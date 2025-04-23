export interface Expense {
  id: string;
  userId: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  description: string;
  paymentMethod: PaymentMethod;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type ExpenseCategory =
  | 'Food & Dining'
  | 'Transportation'
  | 'Shopping'
  | 'Entertainment'
  | 'Bills & Utilities'
  | 'Health & Fitness'
  | 'Travel'
  | 'Education'
  | 'Business'
  | 'Other';

export type PaymentMethod =
  | 'Credit Card'
  | 'Debit Card'
  | 'Cash'
  | 'Bank Transfer'
  | 'Mobile Payment'
  | 'Other';

export interface ExpenseFilters {
  startDate?: string;
  endDate?: string;
  categories?: ExpenseCategory[];
  minAmount?: number;
  maxAmount?: number;
  paymentMethods?: PaymentMethod[];
  search?: string;
}

export interface ExpenseSortOptions {
  field: 'date' | 'amount' | 'category';
  direction: 'asc' | 'desc';
}

export interface Budget {
  id: string;
  userId: string;
  category: ExpenseCategory;
  amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}