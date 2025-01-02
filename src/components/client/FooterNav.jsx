import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // useLocation to track the current path
import { useAuth } from './AuthContext';

// Import Heroicons (Solid icons in this case)
import { HomeIcon, ShoppingCartIcon, UserGroupIcon, ClipboardDocumentListIcon, HeartIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const FooterNav = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation to get the current URL path
  const { isLoggedIn } = useAuth(); // Assuming your context provides isLoggedIn

  // Retrieve the selected icon path from localStorage or fallback to the current path
  const storedSelectedIcon = localStorage.getItem('selectedIcon') || '/';
  const [selectedIcon, setSelectedIcon] = useState(storedSelectedIcon); // Track the active icon

  // Array of menu items (icons and paths)
  const menuItems = [
    { path: '/', icon: <HomeIcon className="w-6 h-6" />, alt: 'Home' },
    { path: '/cart', icon: <ShoppingCartIcon className="w-6 h-6" />, alt: 'Cart' },
    { path: '/favorites', icon: <HeartIcon className="w-6 h-6" />, alt: 'Favorites' },
    { path: '/orderHistory', icon: <ClipboardDocumentListIcon className="w-6 h-6" />, alt: 'Orders' },
    { path: '/socials', icon: <UserGroupIcon className="w-6 h-6" />, alt: 'Socials' },
  ];

  // Function to handle icon click and update the active icon state
  const handleIconClick = (path) => {
    if ((path === '/orderHistory' || path === '/favorites') && !isLoggedIn) {
      toast.error('You need to Login to access this page!');
      navigate('/signin');
    } else {
      setSelectedIcon(path);
      localStorage.setItem('selectedIcon', path); // Save selected icon to localStorage
      navigate(path); // Navigate to the selected path
    }
  };

  // Helper function to determine background color, scale, and border styles based on selected icon
  const getIconStyles = (path) => {
    return {
      transform: selectedIcon === path ? 'scale(1.1)' : 'scale(1)', // Apply size change
      boxShadow: selectedIcon === path ? '0 0 10px rgba(255, 255, 255, 0.8)' : 'none', // Glowing effect on active icon
      color: selectedIcon === path ? '#FBD3DA' : 'black', // Change icon color to white when active
    };
  };

  // Effect to update selected icon when the URL path changes
  useEffect(() => {
    setSelectedIcon(location.pathname); // Update selected icon based on the current path
  }, [location]); // Re-run when the location changes

  return (
    <div className="fixed w-full bottom-0 left-1/2 transform -translate-x-1/2 max-w-[710px] z-10">
      <div className="flex justify-around items-center bg-palette-white shadow-top">
        {/* Dynamically Render Menu Items */}
        {menuItems.map((item) => (
          <div
            key={item.path}
            className="text-gray-700 hover:text-blue-500"
            onClick={() => handleIconClick(item.path)} // Handle icon click for navigation
          >
            <div
              className={`transition-all duration-300 ease-in-out text-palette-complement hover:text-palette-white
                ${selectedIcon === item.path ? 'shadow-lg text-white' : ''} 
                rounded-full p-2`}
              style={getIconStyles(item.path)} // Apply background color, scale, border, and box-shadow dynamically
            >
              {item.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FooterNav;