'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  type ExpenseCategory,
} from '@/types/expense';
import { CURRENCY } from '@/lib/constants';

interface ExpenseChartProps {
  monthlyTotals?: Record<string, number>;
  categoryTotals?: Record<string, number>;
  isLoading?: boolean;
}

export function ExpenseCharts({
  monthlyTotals,
  categoryTotals,
  isLoading,
}: ExpenseChartProps) {
  const monthlyData = useMemo(() => {
    if (!monthlyTotals) return [];

    // Get last 6 months
    const entries = Object.entries(monthlyTotals)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6);

    return entries.map(([month, total]) => {
      const [year, monthNum] = month.split('-');
      const date = new Date(parseInt(year), parseInt(monthNum) - 1);
      return {
        month: date.toLocaleDateString('en-US', {
          month: 'short',
          year: '2-digit',
        }),
        total,
      };
    });
  }, [monthlyTotals]);

  const categoryData = useMemo(() => {
    if (!categoryTotals) return [];

    return Object.entries(categoryTotals)
      .map(([category, total]) => ({
        name: CATEGORY_LABELS[category as ExpenseCategory],
        value: total,
        color: CATEGORY_COLORS[category as ExpenseCategory],
      }))
      .sort((a, b) => b.value - a.value);
  }, [categoryTotals]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatTooltipValue = (value: number) =>
    `${CURRENCY.symbol}${value.toLocaleString(CURRENCY.locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Monthly Spending</CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  formatter={(value: number) => [formatTooltipValue(value), 'Total']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar
                  dataKey="total"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No data to display
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [formatTooltipValue(value), 'Amount']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  wrapperStyle={{ fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No data to display
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

