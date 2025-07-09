import React, { useState } from 'react';

const API_URL = 'https://splitbite.onrender.com';

const AuthForm = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_URL}/${isLogin ? 'login' : 'signup'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        // If login fails due to unverified email, show OTP form
        if (isLogin && data.message && data.message.toLowerCase().includes('verify your email')) {
          setShowOtp(true);
          setOtpError('');
          setOtpSuccess('');
          setSuccess('');
          setError('');
        } else {
          setError(data.message || 'Something went wrong');
        }
      } else {
        if (isLogin) {
          localStorage.setItem('token', data.token);
          setSuccess('Login successful!');
          onAuthSuccess();
        } else {
          setSuccess('Signup successful! Please check your email for the OTP.');
          setShowOtp(true);
        }
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    setOtpError('');
    setOtpSuccess('');
    try {
      const res = await fetch(`${API_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOtpError(data.message || 'Invalid OTP');
      } else {
        setOtpSuccess('OTP verified! You can now log in.');
        setShowOtp(false);
        setIsLogin(true);
        setPassword('');
      }
    } catch (err) {
      setOtpError('Network error');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setOtpError('');
    setOtpSuccess('');
    try {
      const res = await fetch(`${API_URL}/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOtpError(data.message || 'Could not resend OTP');
      } else {
        setOtpSuccess('OTP resent! Please check your email.');
      }
    } catch (err) {
      setOtpError('Network error');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="enhanced-card" style={{
      maxWidth: 400,
      margin: '5rem auto 2rem auto',
      padding: '2.5rem 2rem 2rem 2rem',
      background: '#f5f5f4',
      border: '2px solid #e5e5e5',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <h2 style={{
        fontSize: '2rem',
        fontWeight: 800,
        letterSpacing: '-1px',
        marginBottom: '2rem',
        color: '#7c3f00',
        textAlign: 'center',
        width: '100%',
        borderBottom: '2px solid #e5e5e5',
        paddingBottom: '1rem',
        background: 'none',
      }}>
        {showOtp ? 'Verify Your Email' : (isLogin ? 'Login to SplitBITE' : 'Sign Up for SplitBITE')}
      </h2>
      {!showOtp ? (
        <>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontWeight: 600, marginBottom: 6, display: 'block', color: '#7c3f00' }}>Email</label>
              <input
                type="email"
                className="enhanced-input"
                style={{ width: '100%', fontSize: '1.1rem', padding: '0.8rem 1rem', marginTop: 4 }}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="username"
                disabled={showOtp}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontWeight: 600, marginBottom: 6, display: 'block', color: '#7c3f00' }}>Password</label>
              <input
                type="password"
                className="enhanced-input"
                style={{ width: '100%', fontSize: '1.1rem', padding: '0.8rem 1rem', marginTop: 4 }}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                disabled={showOtp}
              />
            </div>
            {error && <div style={{ color: '#be123c', fontWeight: 600, marginBottom: 12, fontSize: '1rem' }}>{error}</div>}
            {success && <div style={{ color: '#15803d', fontWeight: 600, marginBottom: 12, fontSize: '1rem' }}>{success}</div>}
            <button
              type="submit"
              className="enhanced-btn"
              style={{ width: '100%', fontSize: '1.15rem', padding: '0.9rem 0', marginBottom: '1.2rem', background: '#fbbf24', color: '#7c3f00', borderColor: '#fbbf24', fontWeight: 700, letterSpacing: '0.5px' }}
              disabled={loading}
            >
              {loading ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Login' : 'Sign Up')}
            </button>
          </form>
          <div style={{ width: '100%', textAlign: 'center', marginTop: '0.5rem' }}>
            <button
              className="enhanced-btn"
              style={{
                background: '#f5f5f4',
                color: '#b45309',
                border: '2px solid #fbbf24',
                fontWeight: 600,
                fontSize: '1rem',
                width: '100%',
                padding: '0.7rem 0',
                marginTop: 0,
                marginBottom: 0,
                boxShadow: 'none',
                borderRadius: 0,
                cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s, border 0.2s',
              }}
              onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleOtpSubmit} style={{ width: '100%' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: 600, marginBottom: 6, display: 'block', color: '#7c3f00' }}>Enter OTP sent to your email</label>
            <input
              type="text"
              className="enhanced-input"
              style={{ width: '100%', fontSize: '1.1rem', padding: '0.8rem 1rem', marginTop: 4, letterSpacing: '0.3em' }}
              value={otp}
              onChange={e => setOtp(e.target.value)}
              required
              maxLength={6}
            />
          </div>
          {otpError && <div style={{ color: '#be123c', fontWeight: 600, marginBottom: 12, fontSize: '1rem' }}>{otpError}</div>}
          {otpSuccess && <div style={{ color: '#15803d', fontWeight: 600, marginBottom: 12, fontSize: '1rem' }}>{otpSuccess}</div>}
          <button
            type="submit"
            className="enhanced-btn"
            style={{ width: '100%', fontSize: '1.15rem', padding: '0.9rem 0', marginBottom: '1.2rem', background: '#fbbf24', color: '#7c3f00', borderColor: '#fbbf24', fontWeight: 700, letterSpacing: '0.5px' }}
            disabled={otpLoading}
          >
            {otpLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <button
            type="button"
            className="enhanced-btn"
            style={{ width: '100%', fontSize: '1rem', padding: '0.7rem 0', background: '#f5f5f4', color: '#b45309', border: '2px solid #fbbf24', fontWeight: 600, marginBottom: 0, borderRadius: 0, cursor: 'pointer' }}
            onClick={handleResendOtp}
            disabled={resendLoading}
          >
            {resendLoading ? 'Resending...' : 'Resend OTP'}
          </button>
        </form>
      )}
    </div>
  );
};

export default AuthForm; 