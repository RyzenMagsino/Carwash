import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const POS = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [carType, setCarType] = useState('');
  const [showCarTypeDropdown, setShowCarTypeDropdown] = useState(false);
  const [cashTendered, setCashTendered] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showReceiptPopup, setShowReceiptPopup] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const services = [
    { id: 'EC1', name: 'EC1', price: 150, category: 'SEDAN' },
    { id: 'EC2', name: 'EC2', price: 150, category: 'SEDAN' },
    { id: 'EC3', name: 'EC3', price: 200, category: 'SUV' },
    { id: 'EC4', name: 'EC4', price: 200, category: 'SUV' },
    { id: 'EC5', name: 'EC5', price: 250, category: 'TRUCK' },
    { id: 'EC6', name: 'EC6', price: 250, category: 'TRUCK' },
    { id: 'EC7', name: 'EC7', price: 300, category: 'VAN' },
    { id: 'EC8', name: 'EC8', price: 300, category: 'VAN' },
    { id: 'EC9', name: 'EC9', price: 500, category: 'LUXURY' },
    { id: 'EC10', name: 'EC10', price: 500, category: 'LUXURY' },
    { id: 'EC11', name: 'EC11', price: 1000, category: 'PREMIUM' },
    { id: 'EC12', name: 'EC12', price: 1500, category: 'PREMIUM' },
  ];

  const addToCart = (service) => {
    const existingItem = cart.find(item => item.id === service.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === service.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...service, quantity: 1 }]);
    }
  };

  const removeFromCart = (serviceId) => {
    setCart(cart.filter(item => item.id !== serviceId));
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getChange = () => {
    const cash = parseFloat(cashTendered) || 0;
    return cash - getTotal();
  };


  const processTransaction = () => {
    if (cart.length === 0) {
      alert('Please add services to cart');
      return;
    }

    if (!customerName.trim()) {
      alert('Please enter customer name');
      return;
    }

    if (!cashTendered || parseFloat(cashTendered) < getTotal()) {
      alert('Please enter sufficient cash amount');
      return;
    }

    const transaction = {
      id: Date.now(),
      customerName,
      plateNumber,
      carType,
      items: cart,
      total: getTotal(),
      cashTendered: parseFloat(cashTendered),
      change: getChange(),
      cashier: user.name,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };

    console.log('Transaction processed:', transaction);
    
    // Persist transaction so it can be viewed from sidebar navigation
    try {
      const existingTransactions = JSON.parse(localStorage.getItem('carwash_transactions') || '[]');
      existingTransactions.push(transaction);
      localStorage.setItem('carwash_transactions', JSON.stringify(existingTransactions));
    } catch (error) {
      console.error('Failed to save transaction to localStorage:', error);
    }
    
    // Show receipt popup
    setCurrentTransaction(transaction);
    setShowReceiptPopup(true);
  };

  const closeReceiptPopup = () => {
    setShowReceiptPopup(false);
    setCurrentTransaction(null);
    // Reset form
    setCart([]);
    setCustomerName('');
    setPlateNumber('');
    setCarType('');
    setCashTendered('');
  };

  const printReceipt = () => {
    window.print();
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const carTypes = ['Sedan', 'SUV', 'Pick up', 'Van', 'Tricycle', 'Motorcycle', 'Truck'];

  const selectCarType = (type) => {
    setCarType(type);
    setShowCarTypeDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCarTypeDropdown && !event.target.closest('[data-dropdown]')) {
        setShowCarTypeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCarTypeDropdown]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 50%, #81d4fa 100%)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Water Effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none'
      }}></div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: '20px',
        height: 'calc(100vh - 40px)',
        position: 'relative',
        zIndex: 1,
        maxWidth: '100%'
      }}>
        {/* Left Section - Service Selection */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          minHeight: 0
        }}>
          {/* Customer Input Fields */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            flexShrink: 0
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px'
            }}>
                             {/* Car Type Dropdown */}
               <div style={{ position: 'relative' }} data-dropdown>
                 <label style={{
                   display: 'block',
                   fontSize: '13px',
                   fontWeight: '600',
                   color: '#374151',
                   marginBottom: '6px'
                 }}>
                   CAR TYPE
                 </label>
                 <button 
                   type="button"
                   onClick={() => setShowCarTypeDropdown(!showCarTypeDropdown)}
                   style={{
                     width: '100%',
                     padding: '10px 12px',
                     background: 'white',
                     border: '2px solid #e2e8f0',
                     borderRadius: '6px',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'space-between',
                     cursor: 'pointer',
                     fontSize: '14px',
                     fontWeight: '500',
                     color: '#374151',
                     textAlign: 'left'
                   }}
                   onMouseEnter={(e) => {
                     e.target.style.borderColor = '#3b82f6';
                   }}
                   onMouseLeave={(e) => {
                     e.target.style.borderColor = '#e2e8f0';
                   }}
                 >
                   {carType || 'Select Car Type'}
                   <span style={{ 
                     fontSize: '14px', 
                     transform: showCarTypeDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                     transition: 'transform 0.2s ease'
                   }}>
                     ▼
                   </span>
                 </button>
                 
                 {/* Dropdown Menu */}
                 {showCarTypeDropdown && (
                   <div style={{
                     position: 'absolute',
                     top: '100%',
                     left: 0,
                     right: 0,
                     background: 'white',
                     border: '2px solid #3b82f6',
                     borderTop: 'none',
                     borderRadius: '0 0 6px 6px',
                     boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                     zIndex: 1000,
                     maxHeight: '200px',
                     overflowY: 'auto'
                   }}>
                     {carTypes.map((type) => (
                       <button
                         key={type}
                         type="button"
                         onClick={() => selectCarType(type)}
                         style={{
                           width: '100%',
                           padding: '10px 12px',
                           background: 'white',
                           border: 'none',
                           textAlign: 'left',
                           fontSize: '14px',
                           cursor: 'pointer',
                           transition: 'background 0.2s ease'
                         }}
                         onMouseEnter={(e) => {
                           e.target.style.background = '#f1f5f9';
                         }}
                         onMouseLeave={(e) => {
                           e.target.style.background = 'white';
                         }}
                       >
                         {type}
                       </button>
                     ))}
                   </div>
                 )}
               </div>

              {/* Customer Name */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  CUSTOMER NAME
                </label>
                <input
                  type="text"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'white',
                    border: '2px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                  }}
                />
              </div>

              {/* Plate Number */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  ADD PLATE NUMBER
                </label>
                <input
                  type="text"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'white',
                    border: '2px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  placeholder="Enter plate number"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Service Cards Grid */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1e293b',
              margin: '0 0 16px 0',
              flexShrink: 0
            }}>
              Services
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              flex: 1,
              overflowY: 'auto',
              paddingRight: '4px'
            }}>
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => addToCart(service)}
                  style={{
                    background: 'linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)',
                    border: '2px solid #81d4fa',
                    borderRadius: '8px',
                    padding: '16px 12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100px',
                    boxSizing: 'border-box'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                    e.target.style.borderColor = '#3b82f6';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                    e.target.style.borderColor = '#81d4fa';
                  }}
                >
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1e293b',
                    marginBottom: '6px'
                  }}>
                    {service.name}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#3b82f6'
                  }}>
                    ₱{service.price.toLocaleString()}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#64748b',
                    marginTop: '4px'
                  }}>
                    {service.category}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section - Order Summary */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          minHeight: 0
        }}>
          {/* Date and Time */}
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '12px',
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            flexShrink: 0
          }}>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '2px'
            }}>
              {formatTime(currentTime)}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#64748b'
            }}>
              {formatDate(currentTime)}
            </div>
          </div>

          {/* Order Summary Box */}
          <div style={{
            background: 'rgba(31, 41, 55, 0.9)',
            borderRadius: '12px',
            padding: '20px',
            color: 'white',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              margin: '0 0 16px 0',
              color: '#1e293b',
              background: 'white',
              padding: '6px 10px',
              borderRadius: '4px',
              textAlign: 'center',
              flexShrink: 0
            }}>
              Service Type/s
            </h3>

            {/* Cart Items */}
            <div style={{ 
              flex: 1, 
              marginBottom: '16px',
              overflowY: 'auto',
              minHeight: 0
            }}>
              {cart.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  color: '#9ca3af',
                  fontSize: '13px',
                  marginTop: '20px'
                }}>
                  No services selected
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {cart.map((item) => (
                    <div key={item.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>{item.name}</span>
                        <span style={{ fontSize: '11px', opacity: 0.8 }}>({item.category})</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>
                          ₱{item.price.toLocaleString()}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            fontSize: '16px',
                            cursor: 'pointer',
                            padding: '2px'
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cash Tendered */}
            <div style={{ marginBottom: '16px', flexShrink: 0 }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                marginBottom: '6px'
              }}>
                CASH TENDERED
              </label>
              <input
                type="number"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                value={cashTendered}
                onChange={(e) => setCashTendered(e.target.value)}
                placeholder="Enter cash amount"
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              />
            </div>

            {/* Total */}
            <div style={{
              background: '#1e40af',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexShrink: 0
            }}>
              <span style={{ fontSize: '16px', fontWeight: '600' }}>TOTAL:</span>
              <span style={{ fontSize: '18px', fontWeight: '700' }}>
                ₱{getTotal().toLocaleString()}
              </span>
            </div>

            {/* Change */}
            {cashTendered && (
              <div style={{
                background: '#059669',
                borderRadius: '6px',
                padding: '10px',
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0
              }}>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>CHANGE:</span>
                <span style={{ fontSize: '16px', fontWeight: '700' }}>
                  ₱{getChange().toLocaleString()}
                </span>
              </div>
            )}

            {/* Payment Button */}
            <button
              onClick={processTransaction}
              disabled={cart.length === 0 || !customerName || !cashTendered || getChange() < 0}
              style={{
                width: '100%',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: cart.length === 0 || !customerName || !cashTendered || getChange() < 0 ? 'not-allowed' : 'pointer',
                opacity: cart.length === 0 || !customerName || !cashTendered || getChange() < 0 ? 0.5 : 1,
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                if (cart.length > 0 && customerName && cashTendered && getChange() >= 0) {
                  e.target.style.background = '#2563eb';
                }
              }}
              onMouseLeave={(e) => {
                if (cart.length > 0 && customerName && cashTendered && getChange() >= 0) {
                  e.target.style.background = '#3b82f6';
                }
              }}
            >
              PAYMENT
            </button>
          </div>
        </div>
      </div>

      {/* Receipt Popup */}
      {showReceiptPopup && currentTransaction && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #e2e8f0',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={closeReceiptPopup}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#64748b',
                zIndex: 1
              }}
            >
              ✕
            </button>

            {/* Header */}
            <div style={{
              textAlign: 'center',
              marginBottom: '24px',
              paddingBottom: '20px',
              borderBottom: '2px solid #e2e8f0'
            }}>
              <div style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#1e3a8a',
                marginBottom: '4px'
              }}>
                E&C CARWASH
              </div>
              <div style={{
                fontSize: '14px',
                color: '#64748b',
                marginBottom: '8px'
              }}>
                Professional Car Wash Services
              </div>
              <div style={{
                fontSize: '12px',
                color: '#94a3b8'
              }}>
                {formatDate(currentTime)} • {formatTime(currentTime)}
              </div>
            </div>

            {/* Transaction Details */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>Transaction ID:</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  #{currentTransaction.id}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>Customer:</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  {currentTransaction.customerName}
                </span>
              </div>
              {currentTransaction.plateNumber && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontSize: '14px', color: '#64748b' }}>Plate Number:</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                    {currentTransaction.plateNumber}
                  </span>
                </div>
              )}
              {currentTransaction.carType && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontSize: '14px', color: '#64748b' }}>Car Type:</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                    {currentTransaction.carType}
                  </span>
                </div>
              )}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>Cashier:</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  {currentTransaction.cashier}
                </span>
              </div>
            </div>

            {/* Services Table */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid #e2e8f0'
              }}>
                Items
              </div>
              <div style={{
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '12px', color: '#64748b' }}>Service</th>
                      <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '12px', color: '#64748b' }}>Category</th>
                      <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: '12px', color: '#64748b' }}>Unit Price</th>
                      <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: '12px', color: '#64748b' }}>Qty</th>
                      <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: '12px', color: '#64748b' }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTransaction.items.map((item, index) => {
                      const quantity = item.quantity || 1;
                      const lineTotal = (item.price || 0) * quantity;
                      return (
                        <tr key={index}>
                          <td style={{ padding: '10px 12px', borderTop: '1px solid #e2e8f0', fontSize: '14px', color: '#374151', fontWeight: 500 }}>
                            {item.name}
                          </td>
                          <td style={{ padding: '10px 12px', borderTop: '1px solid #e2e8f0', fontSize: '13px', color: '#64748b' }}>
                            {item.category}
                          </td>
                          <td style={{ padding: '10px 12px', borderTop: '1px solid #e2e8f0', fontSize: '14px', color: '#374151', textAlign: 'right' }}>
                            ₱{(item.price || 0).toLocaleString()}
                          </td>
                          <td style={{ padding: '10px 12px', borderTop: '1px solid #e2e8f0', fontSize: '14px', color: '#374151', textAlign: 'right' }}>
                            {quantity}
                          </td>
                          <td style={{ padding: '10px 12px', borderTop: '1px solid #e2e8f0', fontSize: '14px', color: '#1e40af', textAlign: 'right', fontWeight: 700 }}>
                            ₱{lineTotal.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div style={{
              borderTop: '2px solid #e2e8f0',
              paddingTop: '16px',
              marginBottom: '24px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#374151' }}>Total:</span>
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#1e40af' }}>
                  ₱{currentTransaction.total.toLocaleString()}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>Cash Tendered:</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  ₱{currentTransaction.cashTendered.toLocaleString()}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '8px',
                borderTop: '1px solid #e2e8f0'
              }}>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#059669' }}>Change:</span>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#059669' }}>
                  ₱{currentTransaction.change.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Status */}
            <div style={{
              background: '#dcfce7',
              color: '#166534',
              padding: '12px',
              borderRadius: '8px',
              textAlign: 'center',
              marginBottom: '24px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              ✅ Transaction Completed Successfully
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <button
                onClick={printReceipt}
                style={{
                  flex: 1,
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#3b82f6';
                }}
              >
                🖨️ Print Receipt
              </button>
              <button
                onClick={closeReceiptPopup}
                style={{
                  flex: 1,
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#059669';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#10b981';
                }}
              >
                ✅ Done
              </button>
            </div>

            {/* Footer */}
            <div style={{
              textAlign: 'center',
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid #e2e8f0',
              fontSize: '12px',
              color: '#94a3b8'
            }}>
              Thank you for choosing E&C Carwash!
              <br />
              Please come again!
            </div>
          </div>
        </div>
      )}

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 1200px) {
          div[style*="grid-template-columns: 1fr 380px"] {
            grid-template-columns: 1fr !important;
            grid-template-rows: 1fr auto !important;
            height: auto !important;
            min-height: calc(100vh - 40px) !important;
          }
          div[style*="grid-template-columns: 1fr 380px"] > div:first-child {
            min-height: 400px !important;
          }
          div[style*="grid-template-columns: 1fr 380px"] > div:last-child {
            min-height: 300px !important;
          }
        }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: repeat(4, 1fr)"] {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 480px) {
          div[style*="grid-template-columns: repeat(4, 1fr)"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media print {
          body * {
            visibility: hidden;
          }
          div[style*="background: white"][style*="border-radius: 16px"] {
            visibility: visible !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            box-shadow: none !important;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default POS; 