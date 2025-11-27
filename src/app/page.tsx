"use client";

import Link from "next/link";
import { PlusCircle, List } from "lucide-react";

import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { ExpenseCharts } from "@/components/dashboard/expense-chart";
import { RecentExpenses } from "@/components/dashboard/recent-expenses";
import { useExpenseStats, useRecentExpenses } from "@/hooks/use-expenses";

export default function DashboardPage() {
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useExpenseStats();
  const { data: recentExpenses, isLoading: recentLoading } =
    useRecentExpenses(5);

  return (
    <>
      <Header
        title="Panel de Control"
        description="Resumen de tus hábitos de gasto"
      >
        <Button asChild variant="outline" size="sm">
          <Link href="/expenses">
            <List className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Ver Gastos</span>
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/expenses/new">
            <PlusCircle className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Agregar Gasto</span>
          </Link>
        </Button>
      </Header>
      <main className="flex-1 p-6 space-y-6">
        {statsError ? (
          <div className="rounded-md border border-destructive bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              Error al cargar los datos del panel. Por favor, recarga la página.
            </p>
          </div>
        ) : (
          <>
            <StatsCards stats={stats} isLoading={statsLoading} />

            <div className="grid gap-6 md:grid-cols-2">
              <ExpenseCharts
                dailyTotals={stats?.dailyTotals}
                categoryTotals={stats?.categoryTotals}
                isLoading={statsLoading}
              />
              <RecentExpenses
                expenses={recentExpenses}
                isLoading={recentLoading}
              />
            </div>

            {/* Future: Add more dashboard widgets here */}
          </>
        )}
      </main>
    </>
  );
}
