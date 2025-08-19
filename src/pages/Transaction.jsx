import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Transaction = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('carwash_transactions') || '[]');
      if (Array.isArray(saved)) {
        setTransactions(
          [...saved].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        );
      }
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  }, []);

  const hasTransactions = useMemo(() => transactions && transactions.length > 0, [transactions]);

  const formatDateTime = (iso) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString('en-US')} ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h1 style={{ margin: 0, fontSize: '22px', color: '#1f2937' }}>Transactions</h1>
          <button
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transform hover:scale-105 transition-all duration-200"
            onClick={() => navigate('/pos')}
            style={{
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            New Transaction
          </button>
        </div>

        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
          {!hasTransactions ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
              No transactions yet.
            </div>
          ) : (
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#6b7280' }}>ID</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#6b7280' }}>Date/Time</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#6b7280' }}>Customer</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#6b7280' }}>Plate #</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#6b7280' }}>Car Type</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#6b7280' }}>Items</th>
                    <th style={{ textAlign: 'right', padding: '12px', fontSize: '12px', color: '#6b7280' }}>Total</th>
                    <th style={{ textAlign: 'right', padding: '12px', fontSize: '12px', color: '#6b7280' }}>Cash</th>
                    <th style={{ textAlign: 'right', padding: '12px', fontSize: '12px', color: '#6b7280' }}>Change</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#6b7280' }}>Cashier</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#6b7280' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr key={txn.id}>
                      <td style={{ padding: '12px', borderTop: '1px solid #e5e7eb', fontSize: '13px', color: '#111827' }}>#{txn.id}</td>
                      <td style={{ padding: '12px', borderTop: '1px solid #e5e7eb', fontSize: '13px', color: '#111827' }}>{formatDateTime(txn.timestamp)}</td>
                      <td style={{ padding: '12px', borderTop: '1px solid #e5e7eb', fontSize: '13px', color: '#111827' }}>{txn.customerName}</td>
                      <td style={{ padding: '12px', borderTop: '1px solid #e5e7eb', fontSize: '13px', color: '#111827' }}>{txn.plateNumber || '-'}</td>
                      <td style={{ padding: '12px', borderTop: '1px solid #e5e7eb', fontSize: '13px', color: '#111827' }}>{txn.carType || '-'}</td>
                      <td style={{ padding: '12px', borderTop: '1px solid #e5e7eb', fontSize: '13px', color: '#111827', maxWidth: '260px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {(txn.items || []).map(i => i.name).join(', ')}
                      </td>
                      <td style={{ padding: '12px', borderTop: '1px solid #e5e7eb', fontSize: '13px', color: '#111827', textAlign: 'right' }}>₱{(txn.total || 0).toLocaleString()}</td>
                      <td style={{ padding: '12px', borderTop: '1px solid #e5e7eb', fontSize: '13px', color: '#111827', textAlign: 'right' }}>₱{(txn.cashTendered || 0).toLocaleString()}</td>
                      <td style={{ padding: '12px', borderTop: '1px solid #e5e7eb', fontSize: '13px', color: '#111827', textAlign: 'right' }}>₱{(txn.change || 0).toLocaleString()}</td>
                      <td style={{ padding: '12px', borderTop: '1px solid #e5e7eb', fontSize: '13px', color: '#111827' }}>{txn.cashier}</td>
                      <td style={{ padding: '12px', borderTop: '1px solid #e5e7eb', fontSize: '13px' }}>
                        <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}>
                          {txn.status || 'completed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transaction; 