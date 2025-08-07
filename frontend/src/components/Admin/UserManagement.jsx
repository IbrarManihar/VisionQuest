import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

const UserManagement = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        console.log('Fetching users with token:', token ? 'Token exists' : 'No token');
        
        const response = await fetch('/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache'
          }
        });
        
        console.log('Users response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch users');
        }
        
        const data = await response.json();
        console.log(`Found ${data.length} users`);
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error(`Failed to load users: ${error.message}`);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      fetchUsers();
    }
  }, [token]);
  
  return (
    <div className="user-management">
      <h2>User Management</h2>
      
      {loading ? (
        <div className="loading">Loading users...</div>
      ) : users.length > 0 ? (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user._id.substring(0, 8)}...</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-data">No users found</div>
      )}
    </div>
  );
};

export default UserManagement;
