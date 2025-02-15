import { Pool } from "@neondatabase/serverless";
import { auth } from "@/auth";
import { fillMissingDailyBalances } from "./utils";

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
    SELECT ac.account_id, ac.name, ac.type, ac.created_at, ac.provider
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
      ac.type account_type,
      ac.provider,
      tx.transaction_id, 
      tx.description, 
      ac.name, 
      tx.category, 
      tx.subcategory, 
      tx.type, 
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
        tx.description ILIKE $2 OR
        tx.category ILIKE $2 OR
        tx.subcategory ILIKE $2 OR
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
    SELECT SUM(tx.amount * ex.exchange_rate)::float balance, SUM(CASE WHEN tx.type = 'expense' THEN tx.amount * ex.exchange_rate ELSE 0 END) ::float AS expense, SUM(CASE WHEN tx.type = 'income' THEN tx.amount * ex.exchange_rate ELSE 0 END)::float AS income
    FROM transactions AS tx
    JOIN accounts AS ac ON ac.account_id = tx.account_id
    JOIN users AS us ON us.user_id = $1
    JOIN currency_exchange_rates as ex ON tx.currency_id = ex.from_curr
    WHERE ac.type = 'transactional' AND ex.to_curr = us.preference_currency`,
    [user.id]
  );
  return rows[0];
}

export async function getDailyBalances() {
  const user = await verifySession();
  const { rows } = await pool.query(
    `
    WITH daily_totals AS (
    SELECT
        DATE(tx.created_at) AS date,
        SUM(tx.amount * ex.exchange_rate) AS daily_balance
    FROM transactions AS tx
    JOIN accounts AS ac ON ac.account_id = tx.account_id AND ac.type = 'transactional'
    JOIN users AS us ON us.user_id = $1
    JOIN currency_exchange_rates as ex ON tx.currency_id = ex.from_curr AND ex.to_curr = us.preference_currency
    GROUP BY DATE(tx.created_at)
    )
    SELECT
        date,
        SUM(daily_balance) OVER (ORDER BY date) AS balance
    FROM daily_totals
    ORDER BY date ASC;`,
    [user.id]
  );
  return rows;
}

export async function getWalletAccountDetails() {
  const user = await verifySession();
  const { rows } = await pool.query(
    `
    SELECT ac.name, ac.provider, tx.currency_id, SUM(tx.amount)::float orig, SUM(tx.amount * ex.exchange_rate)::float conv
    FROM accounts AS ac
    LEFT JOIN transactions AS tx ON tx.account_id = ac.account_id
    JOIN users AS us ON us.user_id = $1
    LEFT JOIN currency_exchange_rates AS ex ON ex.from_curr = tx.currency_id AND ex.to_curr = us.preference_currency
    WHERE ac.type = 'transactional'
    GROUP BY ac.name, ac.provider, tx.currency_id`,
    [user.id]
  );
  return rows;
}

export async function getInvestmentAccountDetails() {
  const user = await verifySession();
  const { rows } = await pool.query(
    `
    SELECT cu.name, tx.currency_id, cu.type, SUM(tx.amount)::float orig, SUM(tx.amount * ex.exchange_rate)::float conv
    FROM transactions AS tx
    JOIN accounts AS ac ON ac.account_id = tx.account_id AND ac.type = 'investment'
    JOIN users AS us ON us.user_id = $1
    JOIN currency_exchange_rates AS ex ON ex.from_curr = tx.currency_id AND ex.to_curr = 'usd'
    JOIN currencies AS cu ON cu.currency_id = tx.currency_id
    GROUP BY tx.currency_id, cu.name, cu.type`,
    [user.id]
  );
  return rows;
}

export async function getQuotaDetails() {
  const user = await verifySession();
  const { rows } = await pool.query(
    `
    SELECT qu.name, qu.type, qu.quantity, qu.current_quantity, qu.currency_id currency, qu.created_at, qu.next_payment_date, qu.amount orig, (qu.amount * ex.exchange_rate) conv
    FROM quotas AS qu
    JOIN users AS us ON us.user_id = $1
    JOIN currency_exchange_rates AS ex ON ex.from_curr = qu.currency_id AND ex.to_curr = us.preference_currency
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
    SELECT ac.name, ac.provider, SUM((tx.amount * ex.exchange_rate) / total.total * 100)::float percent
    FROM accounts AS ac
    LEFT JOIN transactions AS tx ON tx.account_id = ac.account_id
    JOIN users AS us ON us.user_id = $1
    LEFT JOIN currency_exchange_rates AS ex ON ex.from_curr = tx.currency_id AND ex.to_curr = us.preference_currency
    JOIN (
      SELECT SUM(tx.amount * ex.exchange_rate) total
      FROM transactions AS tx
      JOIN accounts AS ac ON ac.account_id = tx.account_id AND ac.type = 'transactional'
      JOIN users AS us ON us.user_id = $1
      JOIN currency_exchange_rates as ex ON ex.from_curr = tx.currency_id AND ex.to_curr = us.preference_currency
    ) total ON 1 = 1
    WHERE ac.type = 'transactional'
    GROUP BY ac.name, ac.provider`,
    [user.id]
  );
  return rows;
}
