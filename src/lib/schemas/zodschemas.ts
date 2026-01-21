import { z } from "zod";

export const SalesSchema = z.object({
  total_sales: z.number(),
  total_amount: z.number(),
});

export const AnalyticsSchema = z.object({
  success: z.boolean(),
  status_code: z.number(),
  client_message: z.string(),
  data: z.array(
    z.object({
      id: z.number(),
      label: z.string(),
      price: z.number(),
      validity: z.string(),
      category: z.string(),
      description: z.string(),
      tag: z.string().nullable(), // this can be nullable
    })
  ),
});

export type SalesType = z.infer<typeof SalesSchema>;
export type AnalyticsType = z.infer<typeof AnalyticsSchema>;

export const ProductSchema = z.object({
  id: z.number().optional(),
  label: z.string().min(1, "Label is required"),
  price: z.number().min(0),
  validity: z.string().min(1),
  category: z.enum(["data", "minutes", "sms", "minutesPlusData"]),
  description: z.string().min(1),
  tag: z.string().nullable().optional(),
});

export type Product = z.infer<typeof ProductSchema>;


/**
 * Zod Schema for Bingwa Transaction Validation
 * Represents the "Hard" response from the backend API
 */
export const TransactionSchema = z.object({
  id: z.string().min(1),
  // Handles null when transaction hasn't been processed or failed early
  mpesa_receipt_number: z.string().nullable(),
  paying_number: z.string(),
  receiving_number: z.string(),
  amount: z.number().positive(),
  // Strict status typing for better UI logic
  status: z.enum(["pending", "success", "failed", "cancelled"]),
  // Automatically transforms the string into a Date object
  transaction_date: z.string().datetime({ precision: 6 }).or(z.string()),
});

// Schema for an array of these objects
export const TransactionsArraySchema = z.array(TransactionSchema);

// Infer TypeScript types from the schema
export type Transaction = z.infer<typeof TransactionSchema>;
