"use client";

import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getColumns } from "./columns";
import { useUIStore } from "@/stores/ui-store";
import type { Expense, SortField, ExpenseSort } from "@/types/expense";

interface SortButtonProps {
  field: SortField;
  sort: ExpenseSort;
  onSort: (field: SortField) => void;
  children: React.ReactNode;
}

function SortButton({ field, sort, onSort, children }: SortButtonProps) {
  const isActive = sort.field === field;
  const Icon = isActive
    ? sort.direction === "asc"
      ? ArrowUp
      : ArrowDown
    : ArrowUpDown;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8"
      onClick={() => onSort(field)}
    >
      {children}
      <Icon className="ml-2 h-4 w-4" />
    </Button>
  );
}

interface ExpensesTableProps {
  expenses: Expense[];
  isLoading?: boolean;
  onDelete: (id: string) => void;
}

export function ExpensesTable({
  expenses,
  isLoading,
  onDelete,
}: ExpensesTableProps) {
  const { sort, setSort, page, pageSize, setPage, setPageSize } = useUIStore();
  const columns = getColumns({ onDelete });

  // Calculate pagination
  const totalItems = expenses.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedExpenses = expenses.slice(startIndex, endIndex);

  // Ensure current page is valid when expenses change
  if (page > totalPages && totalPages > 0) {
    setPage(totalPages);
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg font-medium">No se encontraron gastos</p>
          <p className="text-sm text-muted-foreground mt-1">
            Agrega tu primer gasto para comenzar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortButton field="description" sort={sort} onSort={setSort}>
                  Descripción
                </SortButton>
              </TableHead>
              <TableHead className="text-right">
                <SortButton field="amount" sort={sort} onSort={setSort}>
                  Monto
                </SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="category" sort={sort} onSort={setSort}>
                  Categoría
                </SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="date" sort={sort} onSort={setSort}>
                  Fecha
                </SortButton>
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{columns.renderDescription(expense)}</TableCell>
                <TableCell className="text-right">
                  {columns.renderAmount(expense)}
                </TableCell>
                <TableCell>{columns.renderCategory(expense)}</TableCell>
                <TableCell>{columns.renderDate(expense)}</TableCell>
                <TableCell>{columns.renderActions(expense)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">Filas por página</p>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => setPageSize(Number(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-6">
          <p className="text-sm text-muted-foreground">
            {startIndex + 1}-{Math.min(endIndex, totalItems)} de {totalItems}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Página anterior</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Página siguiente</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
