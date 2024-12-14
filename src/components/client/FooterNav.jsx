import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Assuming you're using React Router for navigation

// Import Heroicons (Solid icons in this case)
import { HomeIcon, ShoppingCartIcon, UserGroupIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/solid';

const FooterNav = () => {
  const location = useLocation(); // Get the current route
  const [selectedIcon, setSelectedIcon] = useState(location.pathname); // Track the active icon

  // Array of menu items (icons and paths)
  const menuItems = [
    { path: '/', icon: <HomeIcon className="w-6 h-6" />, alt: 'Home' },
    { path: '/cart', icon: <ShoppingCartIcon className="w-6 h-6" />, alt: 'Cart' },
    { path: '/orderHistory', icon: <ClipboardDocumentListIcon className="w-6 h-6" />, alt: 'Orders' },
    { path: '/socials', icon: <UserGroupIcon className="w-6 h-6" />, alt: 'Socials' },
  ];

  // Function to handle icon click and update the active icon state
  const handleIconClick = (path) => {
    setSelectedIcon(path);
  };

  // Helper function to determine background color, scale, and border styles based on selected icon
  const getIconStyles = (path) => {
    return {
      transform: selectedIcon === path ? 'scale(1.1)' : 'scale(1)', // Apply size change
      boxShadow: selectedIcon === path ? '0 0 10px rgba(255, 255, 255, 0.8)' : 'none', // Glowing effect on active icon
      color: selectedIcon === path ? '#FBD3DA' : 'black', // Change icon color to white when active
    };
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10">
      <div className="flex justify-around items-center bg-palette-white shadow-top">
        {/* Dynamically Render Menu Items */}
        {menuItems.map((item) => (
          <Link
            to={item.path}
            key={item.path}
            className="text-gray-700 hover:text-blue-500"
            onClick={() => handleIconClick(item.path)}
          >
            <div
              className=
                {`
                  transition-all duration-300 ease-in-out text-palette-complement hover:text-palette-white
                  ${selectedIcon === item.path ? 'shadow-lg text-white' : ''} 
                  rounded-full p-2
                `}
              style={getIconStyles(item.path)} // Apply background color, scale, border, and box-shadow dynamically
            >
              {item.icon}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FooterNav;
