import React, { useState } from "react";
import { Plus, Trash2, Edit3 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Expenses = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const [newExpense, setNewExpense] = useState({
    category: "",
    name: "",
    amount: "",
  });

  if (user.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="text-xl font-bold text-gray-600">
          🚫 Access Denied – Admins Only
        </h2>
      </div>
    );
  }

  const addOrUpdateExpense = () => {
    if (!newExpense.category || !newExpense.name || !newExpense.amount) return;

    if (editingExpense) {
      // update existing
      setExpenses(
        expenses.map((exp) =>
          exp.id === editingExpense.id
            ? {
                ...exp,
                category: newExpense.category,
                name: newExpense.name,
                amount: newExpense.amount,
              }
            : exp
        )
      );
      setEditingExpense(null);
    } else {
      // add new with automatic date
      const today = new Date().toISOString().split("T")[0];
      const expense = {
        id: Date.now(),
        category: newExpense.category,
        name: newExpense.name,
        amount: newExpense.amount,
        date: today,
      };
      setExpenses([...expenses, expense]);
    }

    setNewExpense({ category: "", name: "", amount: "" });
    setIsModalOpen(false);
  };

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setNewExpense({
      category: expense.category,
      name: expense.name,
      amount: expense.amount,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800"></h1>
        <button
          onClick={() => {
            setEditingExpense(null);
            setIsModalOpen(true);
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transform hover:scale-105 transition-all duration-200"
        >
           Add Expense
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Category</th>
              <th className="p-3">Expense Name</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No expenses recorded yet.
                </td>
              </tr>
            ) : (
              expenses.map((exp) => (
                <tr key={exp.id} className="border-t">
                  <td className="p-3">{exp.category}</td>
                  <td className="p-3">{exp.name}</td>
                  <td className="p-3">₱{exp.amount}</td>
                  <td className="p-3">{exp.date}</td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => openEditModal(exp)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit3 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() =>
                        setExpenses(expenses.filter((e) => e.id !== exp.id))
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingExpense ? "Edit Expense" : "Add Expense"}
            </h3>

            <div>
              <label className="text-sm text-gray-600">Category</label>
              <select
                value={newExpense.category}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, category: e.target.value })
                }
                className="mt-1 w-full border rounded-md p-2 focus:ring-2 focus:ring-teal-400"
              >
                <option value="">Select Category</option>
                <option value="Supplies">Supplies</option>
                <option value="Utilities">Utilities</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Payroll">Payroll</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Expense Name</label>
              <input
                type="text"
                value={newExpense.name}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, name: e.target.value })
                }
                placeholder="e.g. Shampoo"
                className="mt-1 w-full border rounded-md p-2 focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Amount</label>
              <input
                type="number"
                value={newExpense.amount}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, amount: e.target.value })
                }
                placeholder="e.g. 500"
                className="mt-1 w-full border rounded-md p-2 focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingExpense(null);
                  setNewExpense({ category: "", name: "", amount: "" });
                }}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={addOrUpdateExpense}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
              >
                {editingExpense ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
