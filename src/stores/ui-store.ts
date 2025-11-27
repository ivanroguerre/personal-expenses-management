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

  // Pagination
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  resetPagination: () => void;

  // Delete confirmation modal
  deleteModalOpen: boolean;
  expenseToDelete: string | null;
  openDeleteModal: (expenseId: string) => void;
  closeDeleteModal: () => void;
}

// Helper function to get the current year date range
const getCurrentYearDateRange = () => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1); // January 1st
  const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999); // December 31st
  return { startOfYear, endOfYear };
};

const { startOfYear, endOfYear } = getCurrentYearDateRange();

const defaultFilters: ExpenseFilters = {
  startDate: startOfYear,
  endDate: endOfYear,
};

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
      page: 1, // Reset to first page when filters change
    })),
  resetFilters: () => set({ filters: defaultFilters, page: 1 }),

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
      page: 1, // Reset to first page when sorting changes
    })),

  // Pagination
  page: 1,
  pageSize: 20,
  setPage: (page) => set({ page }),
  setPageSize: (pageSize) => set({ pageSize, page: 1 }),
  resetPagination: () => set({ page: 1, pageSize: 20 }),

  // Delete confirmation modal
  deleteModalOpen: false,
  expenseToDelete: null,
  openDeleteModal: (expenseId) =>
    set({ deleteModalOpen: true, expenseToDelete: expenseId }),
  closeDeleteModal: () =>
    set({ deleteModalOpen: false, expenseToDelete: null }),
}));

