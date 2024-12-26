import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import useLocation to get the current path
import { useAuth } from './AuthContext';

// Import icons from Heroicons
import { HeartIcon, ShoppingCartIcon, UserIcon, ArrowLeftEndOnRectangleIcon, ArrowLeftIcon } from '@heroicons/react/16/solid';

const Navbar = ({ title }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current pathname

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleBack = () => {
    // Check if the current path is not the home page
    if (location.pathname !== '/') {
      navigate(-1); // Navigate to the previous page
    }
  };

  const loggedInMenuItems = [
    { icon: <HeartIcon className="w-5 h-5 mr-3 text-red-500" />, text: 'Favorites', link: '/favorites' },
    { icon: <ShoppingCartIcon className="w-5 h-5 mr-3 text-green-500" />, text: 'My Cart', link: '/cart' },
    {
      icon: <ArrowLeftEndOnRectangleIcon className="w-5 h-5 mr-3 text-gray-500" />,
      text: 'Logout',
      action: () => logout()
    }
  ];

  const loggedOutMenuItem = [
    {
      icon: <UserIcon className="w-5 h-5 mr-3 text-blue-500" />,
      text: 'Login',
      link: '/signin'
    }
  ];

  return (
    <div className='w-full'>
      <div className="w-full relative top-0 left-0 right-0  shadow-md z-50">
        <nav className="flex items-center justify-between py-2 bg-palette-mimi-pink-1">
          <div className="flex w-full items-center justify-between px-3">
            <Link to="/" className="flex items-center text-neutral-900 dark:text-neutral-200">
              <div className="text-center">
                <img
                  src="../../src/assets/image/icons/blushe.png"
                  style={{ height: '30px' }}
                  alt="App Logo"
                  loading="lazy"
                />
              </div>
            </Link>
            <div className="relative">
              <button onClick={toggleMenu} className="flex items-center">
                <img
                  src="../../src/assets/image/icons/user.png"
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </button>
              <ul
                className={`absolute z-10 right-0 mt-2 w-48 bg-palette-white shadow-lg rounded-md transition-all duration-500 ease-out ${
                  isMenuOpen ? 'animate-translate-y delay-500' : 'hidden'
                }`}
              >
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
        <div className="w-full bg-palette-white shadow-md py-2">
          <div className="flex items-center justify-center px-3">
            <button
              onClick={handleBack}
              className={`absolute left-3 flex items-center text-gray-700 hover:text-blue-500 transition-all duration-300 ${
                location.pathname === '/' ? 'cursor-not-allowed opacity-50' : ''
              }`}
              disabled={location.pathname === '/'} // Disable button if on the home page
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
            </button>
            <div className="w-full flex items-center justify-center text-xl font-semibold text-gray-700">
              {title}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
