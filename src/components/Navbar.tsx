
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
    <header className="sticky top-0 z-30 w-full border-b border-[#242A38] bg-[#101521]/95 backdrop-blur supports-[backdrop-filter]:bg-[#101521]/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2 text-[#E5E5E5]">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          )}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-[#007BFF] flex items-center justify-center animate-float">
              <span className="font-bold text-white text-lg">N</span>
            </div>
            <span className="font-bold text-xl text-white hidden sm:inline-block">ProjectNeptune</span>
          </Link>
        </div>
        
        <div className="flex-1" />
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-[#E5E5E5]">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-[#1A1F2C] border-[#242A38] text-[#E5E5E5]">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#242A38]" />
              <div className="max-h-80 overflow-y-auto">
                <DropdownMenuItem className="cursor-pointer hover:bg-[#242A38] focus:bg-[#242A38]">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">Project "Mars Landing" was updated</p>
                    <p className="text-xs text-[#B0B0B0]">2 minutes ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-[#242A38] focus:bg-[#242A38]">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">Alex shared "Q2 Planning" with you</p>
                    <p className="text-xs text-[#B0B0B0]">1 hour ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-[#242A38] focus:bg-[#242A38]">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">Deadline approaching: "Space Station"</p>
                    <p className="text-xs text-[#B0B0B0]">Yesterday</p>
                  </div>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-[#E5E5E5]">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#1A1F2C] border-[#242A38] text-[#E5E5E5]">
              <DropdownMenuItem className="hover:bg-[#242A38] focus:bg-[#242A38]">Appearance</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-[#242A38] focus:bg-[#242A38]">Account</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-[#242A38] focus:bg-[#242A38]">Preferences</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="@user" />
                  <AvatarFallback className="bg-[#007BFF] text-white">US</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#1A1F2C] border-[#242A38] text-[#E5E5E5]">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#242A38]" />
              <DropdownMenuItem className="hover:bg-[#242A38] focus:bg-[#242A38]">Profile</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-[#242A38] focus:bg-[#242A38]">Projects</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-[#242A38] focus:bg-[#242A38]">Settings</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#242A38]" />
              <DropdownMenuItem className="hover:bg-[#242A38] focus:bg-[#242A38]">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
