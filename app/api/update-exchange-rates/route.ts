import { db } from "@vercel/postgres";

export async function GET(req: Request) {
  // Verificar que se incluya la cabecera de autorización
  const authHeader = req.headers.get("authorization");
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedToken) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { rows: currencies } = await db.query(
      `SELECT currency_id, currency_type FROM currencies;`
    );
    const exchangeRates = await Promise.all(
      currencies.map(async ({ currency_id, currency_type }) => {
        const response = await fetch(
          `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency_id}.json`
        );
        return response.ok
          ? {
              from: currency_id,
              type: currency_type,
              data: await response.json(),
            }
          : null;
      })
    );
    const validRates = exchangeRates.filter((rate) => rate !== null);

    const values: any[] = [];
    validRates.forEach(({ from, type, data }) => {
      // Si es fiat, insertar tipos de camio entre fiats
      if (type == "fiat") {
        currencies.forEach(({ currency_id: to, currency_type }) => {
          if (currency_type == "fiat") {
            const exchange = data[from][to];
            console.log(from, to, exchange);
            if (exchange) {
              values.push(`('${from}', '${to}', ${exchange}, '${data.date}')`);
            }
          }
        });
        // Si es crypto, insertar tipo de cambio de crypto a USD
      } else {
        const exchange = data[from]["usd"];
        if (exchange) {
          values.push(`('${from}', 'usd', ${exchange}, '${data.date}')`);
        }
      }
    });

    // Insertar en la base de datos en una sola consulta
    if (values.length > 0) {
      await db.query(`
        INSERT INTO currency_exchange_rates (from_curr, to_curr, exchange_rate, last_update)
        VALUES ${values.join(", ")}
        ON CONFLICT (from_curr, to_curr) 
        DO UPDATE SET exchange_rate = EXCLUDED.exchange_rate, last_update = EXCLUDED.last_update;
      `);
    }

    return new Response(JSON.stringify({ message: "Exchange rates updated" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating exchange rates:", error);
    return new Response(
      JSON.stringify({ error: "Error updating exchange rates" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
