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
