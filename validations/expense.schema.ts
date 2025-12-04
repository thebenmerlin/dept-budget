import * as z from "zod";
import { ActivityType } from "@prisma/client";

export const expenseSchema = z.object({
  description: z.string().min(3, "Description is required"),
  amount: z.coerce.number().min(1, "Amount must be positive"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  vendor: z.string().min(2, "Vendor name is required"),
  categoryId: z.string().min(1, "Category is required"),
  activityType: z.nativeEnum(ActivityType, { errorMap: () => ({ message: "Select a valid activity type" }) }),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;