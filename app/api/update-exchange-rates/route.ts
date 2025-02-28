import { CURRENCIES } from "@/lib/currencies";
import { Pool } from "@neondatabase/serverless";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedToken) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const lastUpdate = `${year}-${month}-${day}`;
  try {
    const exchangeRates = await Promise.all(
      CURRENCIES.map(
        async ({ value, type }: { value: string; type: string }) => {
          const response = await fetch(
            `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${lastUpdate}/v1/currencies/${value}.json`
          );
          return response.ok
            ? {
                from: value,
                type: type,
                data: await response.json(),
              }
            : null;
        }
      )
    );
    const validRates = exchangeRates.filter((rate) => rate !== null);

    const values: string[] = [];
    validRates.forEach(
      ({
        from,
        type,
        data,
      }: {
        from: string;
        type: string;
        data: { [key: string]: { [key: string]: string } };
      }) => {
        // Si es fiat, insertar tipos de camio entre fiats
        if (type == "fiat") {
          CURRENCIES.forEach(
            ({ value: to, type }: { value: string; type: string }) => {
              if (type == "fiat") {
                const exchange = data[from][to];
                if (exchange) {
                  values.push(
                    `('${from}', '${to}', ${exchange}, '${lastUpdate}')`
                  );
                }
              }
            }
          );
          // Si es crypto, insertar tipo de cambio de crypto a USD
        } else {
          const exchange = data[from]["usd"];
          if (exchange) {
            values.push(`('${from}', 'usd', ${exchange}, '${lastUpdate}')`);
          }
        }
      }
    );

    // Insertar en la base de datos en una sola consulta
    if (values.length > 0) {
      await pool.query(`
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
