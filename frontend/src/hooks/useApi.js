import { useState } from 'react';
import API_BASE_URL from '../config/api.js';
import { useAuth } from '../context/AuthContext';

export const useApiCall = () => {
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const apiCall = async (endpoint, options = {}) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.text();
        let errorMessage;
        try {
          const parsedError = JSON.parse(errorData);
          errorMessage = parsedError.message || `HTTP error! status: ${response.status}`;
        } catch {
          errorMessage = `HTTP error! status: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } finally {
      setLoading(false);
    }
  };

  return { apiCall, loading };
};