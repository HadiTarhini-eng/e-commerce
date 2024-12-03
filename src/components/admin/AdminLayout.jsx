import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/admin/SideNav/AdminNavbar';
import Sidebar from '../../components/admin/SideNav/Sidebar';
import { fetchNavbarData, fetchSidebarData } from '../../api/adminApi';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarData, setSidebarData] = useState(null);
  const [navbarData, setNavbarData] = useState(null);

  // Fetch Navbar Data
  useEffect(() => {
    const fetchNavData = async () => {
      try {
        const navbarResponse = await fetchNavbarData();
        setNavbarData(navbarResponse);
      } catch (error) {
        console.error('Error fetching navbar data:', error);
      }
    };

    fetchNavData();
  }, []);

  // Fetch Sidebar Data
  useEffect(() => {
    const fetchSideData = async () => {
      try {
        const sidebarResponse = await fetchSidebarData();
        setSidebarData(sidebarResponse);
      } catch (error) {
        console.error('Error fetching sidebar data:', error);
      }
    };

    fetchSideData();
  }, []);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div>
      {/* Toaster Notification */}
      <Toaster />
      
      {/* Navbar */}
      {navbarData && (
        <AdminNavbar
          logo={navbarData.logo}
          navItems={navbarData.navItems}
          onToggleSidebar={handleToggleSidebar}
        />
      )}

      {/* Sidebar */}
      {sidebarData && (
        <Sidebar menuItems={sidebarData} isSidebarOpen={isSidebarOpen} />
      )}

      {/* Main Content */}
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
