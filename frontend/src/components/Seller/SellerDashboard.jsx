import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './Seller.css';

const SellerDashboard = () => {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeOrder, setActiveOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    fetchSellerOrders();
  }, [token]);
  
  const fetchSellerOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/seller/orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch seller orders');
      }
      
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching seller orders:', error);
      toast.error('Failed to load your orders');
    } finally {
      setLoading(false);
    }
  };
  
  const updateOrderStatus = async (orderId, status, deliveryStatus, sellerNotes) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/seller/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status,
          deliveryStatus,
          sellerNotes
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order');
      }
      
      const updatedOrder = await response.json();
      
     
      setOrders(orders.map(order => 
        order._id === orderId ? updatedOrder.order : order
      ));
      
      setActiveOrder(null);
      toast.success('Order updated successfully');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!activeOrder) return;
    
    const form = e.target;
    const status = form.status.value;
    const deliveryStatus = form.deliveryStatus.value;
    const sellerNotes = form.sellerNotes.value;
    
    updateOrderStatus(activeOrder._id, status, deliveryStatus, sellerNotes);
  };
  
  const filteredOrders = orders.filter(order => 
    statusFilter === 'all' || 
    (statusFilter === 'pending' && order.status === 'pending') ||
    (statusFilter === 'completed' && order.status === 'completed') ||
    (statusFilter === 'processing' && order.deliveryStatus === 'processing') ||
    (statusFilter === 'shipped' && order.deliveryStatus === 'shipped') ||
    (statusFilter === 'delivered' && order.deliveryStatus === 'delivered')
  );
  
  return (
    <div className="seller-dashboard">
      <div className="seller-header">
        <h1>Seller Dashboard</h1>
        <p>Welcome, {user?.name}</p>
      </div>
      
      <div className="seller-controls">
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
        
        <button onClick={fetchSellerOrders} className="refresh-button">
          Refresh
        </button>
      </div>
      
      <div className="seller-orders">
        <h2>My Books Orders</h2>
        
        {loading ? (
          <div className="loading">Loading orders...</div>
        ) : filteredOrders.length > 0 ? (
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Book</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Delivery</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order._id} className={order.status}>
                    <td>{order._id.substring(0, 8)}...</td>
                    <td>{order.bookId?.name || 'Book unavailable'}</td>
                    <td>{order.userName}</td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>₹{order.bookId?.price || 'N/A'}</td>
                    <td>
                      <span className={`status-badge ${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <span className={`delivery-badge ${order.deliveryStatus}`}>
                        {order.deliveryStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data">No orders found for your books</div>
        )}
      </div>
      
      {activeOrder && (
        <div className="order-details-modal">
          <div className="modal-content">
            <button className="close-button" onClick={() => setActiveOrder(null)}>×</button>
            <h3>Order Details</h3>
            
            <div className="order-detail-view">
              <div className="order-detail-header">
                <h2>Order Details</h2>
                <span className="order-id">Order #{activeOrder._id.substring(0, 8)}</span>
              </div>
              
              <div className="order-detail-content">
                <div className="detail-section">
                  <h3>Book Information</h3>
                  <div className="detail-item">
                    <span>Title:</span>
                    <span>{activeOrder.bookId.name}</span>
                  </div>
                  <div className="detail-item">
                    <span>Price:</span>
                    <span>₹{activeOrder.bookId.price}</span>
                  </div>
                  <div className="detail-item">
                    <span>Branch:</span>
                    <span>{activeOrder.bookId.branch}</span>
                  </div>
                  <div className="detail-item">
                    <span>Semester:</span>
                    <span>{activeOrder.bookId.semester}</span>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>Buyer Information</h3>
                  <div className="detail-item">
                    <span>Name:</span>
                    <span>{activeOrder.userName}</span>
                  </div>
                  <div className="detail-item">
                    <span>Email:</span>
                    <span>{activeOrder.userId?.email || 'Not available'}</span>
                  </div>
                  <div className="detail-item">
                    <span>Contact:</span>
                    <span>{activeOrder.contactNumber || 'Not provided'}</span>
                  </div>
                  <div className="detail-item">
                    <span>Semester:</span>
                    <span>{activeOrder.userSemester}</span>
                  </div>
                  <div className="detail-item">
                    <span>Branch:</span>
                    <span>{activeOrder.userBranch}</span>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>Shipping Information</h3>
                  <div className="detail-item">
                    <span>Address:</span>
                    <span>{activeOrder.shippingAddress || 'Not provided'}</span>
                  </div>
                  <div className="detail-item">
                    <span>Order Date:</span>
                    <span>{new Date(activeOrder.orderDate).toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <span>Payment Method:</span>
                    <span>{activeOrder.paymentMethod || 'Not specified'}</span>
                  </div>
                  <div className="detail-item">
                    <span>Payment Status:</span>
                    <span className={`status ${activeOrder.paymentStatus}`}>
                      {activeOrder.paymentStatus}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span>Order Status:</span>
                    <span className={`status ${activeOrder.status}`}>
                      {activeOrder.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span>Delivery Status:</span>
                    <span className={`status ${activeOrder.deliveryStatus}`}>
                      {activeOrder.deliveryStatus}
                    </span>
                  </div>
                </div>
                
                {activeOrder.buyerNotes && (
                  <div className="detail-section">
                    <h3>Buyer Notes</h3>
                    <div className="notes-box">
                      {activeOrder.buyerNotes}
                    </div>
                  </div>
                )}
                
                <div className="detail-section">
                  <h3>Update Order</h3>
                  <form onSubmit={handleUpdateSubmit} className="update-form">
                    <div className="form-group">
                      <label htmlFor="status">Order Status:</label>
                      <select 
                        id="status" 
                        name="status" 
                        defaultValue={activeOrder.status}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="deliveryStatus">Delivery Status:</label>
                      <select 
                        id="deliveryStatus" 
                        name="deliveryStatus" 
                        defaultValue={activeOrder.deliveryStatus}
                      >
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="sellerNotes">Notes to Buyer:</label>
                      <textarea
                        id="sellerNotes"
                        name="sellerNotes"
                        defaultValue={activeOrder.sellerNotes}
                        placeholder="Add notes for the buyer..."
                      />
                    </div>
                    
                    <button type="submit" className="update-button">
                      Update Order
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
