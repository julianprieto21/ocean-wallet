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
  initial: z.union([z.string(), z.undefined()]),
  currency_id: z.union([z.string(), z.undefined()]),
});

export const transactionSchema = z.object({
  account_id: z.string(),
  description: z.string(),
  type: z.string(),
  category: z.string(),
  subcategory: z.union([z.string(), z.undefined()]),
  amount: z.string(),
  created_at: z.string(),
  currency_id: z.string(),
  transfer_id: z.union([z.string(), z.undefined()]),
  quota_id: z.union([z.string(), z.undefined()]),
});
