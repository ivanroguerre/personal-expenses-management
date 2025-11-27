import Dexie, { type EntityTable } from 'dexie';
import type { Expense } from '@/types/expense';

const db = new Dexie('ExpensesDatabase') as Dexie & {
  expenses: EntityTable<Expense, 'id'>;
};

db.version(1).stores({
  expenses: 'id, amount, category, date, createdAt, updatedAt',
});

export { db };

