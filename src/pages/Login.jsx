import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = login(username, password);
      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
      position: 'relative'
    }}>
      {/* Dark Blue Gradient Top Bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '80px',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 40px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ color: 'white' }}>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: '800', 
            letterSpacing: '1px',
            lineHeight: '1.2'
          }}>
            E&C
          </div>
          <div style={{ 
            fontSize: '28px', 
            fontWeight: '900',
            letterSpacing: '2px'
          }}>
            CARWASH
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px'
      }}>
        {/* Dark Semi-transparent Login Form */}
        <div style={{
          width: '100%',
          maxWidth: '400px',
          background: 'rgba(31, 41, 55, 0.9)',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          {/* LOGIN NOW Title */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: 'white',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              margin: 0
            }}>
              Login Now
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <input
                id="username"
                name="username"
                type="text"
                required
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  color: '#1f2937',
                  border: 'none',
                  outline: 'none',
                  fontSize: '16px',
                  fontWeight: '500',
                  boxSizing: 'border-box'
                }}
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  color: '#1f2937',
                  border: 'none',
                  outline: 'none',
                  fontSize: '16px',
                  fontWeight: '500',
                  boxSizing: 'border-box'
                }}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid #ef4444',
                borderRadius: '8px',
                padding: '12px'
              }}>
                <div style={{ color: '#fecaca', fontSize: '14px' }}>{error}</div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: '#14b8a6',
                color: 'white',
                fontWeight: '600',
                padding: '16px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                fontSize: '16px',
                transition: 'all 0.2s ease'
              }}
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div style={{
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <p style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center', marginBottom: '8px' }}>
              Demo Credentials:
            </p>
            <div style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
              <p>Admin: admin / admin123</p>
              <p>Staff: staff / staff123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 