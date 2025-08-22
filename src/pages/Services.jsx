import React, { useState, useEffect } from 'react';
import { Car, Droplet, Star, Plus, Trash2 } from 'lucide-react';

const categoryIcons = {
  wash: <Droplet className="h-6 w-6 text-blue-500" />,
  detail: <Car className="h-6 w-6 text-purple-500" />,
  addon: <Star className="h-6 w-6 text-green-500" />,
};

const categories = [
  { value: 'wash', label: 'Upgrades', posCategory: 'Upgrades' },
  { value: 'detail', label: 'Promo', posCategory: 'Promo' },
  { value: 'addon', label: 'EC Packages', posCategory: 'EC Packages' },
];

const Services = () => {
  const [services, setServices] = useState(() => {
    const savedServices = localStorage.getItem('carwash_services');
    if (savedServices) {
      return JSON.parse(savedServices);
    }
    return [];
  });

  // Update localStorage when services change
  useEffect(() => {
    localStorage.setItem('carwash_services', JSON.stringify(services));
  }, [services]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newService, setNewService] = useState({ name: '', description: '', category: '', basePrice: '' });

  const handleAddService = () => {
    if (!newService.name || !newService.description || !newService.category || !newService.basePrice) {
      return alert('Please fill all fields');
    }
    const updatedServices = [...services, { ...newService, id: Date.now(), basePrice: parseFloat(newService.basePrice) }];
    setServices(updatedServices);
    localStorage.setItem('carwash_services', JSON.stringify(updatedServices));
    setNewService({ name: '', description: '', category: '', basePrice: '' });
    setShowAddModal(false);
  };

  const handleDeleteService = (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      const updatedServices = services.filter(service => service.id !== serviceId);
      setServices(updatedServices);
      localStorage.setItem('carwash_services', JSON.stringify(updatedServices));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl text-blue-600 font-bold">Our Services</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-2xl hover:bg-blue-600 transition"
        >
          <Plus className="h-5 w-5 mr-2" /> Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <div
            key={service.id}
            className="flex flex-col gap-2 bg-white rounded-2xl shadow-lg p-5 hover:shadow-2xl transform hover:scale-105 transition"
          >
            <div className="flex items-center gap-3">
              {categoryIcons[service.category]}
              <span className="text-lg font-semibold text-gray-800">{service.name}</span>
            </div>
            <p className="text-gray-600 text-sm">{service.description}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-blue-600 font-bold">₱{service.basePrice}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {categories.find(cat => cat.value === service.category)?.label}
                </span>
                <button
                  onClick={() => handleDeleteService(service.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition"
                  title="Delete service"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-4">Add New Service</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Service Name"
                value={newService.name}
                onChange={e => setNewService({ ...newService, name: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <textarea
                placeholder="Description"
                value={newService.description}
                onChange={e => setNewService({ ...newService, description: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="number"
                placeholder="Base Price (₱)"
                value={newService.basePrice}
                onChange={e => setNewService({ ...newService, basePrice: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <select
                value={newService.category}
                onChange={e => setNewService({ ...newService, category: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddService}
                className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
              >
                Add Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
