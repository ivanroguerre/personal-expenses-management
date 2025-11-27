'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Header } from '@/components/layout/header';
import { ExpenseForm } from '@/components/expenses/expense-form';
import { useExpense } from '@/hooks/use-expenses';
import { useUpdateExpense } from '@/hooks/use-expense-mutations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { ExpenseFormValues } from '@/lib/validations/expense';

interface EditExpensePageProps {
  params: Promise<{ id: string }>;
}

export default function EditExpensePage({ params }: EditExpensePageProps) {
  const { id } = use(params);
  const { data: expense, isLoading, error } = useExpense(id);
  const updateExpense = useUpdateExpense();

  const handleSubmit = (data: ExpenseFormValues) => {
    updateExpense.mutate({ id, data });
  };

  if (isLoading) {
    return (
      <>
        <Header title="Edit Expense" description="Modify expense details" />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-2xl">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </main>
      </>
    );
  }

  if (error || !expense) {
    return (
      <>
        <Header title="Edit Expense" />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-2xl">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-lg font-medium text-destructive">
                  Expense not found
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  The expense you&apos;re looking for doesn&apos;t exist or has been deleted.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/expenses">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Expenses
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header
        title="Edit Expense"
        description="Modify expense details"
      />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Edit Expense</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseForm
                expense={expense}
                onSubmit={handleSubmit}
                isSubmitting={updateExpense.isPending}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

