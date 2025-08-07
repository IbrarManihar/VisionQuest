import React, { useState } from 'react';
import './CancelOrderModal.css';

const CancelOrderModal = ({ onClose, onConfirm }) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      setError('Please provide a reason for cancellation');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onConfirm(reason);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="cancel-order-modal" onClick={e => e.stopPropagation()}>
        <h2>Cancel Order</h2>
        <p>Are you sure you want to cancel this order? This action cannot be undone.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="reason">Reason for cancellation:</label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a reason for cancellation..."
              rows={4}
              disabled={isSubmitting}
            />
            {error && <p className="error-message">{error}</p>}
          </div>
          
          <div className="modal-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Never mind
            </button>
            <button 
              type="submit" 
              className="confirm-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Cancelling...' : 'Yes, cancel order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancelOrderModal;
