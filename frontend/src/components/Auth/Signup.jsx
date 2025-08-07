import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Auth.css';

export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Account created successfully! Please check your email to verify your account.');
        
       
        setVerificationSent(true);
      } else {
        toast.error(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {verificationSent ? (
        <div className="auth-form-container">
          <h2>Verification Email Sent</h2>
          <div className="verification-sent">
            <div className="email-icon">📧</div>
            <p>A verification email has been sent to <strong>{email}</strong>.</p>
            <p>Please check your inbox and click the verification link to activate your account.</p>
            <p className="check-spam">If you don't see the email, please check your spam folder.</p>
            <button 
              onClick={() => navigate('/login')}
              className="auth-button"
            >
              Go to Login
            </button>
            <div className="auth-links">
              <p>Didn't receive the email? <a href="/resend-verification">Resend verification</a></p>
            </div>
          </div>
        </div>
      ) : (
        <div className="auth-form-container">
          <h2>Create an Account</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
          <div className="auth-links">
            <p>Already have an account? <Link to="/login">Login</Link></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
