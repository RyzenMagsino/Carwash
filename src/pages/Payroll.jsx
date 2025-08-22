import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaDownload, FaPrint, FaFileExcel, FaFilePdf, FaUsers, FaChartLine } from "react-icons/fa";

const Payroll = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [payrollData, setPayrollData] = useState({
    teamA: {
      sales: 0,
      members: 5,
      payrollPercentage: 35
    },
    teamB: {
      sales: 0,
      members: 4,
      payrollPercentage: 35
    }
  });

  // Load sales data from localStorage based on selected date
  useEffect(() => {
    const loadSalesData = () => {
      try {
        const salesKey = `team_sales_${selectedDate}`;
        const salesData = JSON.parse(localStorage.getItem(salesKey) || '{}');
        
        setPayrollData(prev => ({
          teamA: {
            ...prev.teamA,
            sales: salesData.teamA || 0
          },
          teamB: {
            ...prev.teamB,
            sales: salesData.teamB || 0
          }
        }));
      } catch (error) {
        console.error('Failed to load sales data:', error);
      }
    };

    loadSalesData();
    
    // Listen for storage changes to update in real-time
    const handleStorageChange = () => {
      loadSalesData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [selectedDate]);

  // Test different scenarios by changing these values:
  // Example 1: Team A: ₱15,000 sales, 6 members → ₱15,000 × 35% = ₱5,250 ÷ 6 = ₱875 per member
  // Example 2: Team B: ₱12,000 sales, 3 members → ₱12,000 × 35% = ₱4,200 ÷ 3 = ₱1,400 per member

  // Calculate payroll computations
  const calculatePayroll = () => {
    const teamAPayroll = payrollData.teamA.sales * (payrollData.teamA.payrollPercentage / 100);
    const teamBPayroll = payrollData.teamB.sales * (payrollData.teamB.payrollPercentage / 100);
    const teamAPerMember = teamAPayroll / payrollData.teamA.members;
    const teamBPerMember = teamBPayroll / payrollData.teamB.members;
    const totalSales = payrollData.teamA.sales + payrollData.teamB.sales;
    const totalPayroll = teamAPayroll + teamBPayroll;

    return {
      teamAPayroll,
      teamBPayroll,
      teamAPerMember,
      teamBPerMember,
      totalSales,
      totalPayroll
    };
  };

  const calculations = calculatePayroll();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleExportPDF = () => {
    alert("PDF export functionality would be implemented here");
  };

  const handleExportExcel = () => {
    alert("Excel export functionality would be implemented here");
  };

  const handlePrintPayslips = () => {
    alert("Print payslips functionality would be implemented here");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Weekly Payroll Management</h1>
        <p className="text-gray-600">Calculate and manage employee weekly payroll based on weekly sales performance</p>
      </div>

      {/* Date Selection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <FaCalendarAlt className="text-blue-600 text-xl" />
          <h2 className="text-xl font-semibold text-gray-800">Weekly Payroll Period</h2>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-gray-700 font-medium">Select Week Ending Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span className="text-lg font-semibold text-gray-800">{formatDate(selectedDate)}</span>
        </div>
      </div>

      {/* Team Sales Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <FaChartLine className="text-green-600 text-xl" />
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Weekly Team Sales Summary</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Team A Sales */}
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Team A Sales</h3>
            <p className="text-2xl font-bold text-blue-800">{formatCurrency(payrollData.teamA.sales)}</p>
            <div className="flex items-center gap-2 mt-2">
              <FaUsers className="text-blue-600" />
              <span className="text-blue-600">{payrollData.teamA.members} members</span>
            </div>
          </div>

          {/* Team B Sales */}
          <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">Team B Sales</h3>
            <p className="text-2xl font-bold text-purple-800">{formatCurrency(payrollData.teamB.sales)}</p>
            <div className="flex items-center gap-2 mt-2">
              <FaUsers className="text-purple-600" />
              <span className="text-purple-600">{payrollData.teamB.members} members</span>
            </div>
          </div>

          {/* Total Sales */}
          <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-green-700 mb-2">Total Sales</h3>
            <p className="text-2xl font-bold text-green-800">{formatCurrency(calculations.totalSales)}</p>
            <div className="flex items-center gap-2 mt-2">
              <FaUsers className="text-green-600" />
              <span className="text-green-600">{payrollData.teamA.members + payrollData.teamB.members} total members</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payroll Computation */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Weekly Payroll Computation (35% of Weekly Sales)</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team A Computation */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-700 mb-4">Team A Weekly Payroll</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Sales:</span>
                <span className="font-semibold">{formatCurrency(payrollData.teamA.sales)}</span>
              </div>
              <div className="flex justify-between">
                <span>Payroll Rate:</span>
                <span className="font-semibold">{payrollData.teamA.payrollPercentage}%</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>Total Payroll:</span>
                <span className="font-bold text-blue-700">{formatCurrency(calculations.teamAPayroll)}</span>
              </div>
              <div className="flex justify-between">
                <span>Members:</span>
                <span className="font-semibold">{payrollData.teamA.members}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>Per Member:</span>
                <span className="font-bold text-blue-700">{formatCurrency(calculations.teamAPerMember)}</span>
              </div>
            </div>
          </div>

          {/* Team B Computation */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-700 mb-4">Team B Weekly Payroll</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Sales:</span>
                <span className="font-semibold">{formatCurrency(payrollData.teamB.sales)}</span>
              </div>
              <div className="flex justify-between">
                <span>Payroll Rate:</span>
                <span className="font-semibold">{payrollData.teamB.payrollPercentage}%</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>Total Payroll:</span>
                <span className="font-bold text-purple-700">{formatCurrency(calculations.teamBPayroll)}</span>
              </div>
              <div className="flex justify-between">
                <span>Members:</span>
                <span className="font-semibold">{payrollData.teamB.members}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>Per Member:</span>
                <span className="font-bold text-purple-700">{formatCurrency(calculations.teamBPerMember)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Weekly Payroll Summary Table</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <th className="px-6 py-3 text-left">Team</th>
                <th className="px-6 py-3 text-right">Sales</th>
                <th className="px-6 py-3 text-right">Members</th>
                <th className="px-6 py-3 text-right">Weekly Payroll (35%)</th>
                <th className="px-6 py-3 text-right">Per Member/Week</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              <tr className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-blue-700">Team A</td>
                <td className="px-6 py-4 text-right">{formatCurrency(payrollData.teamA.sales)}</td>
                <td className="px-6 py-4 text-right">{payrollData.teamA.members}</td>
                <td className="px-6 py-4 text-right font-semibold">{formatCurrency(calculations.teamAPayroll)}</td>
                <td className="px-6 py-4 text-right font-bold text-blue-700">{formatCurrency(calculations.teamAPerMember)}</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-purple-700">Team B</td>
                <td className="px-6 py-4 text-right">{formatCurrency(payrollData.teamB.sales)}</td>
                <td className="px-6 py-4 text-right">{payrollData.teamB.members}</td>
                <td className="px-6 py-4 text-right font-semibold">{formatCurrency(calculations.teamBPayroll)}</td>
                <td className="px-6 py-4 text-right font-bold text-purple-700">{formatCurrency(calculations.teamBPerMember)}</td>
              </tr>
              <tr className="bg-gray-100 font-bold">
                <td className="px-6 py-4 text-green-700">Total</td>
                <td className="px-6 py-4 text-right text-green-700">{formatCurrency(calculations.totalSales)}</td>
                <td className="px-6 py-4 text-right text-green-700">{payrollData.teamA.members + payrollData.teamB.members}</td>
                <td className="px-6 py-4 text-right text-green-700">{formatCurrency(calculations.totalPayroll)}</td>
                <td className="px-6 py-4 text-right text-green-700">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Generate / Export Options</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleExportPDF}
            className="flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transform hover:scale-105 transition-all duration-200"
          >
            <FaFilePdf className="text-xl" />
            Download PDF Report
          </button>
          
          <button
            onClick={handleExportExcel}
            className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transform hover:scale-105 transition-all duration-200"
          >
            <FaFileExcel className="text-xl" />
            Export to Excel
          </button>
          
          <button
            onClick={handlePrintPayslips}
            className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transform hover:scale-105 transition-all duration-200"
          >
            <FaPrint className="text-xl" />
            Print Payslips
          </button>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
          <p className="text-blue-800">
            <strong>Note:</strong> This is a <strong>weekly payroll calculation</strong>. Sales data is automatically synced from the POS system. Export and print functions will generate individual weekly payslips for each employee with their calculated earnings based on weekly team performance.
          </p>
        </div>
        
        {/* Real-time Sales Status */}
        <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-400 rounded">
          <p className="text-green-800">
            <strong>Real-time Data:</strong> Sales data for {formatDate(selectedDate)} - Team A: {formatCurrency(payrollData.teamA.sales)}, Team B: {formatCurrency(payrollData.teamB.sales)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payroll;