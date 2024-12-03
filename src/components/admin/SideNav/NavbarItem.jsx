import React from 'react';

// Navbar item component
const NavbarItem = ({ label, icon, destination, onClick }) => (
    <a
      href={destination}
      onClick={onClick}
      className="flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
    >
      <span className="sr-only">Open sidebar</span>
      {icon && (
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={icon} />
        </svg>
      )}
    </a>
  );

export default NavbarItem;