import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// Utility function to get a cookie by name
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = getCookie('access_token');
  const location = useLocation();

  useEffect(() => {
    const checkAuthentication = async () => {
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        // Make an API call to verify the access token
        const response = await axios.get('http://127.0.0.1:8000/verify', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        console.log(response);
        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect authenticated users from login or signup to dashboard
  if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/signup')) {
    return <Navigate to="/dashboard" />;
  }

  // Redirect non-authenticated users from protected routes to login
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
