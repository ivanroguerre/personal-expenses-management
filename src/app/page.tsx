'use client';

import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { ExpenseCharts } from '@/components/dashboard/expense-chart';
import { RecentExpenses } from '@/components/dashboard/recent-expenses';
import { useExpenseStats, useRecentExpenses } from '@/hooks/use-expenses';

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useExpenseStats();
  const { data: recentExpenses, isLoading: recentLoading } = useRecentExpenses(5);

  return (
    <>
      <Header
        title="Dashboard"
        description="Overview of your spending habits"
      >
        <Button asChild>
          <Link href="/expenses/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Expense
          </Link>
        </Button>
      </Header>
      <main className="flex-1 p-6 space-y-6">
        {statsError ? (
          <div className="rounded-md border border-destructive bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              Failed to load dashboard data. Please refresh the page.
            </p>
          </div>
        ) : (
          <>
            <StatsCards stats={stats} isLoading={statsLoading} />

            <ExpenseCharts
              monthlyTotals={stats?.monthlyTotals}
              categoryTotals={stats?.categoryTotals}
              isLoading={statsLoading}
            />

            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                {/* Future: Add more dashboard widgets here */}
              </div>
              <RecentExpenses
                expenses={recentExpenses}
                isLoading={recentLoading}
              />
            </div>
          </>
        )}
      </main>
    </>
  );
}
