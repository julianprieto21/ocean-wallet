import { z } from "zod";

export const userSchema = z.object({
  username: z.string(),
  email: z.string(),
  image_url: z.string(),
  preference_currency: z.string(),
});

export const accountSchema = z.object({
  name: z.string(),
  type: z.string(),
  provider: z.string(),
  initial: z.string(),
});

export const transactionSchema = z.object({
  account_id: z.string(),
  description: z.string(),
  type: z.string(),
  category: z.string(),
  subcategory: z.union([z.string(), z.null()]),
  amount: z.number(),
  created_at: z.union([z.string(), z.null()]),
  currency_id: z.string(),
});
