// At the top, import the same as your current code
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  DollarSign,
  Car,
  TrendingUp,
  Calendar,
  Download,
  Filter,
  BarChart3,
  CreditCard,
} from "lucide-react";
import { Line, Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  ChartDataLabels
);

const Reports = () => {
  const { hasPermission } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [selectedReport, setSelectedReport] = useState("sales");

  const periods = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" },
  ];

  const reports = [
    { value: "sales", label: "Sales Report", icon: DollarSign },
    { value: "services", label: "Service Analysis", icon: Car },
    { value: "inventory", label: "Inventory Status", icon: BarChart3 },
    { value: "performance", label: "Performance Metrics", icon: TrendingUp },
    { value: "expenses", label: "Expenses Report", icon: CreditCard },
  ];

  // --- Sample Data ---
  const salesData = [
    { date: "2024-01-15", revenue: 1250, transactions: 18 },
    { date: "2024-01-14", revenue: 980, transactions: 14 },
    { date: "2024-01-13", revenue: 1420, transactions: 20 },
    { date: "2024-01-12", revenue: 1100, transactions: 16 },
    { date: "2024-01-11", revenue: 1350, transactions: 19 },
  ];

  const serviceData = [
    { service: "Basic Wash", count: 45, revenue: 1125 },
    { service: "Premium Wash", count: 32, revenue: 1440 },
    { service: "Interior Detail", count: 18, revenue: 1530 },
    { service: "Full Detail", count: 12, revenue: 1800 },
    { service: "Tire Shine", count: 28, revenue: 420 },
    { service: "Air Freshener", count: 35, revenue: 280 },
  ];

  const inventoryData = [
    { item: "Car Shampoo", current: 15, min: 10, status: "Good" },
    { item: "Microfiber Towels", current: 8, min: 15, status: "Low" },
    { item: "Wax", current: 3, min: 8, status: "Critical" },
    { item: "Tire Shine", current: 12, min: 5, status: "Good" },
    { item: "Air Freshener", current: 25, min: 10, status: "Good" },
    { item: "Clay Bar", current: 6, min: 5, status: "Good" },
  ];

  const expensesData = [
    { date: "2024-01-15", category: "Supplies", amount: 450 },
    { date: "2024-01-14", category: "Utilities", amount: 220 },
    { date: "2024-01-13", category: "Maintenance", amount: 300 },
    { date: "2024-01-12", category: "Supplies", amount: 150 },
    { date: "2024-01-11", category: "Salaries", amount: 1200 },
  ];

  // --- Calculations ---
  const totalRevenue = salesData.reduce((acc, d) => acc + d.revenue, 0);
  const totalTransactions = salesData.reduce((acc, d) => acc + d.transactions, 0);
  const averageTicket = totalTransactions
    ? (totalRevenue / totalTransactions).toFixed(2)
    : 0;
  const topService = serviceData.reduce((prev, curr) =>
    curr.revenue > prev.revenue ? curr : prev
  );

  const totalExpenses = expensesData.reduce((acc, d) => acc + d.amount, 0);

  const salesTrendData = {
    labels: salesData.map((d) => d.date),
    datasets: [
      {
        label: "Revenue",
        data: salesData.map((d) => d.revenue),
        fill: false,
        borderColor: "#22B8CF",
        backgroundColor: "#22B8CF",
        tension: 0.2,
      },
    ],
  };

  const expensesTrendData = {
    labels: expensesData.map((d) => d.date),
    datasets: [
      {
        label: "Expenses",
        data: expensesData.map((d) => d.amount),
        fill: false,
        borderColor: "#F87171",
        backgroundColor: "#F87171",
        tension: 0.2,
      },
    ],
  };

  const servicePieData = {
    labels: serviceData.map((s) => s.service),
    datasets: [
      {
        data: serviceData.map((s) => s.revenue),
        backgroundColor: [
          "#34D399",
          "#60A5FA",
          "#FBBF24",
          "#F87171",
          "#A78BFA",
          "#F97316",
        ],
      },
    ],
  };

  const expensesPieData = {
    labels: [...new Set(expensesData.map((e) => e.category))],
    datasets: [
      {
        data: expensesData.reduce((acc, e) => {
          acc[e.category] = (acc[e.category] || 0) + e.amount;
          return acc;
        }, {}),
        backgroundColor: ["#F87171", "#FBBF24", "#60A5FA", "#A78BFA", "#34D399"],
      },
    ],
  };
  expensesPieData.datasets[0].data = Object.values(expensesPieData.datasets[0].data);

  const pieOptions = {
    plugins: {
      datalabels: {
        display: false, // ✅ hide labels on chart
      },
      legend: {
        position: "bottom",
        labels: { boxWidth: 15, padding: 15 },
      },
    },
  };

  if (!hasPermission("view_reports")) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reports</h1>
        <p className="text-gray-600">
          Access denied. You don't have permission to view reports.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">
            Business insights and performance metrics
          </p>
        </div>
        <button className="flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
          <Download className="h-4 w-4 mr-2" /> Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          >
            {periods.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-gray-400" />
          <select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          >
            {reports.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary KPIs */}
      {selectedReport !== "expenses" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
            <DollarSign className="h-8 w-8 text-green-600" />
            <p className="text-sm text-gray-500 mt-2">Total Revenue</p>
            <p className="text-xl font-bold text-gray-900">
              ${totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
            <Car className="h-8 w-8 text-blue-600" />
            <p className="text-sm text-gray-500 mt-2">Total Transactions</p>
            <p className="text-xl font-bold text-gray-900">{totalTransactions}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <p className="text-sm text-gray-500 mt-2">Average Ticket</p>
            <p className="text-xl font-bold text-gray-900">${averageTicket}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
            <Calendar className="h-8 w-8 text-orange-600" />
            <p className="text-sm text-gray-500 mt-2">Top Service</p>
            <p className="text-xl font-bold text-gray-900">{topService.service}</p>
          </div>
        </div>
      )}

      {/* Sales Report */}
      {selectedReport === "sales" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Daily Revenue Trend
            </h3>
            <Line data={salesTrendData} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Service Revenue Distribution
            </h3>
            <Pie
              data={servicePieData}
              options={pieOptions}
              plugins={[ChartDataLabels]}
            />
          </div>
        </div>
      )}

      {/* Expenses Report */}
      {selectedReport === "expenses" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Daily Expenses Trend
            </h3>
            <Line data={expensesTrendData} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Expenses Breakdown by Category
            </h3>
            <Pie
              data={expensesPieData}
              options={pieOptions}
              plugins={[ChartDataLabels]}
            />
          </div>
          <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition col-span-1 lg:col-span-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Total Expenses
            </h3>
            <p className="text-2xl font-bold text-red-600">
              ₱{totalExpenses.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Inventory */}
      {selectedReport === "inventory" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {inventoryData.map((item) => (
            <div
              key={item.item}
              className={`p-4 rounded-lg shadow text-white ${
                item.status === "Good"
                  ? "bg-green-500"
                  : item.status === "Low"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              } hover:shadow-lg transition`}
            >
              <p className="font-bold text-lg">{item.item}</p>
              <p>
                {item.current} in stock (Min: {item.min})
              </p>
              <p>Status: {item.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;
