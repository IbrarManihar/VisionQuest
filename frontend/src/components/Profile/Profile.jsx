import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './Profile.css';

const Profile = () => {
  const { user, token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
  
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }
      
      if (formData.newPassword.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword || undefined
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
        
       
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating your profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="profile-info">
            <h2>{user?.name}</h2>
            <p className="profile-email">{user?.email}</p>
            <p className="profile-role">
              <span className={`role-badge ${user?.role}`}>
                {user?.role === 'admin' ? 'Administrator' : 'User'}
              </span>
            </p>
          </div>
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled
              />
              <small>Email cannot be changed</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="newPassword">New Password (Optional)</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={!formData.newPassword}
              />
            </div>
            
            <div className="profile-actions">
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="cancel-button"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="save-button"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-actions">
            <button 
              onClick={() => setIsEditing(true)}
              className="edit-button"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
      
      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>Books Purchased</h3>
            <p className="stat-value">0</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Books Sold</h3>
            <p className="stat-value">0</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔖</div>
          <div className="stat-content">
            <h3>Active Orders</h3>
            <p className="stat-value">0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
