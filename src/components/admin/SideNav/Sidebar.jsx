import React from 'react';
import SidebarItem from './SidebarItem';

const Sidebar = ({ menuItems, isSidebarOpen }) => {

  return (
    <aside
      id="logo-sidebar"
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 
                  transition-transform -translate-x-full bg-palette-body-3 border-r border-gray-200 
                  sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700 
                  ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-palette-body-3 dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          {menuItems?.map((item) => (
            <SidebarItem key={item.label} {...item} />
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
