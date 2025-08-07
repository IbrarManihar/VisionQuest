import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Auth.css';

const ResendVerification = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Verification email sent successfully!');
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(data.message || 'Failed to resend verification email');
      }
    } catch (error) {
      console.error('Error resending verification:', error);
      toast.error('An error occurred while resending verification email');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Resend Verification Email</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Sending...' : 'Resend Verification Email'}
          </button>
        </form>
        <div className="auth-links">
          <p>Remembered your password? <a href="/login">Login</a></p>
        </div>
      </div>
    </div>
  );
};

export default ResendVerification;
