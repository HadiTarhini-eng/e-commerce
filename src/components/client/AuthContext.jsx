import React, { createContext, useState, useEffect, useContext } from 'react';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import toast from 'react-hot-toast';

// Secret key for encryption (keep it secure!)
const secretKey = 'the_key_is_in_the_hands_of_the_king'; // Make sure to use a secure key

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null); // Store the decrypted userId
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate(); // Initialize the navigate hook

  // Check if the user is logged in when the app is mounted
  useEffect(() => {
    const encryptedUserData = localStorage.getItem('userData');
    if (encryptedUserData) {
      try {
        const decryptedUserData = decryptData(encryptedUserData, secretKey);
        if (decryptedUserData && decryptedUserData.userId) {
          setIsLoggedIn(true);
          setUserId(decryptedUserData.userId); // Set the decrypted userId (you may also want to store full user data in the future)
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
    setUserId(user.userId); // Store only the userId (you may choose to store full data later)
    setUserType(user.userType);
  };

  // Function to handle logout and redirect to home page
  const logout = () => {
    setIsLoggedIn(false);
    setUserId(null); // Clear the userId on logout
    localStorage.removeItem('userData'); // Clear encrypted user data from localStorage
    navigate('/'); // Redirect to homepage after logout
    toast.success('You are now Logged out!')
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
    <AuthContext.Provider value={{ isLoggedIn, login, logout, userId, userType }}>
      {children}
    </AuthContext.Provider>
  );
};
