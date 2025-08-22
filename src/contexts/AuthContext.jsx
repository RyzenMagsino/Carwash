import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock users for demonstration
  const mockUsers = [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User' },
    { id: 2, username: 'staff', password: 'staff123', role: 'staff', name: 'Staff User' },
  ];

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('carwash_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    const foundUser = mockUsers.find(
      u => u.username === username && u.password === password
    );

    if (foundUser) {
      const userData = { ...foundUser };
      delete userData.password; // Don't store password
      setUser(userData);
      localStorage.setItem('carwash_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } else {
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('carwash_user');
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    
    const permissions = {
      admin: [
        'manage_users',
        'manage_inventory',
        'view_reports',
        'process_transactions',
        'view_transactions',
        'view_expenses',
        'manage_expenses',
        'manage_services',
        'manage_pricing',
        // Ensure admin can access sidebar pages
        'process_transactions',
        'view_inventory',
        'view_services',
        'view_transactions',
        'view_payroll',
        'view_scheduling'
        
      ],
      staff: [
        'view_inventory',
        'process_transactions',
        'view_services',
        'view_transactions',
        'view_scheduling'
      ]
    };

    return permissions[user.role]?.includes(permission) || false;
  };

  const value = {
    user,
    login,
    logout,
    hasPermission,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 