
import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar';
import AppSidebar from './AppSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer, DrawerContent, DrawerOverlay } from './ui/drawer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, HelpCircle } from 'lucide-react';

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
    <div className="flex min-h-screen flex-col bg-[#101521]">
      {/* Top Banner Header with new BFO logo */}
      <header className="fixed top-0 left-0 right-0 h-16 flex items-center justify-center bg-[#1A1F2C] border-b border-[#242A38] z-40">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/8d0700d2-7780-4f2b-8b44-e97d71c4e3d9.png" 
            alt="Boutique Family Office Logo" 
            className="h-8" 
          />
        </Link>
      </header>
      
      {/* Main Navbar - now positioned below the top banner */}
      <Navbar toggleSidebar={toggleSidebar} isMobile={isMobile} />
      
      <div className="flex flex-1 pt-16"> {/* Added padding-top to accommodate the fixed header */}
        {isMobile ? (
          <Drawer open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <DrawerOverlay />
            <DrawerContent className="p-0 max-w-[80%]">
              <AppSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />
            </DrawerContent>
          </Drawer>
        ) : (
          <AppSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />
        )}
        <main className={`flex-1 transition-all duration-300 bg-[#101521] ${sidebarOpen && !isMobile ? 'ml-64' : 'ml-0'}`}>
          <div className="container p-4 md:p-6 mt-16">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
