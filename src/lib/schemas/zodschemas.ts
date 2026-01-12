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
      tag: z.string(),
    })
  ),
});

