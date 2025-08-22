import React, { useState } from "react";
import { FaEdit, FaSearch, FaDownload, FaFilter } from "react-icons/fa";

const Inventory = () => {
  const [items, setItems] = useState([
    { id: 1, name: "Shampoo", quantity: 10 },
    { id: 2, name: "Wax", quantity: 5 },
    { id: 3, name: "Microfiber Cloth", quantity: 20 },
  ]);

  const [history, setHistory] = useState([
    { id: 1, itemName: "Shampoo", quantity: 2, employeeName: "John Doe", date: "2025-01-15", action: "get" },
    { id: 2, itemName: "Wax", quantity: 1, employeeName: "Jane Smith", date: "2025-01-14", action: "get" },
    { id: 3, itemName: "Microfiber Cloth", quantity: 5, employeeName: "John Doe", date: "2025-01-13", action: "get" },
  ]);

  const [search, setSearch] = useState("");
  const [isGetModalOpen, setIsGetModalOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [getItem, setGetItem] = useState({ item: null, quantity: 1, employeeName: "" });



  const openGetModal = (item) => {
    setGetItem({ item: { ...item }, quantity: 1, employeeName: "" });
    setIsGetModalOpen(true);
  };

  const processGetItem = () => {
    if (!getItem.employeeName) return alert("Please enter employee name");
    if (getItem.quantity <= 0 || getItem.quantity > getItem.item.quantity) {
      return alert("Invalid quantity");
    }

    // Update inventory
    setItems(items.map(item => 
      item.id === getItem.item.id 
        ? { ...item, quantity: item.quantity - getItem.quantity }
        : item
    ));

    // Add to history
    setHistory([...history, {
      id: Date.now(),
      itemName: getItem.item.name,
      quantity: getItem.quantity,
      employeeName: getItem.employeeName,
      date: new Date().toISOString().split('T')[0],
      action: "get"
    }]);

    setIsGetModalOpen(false);
    setGetItem({ item: null, quantity: 1, employeeName: "" });
  };


  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredHistory = history.filter(item =>
    employeeFilter === "" || item.employeeName.toLowerCase().includes(employeeFilter.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      

      {/* Navigation Buttons */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="flex gap-2">
          <button
            className={`px-6 py-3 rounded-lg font-semibold shadow-md transform hover:scale-105 transition-all duration-200 ${
              !showHistory ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
            onClick={() => setShowHistory(false)}
          >
            Inventory
          </button>
          <button
            className={`px-6 py-3 rounded-lg font-semibold shadow-md transform hover:scale-105 transition-all duration-200 ${
              showHistory ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
            onClick={() => setShowHistory(true)}
          >
            History
          </button>
        </div>
        

        <div className="relative w-full md:w-64">
          {!showHistory ? (
            <>
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search item..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base shadow-sm"
              />
            </>
          ) : (
            <>
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Filter by employee..."
                value={employeeFilter}
                onChange={e => setEmployeeFilter(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base shadow-sm"
              />
            </>
          )}
        </div>
      </div>

      {/* Content Tables */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        {!showHistory ? (
          // Inventory Table
          <table className="min-w-full table-auto text-center text-lg">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <th className="px-4 py-3 w-1/2">Item</th>
                <th className="px-4 py-3 w-1/4">Quantity</th>
                <th className="px-4 py-3 w-1/4">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {filteredItems.map((item, index) => (
                <tr key={item.id} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">{item.quantity}</td>
                  <td className="px-4 py-3">
                    <button
                      className="text-green-600 hover:text-green-700 mx-1 transform hover:scale-110 transition duration-200"
                      onClick={() => openGetModal(item)}
                      disabled={item.quantity === 0}
                    >
                      <FaDownload />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          // History Table
          <table className="min-w-full table-auto text-center text-lg">
            <thead>
              <tr className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {filteredHistory.map((item, index) => (
                <tr key={item.id} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <td className="px-4 py-3">{item.itemName}</td>
                  <td className="px-4 py-3">{item.quantity}</td>
                  <td className="px-4 py-3">{item.employeeName}</td>
                  <td className="px-4 py-3">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>


      {/* Get Item Modal */}
      {isGetModalOpen && getItem.item && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl w-96 p-6 shadow-2xl flex flex-col gap-5 transform transition-transform duration-300 scale-95 animate-scaleIn">
            <h2 className="text-2xl text-green-600 font-bold text-center">Get Item</h2>
            <p className="text-center font-bold text-xl">{getItem.item.name}</p>
            <p className="text-center text-gray-600">Available: {getItem.item.quantity}</p>
            
            <input
              type="text"
              placeholder="Employee Name"
              value={getItem.employeeName}
              onChange={e => setGetItem({...getItem, employeeName: e.target.value})}
              className="px-4 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
            />
            
            <div className="flex justify-center items-center gap-6 text-lg">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transform hover:scale-110 transition"
                onClick={() => setGetItem({...getItem, quantity: Math.max(1, getItem.quantity - 1)})}
              >
                -
              </button>
              <span className="text-xl font-semibold">{getItem.quantity}</span>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transform hover:scale-110 transition"
                onClick={() => setGetItem({...getItem, quantity: Math.min(getItem.item.quantity, getItem.quantity + 1)})}
              >
                +
              </button>
            </div>
            
            <div className="flex justify-center gap-4 mt-2">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold text-lg shadow-md transform hover:scale-105 transition"
                onClick={processGetItem}
              >
                Get Item
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold text-lg shadow-md transform hover:scale-105 transition"
                onClick={() => setIsGetModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
