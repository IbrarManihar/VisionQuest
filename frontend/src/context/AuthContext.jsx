import React, { createContext, useState, useEffect, useContext } from 'react';


export const AuthContext = createContext();


export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

 
  useEffect(() => {
    const checkLoggedIn = async () => {
      if (token) {
        try {
          const response = await fetch('/api/auth/verify', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData.user);
            localStorage.setItem('user', JSON.stringify(userData.user));
          } else {
        
            logout();
          }
        } catch (error) {
          console.error('Auth verification error:', error);
         
          if (error.name !== 'TypeError') {
            logout();
          }
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, [token]);

 
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

 
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      login, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
