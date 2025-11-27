"use client";

import { Search, X, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useUIStore } from "@/stores/ui-store";
import { EXPENSE_CATEGORIES, CATEGORY_LABELS } from "@/types/expense";
import { cn } from "@/lib/utils";

export function ExpenseFilters() {
  const { filters, setFilters, resetFilters } = useUIStore();

  const hasFilters =
    filters.category || filters.search || filters.startDate || filters.endDate;

  const dateRange: DateRange | undefined =
    filters.startDate || filters.endDate
      ? {
          from: filters.startDate,
          to: filters.endDate,
        }
      : undefined;

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setFilters({
      startDate: range?.from,
      endDate: range?.to,
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar gastos..."
          value={filters.search || ""}
          onChange={(e) => setFilters({ search: e.target.value || undefined })}
          className="pl-9"
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "dd/MM/yyyy", { locale: es })} -{" "}
                  {format(dateRange.to, "dd/MM/yyyy", { locale: es })}
                </>
              ) : (
                format(dateRange.from, "dd/MM/yyyy", { locale: es })
              )
            ) : (
              <span>Seleccionar fechas</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleDateRangeChange}
            numberOfMonths={2}
            autoFocus
            locale={es}
            formatters={{
              formatWeekdayName: (date) => {
                const name = format(date, "EEEEEE", { locale: es });
                return name.charAt(0).toUpperCase() + name.slice(1);
              },
              formatMonthCaption: (date) => {
                const monthYear = format(date, "LLLL yyyy", { locale: es });
                return monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
              },
            }}
          />
        </PopoverContent>
      </Popover>

      <Select
        value={filters.category || "all"}
        onValueChange={(value) =>
          setFilters({
            category:
              value === "all" ? undefined : (value as typeof filters.category),
          })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Todas las categorías" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las Categorías</SelectItem>
          {EXPENSE_CATEGORIES.map((category) => (
            <SelectItem key={category} value={category}>
              {CATEGORY_LABELS[category]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          <X className="mr-2 h-4 w-4" />
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}
