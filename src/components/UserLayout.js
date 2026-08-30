import React, { useState, useCallback } from 'react';
import DashboardNavbar from './DashboardNavbar';
import UserSidebar from './UserSidebar';

const UserLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <DashboardNavbar onMenuClick={handleMenuClick} />

      {/* Main Layout: Sidebar + Content */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <UserSidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

        {/* Main Content Area */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] lg:ml-0">
          <div className="p-6 h-full flex flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default React.memo(UserLayout);
