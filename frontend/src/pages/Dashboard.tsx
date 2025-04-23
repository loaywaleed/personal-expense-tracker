import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  getCategories,
} from "../lib/api";
import { Expense, ExpenseCategory, PaymentMethod } from "../types/expense";

function Dashboard() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  type FormState = {
    amount: string;
    date: string;
    category: ExpenseCategory | "";
    description: string;
    paymentMethod: PaymentMethod | "";
  };
  const [form, setForm] = useState<FormState>({
    amount: "",
    date: "",
    category: "",
    description: "",
    paymentMethod: "Other",
  });
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FormState>(form);

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const data = await getExpenses();
      setExpenses(data);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data as ExpenseCategory[]);
      // Set default category if available
      if (data.length > 0) {
        setForm((f) => ({
          ...f,
          category: data[0] as ExpenseCategory,
          paymentMethod: f.paymentMethod || "Other",
        }));
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addExpense({
      amount: Number(form.amount),
      date: form.date,
      category: form.category as ExpenseCategory,
      description: form.description,
      paymentMethod: form.paymentMethod as PaymentMethod,
    });
    setForm({
      amount: "",
      date: "",
      category: categories.length > 0 ? categories[0] : "",
      description: "",
      paymentMethod: "Other",
    });
    fetchExpenses();
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setEditForm({
      amount: String(expense.amount),
      date: expense.date,
      category: expense.category,
      description: expense.description,
      paymentMethod: expense.paymentMethod,
    });
  };

  const handleUpdate = async (id: string) => {
    await updateExpense(id, {
      amount: Number(editForm.amount),
      date: editForm.date,
      category: editForm.category as ExpenseCategory,
      description: editForm.description,
      paymentMethod: editForm.paymentMethod as PaymentMethod,
    });
    setEditingId(null);
    fetchExpenses();
  };

  const handleDelete = async (id: string) => {
    await deleteExpense(id);
    fetchExpenses();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Dashboard
          </h1>
          <p className="mt-2 text-gray-600">Welcome back, {user?.email}</p>
          <form
            className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4"
            onSubmit={handleAdd}
          >
            <input
              name="amount"
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              {[
                "Credit Card",
                "Debit Card",
                "Cash",
                "Bank Transfer",
                "Mobile Payment",
                "Other",
              ].map((pm) => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="btn btn-primary col-span-1 md:col-auto"
            >
              Add
            </button>
          </form>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="px-2 py-1 border">Amount</th>
                    <th className="px-2 py-1 border">Date</th>
                    <th className="px-2 py-1 border">Category</th>
                    <th className="px-2 py-1 border">Description</th>
                    <th className="px-2 py-1 border">Payment</th>
                    <th className="px-2 py-1 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((exp) => (
                    <tr key={exp.id}>
                      {editingId === exp.id ? (
                        <>
                          <td className="border">
                            <input
                              name="amount"
                              type="number"
                              value={editForm.amount}
                              onChange={handleEditChange}
                              className="border p-1 rounded w-20"
                            />
                          </td>
                          <td className="border">
                            <input
                              name="date"
                              type="date"
                              value={editForm.date}
                              onChange={handleEditChange}
                              className="border p-1 rounded w-28"
                            />
                          </td>
                          <td className="border">
                            <select
                              name="category"
                              value={editForm.category}
                              onChange={handleEditChange}
                              className="border p-1 rounded"
                            >
                              {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="border">
                            <input
                              name="description"
                              value={editForm.description}
                              onChange={handleEditChange}
                              className="border p-1 rounded w-32"
                            />
                          </td>
                          <td className="border">
                            <select
                              name="paymentMethod"
                              value={editForm.paymentMethod}
                              onChange={handleEditChange}
                              className="border p-1 rounded"
                            >
                              {[
                                "Credit Card",
                                "Debit Card",
                                "Cash",
                                "Bank Transfer",
                                "Mobile Payment",
                                "Other",
                              ].map((pm) => (
                                <option key={pm} value={pm}>
                                  {pm}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="border space-x-2">
                            <button
                              className="btn btn-primary"
                              onClick={() => handleUpdate(exp.id)}
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-outline"
                              onClick={() => setEditingId(null)}
                            >
                              Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="border">{exp.amount}</td>
                          <td className="border">{exp.date}</td>
                          <td className="border">{exp.category}</td>
                          <td className="border">{exp.description}</td>
                          <td className="border">{exp.paymentMethod}</td>
                          <td className="border space-x-2">
                            <button
                              className="btn btn-outline"
                              onClick={() => handleEdit(exp)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDelete(exp.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      )}
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
