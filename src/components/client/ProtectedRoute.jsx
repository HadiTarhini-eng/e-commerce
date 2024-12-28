import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Update the path as needed

const ProtectedRoute = ({ children, requiredUserType }) => {
  const { isLoggedIn, userType } = useAuth();

  // If the user is not logged in or doesn't have the required userType, redirect
  if (!isLoggedIn || userType !== requiredUserType) {
    return <Navigate to="*" replace />; // Redirect to home or login page
  }

  // If authorized, render the children components
  return children;
};

export default ProtectedRoute;
