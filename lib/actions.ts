"use server";
import { Pool } from "@neondatabase/serverless";
import { auth, signOut as signOutFunction } from "@/auth";
import { revalidatePath } from "next/cache";
import {
  accountSchema,
  transactionSchema,
  transferSchema,
  userSchema,
} from "./squemas";

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

export async function updateUserData(formData: FormData) {
  const user = await verifySession();
  try {
    const { preference_currency } = userSchema.parse(
      Object.fromEntries(formData)
    );
    await pool.query(
      `UPDATE users SET preference_currency = $1 WHERE user_id = $2;`,
      [preference_currency, user.id]
    );
    return true;
  } catch (error) {
    console.log(error);
    throw new Error("Error updating user data");
  } finally {
    revalidatePath("/");
  }
}

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
    if (initial.length === 0) return rows[0];
    const formatInitial = initial.replace(/\,/g, "");

    await pool.query(
      `INSERT INTO transactions (account_id, description, type, category, amount, currency_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
      [
        rows[0].account_id,
        "-",
        "income",
        "initial_balance",
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
    const formatAmount = amount.replace(/\,/g, "");
    const UTCDate = new Date(created_at);

    const { rows } = await pool.query(
      `INSERT INTO transactions (account_id, description, type, category, subcategory, amount, created_at, currency_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
      [
        account_id,
        description,
        type,
        category,
        subcategory.length > 0 ? subcategory : null,
        type === "income" ? formatAmount : -formatAmount,
        UTCDate,
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

export async function createTransfer(formData: FormData) {
  await verifySession();
  try {
    const { from_account_id, to_account_id, created_at, amount, currency_id } =
      transferSchema.parse(Object.fromEntries(formData));
    const formatAmount = amount.replace(/\,/g, "");
    const UTCDate = new Date(created_at);

    const { rows: source } = await pool.query(
      `INSERT INTO transactions (account_id, description, type, category, subcategory, amount, created_at, currency_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
      [
        from_account_id,
        "",
        "expense",
        "transfer",
        "",
        -formatAmount,
        UTCDate,
        currency_id,
      ]
    );

    const { rows: target } = await pool.query(
      `INSERT INTO transactions (account_id, description, type, category, subcategory, amount, created_at, currency_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
      [
        to_account_id,
        "",
        "income",
        "transfer",
        "",
        formatAmount,
        UTCDate,
        currency_id,
      ]
    );

    const from_transaction_id = source[0].transaction_id;
    const to_transaction_id = target[0].transaction_id;
    const { rows } = await pool.query(
      `INSERT INTO transfers (created_at, source_transaction_id, target_transaction_id) VALUES ($1, $2, $3) RETURNING *;`,
      [UTCDate, from_transaction_id, to_transaction_id]
    );

    const tranfer_id = rows[0].transfer_id;
    await pool.query(
      `UPDATE transactions SET transfer_id = $1 WHERE transaction_id = $2 OR transaction_id = $3;`,
      [tranfer_id, from_transaction_id, to_transaction_id]
    );
    return rows[0];
  } catch (error) {
    console.log(error);
    throw new Error("Error creating transfer");
  } finally {
    revalidatePath("/");
  }
}

export async function signOut() {
  await signOutFunction();
}
