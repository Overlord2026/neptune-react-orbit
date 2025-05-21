
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface StationaryBannerProps {
  title?: string;
  showMenu?: boolean;
  onToggleMenu?: () => void;
  isMobile?: boolean;
  userName?: string;
  userInitials?: string;
  userAvatar?: string;
}

/**
 * StationaryBanner component that provides a consistent header across applications
 */
const StationaryBanner: React.FC<StationaryBannerProps> = ({
  title = 'Family Office',
  showMenu = true,
  onToggleMenu,
  isMobile = false,
  userName = 'John Doe',
  userInitials = 'JD',
  userAvatar = '',
}) => {
  return (
    <header className="sticky top-0 z-10 h-16 border-b border-[#202a42] bg-[#111827] px-6 flex items-center justify-between backdrop-blur-sm shadow-md">
      {isMobile && showMenu && (
        <button
          className="mr-4 p-1 text-white hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
          onClick={onToggleMenu}
        >
          <Menu size={20} />
        </button>
      )}

      {!showMenu && isMobile && (
        <button
          className="mr-4 p-1 text-white hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
          onClick={onToggleMenu}
        >
          <X size={20} />
        </button>
      )}

      <div className="flex items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-[#3b82f6] flex items-center justify-center shadow-md">
            <span className="font-bold text-white text-lg">B</span>
          </div>
          <span className="font-bold text-xl text-white">{title}</span>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-sm text-white hidden sm:block">{userName}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="focus:outline-none focus:ring-2 focus:ring-[#3b82f6] rounded-full">
              <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-[#3b82f6]/30">
                <AvatarImage src={userAvatar} />
                <AvatarFallback className="bg-[#3b82f6] text-white">{userInitials}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 border-[#202a42] bg-[#141c2e] text-white">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#202a42]" />
            <DropdownMenuItem className="hover:bg-[#202a42] cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-[#202a42] cursor-pointer">Settings</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#202a42]" />
            <DropdownMenuItem className="hover:bg-[#202a42] cursor-pointer">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default StationaryBanner;
