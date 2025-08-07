import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './Admin.css';

const Statistics = ({ token }) => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalBooks: 0,
    availableBooks: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  
  useEffect(() => {
    fetchStatistics();
    fetchRecentOrders();
  }, [token]);
  
  const fetchStatistics = async () => {
    try {
      setLoading(true);
      console.log('Fetching statistics with token:', token ? 'Token exists' : 'No token');
      
     
      const response = await fetch('/api/statistics', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });
      
      console.log('Statistics response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch statistics');
      }
      
      const data = await response.json();
      console.log('Statistics data:', data);
      setStats(data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      toast.error(`Failed to load statistics: ${error.message}`);
     
      setStats({
        totalOrders: 0,
        completedOrders: 0,
        pendingOrders: 0,
        cancelledOrders: 0,
        totalRevenue: 0,
        totalUsers: 0,
        totalBooks: 0,
        availableBooks: 0
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchRecentOrders = async () => {
    try {
      const response = await fetch('/api/orders?limit=5', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch recent orders');
      }
      
      const data = await response.json();
      setRecentOrders(data);
    } catch (error) {
      console.error('Error fetching recent orders:', error);
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="admin-statistics">
      <div className="admin-section-header">
        <h2>Dashboard Overview</h2>
        <button onClick={fetchStatistics} className="refresh-button">
          <span>↻</span> Refresh
        </button>
      </div>
      
      {loading ? (
        <div className="loading">Loading statistics...</div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>Total Orders</h3>
                <p className="stat-value">{stats.totalOrders}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>Completed Orders</h3>
                <p className="stat-value">{stats.completedOrders}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <h3>Pending Orders</h3>
                <p className="stat-value">{stats.pendingOrders}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">❌</div>
              <div className="stat-content">
                <h3>Cancelled Orders</h3>
                <p className="stat-value">{stats.cancelledOrders}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>Total Revenue</h3>
                <p className="stat-value">₹{stats.totalRevenue}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>Total Users</h3>
                <p className="stat-value">{stats.totalUsers}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <h3>Total Books</h3>
                <p className="stat-value">{stats.totalBooks}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">📖</div>
              <div className="stat-content">
                <h3>Available Books</h3>
                <p className="stat-value">{stats.availableBooks}</p>
              </div>
            </div>
          </div>
          
          <div className="recent-activity">
            <h3>Recent Orders</h3>
            
            {recentOrders.length > 0 ? (
              <table className="recent-orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Book</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order._id}>
                      <td>{order._id.substring(0, 8)}...</td>
                      <td>{order.bookId?.name || 'Book unavailable'}</td>
                      <td>{order.userName}</td>
                      <td>{formatDate(order.orderDate)}</td>
                      <td>
                        <span className={`status-badge ${order.status}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data">No recent orders found</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Statistics;
