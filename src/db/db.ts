// src/db.ts
import Dexie, { type EntityTable } from 'dexie';

interface Account {
  id?: number;
  name: string;
  balance: number;
}

interface Category {
  id?: number;
  name: string;
  color: string; 
}

interface Income {
  id?: number;
  title: string;
  amount: number;
  date: Date;
  accountId: number;
  description?: string;
}

interface Expense {
  id?: number;
  title: string;
  amount: number;
  date: Date;
  categoryId: number;
  accountId: number;
  description?: string;
}

const db = new Dexie('FinancesDb') as Dexie & {
  accounts: EntityTable<Account, 'id'>;
  categories: EntityTable<Category, 'id'>;
  incomes: EntityTable<Income, 'id'>;
  expenses: EntityTable<Expense, 'id'>;
};

db.version(1).stores({
  accounts: '++id, name, balance',
  categories: '++id, name, color',
  incomes: '++id, title, amount, date, accountId, description',
  expenses: '++id, title, amount, date, categoryId, accountId, description'
   
});

db.on("populate", () => {
  db.categories.bulkAdd([
    { name: "Bills", color: "#ff4538" },
    { name: "Groceries", color: "#38ff45" },
    { name: "Transport", color: "#4538ff" },
    { name: "Entertainment", color: "#ff38f2" },
    { name: "Other", color: "#f2ff38" }
  ]);
  db.accounts.bulkAdd([
    { name: "Wallet", balance: 0 },
    { name: "Bank account", balance: 0 }
  ]);
});

export type { Account };
export type { Category };
export type { Income };
export type { Expense };
export { db };