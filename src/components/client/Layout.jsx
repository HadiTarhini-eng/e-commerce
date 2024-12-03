// components/Layout.js
import React from 'react';
import Navbar from './Navbar';
import FooterNav from './FooterNav';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const Layout = () => {
  const location = useLocation();  // Get current location (route)
  
  // Define the title based on the current route
  let pageTitle = 'Home';  // Default title

  if (location.pathname === '/product/:id') {
    pageTitle = 'Product Details';  // Change title for product page
  } else if (location.pathname === '/cart') {
    pageTitle = 'Your Cart';  // Change title for cart page
  } else if(location.pathname === '/socials') {
    pageTitle = 'Socials';
  } else if(location.pathname === '/checkout') {
    pageTitle = 'Checkout';
  } else if(location.pathname === '/payment') {
    pageTitle = 'Payment Methods';
  }

  return (
    <div className="min-h-screen flex flex-col items-center w-full">
      {/* Toast */}
      <Toaster />

      {/* Navbar */}
      <div className="w-full max-w-lg px-4 mt-4">
        <Navbar title={pageTitle} />
      </div>

      {/* Main Content */}
      <Outlet />

      {/* Footer Navigation */}
      <div className="w-full max-w-lg px-4 mt-4">
        <FooterNav />
      </div>
    </div>
  );
};

export default Layout;
