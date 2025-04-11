
import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer, DrawerContent, DrawerTrigger, DrawerOverlay } from './ui/drawer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, HelpCircle } from 'lucide-react';
import logo from '@/assets/images/logo.png';

const Layout = () => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Update sidebar state when screen size changes
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Banner Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#1A1F2C] border-b border-[#242A38] z-40 px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="BFO Logo" className="h-8" />
          <span className="font-bold text-xl text-white ml-3 hidden md:inline">Family Office</span>
        </Link>
        
        <div className="flex items-center gap-3">
          <button className="text-[#9AA0AC] hover:text-white transition-colors">
            <Bell size={20} />
          </button>
          <button className="text-[#9AA0AC] hover:text-white transition-colors">
            <HelpCircle size={20} />
          </button>
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback className="bg-[#007BFF] text-white">JD</AvatarFallback>
          </Avatar>
        </div>
      </header>
      
      {/* Main Navbar - now positioned below the top banner */}
      <Navbar toggleSidebar={toggleSidebar} isMobile={isMobile} />
      
      <div className="flex flex-1 mt-16"> {/* Added margin-top to accommodate the fixed header */}
        {isMobile ? (
          <Drawer open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <DrawerOverlay />
            <DrawerContent className="p-0 max-w-[80%]">
              <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />
            </DrawerContent>
          </Drawer>
        ) : (
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />
        )}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen && !isMobile ? 'ml-64' : 'ml-0'}`}>
          <div className="container p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
