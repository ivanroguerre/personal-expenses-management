'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getAllExpenses,
  getExpenseById,
  getFilteredExpenses,
  getExpenseStats,
  getRecentExpenses,
} from '@/lib/db/expenses';
import type { ExpenseFilters, ExpenseSort } from '@/types/expense';

export const expenseKeys = {
  all: ['expenses'] as const,
  lists: () => [...expenseKeys.all, 'list'] as const,
  list: (filters?: ExpenseFilters, sort?: ExpenseSort) =>
    [...expenseKeys.lists(), { filters, sort }] as const,
  details: () => [...expenseKeys.all, 'detail'] as const,
  detail: (id: string) => [...expenseKeys.details(), id] as const,
  stats: () => [...expenseKeys.all, 'stats'] as const,
  recent: (limit?: number) => [...expenseKeys.all, 'recent', limit] as const,
};

export function useExpenses(filters?: ExpenseFilters, sort?: ExpenseSort) {
  return useQuery({
    queryKey: expenseKeys.list(filters, sort),
    queryFn: () => getFilteredExpenses(filters, sort),
  });
}

export function useAllExpenses() {
  return useQuery({
    queryKey: expenseKeys.all,
    queryFn: getAllExpenses,
  });
}

export function useExpense(id: string) {
  return useQuery({
    queryKey: expenseKeys.detail(id),
    queryFn: () => getExpenseById(id),
    enabled: !!id,
  });
}

export function useExpenseStats() {
  return useQuery({
    queryKey: expenseKeys.stats(),
    queryFn: getExpenseStats,
  });
}

export function useRecentExpenses(limit: number = 5) {
  return useQuery({
    queryKey: expenseKeys.recent(limit),
    queryFn: () => getRecentExpenses(limit),
  });
}

