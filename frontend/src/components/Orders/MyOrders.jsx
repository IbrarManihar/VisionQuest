import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './MyOrders.css';
import CancelOrderModal from './CancelOrderModal';
import API_BASE_URL from '../../config/api.js'; // Add this import

const MyOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
       
        const isNewOrder = location.search.includes('newOrder=true');
        
        if (isNewOrder) {
          console.log('New order detected, adding delay for DB consistency');
          await new Promise(resolve => setTimeout(resolve, 2500));
        }
        
        console.log('Fetching orders with token:', token ? 'Token exists' : 'No token');
        
        const response = await fetch(`${API_BASE_URL}/api/orders/my`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache' 
          }
        });
        
        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('Orders API response:', data);
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch orders');
        }
        
       
        const recentOrders = JSON.parse(localStorage.getItem('recentOrders') || '[]');
        
        if (Array.isArray(data)) {
          console.log(`Found ${data.length} orders from API`);
          
          let ordersToDisplay = [...data];
          
          
          if (recentOrders.length > 0) {
            console.log('Found recent orders in localStorage:', recentOrders.length);
            
           
            const existingIds = new Set(data.map(order => order._id));
            const newOrders = recentOrders.filter(order => !existingIds.has(order._id));
            
            if (newOrders.length > 0) {
              console.log('Adding new orders from localStorage:', newOrders.length);
              ordersToDisplay = [...newOrders, ...data];
            }
            
           
            localStorage.removeItem('recentOrders');
          }
          
          setOrders(ordersToDisplay);
        } else {
          console.error('Expected array of orders but got:', typeof data);
          setOrders(recentOrders.length > 0 ? recentOrders : []);
        }
        
     
        if (isNewOrder) {
      
          const orderDetails = JSON.parse(sessionStorage.getItem('newOrderDetails') || '{}');
    
          toast.success(
            <div className="order-success-notification">
              <div className="success-icon">✅</div>
              <div className="success-content">
                <h4>Order Placed Successfully!</h4>
                {orderDetails.bookName && <p>Your order for "{orderDetails.bookName}" has been confirmed.</p>}
                <p>You can track your order status on this page.</p>
              </div>
            </div>,
            {
              autoClose: 7000,
              closeButton: true,
              className: 'order-success-toast',
              progressClassName: 'success-progress'
            }
          );
          
        
          sessionStorage.removeItem('newOrderDetails');
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        
        
        const recentOrders = JSON.parse(localStorage.getItem('recentOrders') || '[]');
        if (recentOrders.length > 0) {
          console.log('Showing orders from localStorage as fallback');
          setOrders(recentOrders);
          toast.warning('Showing locally cached orders. Some orders may be missing.');
        } else {
          toast.error(`Failed to load orders: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      fetchOrders();
    } else {
      console.warn('No token available, skipping order fetch');
      setLoading(false);
    }
  }, [token, location.search]);
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getOrderStatusSteps = (order) => {
 
    const steps = [
      { 
        label: 'Order Placed', 
        icon: '📋',
        completed: true, 
        date: formatDate(order.orderDate),
        description: 'Your order has been received'
      },
      { 
        label: 'Processing', 
        icon: '🔄',
        completed: order.deliveryStatus !== 'processing', 
        date: order.deliveryStatus !== 'processing' ? formatDate(order.updatedAt || new Date(order.orderDate.getTime() + 86400000)) : 'In progress',
        description: 'Preparing your book for shipping'
      },
      { 
        label: 'Shipped', 
        icon: '🚚',
        completed: order.deliveryStatus === 'shipped' || order.deliveryStatus === 'delivered', 
        date: order.deliveryStatus === 'shipped' || order.deliveryStatus === 'delivered' ? formatDate(order.updatedAt || new Date(order.orderDate.getTime() + 172800000)) : 'Upcoming',
        description: 'Your book is on the way'
      },
      { 
        label: 'Delivered', 
        icon: '📦',
        completed: order.deliveryStatus === 'delivered', 
        date: order.deliveryStatus === 'delivered' ? formatDate(order.updatedAt || new Date(order.orderDate.getTime() + 259200000)) : 'Upcoming',
        description: 'Your book has arrived'
      }
    ];
    
   
    const completedSteps = steps.filter(step => step.completed).length;
    const connectionWidth = `${(completedSteps - 1) * 33.3}%`;
    
    return (
      <div className="order-progress">
        {steps.map((step, index) => (
          <div key={index} className={`progress-step ${step.completed ? 'completed' : ''}`}>
            <div className="step-indicator">
              {step.completed ? '✓' : step.icon}
            </div>
            <div className="step-label">{step.label}</div>
            <div className="step-date">{step.date}</div>
            {index < steps.length - 1 && step.completed && steps[index + 1].completed && (
              <div className="step-connector" style={{left: `${index * 33.3}%`, width: '33.3%'}}></div>
            )}
          </div>
        ))}
        <div className="step-connector" style={{left: '0', width: connectionWidth}}></div>
      </div>
    );
  };
  
  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'razorpay':
        return '💳';
      case 'cash':
        return '💵';
      case 'upi':
        return '📱';
      default:
        return '💰';
    }
  };
  
  const openCancelModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowCancelModal(true);
  };
  
  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedOrderId(null);
  };
  
  const handleCancelOrder = async (reason) => {
    try {
      setCancelLoading(true);
      
      
      const response = await fetch(`/api/orders/${selectedOrderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cancellationReason: reason
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel order');
      }
      
     
      setOrders(orders.map(order => 
        order._id === selectedOrderId 
          ? { ...order, status: 'cancelled', cancellationReason: reason } 
          : order
      ));
      
      toast.success('Order cancelled successfully');
      closeCancelModal();
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error(`Failed to cancel order: ${error.message}`);
    } finally {
      setCancelLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="orders-loading">
        <div className="loading-spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }
  
  if (orders.length === 0) {
    return (
      <div className="empty-orders">
        <div className="empty-icon">📚</div>
        <h2>No Orders Yet</h2>
        <p>You haven't placed any orders yet. Start exploring books to find your next read!</p>
        <Link to="/borrow" className="browse-books-link">
          <span className="browse-icon">🔍</span> Browse Books
        </Link>
      </div>
    );
  }
  
  return (
    <div className="my-orders-container">
      <h1>My Orders</h1>
      
      <div className="orders-list">
        {orders.map(order => (
          <div key={order._id} className={`order-card ${getStatusClass(order.status)}`}>
            <div className="order-header">
              <div className="order-id">
                <span>Order ID:</span>
                <span>#{order._id.substring(0, 8)}...</span>
              </div>
              <div className="order-date">
                <span>Ordered on:</span>
                <span>{formatDate(order.orderDate)}</span>
              </div>
              <div className={`order-status ${order.status}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
            </div>
            
            <div className="order-content">
              <div className="book-image">
                {order.bookId?.photo ? (
                  <img src={order.bookId.photo} alt={order.bookId.name} />
                ) : (
                  <div className="no-image">No image</div>
                )}
              </div>
              
              <div className="order-details">
                <h3>{order.bookId?.name || 'Book no longer available'}</h3>
                {order.bookId && (
                  <>
                    <p><span>Branch:</span> {order.bookId.branch}</p>
                    <p><span>Semester:</span> {order.bookId.semester}</p>
                    <p className="book-price"><span>Price:</span> ₹{order.bookId.price}</p>
                  </>
                )}
              </div>
            </div>
            
            <div className="order-tracking">
              <h4>Order Tracking</h4>
              {getOrderStatusSteps(order)}
            </div>
            
            <div className="order-footer">
              <div className="shipping-info">
                <h4>Shipping Details</h4>
                <p><span>Name:</span> <span>{order.userName}</span></p>
                <p><span>Contact:</span> <span>{order.contactNumber}</span></p>
                <p><span>Branch:</span> <span>{order.userBranch}</span></p>
                <p><span>Semester:</span> <span>{order.userSemester}</span></p>
                <p><span>Address:</span> <span>{order.shippingAddress}</span></p>
              </div>
              
              <div className="payment-info">
                <h4>Payment Information</h4>
                <p>
                  <span>Method:</span>
                  <span className={`payment-badge ${order.paymentMethod}`}>
                    {order.paymentMethod === 'cash' ? 'Cash on Delivery' : 
                     order.paymentMethod === 'razorpay' ? 'Paid via Razorpay' : 
                     order.paymentMethod}
                  </span>
                </p>
                <p>
                  <span>Status:</span>
                  <span className={`payment-status ${order.paymentStatus}`}>
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </span>
                </p>
                
                {order.transactionId && order.paymentMethod !== 'cash' && (
                  <p><span>Transaction ID:</span> <span className="transaction-id">{order.transactionId}</span></p>
                )}
              </div>
              
              {order.sellerNotes && (
                <div className="seller-message">
                  <h4>Message from Seller</h4>
                  <p>{order.sellerNotes}</p>
                </div>
              )}
              
              {order.buyerNotes && (
                <div className="buyer-notes">
                  <h4>Your Notes</h4>
                  <div className="notes-content">
                    <p>{order.buyerNotes}</p>
                  </div>
                </div>
              )}
              
              <div className={`order-message ${order.status}`}>
                <div className="message-icon">
                  {order.status === 'pending' ? '🕒' : 
                   order.status === 'completed' ? '✅' : '❌'}
                </div>
                <div className="message-content">
                  {order.status === 'pending' && (
                    <>
                      <h4>Your order is being processed</h4>
                      <p>The seller is preparing your book for delivery. You will receive it soon!</p>
                    </>
                  )}
                  
                  {order.status === 'completed' && (
                    <>
                      <h4>Order completed successfully</h4>
                      <p>Your order has been delivered. Enjoy your book!</p>
                    </>
                  )}
                  
                  {order.status === 'cancelled' && (
                    <>
                      <h4>Order has been cancelled</h4>
                      <p>This order was cancelled. If you have any questions, please contact support.</p>
                    </>
                  )}
                </div>
              </div>
              
              <div className="order-actions">
                {order.status === 'pending' && (
                  <button 
                    className="action-button cancel-order"
                    onClick={() => openCancelModal(order._id)}
                  >
                    <span className="action-icon">❌</span> Cancel Order
                  </button>
                )}
                
                <button 
                  className="action-button contact-seller"
                  onClick={() => {/*Contact seller part yaha aaeyega */}}
                >
                  <span className="action-icon">💬</span> Contact Seller
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {showCancelModal && (
        <CancelOrderModal 
          onClose={closeCancelModal}
          onConfirm={handleCancelOrder}
          isLoading={cancelLoading}
        />
      )}
    </div>
  );
};



export default MyOrders;

