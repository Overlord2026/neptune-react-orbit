
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Button } from '@/components/ui/button';
import { User, Bell, Settings, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

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
        
        <div className="flex items-center gap-2">
          <Link to="/settings">
            <Button variant="ghost" size="icon" className="relative text-[#E5E5E5]">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
