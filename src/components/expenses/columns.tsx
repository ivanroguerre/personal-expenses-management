'use client';

import { format } from 'date-fns';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Expense } from '@/types/expense';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/types/expense';
import { CURRENCY } from '@/lib/constants';

interface ColumnConfig {
  onDelete: (id: string) => void;
}

export function getColumns({ onDelete }: ColumnConfig) {
  return {
    renderDate: (expense: Expense) => (
      <span className="font-medium">
        {format(new Date(expense.date), 'MMM dd, yyyy')}
      </span>
    ),
    renderDescription: (expense: Expense) => (
      <span className="max-w-[200px] truncate">{expense.description}</span>
    ),
    renderCategory: (expense: Expense) => (
      <Badge
        variant="outline"
        style={{
          borderColor: CATEGORY_COLORS[expense.category],
          color: CATEGORY_COLORS[expense.category],
        }}
      >
        {CATEGORY_LABELS[expense.category]}
      </Badge>
    ),
    renderAmount: (expense: Expense) => (
      <span className="font-mono font-semibold">
        {CURRENCY.symbol}
        {expense.amount.toLocaleString(CURRENCY.locale, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
    renderActions: (expense: Expense) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/expenses/${expense.id}`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(expense.id)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  };
}

