import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API_BASE_URL from '../../config/api.js';
import './RazorpayPayment.css';

const RazorpayPayment = ({ bookId, amount, onPaymentSuccess, onPaymentError, onCancel }) => {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentComplete, setPaymentComplete] = useState(false);
  
  useEffect(() => {

    const loadRazorpayScript = async () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };
    
  
    const initializePayment = async () => {
     
      if (paymentComplete) {
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
     
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error('Razorpay SDK failed to load');
        }
        
     
        console.log('Creating Razorpay order...');
        const response = await fetch(`${API_BASE_URL}/api/payments/razorpay/create-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            bookId,
            amount: amount || 0
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create payment order');
        }
        
        const orderData = await response.json();
        console.log('Order created:', orderData);
        
       
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Vision Quest',
          description: 'Purchase Book',
          order_id: orderData.id,
          handler: async function(response) {
            try {
            
              console.log('Verifying payment...', response);
              const verifyResponse = await fetch('/api/payments/razorpay/verify', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                })
              });
              
              if (!verifyResponse.ok) {
                const errorData = await verifyResponse.json();
                throw new Error(errorData.message || 'Payment verification failed');
              }
              
              const paymentData = await verifyResponse.json();
              console.log('Payment verified:', paymentData);
              
              
              setPaymentComplete(true);
              
              
              onPaymentSuccess({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                orderData: paymentData.orderData
              });
            } catch (error) {
              console.error('Payment verification error:', error);
              onPaymentError(error.message);
            }
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
          },
          theme: {
            color: '#6a11cb'
          },
          modal: {
            ondismiss: onCancel
          }
        };
        
      
        const razorpay = new window.Razorpay(options);
        razorpay.open();
        
        setLoading(false);
      } catch (error) {
        console.error('Razorpay initialization error:', error);
        setError(error.message);
        setLoading(false);
        onPaymentError(`Razorpay configuration issue: ${error.message}`);
      }
    };
    
    if (!paymentComplete) {
      initializePayment();
    }
  }, [bookId, amount, token, user, onPaymentSuccess, onPaymentError, onCancel, paymentComplete]);
  
 
  if (paymentComplete) {
    return null;
  }
  
  return (
    <div className="razorpay-container">
      {loading && (
        <div className="razorpay-loader">
          <div className="loader-spinner"></div>
          <p>Initializing payment...</p>
        </div>
      )}
      
      {error && (
        <div className="razorpay-error">
          <h3>Payment Error</h3>
          <p>{error}</p>
          <button onClick={onCancel}>Go Back</button>
        </div>
      )}
    </div>
  );
};

export default RazorpayPayment;

