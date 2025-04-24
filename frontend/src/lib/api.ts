import axios from "axios";
import {
  CreateExpense,
  Expense,
  ExpenseCategory,
  ExpenseFilters,
  PaginatedResponse,
} from "../types/expense";

const API_URL = "https://millennium.loaywaleed.tech/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Helper to get CSRF token from cookies
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

api.interceptors.request.use((config) => {
  // Read CSRF token from cookie before sending request
  const token = getCookie("csrftoken");
  if (
    token &&
    ["post", "put", "delete"].includes(config.method?.toLowerCase() || "")
  ) {
    config.headers["X-csrftoken"] = token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // window.location.href = "/login";
      console.log("Unauthorized access - redirecting to login");
    }
    return Promise.reject(error);
  },
);

// Expense API functions
export const getExpenses = async (filters?: ExpenseFilters) => {
  const queryParams: Record<string, string> = {};

  if (filters) {
    if (filters.category) {
      queryParams.category = filters.category;
    }
    if (filters.date_from) {
      queryParams.date_from = filters.date_from;
    }
    if (filters.date_to) {
      queryParams.date_to = filters.date_to;
    }
  }

  const { data } = await api.get<PaginatedResponse<Expense>>("/expenses", {
    params: queryParams,
  });
  return data.results;
};

export const addExpense = async (expense: CreateExpense) => {
  const { data } = await api.post<Expense>("/expenses", expense);
  return data;
};

export const updateExpense = async (id: number, expense: CreateExpense) => {
  const { data } = await api.put<Expense>(`/expenses/${id}`, {
    amount: Number(expense.amount),
    date: expense.date,
    category: Number(expense.category),
    description: expense.description,
  });
  return data;
};

export const deleteExpense = async (id: number) => {
  await api.delete(`/expenses/${id}`);
};

// Fetch categories from /categories endpoint
export const getCategories = async (): Promise<ExpenseCategory[]> => {
  const { data } = await api.get<PaginatedResponse<ExpenseCategory>>(
    "/categories",
  );
  return data.results;
};
