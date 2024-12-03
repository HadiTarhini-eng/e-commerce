import React from 'react';
import NavbarItem from './NavbarItem';

// Main Navbar component
const AdminNavbar = ({ logo, navItems, onToggleSidebar }) => {
    return (
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <NavbarItem
                label="Open sidebar"
                icon="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                destination="#"
                onClick={onToggleSidebar}
              />
              <a href={logo.link} className="flex ms-2 md:me-24">
                <img
                  src={logo.image}
                  className="h-8 me-3"
                  alt="Logo"
                />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                  {logo.text}
                </span>
              </a>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                aria-expanded="false"
                data-dropdown-toggle="dropdown-user"
              >
                <img
                  className="w-8 h-8 rounded-full"
                  src={logo.userImage}
                  alt="user photo"
                />
              </button>
              {/* Add dropdown user menu here */}
            </div>
          </div>
        </div>
      </nav>
    );
  };

export default AdminNavbar;