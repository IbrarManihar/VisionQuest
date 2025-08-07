import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './Admin.css';

const OrderManagement = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  useEffect(() => {
    fetchOrders();
  }, [token]);
  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('Fetching orders with token:', token ? 'Token exists' : 'No token');
      
      const response = await fetch('/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });
      
      console.log('Orders response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch orders');
      }
      
      const data = await response.json();
      console.log(`Found ${data.length} orders`);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error(`Failed to load orders: ${error.message}`);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
      
  
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };
  
  const handleDeliveryStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/delivery-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ deliveryStatus: newStatus })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update delivery status');
      }
      
     
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, deliveryStatus: newStatus } : order
      ));
      
      toast.success(`Delivery status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating delivery status:', error);
      toast.error('Failed to update delivery status');
    }
  };
  
  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="order-management">
      <div className="admin-section-header">
        <h2>Order Management</h2>
        <div className="admin-controls">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button onClick={fetchOrders} className="refresh-button">
            <span>↻</span> Refresh
          </button>
        </div>
      </div>
      
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order._id} className={order.status}>
                  <td>{order._id.substring(0, 8)}...</td>
                  <td>{order.bookId?.name || 'Book unavailable'}</td>
                  <td>{order.userName}</td>
                  <td>{formatDate(order.orderDate)}</td>
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
                  <td>
                    <button 
                      className="action-button view-button"
                      onClick={() => setSelectedOrder(order)}
                    >
                      View
                    </button>
                    <div className="order-actions">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="status-select"
                        disabled={order.status === 'cancelled'}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <select 
                        value={order.deliveryStatus}
                        onChange={(e) => handleDeliveryStatusChange(order._id, e.target.value)}
                        className="delivery-select"
                        disabled={order.status === 'cancelled'}
                      >
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-data">No orders found matching your filter</div>
      )}
      
      {selectedOrder && (
        <div className="order-details-modal">
          <div className="modal-content">
            <button className="close-button" onClick={() => setSelectedOrder(null)}>×</button>
            <h3>Order Details</h3>
            
            <div className="order-details-grid">
              <div className="detail-section">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> {selectedOrder.userName}</p>
                <p><strong>Contact:</strong> {selectedOrder.contactNumber}</p>
                <p><strong>Address:</strong> {selectedOrder.shippingAddress}</p>
                <p><strong>Branch:</strong> {selectedOrder.userBranch}</p>
                <p><strong>Semester:</strong> {selectedOrder.userSemester}</p>
              </div>
              
              <div className="detail-section">
                <h4>Order Information</h4>
                <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                <p><strong>Date:</strong> {formatDate(selectedOrder.orderDate)}</p>
                <p><strong>Book:</strong> {selectedOrder.bookId?.name || 'Book unavailable'}</p>
                <p><strong>Price:</strong> ₹{selectedOrder.bookId?.price || 'N/A'}</p>
                <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</p>
              </div>
            </div>
            
            <div className="order-notes">
              {selectedOrder.buyerNotes && (
                <div className="notes-section">
                  <h4>Buyer Notes</h4>
                  <p>{selectedOrder.buyerNotes}</p>
                </div>
              )}
              
              <div className="status-management">
                <h4>Update Status</h4>
                <div className="status-controls">
                  <div className="control-group">
                    <label>Order Status:</label>
                    <select 
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                      disabled={selectedOrder.status === 'cancelled'}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div className="control-group">
                    <label>Delivery Status:</label>
                    <select 
                      value={selectedOrder.deliveryStatus}
                      onChange={(e) => handleDeliveryStatusChange(selectedOrder._id, e.target.value)}
                      disabled={selectedOrder.status === 'cancelled'}
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
