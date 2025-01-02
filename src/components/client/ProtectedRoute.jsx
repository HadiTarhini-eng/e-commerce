import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Update the path as needed

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isLoggedIn, userType, loading } = useAuth();
console.log(isLoggedIn, userType);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner or something better
  }

  // If the user is not logged in or doesn't have the required userType, redirect
  if (!isLoggedIn || userType !== requiredRole) {
    return <Navigate to="/404" />; // Redirect to home or login page
  }

  // If authorized, render the children components
  return children;
};

export default ProtectedRoute;