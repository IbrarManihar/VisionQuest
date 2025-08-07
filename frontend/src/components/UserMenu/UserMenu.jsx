import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './UserMenu.css';

const UserMenu = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return (
      <Link to="/login" className="login-button">
        Login
      </Link>
    );
  }

  return (
    <div className="user-menu-container" ref={menuRef}>
      <button 
        className="user-menu-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="user-avatar">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <span className="user-name">{user?.name?.split(' ')[0]}</span>
        <span className="dropdown-arrow">▼</span>
      </button>
      
      {isOpen && (
        <div className="user-dropdown">
          <div className="user-info">
            <div className="user-avatar large">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <p className="user-full-name">{user?.name}</p>
              <p className="user-email">{user?.email}</p>
            </div>
          </div>
          
          <div className="dropdown-divider"></div>
          
          <ul className="menu-items">
            {user?.role === 'admin' && (
              <li>
                <Link to="/admin" onClick={() => setIsOpen(false)}>
                  <i className="menu-icon admin-icon">🛠️</i>
                  Admin Dashboard
                </Link>
              </li>
            )}
            <li>
              <Link to="/seller-dashboard" onClick={() => setIsOpen(false)}>
                <i className="menu-icon seller-icon">📊</i>
                Seller Dashboard
              </Link>
            </li>
            <li>
              <Link to="/my-orders" onClick={() => setIsOpen(false)}>
                <i className="menu-icon orders-icon">📦</i>
                My Orders
              </Link>
            </li>
          
            <li>
              <Link to="/profile" onClick={() => setIsOpen(false)}>
                <i className="menu-icon profile-icon">👤</i>
                Profile
              </Link>
            </li>
            <li className="logout-item">
              <button onClick={handleLogout}>
                <i className="menu-icon logout-icon">🚪</i>
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
