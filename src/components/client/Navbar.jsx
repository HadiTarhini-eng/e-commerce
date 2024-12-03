import React from 'react';
import { Link } from 'react-router-dom'; // We will use Link for navigation

const Navbar = ({ title }) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-md py-3 z-50 bg-pale-peach">
      <nav className="flex items-center justify-between py-2">
        <div className="flex w-full items-center justify-between px-3">
          {/* App logo on the left */}
          <Link to="/" className="flex items-center text-neutral-900 dark:text-neutral-200">
            <img
              src="../../src/assets/image/icons/logo.png"
              style={{ height: '30px' }} // Adjust logo size as needed
              alt="App Logo"
              loading="lazy"
            />
          </Link>

          {/* Title in the center */}
          <div className="flex-grow text-center">
            <h1 className="font-bold text-lg text-neutral-800 dark:text-neutral-200">{title}</h1>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
