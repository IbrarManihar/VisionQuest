import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../actions/orderActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../../firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import CancelOrderModal from './CancelOrderModal';

const MyOrders = () => {
  const dispatch = useDispatch();

  const orderList = useSelector(state => state.orderList);
  const { loading, error, orders } = orderList;

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
       
        const isNewOrder = window.location.search.includes('newOrder=true');
        if (isNewOrder) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
        
        const response = await fetch('/api/orders/my', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          let data = await response.json();
          console.log('Orders from API:', data);
          
        
          const recentOrders = JSON.parse(localStorage.getItem('recentOrders') || '[]');
          if (recentOrders.length > 0) {
   
            const existingOrderIds = new Set(data.map(order => order._id));
            const missingOrders = recentOrders.filter(order => !existingOrderIds.has(order._id));
            
            if (missingOrders.length > 0) {
              console.log('Adding missing recent orders:', missingOrders);
              data = [...missingOrders, ...data];
            }
          }
          
          setOrders(data);
          
 
          if (isNewOrder) {
            toast.success('Your order has been placed successfully!');
            window.history.replaceState({}, document.title, window.location.pathname);
            localStorage.removeItem('recentOrders');
          }
        } else {
          throw new Error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        
        const recentOrders = JSON.parse(localStorage.getItem('recentOrders') || '[]');
        if (recentOrders.length > 0) {
          setOrders(recentOrders);
          toast.warning('Showing locally cached orders. Some orders may be missing.');
        } else {
          toast.error('Failed to load orders');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [token, window.location.search]);


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
      setIsLoading(true);
      
    
      const orderRef = doc(db, "orders", selectedOrderId);
      
     
      await updateDoc(orderRef, {
        status: "cancelled",
        cancelledAt: new Date().toISOString(),
        cancellationReason: reason
      });
      
  
      setOrders(orders.filter(order => order.id !== selectedOrderId));
      
      toast.success("Order cancelled successfully");
      closeCancelModal();
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'delivered':
        return 'order-delivered';
      case 'shipped':
        return 'order-shipped';
      case 'processing':
        return 'order-processing';
      default:
        return '';
    }
  };

  const getOrderStatusSteps = (order) => {
    const steps = [
      { label: 'Order Placed', completed: true, date: new Date(order.orderDate).toLocaleDateString() },
      { label: 'Processing', completed: order.deliveryStatus !== 'processing', date: order.deliveryStatus !== 'processing' ? '✓' : '...' },
      { label: 'Shipped', completed: order.deliveryStatus === 'shipped' || order.deliveryStatus === 'delivered', date: order.deliveryStatus === 'shipped' || order.deliveryStatus === 'delivered' ? '✓' : '...' },
      { label: 'Delivered', completed: order.deliveryStatus === 'delivered', date: order.deliveryStatus === 'delivered' ? '✓' : '...' }
    ];
    
    return (
      <div className="order-progress">
        {steps.map((step, index) => (
          <div key={index} className={`progress-step ${step.completed ? 'completed' : ''}`}>
            <div className="step-indicator">{step.completed ? '✓' : index + 1}</div>
            <div className="step-label">{step.label}</div>
            <div className="step-date">{step.date}</div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="my-orders-container">
      <h1>My Orders</h1>
      
      {loading ? (
        <div className="orders-loading">
          <div className="loading-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      ) : orders.length > 0 ? (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className={`order-card ${getStatusClass(order.status)}`}>
              <div className="order-header">
                <div className="order-id">
                  <span>Order ID:</span> #{order._id.substring(0, 8)}...
                </div>
                <div className="order-date">
                  <span>Ordered on:</span> {formatDate(order.orderDate)}
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
                {getOrderStatusSteps(order)}
              </div>
              
              <div className="order-footer">
                <div className="shipping-info">
                  <p><span>Delivery Address:</span> {order.shippingAddress || 'Not specified'}</p>
                  <p><span>Payment Method:</span> 
                    <span className={`payment-badge ${order.paymentMethod}`}>
                      {order.paymentMethod === 'cash' ? 'Cash on Delivery' : 
                       order.paymentMethod === 'razorpay' ? 'Paid via Razorpay' : 
                       order.paymentMethod}
                    </span>
                  </p>
                  {order.transactionId && order.paymentMethod === 'razorpay' && (
                    <p><span>Transaction ID:</span> 
                      <span className="transaction-id">{order.transactionId}</span>
                    </p>
                  )}
                </div>
                
                {order.sellerNotes && (
                  <div className="seller-message">
                    <h4>Seller Note:</h4>
                    <p>{order.sellerNotes}</p>
                  </div>
                )}
                
                {/* Status-specific messages */}
                {order.status === 'pending' && (
                  <div className="order-message pending">
                    <div className="message-icon">🕒</div>
                    <p>Your order is being processed. You will receive your book soon!</p>
                  </div>
                )}
                
                {order.status === 'completed' && (
                  <div className="order-message success">
                    <div className="message-icon">✅</div>
                    <p>Your order has been completed. Enjoy your book!</p>
                  </div>
                )}
                
                {order.status === 'cancelled' && (
                  <div className="order-message error">
                    <div className="message-icon">❌</div>
                    <p>This order has been cancelled.</p>
                  </div>
                )}
              </div>
              
              <div className="order-actions">
                {order.status === 'pending' && (
                  <button 
                    className="action-button cancel-order"
                    onClick={() => openCancelModal(order.id)}
                  >
                    <span className="action-icon">❌</span> Cancel Order
                  </button>
                )}
                
                <button 
                  className="action-button contact-seller"
                  
                >
                  <span className="action-icon">💬</span> Contact Seller
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-orders">
          <div className="empty-icon">📚</div>
          <h2>No Orders Yet</h2>
          <p>You haven't placed any orders yet.</p>
          <Link to="/borrow" className="browse-books-link">
            Browse Books
          </Link>
        </div>
      )}
      
     
      {showCancelModal && (
        <CancelOrderModal 
          onClose={closeCancelModal}
          onConfirm={handleCancelOrder}
        />
      )}
    </div>
  );
};

export default MyOrders;