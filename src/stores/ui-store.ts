import { create } from 'zustand';
import type {
  ExpenseFilters,
  ExpenseSort,
  SortDirection,
  SortField,
} from '@/types/expense';

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Expense filters
  filters: ExpenseFilters;
  setFilters: (filters: Partial<ExpenseFilters>) => void;
  resetFilters: () => void;

  // Expense sorting
  sort: ExpenseSort;
  setSort: (field: SortField, direction?: SortDirection) => void;

  // Delete confirmation modal
  deleteModalOpen: boolean;
  expenseToDelete: string | null;
  openDeleteModal: (expenseId: string) => void;
  closeDeleteModal: () => void;
}

const defaultFilters: ExpenseFilters = {};

const defaultSort: ExpenseSort = {
  field: 'date',
  direction: 'desc',
};

export const useUIStore = create<UIState>((set) => ({
  // Sidebar
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  // Expense filters
  filters: defaultFilters,
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  resetFilters: () => set({ filters: defaultFilters }),

  // Expense sorting
  sort: defaultSort,
  setSort: (field, direction) =>
    set((state) => ({
      sort: {
        field,
        direction:
          direction ??
          (state.sort.field === field && state.sort.direction === 'asc'
            ? 'desc'
            : 'asc'),
      },
    })),

  // Delete confirmation modal
  deleteModalOpen: false,
  expenseToDelete: null,
  openDeleteModal: (expenseId) =>
    set({ deleteModalOpen: true, expenseToDelete: expenseId }),
  closeDeleteModal: () =>
    set({ deleteModalOpen: false, expenseToDelete: null }),
}));

