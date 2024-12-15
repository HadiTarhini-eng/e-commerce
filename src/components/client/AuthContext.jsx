import React, { createContext, useState, useEffect, useContext } from 'react';
import CryptoJS from 'crypto-js';

// Secret key for encryption (keep it secure!)
const secretKey = 'your_secret_key'; // Make sure to use a secure key

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if the user is logged in when the app is mounted
  useEffect(() => {
    const encryptedUserData = localStorage.getItem('userData');
    if (encryptedUserData) {
      try {
        const decryptedUserData = decryptData(encryptedUserData, secretKey);
        if (decryptedUserData) {
          setIsLoggedIn(true); // User is logged in if valid data is found
        }
      } catch (error) {
        console.error('Failed to decrypt user data:', error);
      }
    }
  }, []);

  // Function to handle login
  const login = (user) => {
    setIsLoggedIn(true);
    const encryptedData = encryptData(user, secretKey); // Encrypt and store user data
    localStorage.setItem('userData', encryptedData);
  };

  // Function to handle logout
  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('userData'); // Clear encrypted user data from localStorage
  };

  // Encrypt the data
  const encryptData = (data, secretKey) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  };

  // Decrypt the data
  const decryptData = (encryptedData, secretKey) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData); // Return the parsed object
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
