import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaUser, FaCar, FaPhone, FaEnvelope, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaEye, FaPrint, FaFilter, FaSearch } from 'react-icons/fa';

const Scheduling = () => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('');

  // Mock data - replace with API calls to your backend
  useEffect(() => {
    const mockBookings = [
      {
        id: 'BK001',
        customerName: 'John Doe',
        email: 'john@example.com',
        phone: '+63 912 345 6789',
        plateNumber: 'ABC 123',
        carType: 'Sedan',
        services: ['Basic Wash', 'Wax'],
        bookingDate: '2025-08-21',
        bookingTime: '10:00 AM',
        status: 'pending',
        totalAmount: 350,
        createdAt: '2025-08-20T14:30:00Z',
        assignedTeam: null,
        notes: 'Please handle with care, new car'
      },
      {
        id: 'BK002',
        customerName: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+63 917 654 3210',
        plateNumber: 'XYZ 789',
        carType: 'SUV',
        services: ['Premium Wash', 'Interior Cleaning'],
        bookingDate: '2025-08-21',
        bookingTime: '2:00 PM',
        status: 'approved',
        totalAmount: 500,
        createdAt: '2025-08-20T16:45:00Z',
        assignedTeam: 'Team A',
        notes: ''
      },
      {
        id: 'BK003',
        customerName: 'Mike Johnson',
        email: 'mike@example.com',
        phone: '+63 905 123 4567',
        plateNumber: 'DEF 456',
        carType: 'Hatchback',
        services: ['Basic Wash'],
        bookingDate: '2025-08-20',
        bookingTime: '4:00 PM',
        status: 'completed',
        totalAmount: 200,
        createdAt: '2025-08-19T10:20:00Z',
        assignedTeam: 'Team B',
        notes: 'Regular customer'
      }
    ];
    setBookings(mockBookings);
  }, []);

  const filteredBookings = bookings.filter(booking => {
    const matchesTab = booking.status === activeTab;
    const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || booking.bookingDate === dateFilter;
    return matchesTab && matchesSearch && matchesDate;
  });

  const createTransactionRecord = (booking) => {
    const transaction = {
      id: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      bookingId: booking.id,
      timestamp: new Date().toISOString(),
      customerName: booking.customerName,
      plateNumber: booking.plateNumber,
      carType: booking.carType,
      items: booking.services.map(service => ({ name: service, price: 0 })), // Services from booking
      total: booking.totalAmount,
      selectedTeam: booking.assignedTeam || 'Team A', // Use assigned team from booking
      status: 'completed'
    };
    
    // Save to localStorage for Transaction page
    try {
      const existingTransactions = JSON.parse(localStorage.getItem('carwash_transactions') || '[]');
      const updatedTransactions = [transaction, ...existingTransactions];
      localStorage.setItem('carwash_transactions', JSON.stringify(updatedTransactions));
      console.log('Transaction record created:', transaction);
    } catch (error) {
      console.error('Failed to save transaction:', error);
    }
  };

  const onStatusChange = async (bookingId, newStatus) => {
    const now = new Date();
    const arrivalDeadline = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes from now
    
    // Find the booking being updated
    const booking = bookings.find(b => b.id === bookingId);
    
    // Update booking status locally
    setBookings(prev => prev.map(booking => {
      if (booking.id === bookingId) {
        const updatedBooking = { ...booking, status: newStatus };
        
        // If approving pending booking, assign selected team
        if (booking.status === 'pending' && newStatus === 'approved' && selectedTeam) {
          updatedBooking.assignedTeam = selectedTeam;
        }
        
        // If moving to ongoing, add approval timestamp and deadline
        if (newStatus === 'ongoing') {
          updatedBooking.approvedAt = now.toISOString();
          updatedBooking.arrivalDeadline = arrivalDeadline.toISOString();
        }
        
        return updatedBooking;
      }
      return booking;
    }));
    
    // Reset team selection after approval
    if (newStatus === 'approved') {
      setSelectedTeam('');
    }
    
    // Create transaction record when booking is completed
    if (newStatus === 'completed' && booking) {
      createTransactionRecord(booking);
    }
    
    setShowModal(false);
    
    // TODO: Replace with actual API call to sync with mobile app
    // await fetch(`/api/bookings/${bookingId}/status`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ status: newStatus, arrivalDeadline: newStatus === 'ongoing' ? arrivalDeadline.toISOString() : null })
    // });
    
    // Send appropriate push notification based on status change
    if (newStatus === 'ongoing') {
      // Send 30-minute arrival notification
      // await sendPushNotification(booking.userId, {
      //   title: 'Service Starting - Please Arrive Soon!',
      //   body: `Your booking #${bookingId} service is starting. Please arrive within 30 minutes or it will be automatically cancelled.`,
      //   data: { arrivalDeadline: arrivalDeadline.toISOString() }
      // });
      
      // Set automatic cancellation timer
      setTimeout(() => {
        checkAndCancelLateBooking(bookingId);
      }, 30 * 60 * 1000); // 30 minutes
    } else {
      // Send regular status update notification
      // await sendPushNotification(booking.userId, {
      //   title: `Booking ${newStatus}`,
      //   body: `Your booking #${bookingId} has been ${newStatus}.`
      // });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'approved': return '#10b981';
      case 'ongoing': return '#3b82f6';
      case 'completed': return '#6b7280';
      case 'cancelled': return '#ef4444';
      case 'rejected': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaHourglassHalf />;
      case 'approved': return <FaCheckCircle />;
      case 'ongoing': return <FaClock />;
      case 'completed': return <FaCheckCircle />;
      case 'cancelled': return <FaTimesCircle />;
      case 'rejected': return <FaTimesCircle />;
      default: return <FaHourglassHalf />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const BookingModal = ({ booking, onClose, onStatusChange }) => {
    if (!booking) return null;

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
          maxWidth: '600px', 
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '24px', color: '#1f2937' }}>Booking Details</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Booking ID</label>
              <p style={{ margin: '4px 0 0 0', fontSize: '16px', color: '#1f2937' }}>{booking.id}</p>
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Status</label>
              <div style={{ margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: getStatusColor(booking.status) }}>{getStatusIcon(booking.status)}</span>
                <span style={{ 
                  backgroundColor: `${getStatusColor(booking.status)}20`, 
                  color: getStatusColor(booking.status),
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'capitalize'
                }}>
                  {booking.status}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Customer Name</label>
              <p style={{ margin: '4px 0 0 0', fontSize: '16px', color: '#1f2937' }}>{booking.customerName}</p>
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Phone</label>
              <p style={{ margin: '4px 0 0 0', fontSize: '16px', color: '#1f2937' }}>{booking.phone}</p>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Email</label>
            <p style={{ margin: '4px 0 0 0', fontSize: '16px', color: '#1f2937' }}>{booking.email}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Plate Number</label>
              <p style={{ margin: '4px 0 0 0', fontSize: '16px', color: '#1f2937' }}>{booking.plateNumber}</p>
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Car Type</label>
              <p style={{ margin: '4px 0 0 0', fontSize: '16px', color: '#1f2937' }}>{booking.carType}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Date</label>
              <p style={{ margin: '4px 0 0 0', fontSize: '16px', color: '#1f2937' }}>{booking.bookingDate}</p>
            </div>
            <div>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Time</label>
              <p style={{ margin: '4px 0 0 0', fontSize: '16px', color: '#1f2937' }}>{booking.bookingTime}</p>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Services</label>
            <div style={{ margin: '4px 0 0 0', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {booking.services && booking.services.map((service, index) => (
                <span key={index} style={{
                  backgroundColor: '#eff6ff',
                  color: '#3b82f6',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {service}
                </span>
              ))}
            </div>
          </div>

          {booking.notes && booking.notes.trim() && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Notes</label>
              <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280', fontStyle: 'italic' }}>{booking.notes}</p>
            </div>
          )}

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Created At</label>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>{formatDateTime(booking.createdAt)}</p>
          </div>
          
          {booking.approvedAt && (
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Approved At</label>
              <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>{formatDateTime(booking.approvedAt)}</p>
            </div>
          )}
          
          {booking.arrivalDeadline && booking.status === 'ongoing' && (
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Arrival Deadline</label>
              <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: new Date() > new Date(booking.arrivalDeadline) ? '#dc2626' : '#f59e0b' }}>
                {formatDateTime(booking.arrivalDeadline)}
                {new Date() > new Date(booking.arrivalDeadline) && ' (OVERDUE)'}
              </p>
            </div>
          )}
          
          {booking.cancelReason && (
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Cancel Reason</label>
              <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#dc2626' }}>{booking.cancelReason}</p>
            </div>
          )}
          
          {booking.assignedTeam && (
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>Assigned Team</label>
              <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: booking.assignedTeam === 'Team A' ? '#3b82f6' : '#8b5cf6', fontWeight: '600' }}>
                {booking.assignedTeam}
              </p>
            </div>
          )}

          {booking.status === 'pending' && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>Assign Team</label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Select Team</option>
                  <option value="Team A">Team A</option>
                  <option value="Team B">Team B</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => onStatusChange(booking.id, 'rejected')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Reject Booking
                </button>
                <button
                  onClick={() => onStatusChange(booking.id, 'approved')}
                  disabled={!selectedTeam}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: selectedTeam ? '#10b981' : '#9ca3af',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: selectedTeam ? 'pointer' : 'not-allowed',
                    fontWeight: '500',
                    opacity: selectedTeam ? 1 : 0.6
                  }}
                >
                  Approve Booking
                </button>
              </div>
            </div>
          )}

          {booking.status === 'approved' && (
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => onStatusChange(booking.id, 'ongoing')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Start Service
              </button>
            </div>
          )}

          {booking.status === 'ongoing' && (
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => onStatusChange(booking.id, 'completed')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Complete Service
              </button>
            </div>
          )}

          {booking.status === 'completed' && (
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => window.print()}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <FaPrint /> Print Receipt
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: '20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#1f2937', fontWeight: 'bold' }}>Booking Management</h1>
          <p style={{ margin: '4px 0 0 0', color: '#6b7280' }}>Manage mobile app bookings and appointments</p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <FaHourglassHalf style={{ color: '#f59e0b', fontSize: '20px' }} />
              <h3 style={{ margin: 0, fontSize: '14px', color: '#374151', fontWeight: '600' }}>Pending</h3>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
              {bookings.filter(b => b.status === 'pending').length}
            </div>
          </div>
          
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <FaCheckCircle style={{ color: '#10b981', fontSize: '20px' }} />
              <h3 style={{ margin: 0, fontSize: '14px', color: '#374151', fontWeight: '600' }}>Approved</h3>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
              {bookings.filter(b => b.status === 'approved').length}
            </div>
          </div>
          
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <FaClock style={{ color: '#3b82f6', fontSize: '20px' }} />
              <h3 style={{ margin: 0, fontSize: '14px', color: '#374151', fontWeight: '600' }}>Ongoing</h3>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
              {bookings.filter(b => b.status === 'ongoing').length}
            </div>
          </div>
          
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <FaCheckCircle style={{ color: '#6b7280', fontSize: '20px' }} />
              <h3 style={{ margin: 0, fontSize: '14px', color: '#374151', fontWeight: '600' }}>Completed</h3>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
              {bookings.filter(b => b.status === 'completed').length}
            </div>
          </div>
          
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <FaTimesCircle style={{ color: '#ef4444', fontSize: '20px' }} />
              <h3 style={{ margin: 0, fontSize: '14px', color: '#374151', fontWeight: '600' }}>Rejected</h3>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
              {bookings.filter(b => b.status === 'rejected').length}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaSearch style={{ color: '#6b7280', fontSize: '16px' }} />
              <input
                type="text"
                placeholder="Search by name, plate, or booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  width: '250px'
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaCalendarAlt style={{ color: '#6b7280', fontSize: '16px' }} />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>
            {(searchTerm || dateFilter) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setDateFilter('');
                }}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: '#f9fafb',
                  cursor: 'pointer',
                  color: '#374151'
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', flexWrap: 'wrap' }}>
            {['pending', 'approved', 'ongoing', 'completed', 'rejected'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '16px 20px',
                  border: 'none',
                  background: activeTab === tab ? '#f9fafb' : 'transparent',
                  borderBottom: activeTab === tab ? '2px solid #3b82f6' : '2px solid transparent',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: activeTab === tab ? '#3b82f6' : '#6b7280',
                  textTransform: 'capitalize'
                }}
              >
                {tab} ({bookings.filter(b => b.status === tab).length})
              </button>
            ))}
          </div>

          {/* Bookings List */}
          <div style={{ padding: '20px' }}>
            {filteredBookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                No {activeTab} bookings found.
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {filteredBookings.map(booking => (
                  <div key={booking.id} style={{ 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px', 
                    padding: '16px',
                    backgroundColor: '#fafafa'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#1f2937' }}>{booking.customerName}</h3>
                        <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Booking ID: {booking.id}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: getStatusColor(booking.status) }}>{getStatusIcon(booking.status)}</span>
                        <span style={{ 
                          backgroundColor: `${getStatusColor(booking.status)}20`, 
                          color: getStatusColor(booking.status),
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'capitalize'
                        }}>
                          {booking.status}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaCar style={{ color: '#6b7280', fontSize: '14px' }} />
                        <span style={{ fontSize: '14px', color: '#374151' }}>{booking.plateNumber} - {booking.carType}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaCalendarAlt style={{ color: '#6b7280', fontSize: '14px' }} />
                        <span style={{ fontSize: '14px', color: '#374151' }}>{booking.bookingDate} at {booking.bookingTime}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaPhone style={{ color: '#6b7280', fontSize: '14px' }} />
                        <span style={{ fontSize: '14px', color: '#374151' }}>{booking.phone}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>Services:</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {booking.services && booking.services.map((service, index) => (
                          <span key={index} style={{
                            backgroundColor: '#eff6ff',
                            color: '#3b82f6',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}>
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>
                        {formatCurrency(booking.totalAmount)}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowModal(true);
                        }}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <FaEye /> View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <BookingModal 
          booking={selectedBooking}
          onClose={() => setShowModal(false)}
          onStatusChange={onStatusChange}
        />
      )}
    </div>
  );
};

export default Scheduling;