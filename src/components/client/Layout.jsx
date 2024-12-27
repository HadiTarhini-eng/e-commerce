import React, { useState } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import FooterNav from './FooterNav';
import { Toaster } from 'react-hot-toast';

const Layout = () => {
  const location = useLocation(); // Get current location (route)
  const { orderID } = useParams(); // Get the dynamic orderID parameter if available
  let pageTitle = '';
  
  // Define the title based on the current route
  if (location.pathname === '/') {
    pageTitle = 'Home';
  } else if (location.pathname.startsWith('/product/')) {
    pageTitle = 'Product Details'; // Handle dynamic product title
  } else if (location.pathname.startsWith('/OrderTrack/')) {
    pageTitle = `Track your order`; // Dynamic title for Order Track page
  } else if (location.pathname.startsWith('/orderDetails/')) {
    pageTitle = `Order Details`; // Dynamic title for Order Details page
  } else if (location.pathname === '/cart') {
    pageTitle = 'Your Cart';
  } else if (location.pathname === '/checkout') {
    pageTitle = 'Checkout';
  } else if (location.pathname === '/signin') {
    pageTitle = 'Sign In';
  } else if (location.pathname === '/orderHistory') {
    pageTitle = 'Past Orders';
  } else if (location.pathname === '/favorites') {
    pageTitle = 'Your Favorites';
  } else if (location.pathname === '/socials') {
    pageTitle = 'Contact Us';
  } else if (location.pathname === '/payment') {
    pageTitle = 'Payment Page';
  }

  return (
    <div className='sm:flex sm:justify-center h-full'>
      <div className="min-h-screen h-full flex flex-col md:max-w-[710px]">
        {/* Toast */}
        <Toaster />

        {/* Navbar */}
        <div className="sticky top-0 w-full max-w-[710px] z-50">
          <Navbar title={pageTitle} />
        </div>
        
        {/* Main Content */}
        <Outlet />

        {/* Footer Navigation */}
        <div className="sticky w-full max-w-[710px] px-4 mt-4">
          <FooterNav />
        </div>
      </div>
    </div>
  );
};

export default Layout;
