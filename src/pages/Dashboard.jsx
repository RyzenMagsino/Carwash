import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, hasPermission } = useAuth();
  const [stats, setStats] = useState({
  todayRevenue: 1250,
  todayTransactions: 18,
  lowStockItems: 3,
  pendingServices: 2,
  monthlyRevenue: 28500,
  totalCustomers: 245,
  todayExpenses: 400, 
});

  const [recentTransactions, setRecentTransactions] = useState([
    { id: 1, customer: 'John Doe', service: 'Premium Wash', amount: 45, time: '2:30 PM', status: 'completed' },
    { id: 2, customer: 'Jane Smith', service: 'Basic Wash', amount: 25, time: '2:15 PM', status: 'completed' },
    { id: 3, customer: 'Mike Johnson', service: 'Interior Detail', amount: 85, time: '2:00 PM', status: 'in-progress' },
    { id: 4, customer: 'Sarah Wilson', service: 'Premium Wash', amount: 45, time: '1:45 PM', status: 'completed' },
  ]);

  const [lowStockAlerts, setLowStockAlerts] = useState([
    { id: 1, item: 'Car Shampoo', current: 5, min: 10 },
    { id: 2, item: 'Microfiber Towels', current: 8, min: 15 },
    { id: 3, item: 'Wax', current: 3, min: 8 },
  ]);

  const quickActions = [
    { name: 'New Transaction', href: '/pos', icon: '💰', color: '#10b981' },
    { name: 'View Inventory', href: '/inventory', icon: '📦', color: '#3b82f6' },
    { name: 'Manage Services', href: '/services', icon: '🚗', color: '#8b5cf6' },
    { name: 'View Reports', href: '/reports', icon: '📊', color: '#f59e0b' },
  ].filter(action => {
    if (action.href === '/pos') return hasPermission('process_transactions');
    if (action.href === '/inventory') return hasPermission('view_inventory');
    if (action.href === '/services') return hasPermission('view_services');
    if (action.href === '/reports') return hasPermission('view_reports');
    return true;
  });

  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#1e293b',
          margin: '0 0 8px 0'
        }}>
          Dashboard
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#64748b',
          margin: 0,
          fontWeight: '500'
        }}>
          Welcome back, {user?.name}! Here's what's happening at E&C Carwash today.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Today's Revenue */}
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: '16px',
          padding: '24px',
          color: 'white',
          boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '14px', opacity: 0.9, margin: '0 0 8px 0' }}>Today's Revenue</p>
              <p style={{ fontSize: '32px', fontWeight: '700', margin: 0 }}>${stats.todayRevenue}</p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              💰
            </div>
          </div>
        </div>

        {/* Today's Transactions */}
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          borderRadius: '16px',
          padding: '24px',
          color: 'white',
          boxShadow: '0 10px 25px rgba(59, 130, 246, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '14px', opacity: 0.9, margin: '0 0 8px 0' }}>Today's Transactions</p>
              <p style={{ fontSize: '32px', fontWeight: '700', margin: 0 }}>{stats.todayTransactions}</p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              🚗
            </div>
          </div>
        </div>

        {/* Today's Expenses */}
        <div style={{
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          borderRadius: '16px',
          padding: '24px',
          color: 'white',
          boxShadow: '0 10px 25px rgba(239, 68, 68, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '14px', opacity: 0.9, margin: '0 0 8px 0' }}>Today's Expenses</p>
              <p style={{ fontSize: '32px', fontWeight: '700', margin: 0 }}>${stats.todayExpenses}</p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              📉
            </div>
          </div>
        </div>


        {/* Low Stock Items */}
        <div style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          borderRadius: '16px',
          padding: '24px',
          color: 'white',
          boxShadow: '0 10px 25px rgba(245, 158, 11, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '14px', opacity: 0.9, margin: '0 0 8px 0' }}>Low Stock Items</p>
              <p style={{ fontSize: '32px', fontWeight: '700', margin: 0 }}>{stats.lowStockItems}</p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              ⚠️
            </div>
          </div>
        </div>

        {/* Pending Services */}
        <div style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          borderRadius: '16px',
          padding: '24px',
          color: 'white',
          boxShadow: '0 10px 25px rgba(139, 92, 246, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '14px', opacity: 0.9, margin: '0 0 8px 0' }}>Pending Services</p>
              <p style={{ fontSize: '32px', fontWeight: '700', margin: 0 }}>{stats.pendingServices}</p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              ⏱️
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '32px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#1e293b',
          margin: '0 0 20px 0'
        }}>
          Quick Actions
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px',
                borderRadius: '12px',
                border: '2px solid #e2e8f0',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                background: 'white'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = action.color;
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                background: action.color,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                marginBottom: '12px'
              }}>
                {action.icon}
              </div>
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e293b',
                textAlign: 'center'
              }}>
                {action.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px'
      }}>
        {/* Recent Transactions */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1e293b',
            margin: '0 0 20px 0'
          }}>
            Recent Transactions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div>
                  <p style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1e293b',
                    margin: '0 0 4px 0'
                  }}>
                    {transaction.customer}
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: '#64748b',
                    margin: 0
                  }}>
                    {transaction.service}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1e293b',
                    margin: '0 0 4px 0'
                  }}>
                    ${transaction.amount}
                  </p>
                  <p style={{
                    fontSize: '14px',
                    color: '#64748b',
                    margin: 0
                  }}>
                    {transaction.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '16px' }}>
            <Link to="/transaction" style={{
              color: '#3b82f6',
              fontSize: '14px',
              fontWeight: '600',
              textDecoration: 'none'
            }}>
              View all transactions →
            </Link>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1e293b',
            margin: '0 0 20px 0'
          }}>
            Low Stock Alerts
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {lowStockAlerts.map((item) => (
              <div key={item.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                background: '#fef2f2',
                borderRadius: '12px',
                border: '1px solid #fecaca'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '20px', marginRight: '12px' }}>⚠️</span>
                  <div>
                    <p style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1e293b',
                      margin: '0 0 4px 0'
                    }}>
                      {item.item}
                    </p>
                    <p style={{
                      fontSize: '14px',
                      color: '#64748b',
                      margin: 0
                    }}>
                      {item.current} remaining (min: {item.min})
                    </p>
                  </div>
                </div>
                <button style={{
                  color: '#3b82f6',
                  fontSize: '14px',
                  fontWeight: '600',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#eff6ff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'none';
                }}>
                  Reorder
                </button>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '16px' }}>
            <Link to="/inventory" style={{
              color: '#3b82f6',
              fontSize: '14px',
              fontWeight: '600',
              textDecoration: 'none'
            }}>
              View inventory →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 