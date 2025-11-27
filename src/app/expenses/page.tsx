'use client';

import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { ExpensesTable } from '@/components/expenses/expenses-table';
import { ExpenseFilters } from '@/components/expenses/filters';
import { DeleteExpenseDialog } from '@/components/expenses/delete-expense-dialog';
import { useExpenses } from '@/hooks/use-expenses';
import { useUIStore } from '@/stores/ui-store';

export default function ExpensesPage() {
  const { filters, sort, openDeleteModal } = useUIStore();
  const { data: expenses, isLoading, error } = useExpenses(filters, sort);

  return (
    <>
      <Header
        title="Gastos"
        description="Ver y gestionar tus gastos"
      >
        <Button asChild size="sm">
          <Link href="/expenses/new">
            <PlusCircle className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Agregar Gasto</span>
          </Link>
        </Button>
      </Header>
      <main className="flex-1 p-6 space-y-6">
        <ExpenseFilters />

        {error ? (
          <div className="rounded-md border border-destructive bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              Error al cargar los gastos. Por favor, intenta de nuevo.
            </p>
          </div>
        ) : (
          <ExpensesTable
            expenses={expenses || []}
            isLoading={isLoading}
            onDelete={openDeleteModal}
          />
        )}

        <DeleteExpenseDialog />
      </main>
    </>
  );
}

