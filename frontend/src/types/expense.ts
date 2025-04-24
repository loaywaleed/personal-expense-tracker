export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ExpenseCategory {
  id: number;
  name: string;
}

export interface Expense {
  id: number;
  userId: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  category_name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpense {
  amount: number;
  date: string;
  category: number;
  description: string;
}

export interface ExpenseFilters {
  date?: string;
  date_from?: string;
  date_to?: string;
  category?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface ExpenseSortOptions {
  field: "date" | "amount" | "category";
  direction: "asc" | "desc";
}

export interface Budget {
  id: string;
  userId: string;
  category: ExpenseCategory;
  amount: number;
  period: "monthly" | "weekly" | "yearly";
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}
