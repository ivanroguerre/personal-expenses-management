'use client';

import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getColumns } from './columns';
import { useUIStore } from '@/stores/ui-store';
import type { Expense, SortField, ExpenseSort } from '@/types/expense';

interface SortButtonProps {
  field: SortField;
  sort: ExpenseSort;
  onSort: (field: SortField) => void;
  children: React.ReactNode;
}

function SortButton({ field, sort, onSort, children }: SortButtonProps) {
  const isActive = sort.field === field;
  const Icon = isActive
    ? sort.direction === 'asc'
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
  const { sort, setSort } = useUIStore();
  const columns = getColumns({ onDelete });

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16 ml-auto" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="rounded-md border">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg font-medium">No expenses found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add your first expense to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <SortButton field="date" sort={sort} onSort={setSort}>
                Date
              </SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="description" sort={sort} onSort={setSort}>
                Description
              </SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="category" sort={sort} onSort={setSort}>
                Category
              </SortButton>
            </TableHead>
            <TableHead className="text-right">
              <SortButton field="amount" sort={sort} onSort={setSort}>
                Amount
              </SortButton>
            </TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{columns.renderDate(expense)}</TableCell>
              <TableCell>{columns.renderDescription(expense)}</TableCell>
              <TableCell>{columns.renderCategory(expense)}</TableCell>
              <TableCell className="text-right">
                {columns.renderAmount(expense)}
              </TableCell>
              <TableCell>{columns.renderActions(expense)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
