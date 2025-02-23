import { z } from "zod";

export const userSchema = z.object({
  username: z.union([z.string(), z.undefined()]),
  email: z.union([z.string(), z.undefined()]),
  image_url: z.string(),
  preference_currency: z.string(),
});

export const accountSchema = z.object({
  name: z.string(),
  type: z.string(),
  provider: z.string(),
  initial: z.string(),
  currency_id: z.string(),
});

export const transactionSchema = z.object({
  account_id: z.string(),
  description: z.string(),
  type: z.string(),
  category: z.string(),
  subcategory: z.string(),
  amount: z.string(),
  created_at: z.string(),
  currency_id: z.string(),
  transfer_id: z.union([z.string(), z.undefined()]),
  quota_id: z.union([z.string(), z.undefined()]),
});

export const transferSchema = z.object({
  from_account_id: z.string(),
  to_account_id: z.string(),
  created_at: z.string(),
  amount: z.string(),
  currency_id: z.string(),
});
