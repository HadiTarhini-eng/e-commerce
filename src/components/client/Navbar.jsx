import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate to handle navigation
import { useAuth } from './AuthContext';

// Import icons from Heroicons
import { HeartIcon, ShoppingCartIcon, UserIcon, ArrowLeftEndOnRectangleIcon, ArrowLeftIcon } from '@heroicons/react/16/solid';

const Navbar = ({ title }) => {
  // State to manage the dropdown visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Get the isLoggedIn and logout function from the context
  const { isLoggedIn, logout } = useAuth();

  // Navigation hook for back button
  const navigate = useNavigate();

  // Function to toggle the dropdown
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Dynamic menu items array for logged-in users
  const loggedInMenuItems = [
    { icon: <HeartIcon className="w-5 h-5 mr-3 text-red-500" />, text: 'Favorites', link: '/favorites' },
    { icon: <ShoppingCartIcon className="w-5 h-5 mr-3 text-green-500" />, text: 'My Cart', link: '/cart' },
    {
      icon: <ArrowLeftEndOnRectangleIcon className="w-5 h-5 mr-3 text-gray-500" />,
      text: 'Logout',
      action: () => logout() // Call logout function from context
    }
  ];

  // Menu item for logged-out users
  const loggedOutMenuItem = [
    {
      icon: <UserIcon className="w-5 h-5 mr-3 text-blue-500" />,
      text: 'Login',
      link: '/signin' // Navigate to the login page
    }
  ];

  // Function to handle back button click
  const handleBack = () => {
    navigate(-1); // This navigates to the previous page in history
  };

  return (
    <div className='w-full'>
      {/* Navbar */}
      <div className="w-full relative top-0 left-0 right-0  shadow-md z-50">
        <nav className="flex items-center justify-between py-2 bg-palette-mimi-pink-1">
          <div className="flex w-full items-center justify-between px-3">
            {/* Left - App Logo */}
            <Link to="/" className="flex items-center text-neutral-900 dark:text-neutral-200">
              <div className="text-center">
                <img
                  src="../../src/assets/image/icons/blushe.png"
                  style={{ height: '30px' }} // Adjust logo size as needed
                  alt="App Logo"
                  loading="lazy"
                />
              </div>
            </Link>

            {/* Right - Avatar with Dropdown Menu */}
            <div className="relative">
              <button onClick={toggleMenu} className="flex items-center">
                <img
                  src="https://randomuser.me/api/portraits/men/42.jpg" // Placeholder avatar URL (replace with actual)
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full object-cover" // Tailwind classes for size, shape, and image cropping
                />
              </button>

              {/* Dropdown Menu */}
              <ul
                className={`absolute z-10 right-0 mt-2 w-48 bg-palette-white shadow-lg rounded-md transition-all duration-500 ease-out ${
                  isMenuOpen ? 'animate-translate-y delay-500' : 'hidden'
                }`}
              >
                {/* Conditionally render menu items based on login status */}
                {(isLoggedIn ? loggedInMenuItems : loggedOutMenuItem).map((item, index) => (
                  <li
                    onClick={toggleMenu}
                    key={index}
                    className={`dropdown_item py-2 px-4 text-gray-700 hover:bg-palette-mimi-pink-3 hover:text-white transition-all duration-500 ease-out ${
                      isMenuOpen
                        ? `animate-translate-y delay-${index * 100}`
                        : 'animate-translate-y-reverse'
                    }`}
                  >
                    {item.link ? (
                      <Link to={item.link} className="flex items-center text-gray-700">
                        {React.cloneElement(item.icon, {
                          className: `w-5 h-5 mr-3 ${item.icon.props.className}`
                        })}
                        {item.text}
                      </Link>
                    ) : (
                      <button
                        onClick={item.action}
                        className="flex items-center w-full text-left text-gray-700"
                      >
                        {React.cloneElement(item.icon, {
                          className: `w-5 h-5 mr-3 ${item.icon.props.className}`
                        })}
                        {item.text}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
        {/* Back Button and Title Bar */}
        <div className="w-full bg-palette-white shadow-md py-2"> {/* mt-14 to make space below navbar */}
          <div className="flex items-center justify-center px-3">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="absolute left-3 flex items-center text-gray-700 hover:text-blue-500 transition-all duration-300"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
            </button>

            {/* Page Title */}
            <div className="w-full flex items-center justify-center text-xl font-semibold text-gray-700">{title}</div> {/* Customize this title dynamically if needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
