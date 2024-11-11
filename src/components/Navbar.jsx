import React from 'react';
import { Link } from 'react-router-dom'; // We will use Link for navigation

const Navbar = ({ title }) => {
  return (
    <nav className="flex items-center justify-between bg-zinc-50 py-2 shadow-dark-mild dark:bg-neutral-700">
      <div className="flex w-full items-center justify-between px-3">
        {/* App logo on the left */}
        <Link to="/" className="flex items-center text-neutral-900 dark:text-neutral-200">
          <img
            src="https://tecdn.b-cdn.net/img/logo/te-transparent-noshadows.webp"
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
  );
};

export default Navbar;
