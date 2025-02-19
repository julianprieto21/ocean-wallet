export type AccountType = "transactional" | "investment";

export type Account = {
  account_id: string;
  type: AccountType;
  name: string;
  provider: string;
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
  description: string;
  category: Category;
  subcategory: string;
  type: TransactionType;
  created_at: string;
  amount: number;
  currency_id: string;
  transfer_id: string;
  quota_id: string;
};

export interface Dict {
  balance: string;
  incomes: string;
  expenses: string;
  navigation: NavigationDict;
  common_fields: CommonFields;
  users: UsersDict;
  accounts: AccountsDict;
  transactions: TransactionsDict;
  quotas: QuotasDict;
  currencies: CurrenciesDict;
  greetings: GreetingsDict;
  categories: CategoriesDict;
  // sub_categories: SubCategoriesDict;
  actions: ActionsDict;
  modalMessages: ModalMessages;
  form: FormDict;
}

export interface NavigationDict {
  search: string;
  home: string;
  transactions: string;
  accounts: string;
  details: string;
}

export interface CommonFields {
  name: string;
  image_url: string;
  created_at: string;
  currency: string;
  amount: string;
  type: string;
}

export interface UsersDict {
  users: string;
  user: string;
  email: string;
  preference_currency: string;
}

export interface AccountsDict {
  accounts: string;
  account: string;
  transactional: string;
  investment: string;
  crypto: string;
  stock: string;
  provider: string;
  generic: string;
  cash: string;
  initial: string;
}

export interface TransactionsDict {
  transactions: string;
  transaction: string;
  description: string;
  category: string;
  subcategory: string;
  income: string;
  expense: string;
}

export interface QuotasDict {
  quotas: string;
  quota: string;
  quantity: string;
  current_quantity: string;
  next_payment_date: string;
}

export interface CurrenciesDict {
  currencies: string;
  currency: string;
}

export interface GreetingsDict {
  morning: string;
  afternoon: string;
  evening: string;
}

export interface CategoriesDict {
  house: string;
  transport: string;
  food: string;
  health_beauty: string;
  entertainment_leisure: string;
  savings_investments: string;
}

// export interface SubCategoriesDict {}

export interface ActionsDict {
  create_account: string;
  add_account: string;
  edit_account: string;
  new_account: string;
  delete_account: string;
  create_transaction: string;
  add_transaction: string;
  edit_transaction: string;
  new_transaction: string;
  delete_transaction: string;
  create_quota: string;
  add_quota: string;
  edit_quota: string;
  new_quota: string;
}

type Messages = {
  title: string;
  message: string;
  button: string;
};
export interface ModalMessages {
  no_account: Messages;
  create_account: Messages;
  create_transactions: Messages;
}

export interface FormDict {
  pending: string;
  edit: string;
  delete: string;
  cancel: string;
  create: string;
}
