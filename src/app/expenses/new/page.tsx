'use client';

import { Header } from '@/components/layout/header';
import { ExpenseForm } from '@/components/expenses/expense-form';
import { useCreateExpense } from '@/hooks/use-expense-mutations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ExpenseFormValues } from '@/lib/validations/expense';

export default function NewExpensePage() {
  const createExpense = useCreateExpense();

  const handleSubmit = (data: ExpenseFormValues) => {
    createExpense.mutate(data);
  };

  return (
    <>
      <Header
        title="Add Expense"
        description="Record a new expense"
      />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>New Expense</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseForm
                onSubmit={handleSubmit}
                isSubmitting={createExpense.isPending}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

