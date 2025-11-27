export const EXPENSE_CATEGORIES = [
  'food',
  'transport',
  'entertainment',
  'utilities',
  'health',
  'shopping',
  'other',
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: ExpenseCategory;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type ExpenseFormData = Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>;

export interface ExpenseFilters {
  category?: ExpenseCategory;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

export type SortField = 'date' | 'amount' | 'category' | 'description';
export type SortDirection = 'asc' | 'desc';

export interface ExpenseSort {
  field: SortField;
  direction: SortDirection;
}

export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  food: 'Comida',
  transport: 'Transporte',
  entertainment: 'Entretenimiento',
  utilities: 'Servicios',
  health: 'Salud',
  shopping: 'Compras',
  other: 'Otros',
};

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  food: '#f97316',
  transport: '#3b82f6',
  entertainment: '#a855f7',
  utilities: '#eab308',
  health: '#ef4444',
  shopping: '#22c55e',
  other: '#6b7280',
};

export interface ExpenseStats {
  totalExpenses: number;
  topSpendingCategory: string | null;
  totalThisMonth: number;
  totalLastMonth: number;
  currentMonthExpenseCount: number;
  monthlyChange: number | null;
  categoryTotals: Record<string, number>;
  monthlyTotals: Record<string, number>;
  dailyTotals: Record<string, number>;
  averageTodayExpense: number;
  todayExpenseCount: number;
}

