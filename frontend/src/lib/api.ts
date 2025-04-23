import axios from "axios";
import { Expense, ExpenseFilters } from "../types/expense";

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
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
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
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Expense API functions
export const getExpenses = async (filters?: ExpenseFilters) => {
  const params = filters ? { ...filters } : {};
  const { data } = await api.get<Expense[]>("/expenses", { params });
  return data;
};

export const addExpense = async (
  expense: Omit<Expense, "id" | "userId" | "createdAt" | "updatedAt">,
) => {
  const { data } = await api.post<Expense>("/expenses", expense);
  return data;
};

export const updateExpense = async (
  id: string,
  expense: Partial<Omit<Expense, "id" | "userId" | "createdAt" | "updatedAt">>,
) => {
  const { data } = await api.put<Expense>(`/expenses/${id}`, expense);
  return data;
};

export const deleteExpense = async (id: string) => {
  await api.delete(`/expenses/${id}`);
};

// Fetch categories from /categories endpoint
export const getCategories = async (): Promise<string[]> => {
  const { data } = await api.get<string[]>("/categories", {
    withCredentials: false,
  });
  return data;
};
