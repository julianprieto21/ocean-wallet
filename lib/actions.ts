"use server";
import { Pool } from "@neondatabase/serverless";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { accountSchema } from "./squemas";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const verifySession = async () => {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  } else {
    return session.user;
  }
};

export async function createAccount(formData: FormData) {
  const user = await verifySession();
  try {
    const { name, type, provider, initial } = accountSchema.parse(
      Object.fromEntries(formData)
    );

    const { rows } = await pool.query(
      `INSERT INTO accounts (user_id, name, type, provider) VALUES ($1, $2, $3, $4) RETURNING *;`,
      [user.id, name, type, provider]
    );
    if (initial == "0") return rows[0];

    await pool.query(
      `INSERT INTO transactions (account_id, description, type, category, amount, currency_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
      [
        rows[0].account_id,
        "-",
        "income",
        "initial-balance",
        initial,
        user.preferenceCurrency,
      ]
    );
    return rows[0];
  } catch (error) {
    console.log(error);
    throw new Error("Error creating account");
  } finally {
    revalidatePath("/");
  }
}
