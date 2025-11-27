"use client";

import {
  TrendingUp,
  TrendingDown,
  Calculator,
  PieChart,
  CalendarIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CURRENCY } from "@/lib/constants";

import type { ExpenseStats } from "@/types/expense";

interface StatsCardsProps {
  stats?: ExpenseStats;
  isLoading?: boolean;
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-3 w-20 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const formatCurrency = (amount: number) =>
    `${CURRENCY.symbol}${amount.toLocaleString(CURRENCY.locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const getMonthlyChangeDescription = () => {
    if (stats.monthlyChange === null) {
      return "Nuevo gasto este mes";
    }
    if (stats.monthlyChange === 0) {
      return "Sin cambios desde el mes pasado";
    }
    return `${stats.monthlyChange > 0 ? "+" : ""}${stats.monthlyChange.toFixed(
      1
    )}% desde el mes pasado`;
  };

  const getMonthlyChangeIcon = () => {
    if (stats.monthlyChange === null || stats.monthlyChange >= 0) {
      return TrendingUp;
    }
    return TrendingDown;
  };

  const getMonthlyChangeColor = () => {
    if (stats.monthlyChange === null) {
      return "text-blue-500";
    }
    if (stats.monthlyChange > 0) {
      return "text-red-500";
    }
    if (stats.monthlyChange < 0) {
      return "text-emerald-500";
    }
    return "text-muted-foreground";
  };

  const cards = [
    {
      title: "Total gastado este mes",
      value: formatCurrency(stats.totalThisMonth),
      description: getMonthlyChangeDescription(),
      icon: getMonthlyChangeIcon(),
      iconColor: getMonthlyChangeColor(),
    },
    {
      title: "Promedio diario de gastos",
      value: formatCurrency(stats.averageTodayExpense),
      description: "Por gasto diario",
      icon: Calculator,
      iconColor: "text-purple-500",
    },
    {
      title: "Categoría con mayor gasto",
      value: stats.topSpendingCategory || "N/A",
      description: stats.topSpendingCategory
        ? `De toda la historia de gastos`
        : "No hay gastos aún",
      icon: PieChart,
      iconColor: "text-emerald-500",
    },
    {
      title: "Número de gastos del mes",
      value: stats.currentMonthExpenseCount.toString(),
      description: "Del presente mes",
      icon: CalendarIcon,
      iconColor: "text-blue-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.iconColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
