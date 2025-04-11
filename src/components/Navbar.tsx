
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface NavbarProps {
  toggleSidebar: () => void;
  isMobile: boolean;
}

const Navbar = ({ toggleSidebar, isMobile }: NavbarProps) => {
  return (
    <header className="sticky top-16 z-30 w-full border-b border-[#242A38] bg-[#101521]/95 backdrop-blur supports-[backdrop-filter]:bg-[#101521]/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2 text-[#E5E5E5]">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          )}
        </div>
        
        <div className="flex-1" />
      </div>
    </header>
  );
};

export default Navbar;
