import React, { useState } from "react";
import { FaTrash, FaEdit, FaSearch } from "react-icons/fa";

const Inventory = () => {
  const [items, setItems] = useState([
    { id: 1, name: "Shampoo", quantity: 10, price: 120 },
    { id: 2, name: "Wax", quantity: 5, price: 250 },
    { id: 3, name: "Microfiber Cloth", quantity: 20, price: 50 },
  ]);

  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", price: "" });
  const [editItem, setEditItem] = useState(null);

  const addItem = () => {
    if (!newItem.name || !newItem.quantity || !newItem.price) return alert("Please fill all fields");
    setItems([...items, {
      id: Date.now(),
      name: newItem.name,
      quantity: parseInt(newItem.quantity),
      price: parseFloat(newItem.price)
    }]);
    setNewItem({ name: "", quantity: "", price: "" });
    setIsAddModalOpen(false);
  };

  const deleteItem = (id) => setItems(items.filter(item => item.id !== id));

  const openEditModal = (item) => {
    setEditItem({ ...item });
    setIsEditModalOpen(true);
  };

  const saveEdit = () => {
    setItems(items.map(item => item.id === editItem.id ? editItem : item));
    setIsEditModalOpen(false);
  };

  const changeQuantity = (amount) => {
    setEditItem(prev => ({ ...prev, quantity: Math.max(0, prev.quantity + amount) }));
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      

      {/* Add + Search Row */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transform hover:scale-105 transition-all duration-200"
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Item
        </button>

        <div className="relative w-full md:w-64">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search item..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base shadow-sm"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full table-auto text-center text-lg">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <th className="px-4 py-3 w-1/2">Item</th>
              <th className="px-4 py-3 w-1/6">Quantity</th>
              <th className="px-4 py-3 w-1/6">Price (₱)</th>
              <th className="px-4 py-3 w-1/6">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {filteredItems.map((item, index) => (
              <tr key={item.id} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{item.quantity}</td>
                <td className="px-4 py-3">{item.price}</td>
                <td className="px-4 py-3">
                  <button
                    className="text-yellow-500 hover:text-yellow-600 mx-1 transform hover:scale-110 transition duration-200"
                    onClick={() => openEditModal(item)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-700 mx-1 transform hover:scale-110 transition duration-200"
                    onClick={() => deleteItem(item.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl w-96 p-6 shadow-2xl flex flex-col gap-5 transform transition-transform duration-300 scale-95 animate-scaleIn">
            <h2 className="text-2xl text-blue-600 font-bold text-center">Add New Item</h2>
            <input
              type="text"
              placeholder="Item Name"
              value={newItem.name}
              onChange={e => setNewItem({...newItem, name: e.target.value})}
              className="px-4 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newItem.quantity}
              onChange={e => setNewItem({...newItem, quantity: e.target.value})}
              className="px-4 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            />
            <input
              type="number"
              placeholder="Price"
              value={newItem.price}
              onChange={e => setNewItem({...newItem, price: e.target.value})}
              className="px-4 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            />
            <div className="flex justify-center gap-4 mt-2">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold text-lg shadow-md transform hover:scale-105 transition"
                onClick={addItem}
              >
                Save
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold text-lg shadow-md transform hover:scale-105 transition"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl w-96 p-6 shadow-2xl flex flex-col gap-5 transform transition-transform duration-300 scale-95 animate-scaleIn">
            <h2 className="text-2xl text-blue-600 font-bold text-center">Edit Item</h2>
            <p className="text-center font-bold text-xl">{editItem.name}</p>
            <div className="flex justify-center items-center gap-6 text-lg">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transform hover:scale-110 transition"
                onClick={() => changeQuantity(-1)}
              >
                -
              </button>
              <span className="text-xl font-semibold">{editItem.quantity}</span>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transform hover:scale-110 transition"
                onClick={() => changeQuantity(1)}
              >
                +
              </button>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold text-lg shadow-md transform hover:scale-105 transition"
                onClick={saveEdit}
              >
                Save
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold text-lg shadow-md transform hover:scale-105 transition"
                onClick={() => setIsEditModalOpen(false)}
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
