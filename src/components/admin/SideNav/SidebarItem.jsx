import React from 'react';

// Sidebar item component
const SidebarItem = ({ icon, label, destination, badge }) => (
  <li>
    <a
      href={destination}
      className="flex items-center p-2 text-gray-900 
                rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
    >
      {icon && (
        <img
          className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
          aria-hidden="true"
          src={icon}
          fill="currentColor"
          viewBox="0 0 22 21"
        >
        </img>
      )}
      <span className="ms-3">{label}</span>
      {badge && (
        <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
          {badge}
        </span>
      )}
    </a>
  </li>
);

export default SidebarItem;