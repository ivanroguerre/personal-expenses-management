import { z } from 'zod';
import { EXPENSE_CATEGORIES } from '@/types/expense';

export const expenseFormSchema = z.object({
  amount: z
    .number({ message: 'El monto es requerido' })
    .positive('El monto debe ser positivo')
    .max(1000000, 'El monto no puede exceder 1,000,000'),
  description: z
    .string()
    .min(1, 'La descripción es requerida')
    .max(200, 'La descripción no puede exceder 200 caracteres'),
  category: z.enum(EXPENSE_CATEGORIES, {
    message: 'Por favor selecciona una categoría',
  }),
  date: z.date({
    message: 'La fecha es requerida',
  }),
});

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;
