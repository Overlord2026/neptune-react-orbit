
import React from 'react';
import { cn } from '@/lib/utils';
import SidebarHeader from './sidebar/SidebarHeader';
import SidebarContent from './sidebar/SidebarContent';

interface AppSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
}

const AppSidebar = ({ isOpen, toggleSidebar, isMobile }: AppSidebarProps) => {
  // If the sidebar is not open, return null
  if (!isOpen && !isMobile) return null;
  
  // If the sidebar is not open and on mobile, also return null
  if (!isOpen && isMobile) return null;
  
  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-[#242A38] bg-[#101521] pt-16 mt-16 transition-transform duration-300 ease-in-out",
      isMobile && !isOpen && "-translate-x-full",
      isMobile && isOpen && "translate-x-0"
    )}>
      <SidebarHeader toggleSidebar={toggleSidebar} isMobile={isMobile} />
      <SidebarContent />
    </div>
  );
};

export default AppSidebar;
