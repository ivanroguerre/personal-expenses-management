import { z } from 'zod';
import { EXPENSE_CATEGORIES } from '@/types/expense';

export const expenseFormSchema = z.object({
  amount: z
    .number({ message: 'Amount is required' })
    .positive('Amount must be positive')
    .max(1000000, 'Amount cannot exceed 1,000,000'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(200, 'Description cannot exceed 200 characters'),
  category: z.enum(EXPENSE_CATEGORIES, {
    message: 'Please select a category',
  }),
  date: z.date({
    message: 'Date is required',
  }),
});

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;
