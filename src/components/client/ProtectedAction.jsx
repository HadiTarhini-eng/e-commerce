import React from 'react';
import { useAuth } from './AuthContext';

const ProtectedAction = ({ children, onClick }) => {
  const { userLoggedIn, openAuthModal } = useAuth();

  const handleClick = (e) => {
    if (userLoggedIn) {
      onClick && onClick(e);
    } else {
      openAuthModal(); // Open the authentication modal if not logged in
    }
  };

  return React.cloneElement(children, { onClick: handleClick });
};

export default ProtectedAction;
