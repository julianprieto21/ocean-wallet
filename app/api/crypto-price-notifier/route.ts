import { CURRENCIES } from "@/lib/currencies";
import { Pool } from "@neondatabase/serverless";
import { Resend } from "resend";
import { formatCurrency } from "@/lib/utils";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
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
    const { rows: notifications } = await pool.query(
      `
      SELECT 
        pn.notification_id,
        pn.user_id, 
        us.username,
        us.email, 
        pn.currency_id, 
        pn.min_wanted_usd_price 
    FROM price_notifications AS pn 
    JOIN users AS us ON us.user_id = pn.user_id;
    `
    );
    if (notifications.length === 0) {
      return new Response(
        JSON.stringify({ message: "No notifications registered." }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const mails = (
      await Promise.all(
        notifications.map(
          async ({
            notification_id,
            email,
            username,
            currency_id,
            min_wanted_usd_price,
          }) => {
            const response = await fetch(
              `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${lastUpdate}/v1/currencies/${currency_id}.json`
            );

            if (!response.ok) return null;

            const data = await response.json();
            const exchangeRate = data?.[currency_id]?.usd;

            if (!exchangeRate || exchangeRate > min_wanted_usd_price)
              return null;

            const name =
              CURRENCIES.find((c) => c.value === currency_id)?.label ||
              currency_id.toUpperCase();
            const { integer, decimal } = formatCurrency({
              amount: min_wanted_usd_price,
              currency: "usd",
            });

            // Una vez que se envíe el mail, se elimina de la base de datos
            await pool.query(
              `
                DELETE FROM price_notifications WHERE notification_id = $1;
                `,
              [notification_id]
            );
            return {
              to: email,
              subject: `Ocean Wallet | Alerta de precio de ${name}`,
              html: `
                <p>Hola ${username},</p>
                <p>El precio de ${name} ha llegado a tu mínimo establecido de ${integer}${decimal} USD.</p> 
                <p>El precio actual es de ${exchangeRate.toFixed(2)} USD.</p>
                <p>¡Gracias por usar Ocean Wallet!</p>
              `,
            };
          }
        )
      )
    ).filter(
      (mail): mail is { to: string; subject: string; html: string } =>
        mail !== null
    );

    if (mails.length === 0) {
      return new Response(JSON.stringify({ message: "No emails to send." }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    await Promise.all(
      mails.map((mail) =>
        resend.emails.send({
          from: "onboarding@resend.dev",
          to: mail.to,
          subject: mail.subject,
          html: mail.html,
        })
      )
    );
    return new Response(
      JSON.stringify({ message: "Emails sent successfully." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending mail notifications:", error);
    return new Response(
      JSON.stringify({ error: "Error sending mail notifications" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
