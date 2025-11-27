'use client';

import { Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/stores/ui-store';
import { useDeleteExpense } from '@/hooks/use-expense-mutations';

export function DeleteExpenseDialog() {
  const { deleteModalOpen, expenseToDelete, closeDeleteModal } = useUIStore();
  const deleteExpense = useDeleteExpense();

  const handleDelete = () => {
    if (expenseToDelete) {
      deleteExpense.mutate(expenseToDelete, {
        onSuccess: () => {
          closeDeleteModal();
        },
      });
    }
  };

  return (
    <Dialog open={deleteModalOpen} onOpenChange={closeDeleteModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Expense</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this expense? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteExpense.isPending}
          >
            {deleteExpense.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

