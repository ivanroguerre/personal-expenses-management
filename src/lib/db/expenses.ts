import { v4 as uuidv4 } from "uuid";
import { db } from "./index";
import type {
  Expense,
  ExpenseFormData,
  ExpenseFilters,
  ExpenseSort,
} from "@/types/expense";

export async function getAllExpenses(): Promise<Expense[]> {
  return db.expenses.toArray();
}

export async function getExpenseById(id: string): Promise<Expense | undefined> {
  return db.expenses.get(id);
}

export async function getFilteredExpenses(
  filters?: ExpenseFilters,
  sort?: ExpenseSort
): Promise<Expense[]> {
  const collection = db.expenses.toCollection();

  let expenses = await collection.toArray();

  // Apply filters
  if (filters) {
    expenses = expenses.filter((expense) => {
      if (filters.category && expense.category !== filters.category) {
        return false;
      }

      if (filters.startDate && new Date(expense.date) < filters.startDate) {
        return false;
      }

      if (filters.endDate && new Date(expense.date) > filters.endDate) {
        return false;
      }

      if (
        filters.minAmount !== undefined &&
        expense.amount < filters.minAmount
      ) {
        return false;
      }

      if (
        filters.maxAmount !== undefined &&
        expense.amount > filters.maxAmount
      ) {
        return false;
      }

      if (
        filters.search &&
        !expense.description
          .toLowerCase()
          .includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }

  // Apply sorting
  if (sort) {
    expenses.sort((a, b) => {
      let comparison = 0;

      switch (sort.field) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        case "description":
          comparison = a.description.localeCompare(b.description);
          break;
      }

      return sort.direction === "asc" ? comparison : -comparison;
    });
  } else {
    // Default sort by date descending
    expenses.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  return expenses;
}

export async function createExpense(data: ExpenseFormData): Promise<Expense> {
  const now = new Date();
  const expense: Expense = {
    id: uuidv4(),
    ...data,
    createdAt: now,
    updatedAt: now,
  };

  await db.expenses.add(expense);
  return expense;
}

export async function updateExpense(
  id: string,
  data: Partial<ExpenseFormData>
): Promise<Expense | undefined> {
  const existing = await db.expenses.get(id);
  if (!existing) {
    throw new Error(`Expense with id ${id} not found`);
  }

  const updated: Expense = {
    ...existing,
    ...data,
    updatedAt: new Date(),
  };

  await db.expenses.put(updated);
  return updated;
}

export async function deleteExpense(id: string): Promise<void> {
  await db.expenses.delete(id);
}

export async function deleteAllExpenses(): Promise<void> {
  await db.expenses.clear();
}

// Analytics helpers
export async function getExpenseStats() {
  const expenses = await getAllExpenses();
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthExpenses = expenses.filter((e) => {
    const date = new Date(e.date);
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  });

  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const lastMonthExpenses = expenses.filter((e) => {
    const date = new Date(e.date);
    return (
      date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
    );
  });

  const totalThisMonth = thisMonthExpenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );
  const totalLastMonth = lastMonthExpenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const monthlyTotals = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    acc[key] = (acc[key] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const dailyTotals = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
    acc[key] = (acc[key] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const todayExpenses = expenses.filter((e) => {
    const expenseDate = new Date(e.date);
    return (
      expenseDate.getDate() === now.getDate() &&
      expenseDate.getMonth() === now.getMonth() &&
      expenseDate.getFullYear() === now.getFullYear()
    );
  });

  // Find the category with the highest total spending
  const topSpendingCategory = Object.entries(categoryTotals).reduce(
    (max, [category, total]) => (total > max.total ? { category, total } : max),
    { category: "", total: 0 }
  );

  return {
    totalExpenses: expenses.length,
    topSpendingCategory: topSpendingCategory.category || null,
    totalThisMonth,
    totalLastMonth,
    currentMonthExpenseCount: thisMonthExpenses.length,
    monthlyChange:
      totalLastMonth > 0
        ? ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100
        : 0,
    categoryTotals,
    monthlyTotals,
    dailyTotals,
    averageTodayExpense:
      todayExpenses.length > 0
        ? todayExpenses.reduce((sum, e) => sum + e.amount, 0) /
          todayExpenses.length
        : 0,
  };
}

export async function getRecentExpenses(limit: number = 5): Promise<Expense[]> {
  const expenses = await getAllExpenses();
  return expenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}
