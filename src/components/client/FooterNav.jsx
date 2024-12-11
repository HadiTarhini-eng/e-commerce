import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Assuming you're using React Router for navigation

const FooterNav = () => {
  const location = useLocation(); // Get the current route
  const [selectedIcon, setSelectedIcon] = useState(location.pathname); // Track the active icon

  // Function to handle icon click and update the active icon state
  const handleIconClick = (path) => {
    setSelectedIcon(path);
  };

  // Helper function to determine filter and scale based on selected icon
  const getIconStyles = (path) => {
    return {
      filter: selectedIcon === path
        ? 'brightness(0) saturate(100%) invert(50%) sepia(80%) saturate(500%) hue-rotate(330deg)' // Custom Light-Rose tint
        : 'none', // No filter for unselected icons
      transform: selectedIcon === path ? 'scale(1.1)' : 'scale(1)', // Apply size change
    };
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md py-3 bg-pale-peach">
      <div className="flex justify-around items-center">
        {/* Home Icon */}
        <Link
          to="/"
          className="text-gray-700 hover:text-blue-500"
          onClick={() => handleIconClick("/")}
        >
          <img
            src="../../src/assets/image/icons/home.png"
            alt="Home"
            className="w-8 h-8 transition-all duration-300 ease-in-out"
            style={getIconStyles("/")} // Apply filter and scale dynamically
          />
        </Link>

        {/* Cart Icon */}
        <Link
          to="/cart"
          className="text-gray-700 hover:text-blue-500"
          onClick={() => handleIconClick("/cart")}
        >
          <img
            src="../../src/assets/image/icons/cart.png"
            alt="Cart"
            className="w-8 h-8 transition-all duration-300 ease-in-out"
            style={getIconStyles("/cart")} // Apply filter and scale dynamically
          />
        </Link>

        {/* Orders Icon */}
        <Link
          to="/orderHistory"
          className="text-gray-700 hover:text-blue-500"
          onClick={() => handleIconClick("/orderHistory")}
        >
          <img
            src="../../src/assets/image/icons/orders.png"
            alt="Orders"
            className="w-8 h-8 transition-all duration-300 ease-in-out"
            style={getIconStyles("/orderHistory")} // Apply filter and scale dynamically
          />
        </Link>

        {/* Socials Icon */}
        <Link
          to="/socials"
          className="text-gray-700 hover:text-blue-500"
          onClick={() => handleIconClick("/socials")}
        >
          <img
            src="../../src/assets/image/icons/socials.png"
            alt="Socials"
            className="w-8 h-8 transition-all duration-300 ease-in-out"
            style={getIconStyles("/socials")} // Apply filter and scale dynamically
          />
        </Link>
      </div>
    </div>
  );
};

export default FooterNav;
