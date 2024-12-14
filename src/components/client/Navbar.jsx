import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Import icons from Heroicons
import { HeartIcon, ShoppingCartIcon, UserIcon, ArrowLeftEndOnRectangleIcon } from '@heroicons/react/16/solid';

const Navbar = () => {
  // State to manage the dropdown visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle the dropdown
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Dynamic menu items array
  const menuItems = [
    { icon: <HeartIcon className="w-5 h-5 mr-3 text-red-500" />, text: 'Favorites', link: '/favorites' },
    { icon: <ShoppingCartIcon className="w-5 h-5 mr-3 text-green-500" />, text: 'My Cart', link: '/cart' },
    { icon: <UserIcon className="w-5 h-5 mr-3 text-blue-500" />, text: 'Profile', link: '/profile' },
    {
      icon: <ArrowLeftEndOnRectangleIcon className="w-5 h-5 mr-3 text-gray-500" />,
      text: 'Logout',
      action: () => alert('Logged out!') // Replace with actual logout functionality
    }
  ];

  return (
    <div className="fixed top-0 left-0 right-0 bg-palette-mimi-pink-1 shadow-md py-1 z-50 bg-pale-peach">
      <nav className="flex items-center justify-between py-2">
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
              className={`absolute z-{10} right-0 mt-2 w-48 bg-palette-white shadow-lg rounded-md transition-all duration-500 ease-out ${
                isMenuOpen ? 'animate-translate-y delay-500' : 'hidden'
              }`}
            >
              {/* Dynamic Menu Items */}
              {menuItems.map((item, index) => (
                <li
                  key={index}
                  className={`dropdown_item py-2 px-4 text-gray-700 hover:bg-palette-mimi-pink-3 hover:text-white transition-all duration-500 ease-out ${
                    isMenuOpen ? `animate-translate-y delay-${index * 100}` : 'animate-translate-y-reverse'
                  }`}
                >
                  {item.link ? (
                    <Link
                      to={item.link}
                      className="flex items-center text-gray-700"
                    >
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
    </div>
  );
};

export default Navbar;
