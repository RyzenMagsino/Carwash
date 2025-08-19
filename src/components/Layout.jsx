import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '🏠', permission: null },
    { name: 'POS', href: '/pos', icon: '💰', permission: 'process_transactions' },
    { name: 'Transaction', href: '/transaction', icon: '📋', permission: 'view_transactions' },
    { name: 'Inventory', href: '/inventory', icon: '📦', permission: 'view_inventory' },
    { name: 'Expenses', href: '/expenses', icon: '💸', permission: 'view_expenses' },
    { name: 'Services', href: '/services', icon: '🚗', permission: 'view_services' },
    { name: 'Reports', href: '/reports', icon: '📊', permission: 'view_reports' },
  ];

  const filteredNavigation = navigation.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          background: 'rgba(0, 0, 0, 0.5)'
        }} onClick={() => setSidebarOpen(false)}>
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: '280px',
            background: 'white',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <div style={{ color: '#1e293b', fontSize: '20px', fontWeight: '700' }}>
                E&C CARWASH
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                ✕
              </button>
            </div>
            <nav style={{ padding: '20px' }}>
              {filteredNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 16px',
                      marginBottom: '8px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '16px',
                      fontWeight: '500',
                      background: isActive ? '#eff6ff' : 'transparent',
                      color: isActive ? '#1e40af' : '#64748b',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => setSidebarOpen(false)}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.target.style.background = '#f1f5f9';
                        e.target.style.color = '#1e293b';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#64748b';
                      }
                    }}
                  >
                    <span style={{ fontSize: '20px', marginRight: '12px' }}>{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: '280px',
        background: 'white',
        borderRight: '1px solid #e2e8f0',
        zIndex: 30
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '24px',
            borderBottom: '1px solid #e2e8f0',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)',
            color: 'white'
          }}>
            <div style={{ fontSize: '24px', marginRight: '12px' }}>🚗</div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: '700', lineHeight: '1.2' }}>E&C</div>
              <div style={{ fontSize: '16px', fontWeight: '600', opacity: 0.9 }}>CARWASH</div>
            </div>
          </div>
          <nav style={{ flex: 1, padding: '20px' }}>
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    marginBottom: '8px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontWeight: '500',
                    background: isActive ? '#eff6ff' : 'transparent',
                    color: isActive ? '#1e40af' : '#64748b',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.background = '#f1f5f9';
                      e.target.style.color = '#1e293b';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.background = isActive ? '#eff6ff' : 'transparent';
                      e.target.style.color = isActive ? '#1e40af' : '#64748b';
                    }
                  }}
                >
                  <span style={{ fontSize: '20px', marginRight: '12px' }}>{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div style={{ marginLeft: '280px' }}>
        {/* Top bar */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          height: '80px',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)',
          color: 'white',
          padding: '0 24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              marginRight: '16px',
              display: 'none'
            }}
            onClick={() => setSidebarOpen(true)}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'none';
            }}
          >
            ☰
          </button>

          <div style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '600' }}>
              {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px'
              }}>
                <span style={{ fontSize: '20px' }}>👤</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>{user?.name}</div>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>{user?.role}</div>
                </div>
              </div>
              
              <button
                onClick={logout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <span style={{ fontSize: '16px' }}>🚪</span>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main style={{ padding: '0' }}>
          {children}
        </main>
      </div>

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 1024px) {
          div[style*="margin-left: 280px"] {
            margin-left: 0 !important;
          }
          div[style*="position: fixed"][style*="width: 280px"] {
            display: none !important;
          }
          button[style*="display: none"] {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout; 