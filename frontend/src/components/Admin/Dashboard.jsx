import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import UserManagement from './UserManagement';
import OrderManagement from './OrderManagement';
import Statistics from './Statistics';
import './Admin.css';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('statistics');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'admin') {
    
      toast.error('You do not have permission to access the admin dashboard');
      window.location.href = '/home';
    }
  }, [user]);
  
  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-unauthorized">
        <h2>Unauthorized Access</h2>
        <p>You must be an administrator to view this page.</p>
      </div>
    );
  }
  
  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user.name}</p>
      </div>
      
      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'statistics' ? 'active' : ''}`} 
          onClick={() => setActiveTab('statistics')}
        >
          <span className="tab-icon">📊</span> Statistics
        </button>
        <button 
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`} 
          onClick={() => setActiveTab('orders')}
        >
          <span className="tab-icon">📦</span> Order Management
        </button>
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`} 
          onClick={() => setActiveTab('users')}
        >
          <span className="tab-icon">👥</span> User Management
        </button>
      </div>
      
      <div className="admin-content">
        {activeTab === 'statistics' && <Statistics token={token} />}
        {activeTab === 'orders' && <OrderManagement token={token} />}
        {activeTab === 'users' && <UserManagement token={token} />}
      </div>
    </div>
  );
};

export default Dashboard;
