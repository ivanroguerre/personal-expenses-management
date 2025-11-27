"use client";

import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  type ExpenseCategory,
} from "@/types/expense";
import { CURRENCY } from "@/lib/constants";

interface ExpenseChartProps {
  dailyTotals?: Record<string, number>;
  categoryTotals?: Record<string, number>;
  isLoading?: boolean;
}

type ChartType = "daily" | "category";

export function ExpenseCharts({
  dailyTotals,
  categoryTotals,
  isLoading,
}: ExpenseChartProps) {
  const [selectedChart, setSelectedChart] = useState<ChartType>("daily");

  // Initialize with current month/year
  const [selectedYear, setSelectedYear] = useState(() =>
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState(() =>
    new Date().getMonth()
  ); // 0-11

  // Get available years from dailyTotals
  const availableYears = useMemo(() => {
    if (!dailyTotals || Object.keys(dailyTotals).length === 0) {
      return [new Date().getFullYear()];
    }
    const years = new Set<number>();
    Object.keys(dailyTotals).forEach((dateStr) => {
      const year = parseInt(dateStr.split("-")[0]);
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [dailyTotals]);

  // Spanish month names
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  // Get available months for the selected year
  const availableMonths = useMemo(() => {
    if (!dailyTotals || Object.keys(dailyTotals).length === 0) {
      return [new Date().getMonth()];
    }
    const months = new Set<number>();
    const yearStr = selectedYear.toString();

    Object.keys(dailyTotals).forEach((dateStr) => {
      if (dateStr.startsWith(yearStr + "-")) {
        const month = parseInt(dateStr.split("-")[1]) - 1; // Convert to 0-based
        months.add(month);
      }
    });

    return Array.from(months).sort((a, b) => a - b);
  }, [dailyTotals, selectedYear]);

  // Handle year change and auto-select appropriate month
  const handleYearChange = (year: number) => {
    setSelectedYear(year);

    // Calculate available months for the new year
    const months = new Set<number>();
    const yearStr = year.toString();

    if (dailyTotals) {
      Object.keys(dailyTotals).forEach((dateStr) => {
        if (dateStr.startsWith(yearStr + "-")) {
          const month = parseInt(dateStr.split("-")[1]) - 1;
          months.add(month);
        }
      });
    }

    const monthsArray = Array.from(months).sort((a, b) => a - b);

    // If current selected month is not available in new year, select the most recent available month
    if (monthsArray.length > 0 && !monthsArray.includes(selectedMonth)) {
      setSelectedMonth(monthsArray[monthsArray.length - 1]);
    }
  };

  const dailyData = useMemo(() => {
    if (!dailyTotals) return [];

    // Filter entries for the selected month/year
    const yearStr = selectedYear.toString();
    const monthStr = String(selectedMonth + 1).padStart(2, "0");
    const monthPrefix = `${yearStr}-${monthStr}`;

    const entries = Object.entries(dailyTotals)
      .filter(([date]) => date.startsWith(monthPrefix))
      .sort(([a], [b]) => a.localeCompare(b));

    // Fill in missing days with 0
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const dailyMap = new Map(entries);
    const result = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${yearStr}-${monthStr}-${String(day).padStart(2, "0")}`;
      const dateObj = new Date(selectedYear, selectedMonth, day);
      result.push({
        date: dateObj.toLocaleDateString("es-ES", {
          day: "numeric",
          month: "short",
        }),
        total: dailyMap.get(dateStr) || 0,
      });
    }

    return result;
  }, [dailyTotals, selectedYear, selectedMonth]);

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
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const formatTooltipValue = (value: number) =>
    `${CURRENCY.symbol}${value.toLocaleString(CURRENCY.locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const chartTitle =
    selectedChart === "daily" ? "Gasto Diario" : "Gastos por Categoría";

  return (
    <Card>
      <CardHeader className="space-y-0 pb-4">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">{chartTitle}</CardTitle>
          <Select
            value={selectedChart}
            onValueChange={(value) => setSelectedChart(value as ChartType)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar gráfico" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Gasto Diario</SelectItem>
              <SelectItem value="category">Por Categoría</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {selectedChart === "daily" && (
          <div className="flex items-center gap-3 pt-4">
            <div className="flex-1">
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => handleYearChange(parseInt(value))}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => setSelectedMonth(parseInt(value))}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableMonths.map((monthIndex) => (
                    <SelectItem key={monthIndex} value={monthIndex.toString()}>
                      {monthNames[monthIndex]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {selectedChart === "daily" ? (
          dailyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  formatter={(value: number) => [
                    formatTooltipValue(value),
                    "Total",
                  ]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No hay datos para mostrar
            </div>
          )
        ) : categoryData.length > 0 ? (
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
                formatter={(value: number) => [
                  formatTooltipValue(value),
                  "Monto",
                ]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                wrapperStyle={{ fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No hay datos para mostrar
          </div>
        )}
      </CardContent>
    </Card>
  );
}
