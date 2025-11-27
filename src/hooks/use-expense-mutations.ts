'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  createExpense,
  updateExpense,
  deleteExpense,
} from '@/lib/db/expenses';
import { expenseKeys } from './use-expenses';
import type { ExpenseFormData } from '@/types/expense';

export function useCreateExpense() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ExpenseFormData) => createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
      toast.success('Expense created successfully');
      router.push('/expenses');
    },
    onError: (error) => {
      console.error('Failed to create expense:', error);
      toast.error('Failed to create expense');
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ExpenseFormData> }) =>
      updateExpense(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
      queryClient.invalidateQueries({
        queryKey: expenseKeys.detail(variables.id),
      });
      toast.success('Expense updated successfully');
      router.push('/expenses');
    },
    onError: (error) => {
      console.error('Failed to update expense:', error);
      toast.error('Failed to update expense');
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
      toast.success('Expense deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete expense:', error);
      toast.error('Failed to delete expense');
    },
  });
}

