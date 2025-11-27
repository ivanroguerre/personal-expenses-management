'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUIStore } from '@/stores/ui-store';
import { EXPENSE_CATEGORIES, CATEGORY_LABELS } from '@/types/expense';

export function ExpenseFilters() {
  const { filters, setFilters, resetFilters } = useUIStore();

  const hasFilters = filters.category || filters.search;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar gastos..."
          value={filters.search || ''}
          onChange={(e) => setFilters({ search: e.target.value || undefined })}
          className="pl-9"
        />
      </div>

      <Select
        value={filters.category || 'all'}
        onValueChange={(value) =>
          setFilters({
            category: value === 'all' ? undefined : (value as typeof filters.category),
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

