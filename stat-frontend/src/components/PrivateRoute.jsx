import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, requiredRole }) => {
  const accessToken = localStorage.getItem('accessToken');
  const userRole = localStorage.getItem('userRole'); // Get user role from localStorage

  // Check if user is authenticated and has the required role
  const isAuthenticated = !!accessToken;
  const hasRequiredRole = !requiredRole || userRole === requiredRole;

  return isAuthenticated && hasRequiredRole ? children : <Navigate to="/" />;
};

export default PrivateRoute;
