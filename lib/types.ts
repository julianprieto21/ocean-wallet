export type AccountType = "wallet" | "crypto";

export type Account = {
  account_id: string;
  account_type: AccountType;
  name: string;
  hex_code: string;
};

export type Category =
  | "house"
  | "transport"
  | "food"
  | "health_beauty"
  | "entertainment_leisure"
  | "savings_investments";

export type TransactionType = "income" | "expense";

export type Transaction = {
  transaction_id: string;
  transaction_description: string;
  transaction_category: Category;
  transaction_subcategory: string;
  transaction_type: TransactionType;
  created_at: string;
  amount: number;
  currency_id: string;
  transfer_id: string;
  quota_id: string;
};
