'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Expense } from '@/types/expense';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/types/expense';
import { CURRENCY } from '@/lib/constants';

interface RecentExpensesProps {
  expenses?: Expense[];
  isLoading?: boolean;
}

export function RecentExpenses({ expenses, isLoading }: RecentExpensesProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gastos Recientes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) =>
    `${CURRENCY.symbol}${amount.toLocaleString(CURRENCY.locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Gastos Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        {expenses && expenses.length > 0 ? (
          <div className="space-y-4">
            {expenses.map((expense) => (
              <Link
                key={expense.id}
                href={`/expenses/${expense.id}`}
                className="flex items-center justify-between hover:bg-muted/50 -mx-2 px-2 py-2 rounded-lg transition-colors"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {expense.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={{
                        borderColor: CATEGORY_COLORS[expense.category],
                        color: CATEGORY_COLORS[expense.category],
                      }}
                    >
                      {CATEGORY_LABELS[expense.category]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(expense.date), 'MMM dd')}
                    </span>
                  </div>
                </div>
                <span className="font-mono font-semibold text-sm">
                  {formatCurrency(expense.amount)}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">Aún no hay gastos</p>
            <Button asChild variant="link" className="mt-2">
              <Link href="/expenses/new">Agregar tu primer gasto</Link>
            </Button>
          </div>
        )}
      </CardContent>
      {expenses && expenses.length > 0 && (
        <CardFooter>
          <Button asChild variant="ghost" className="w-full">
            <Link href="/expenses">
              Ver todos los gastos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

