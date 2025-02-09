import { Pool } from "@neondatabase/serverless";
import { auth } from "@/auth";

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

export async function getUser() {
  const user = await verifySession();
  const { rows } = await pool.query(
    `
    SELECT username, email, image_url, preference_currency
    FROM users AS us
    WHERE us.user_id = $1`,
    [user.id]
  );
  return rows[0];
}

export async function getAccounts() {
  const user = await verifySession();
  const { rows } = await pool.query(
    `
    SELECT ac.account_id, ac.name, ac.account_type, ac.created_at, ac.hex_code
    FROM accounts AS ac
    WHERE ac.user_id = $1`,
    [user.id]
  );
  return rows;
}

export async function getTransactions({ search }: { search?: string } = {}) {
  const user = await verifySession();
  const searchTerm = search ? `%${search}%` : null;
  const { rows } = await pool.query(
    `
    SELECT 
      ac.account_type,
      tx.transaction_id, 
      tx.transaction_description, 
      ac.name, 
      tx.transaction_category, 
      tx.transaction_subcategory, 
      tx.transaction_type, 
      tx.created_at, 
      tx.amount::float, 
      tx.currency_id, 
      tx.transfer_id, 
      tx.quota_id
    FROM accounts AS ac
    JOIN transactions AS tx ON tx.account_id = ac.account_id
    WHERE ac.user_id = $1
        AND ($2::text IS NULL OR (
        ac.name ILIKE $2 OR
        tx.transaction_description ILIKE $2 OR
        tx.transaction_category ILIKE $2 OR
        tx.transaction_subcategory ILIKE $2 OR
        tx.currency_id ILIKE $2
      ))
    ORDER BY tx.created_at DESC`,
    [user.id, searchTerm]
  );
  return rows;
}

export async function getBalances() {
  const user = await verifySession();
  const { rows } = await pool.query(
    `
    SELECT SUM(tx.amount * ex.exchange_rate)::float balance, SUM(CASE WHEN tx.transaction_type = 'expense' THEN tx.amount * ex.exchange_rate ELSE 0 END) ::float AS expense, SUM(CASE WHEN tx.transaction_type = 'income' THEN tx.amount * ex.exchange_rate ELSE 0 END)::float AS income
    FROM transactions AS tx
    JOIN accounts AS ac ON ac.account_id = tx.account_id
    JOIN users AS us ON us.user_id = $1
    JOIN currency_exchange_rates as ex ON tx.currency_id = ex.from_curr
    WHERE ac.account_type = 'wallet' AND ex.to_curr = us.preference_currency`,
    [user.id]
  );
  return rows[0];
}

export async function getDailyBalances() {
  const user = await verifySession();
  const { rows } = await pool.query(
    `
    SELECT DATE(tx.created_at), SUM(tx.amount * ex.exchange_rate)::float balance
    FROM transactions AS tx
    JOIN accounts AS ac ON ac.accouts_id = tx.account_id AND ac.account_type = 'wallet'
    JOIN users AS us ON us.user_id = $1
    JOIN currency_exchange_rates as ex ON tx.currency_id = ex.from_curr AND ex.to_curr = us.preference_currency
    GROUP BY DATE(tx.created_at)
    ORDER BY DATE(tx.created_at) DESC`,
    [user.id]
  );
  return rows;
}

export async function getWalletAccountDetails() {
  const user = await verifySession();
  const { rows } = await pool.query(
    `
    SELECT ac.name, ac.hex_code, tx.currency_id, SUM(tx.amount)::float orig, SUM(tx.amount * ex.exchange_rate)::float conv
    FROM transactions AS tx
    JOIN accounts AS ac ON ac.account_id = tx.account_id AND ac.account_type = 'wallet'
    JOIN users AS us ON us.user_id = $1
    JOIN currency_exchange_rates AS ex ON ex.from_curr = tx.currency_id AND ex.to_curr = us.preference_currency
    GROUP BY ac.name, ac.hex_code, tx.currency_id`,
    [user.id]
  );
  return rows;
}

export async function getCryptoAccountDetails() {
  const user = await verifySession();
  const { rows } = await pool.query(
    `
    SELECT tx.currency_id, cu.currency_name, cu.image_url, SUM(tx.amount)::float orig, SUM(tx.amount * ex.exchange_rate)::float conv
    FROM transactions AS tx
    JOIN accounts AS ac ON ac.account_id = tx.account_id AND ac.account_type = 'crypto'
    JOIN users AS us ON us.user_id = $1
    JOIN currency_exchange_rates AS ex ON ex.from_curr = tx.currency_id AND ex.to_curr = 'usd'
    JOIN currencies AS cu ON cu.currency_id = tx.currency_id
    GROUP BY tx.currency_id, cu.currency_name, cu.image_url`,
    [user.id]
  );
  return rows;
}

export async function getQuotaDetails() {
  const user = await verifySession();
  const { rows } = await pool.query(
    `
    SELECT qu.quota_name, qu.quota_type, qu.quota_quantity, qu.current_quantity, qu.quota_currency currency, qu.created_at, qu.next_payment_date, qu.amount orig, (qu.amount * ex.exchange_rate) conv
    FROM quotas AS qu
    JOIN users AS us ON us.user_id = $1
    JOIN currency_exchange_rates AS ex ON ex.from_curr = qu.quota_currency AND ex.to_curr = us.preference_currency
    WHERE qu.status IN ('active', 'paused')
    ORDER BY qu.created_at`,
    [user.id]
  );
  return rows;
}

export async function getBalancePerAccount() {
  const user = await verifySession();
  const { rows } = await pool.query(
    `
    SELECT ac.name, ac.hex_code, SUM((tx.amount * ex.exchange_rate) / total.total * 100)::float percent
    FROM transactions AS tx
    JOIN accounts AS ac ON ac.account_id = tx.account_id AND ac.account_type = 'wallet'
    JOIN users AS us ON us.user_id = $1
    JOIN currency_exchange_rates AS ex ON ex.from_curr = tx.currency_id AND ex.to_curr = us.preference_currency
    JOIN (
      SELECT ac.name, SUM(tx.amount * ex.exchange_rate) total
      FROM transactions AS tx
      JOIN accounts AS ac ON ac.account = tx.account_id AND ac.account_type = 'wallet'
      JOIN users AS us ON us.user_id = $1
      JOIN currency_exchange_rates as ex ON ex.from_curr = tx.currency_id AND ex.to_curr = us.preference_currency
      GROUP BY ac.name
    ) total ON total.name = ac.name
    GROUP BY ac.name, ac.hex_code`,
    [user.id]
  );
  return rows;
}
