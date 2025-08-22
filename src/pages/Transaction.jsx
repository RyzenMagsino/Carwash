import React, { useEffect, useMemo, useState } from 'react';
import { FaFilter, FaUsers, FaPrint, FaTimes } from 'react-icons/fa';

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [teamFilter, setTeamFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

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

  // Filter transactions based on team and date
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;
    
    // Filter by team
    if (teamFilter !== 'ALL') {
      filtered = filtered.filter(txn => txn.selectedTeam === teamFilter);
    }
    
    // Filter by date
    if (dateFilter) {
      filtered = filtered.filter(txn => {
        const txnDate = new Date(txn.timestamp).toISOString().split('T')[0];
        return txnDate === dateFilter;
      });
    }
    
    return filtered;
  }, [transactions, teamFilter, dateFilter]);

  // Calculate team statistics
  const teamStats = useMemo(() => {
    const stats = {
      teamA: { count: 0, total: 0 },
      teamB: { count: 0, total: 0 },
      all: { count: 0, total: 0 }
    };
    
    filteredTransactions.forEach(txn => {
      stats.all.count++;
      stats.all.total += txn.total || 0;
      
      if (txn.selectedTeam === 'Team A') {
        stats.teamA.count++;
        stats.teamA.total += txn.total || 0;
      } else if (txn.selectedTeam === 'Team B') {
        stats.teamB.count++;
        stats.teamB.total += txn.total || 0;
      }
    });
    
    return stats;
  }, [filteredTransactions]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDateTime = (iso) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString('en-US')} ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  };

  const ReceiptModal = ({ transaction, onClose }) => {
    if (!transaction) return null;

    const handlePrint = () => {
      window.print();
    };

    return (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '24px', 
          maxWidth: '500px', 
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          {/* Receipt Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '24px', color: '#1f2937' }}>Receipt</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
          </div>

          {/* Receipt Content */}
          <div className="receipt-content" style={{ fontFamily: 'monospace' }}>
            {/* Business Header */}
            <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
              <h1 style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold' }}>CARWASH SERVICE</h1>
              <p style={{ margin: '0', fontSize: '14px' }}>Professional Car Cleaning</p>
              <p style={{ margin: '0', fontSize: '12px' }}>Phone: +63 123 456 7890</p>
            </div>

            {/* Transaction Details */}
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Receipt #:</span>
                <span style={{ fontWeight: 'bold' }}>{transaction.id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Date:</span>
                <span>{formatDateTime(transaction.timestamp)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Customer:</span>
                <span style={{ fontWeight: 'bold' }}>{transaction.customerName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Plate #:</span>
                <span>{transaction.plateNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Car Type:</span>
                <span>{transaction.carType}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Team:</span>
                <span style={{ color: transaction.selectedTeam === 'Team A' ? '#3b82f6' : '#8b5cf6', fontWeight: 'bold' }}>
                  {transaction.selectedTeam}
                </span>
              </div>
            </div>

            {/* Services */}
            <div style={{ borderTop: '1px solid #ccc', paddingTop: '10px', marginBottom: '15px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>SERVICES:</h3>
              {transaction.items && transaction.items.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span>{item.name}</span>
                  <span>{formatCurrency(item.price || 0)}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div style={{ borderTop: '2px solid #000', paddingTop: '10px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold' }}>
                <span>TOTAL:</span>
                <span>{formatCurrency(transaction.total)}</span>
              </div>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', fontSize: '12px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
              <p style={{ margin: '0 0 5px 0' }}>Thank you for choosing our service!</p>
              <p style={{ margin: '0' }}>Have a great day!</p>
            </div>
          </div>

          {/* Print Button */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button
              onClick={handlePrint}
              style={{
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: '0 auto'
              }}
            >
              <FaPrint /> Print Receipt
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#1f2937', fontWeight: 'bold' }}>Transactions</h1>
        </div>

        {/* Team Statistics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <FaUsers style={{ color: '#3b82f6', fontSize: '20px' }} />
              <h3 style={{ margin: 0, fontSize: '16px', color: '#374151', fontWeight: '600' }}>Team A</h3>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{formatCurrency(teamStats.teamA.total)}</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>{teamStats.teamA.count} transactions</div>
          </div>
          
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <FaUsers style={{ color: '#8b5cf6', fontSize: '20px' }} />
              <h3 style={{ margin: 0, fontSize: '16px', color: '#374151', fontWeight: '600' }}>Team B</h3>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>{formatCurrency(teamStats.teamB.total)}</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>{teamStats.teamB.count} transactions</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
          <FaFilter style={{ color: '#6b7280', fontSize: '16px' }} />
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            style={{
              padding: '6px 10px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '13px',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All Teams</option>
            <option value="Team A">Team A</option>
            <option value="Team B">Team B</option>
          </select>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              padding: '6px 10px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '13px',
              backgroundColor: 'white'
            }}
          />
          {(teamFilter !== 'ALL' || dateFilter) && (
            <button
              onClick={() => {
                setTeamFilter('ALL');
                setDateFilter('');
              }}
              style={{
                padding: '6px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '13px',
                backgroundColor: '#f9fafb',
                cursor: 'pointer',
                color: '#374151'
              }}
            >
              Clear
            </button>
          )}
        </div>

        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          {filteredTransactions.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
              {!hasTransactions ? 'No transactions yet.' : 'No transactions match the selected filters.'}
            </div>
          ) : (
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>#</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>Date/Time</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>Customer</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>Team</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>Plate #</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>Car Type</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>Items</th>
                    <th style={{ textAlign: 'right', padding: '12px', fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>Total</th>
                    <th style={{ textAlign: 'left', padding: '12px', fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((txn, index) => {
                    const teamColor = txn.selectedTeam === 'Team A' ? '#3b82f6' : txn.selectedTeam === 'Team B' ? '#8b5cf6' : '#6b7280';
                    return (
                      <tr 
                        key={txn.id} 
                        onClick={() => {
                          setSelectedTransaction(txn);
                          setShowReceipt(true);
                        }}
                        style={{ 
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.parentElement.style.backgroundColor = '#f9fafb'}
                        onMouseLeave={(e) => e.target.parentElement.style.backgroundColor = 'transparent'}
                      >
                        <td style={{ padding: '12px', borderTop: '1px solid #e5e7eb', fontSize: '13px', color: '#111827', fontWeight: '500' }}>{index + 1}</td>
                        <td style={{ padding: '12px', borderTop: '1px solid #e5e7eb', fontSize: '13px', color: '#111827' }}>{formatDateTime(txn.timestamp)}</td>
                        <td style={{ padding: '12px', borderTop: '1px solid #e5e7eb', fontSize: '13px', color: '#111827', fontWeight: '500' }}>{txn.customerName}</td>
                        <td style={{ padding: '12px', borderTop: '1px solid #e5e7eb', fontSize: '13px' }}>
                          {txn.selectedTeam ? (
                            <span style={{ 
                              background: txn.selectedTeam === 'Team A' ? '#eff6ff' : '#f3e8ff', 
                              color: teamColor, 
                              padding: '4px 8px', 
                              borderRadius: '6px', 
                              fontSize: '12px', 
                              fontWeight: '600',
                              border: `1px solid ${teamColor}20`
                            }}>
                              {txn.selectedTeam}
                            </span>
                          ) : (
                            <span style={{ color: '#9ca3af', fontSize: '12px' }}>-</span>
                          )}
                        </td>
                        <td style={{ padding: '12px', borderTop: '1px solid #e5e7eb', fontSize: '13px', color: '#111827' }}>{txn.plateNumber || '-'}</td>
                        <td style={{ padding: '12px', borderTop: '1px solid #e5e7eb', fontSize: '13px', color: '#111827' }}>{txn.carType || '-'}</td>
                        <td style={{ padding: '12px', borderTop: '1px solid #e5e7eb', fontSize: '13px', color: '#111827', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {(txn.items || []).map(i => i.name).join(', ')}
                        </td>
                        <td style={{ padding: '12px', borderTop: '1px solid #e5e7eb', fontSize: '13px', color: '#111827', textAlign: 'right', fontWeight: '600' }}>{formatCurrency(txn.total || 0)}</td>
                        <td style={{ padding: '12px', borderTop: '1px solid #e5e7eb', fontSize: '13px' }}>
                          <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
                            {txn.status || 'completed'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Receipt Modal */}
        {showReceipt && (
          <ReceiptModal 
            transaction={selectedTransaction}
            onClose={() => {
              setShowReceipt(false);
              setSelectedTransaction(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Transaction;