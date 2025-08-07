import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Auth.css';

const VerifyEmail = () => {
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const verifyEmailToken = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');
        
        if (!token) {
          throw new Error('Verification token is missing');
        }
        
        const response = await fetch(`/api/auth/verify/${token}`);
        const data = await response.json();
        
        if (response.ok) {
          setVerified(true);
          toast.success('Email verified successfully!');
         
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setError(data.message || 'Verification failed');
        }
      } catch (error) {
        console.error('Error verifying email:', error);
        setError(error.message || 'An error occurred during verification');
      } finally {
        setVerifying(false);
      }
    };
    
    verifyEmailToken();
  }, [location, navigate]);
  
  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Email Verification</h2>
        
        {verifying && (
          <div className="verification-status">
            <div className="loading-spinner"></div>
            <p>Verifying your email...</p>
          </div>
        )}
        
        {!verifying && verified && (
          <div className="verification-status success">
            <div className="verification-icon">✅</div>
            <h3>Verification Successful!</h3>
            <p>Your email has been verified successfully.</p>
            <p>You will be redirected to the login page shortly...</p>
            <button 
              onClick={() => navigate('/login')}
              className="auth-button"
            >
              Go to Login
            </button>
          </div>
        )}
        
       {/* {!verifying && error && (
          <div className="verification-status error">
            <div className="verification-icon">❌</div>
            <h3>Verification Failed</h3>
            <p>{error}</p>
            <p>Please try again or request a new verification email.</p>
            <button 
              onClick={() => navigate('/login')}
              className="auth-button"
            >
              Go to Login
            </button>
          </div>
        )}
          */}
      </div>
    </div>
  );
};

export default VerifyEmail;
