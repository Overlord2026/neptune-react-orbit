
import React from 'react';
import { Menu, Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface NavbarProps {
  toggleSidebar: () => void;
  isMobile: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, isMobile }) => {
  return (
    <header className="bg-[#1F2937] border-b border-[#2d3748] sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2 text-white hover:bg-[#374151]">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open sidebar</span>
              </Button>
            )}
            <h1 className="text-xl font-semibold text-white">TaxPlanner</h1>
          </div>
          
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-white opacity-70" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-[#4B5563] rounded-md leading-5 bg-[#374151] placeholder-white/70 text-white focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-white hover:bg-[#374151]">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-[#374151]">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
