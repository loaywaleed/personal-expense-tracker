import { useAuth } from "../hooks/useAuth";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getExpenses,
  addExpense,
  deleteExpense,
  getCategories,
} from "../lib/api";
import { Expense, ExpenseCategory } from "../types/expense";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    category: "",
    exactDate: "",
  });
  type FormState = {
    amount: string;
    date: string;
    category: number;
    description: string;
  };
  const [form, setForm] = useState<FormState>({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: 1,
    description: "",
  });
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getExpenses({
        date_from: filters.exactDate || filters.startDate || undefined,
        date_to: filters.exactDate || filters.endDate || undefined,
        category: filters.category || undefined,
      });
      setExpenses(data);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data as ExpenseCategory[]);
      if (data.length > 0) {
        setForm((f) => ({
          ...f,
          category: data[0].id,
        }));
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value =
      e.target.name === "category" ? Number(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    await addExpense({
      amount: Number(form.amount),
      date: form.date,
      category: form.category,
      description: form.description,
    });

    setForm({
      amount: "",
      date: new Date().toISOString().split("T")[0],
      category: categories.length > 0 ? categories[0].id : 0,
      description: "",
    });
    fetchExpenses();
  };

  const handleDelete = async (id: number) => {
    await deleteExpense(id);
    fetchExpenses();
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600">Welcome back, {user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Sign Out
            </button>
          </div>

          <form
            className="mb-8 space-y-4 md:space-y-0 md:grid md:grid-cols-5 md:gap-4"
            onSubmit={handleAdd}
          >
            <input
              name="amount"
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition-colors"
            />
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition-colors"
            />
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition-colors"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition-colors"
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Add Expense
            </button>
          </form>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Filter Expenses</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exact Date
                </label>
                <input
                  type="date"
                  name="exactDate"
                  value={filters.exactDate}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  disabled={!!filters.exactDate}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  disabled={!!filters.exactDate}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition-colors"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="text-gray-600">Loading...</div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expenses.map((exp) => (
                    <tr
                      key={exp.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">{exp.amount} EGP</td>
                      <td className="px-6 py-4">{exp.date}</td>
                      <td className="px-6 py-4">{exp.category_name}</td>
                      <td className="px-6 py-4">{exp.description}</td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          className="px-3 py-1 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                          onClick={() => handleDelete(exp.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
