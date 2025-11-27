'use client';

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Receipt,
  Calculator,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CURRENCY } from '@/lib/constants';

interface StatsCardsProps {
  stats?: {
    totalExpenses: number;
    totalAmount: number;
    totalThisMonth: number;
    totalLastMonth: number;
    monthlyChange: number;
    averageExpense: number;
  };
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

  const cards = [
    {
      title: 'Total gastado este mes',
      value: formatCurrency(stats.totalThisMonth),
      description:
        stats.monthlyChange !== 0
          ? `${stats.monthlyChange > 0 ? '+' : ''}${stats.monthlyChange.toFixed(1)}% desde el mes pasado`
          : 'Sin cambios desde el mes pasado',
      icon: stats.monthlyChange >= 0 ? TrendingUp : TrendingDown,
      iconColor:
        stats.monthlyChange > 0
          ? 'text-red-500'
          : stats.monthlyChange < 0
            ? 'text-emerald-500'
            : 'text-muted-foreground',
    },
    {
      title: 'Total Gastado',
      value: formatCurrency(stats.totalAmount),
      description: `${stats.totalExpenses} gastos totales`,
      icon: DollarSign,
      iconColor: 'text-emerald-500',
    },
    {
      title: 'Mes Anterior',
      value: formatCurrency(stats.totalLastMonth),
      description: 'Total del mes anterior',
      icon: Receipt,
      iconColor: 'text-blue-500',
    },
    {
      title: 'Promedio',
      value: formatCurrency(stats.averageExpense),
      description: 'Por gasto',
      icon: Calculator,
      iconColor: 'text-purple-500',
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

