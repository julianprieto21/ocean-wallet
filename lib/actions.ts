"use server";
import { Pool } from "@neondatabase/serverless";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { accountSchema, transactionSchema } from "./squemas";

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
    const { name, type, provider, initial, currency_id } = accountSchema.parse(
      Object.fromEntries(formData)
    );

    const { rows } = await pool.query(
      `INSERT INTO accounts (user_id, name, type, provider) VALUES ($1, $2, $3, $4) RETURNING *;`,
      [user.id, name, type, provider]
    );
    if (!initial) return rows[0];
    const formatInitial = initial.slice(1).replace(/\,/g, "");

    await pool.query(
      `INSERT INTO transactions (account_id, description, type, category, amount, currency_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
      [
        rows[0].account_id,
        "-",
        "income",
        "initial-balance",
        formatInitial,
        currency_id,
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

export async function createTransaction(formData: FormData) {
  await verifySession();
  try {
    const {
      account_id,
      description,
      type,
      category,
      subcategory,
      created_at,
      amount,
      currency_id,
    } = transactionSchema.parse(Object.fromEntries(formData));
    const formatAmount = amount.slice(1).replace(/\,/g, "");
    console.log(currency_id);
    const { rows } = await pool.query(
      `INSERT INTO transactions (account_id, description, type, category, subcategory, amount, created_at, currency_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
      [
        account_id,
        description,
        type,
        category,
        subcategory ?? "",
        formatAmount,
        created_at,
        currency_id,
      ]
    );
    return rows[0];
  } catch (error) {
    console.log(error);
    throw new Error("Error creating transaction");
  } finally {
    revalidatePath("/");
  }
}
