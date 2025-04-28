
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SidebarHeaderProps {
  toggleSidebar: () => void;
  isMobile: boolean;
}

const SidebarHeader = ({ toggleSidebar, isMobile }: SidebarHeaderProps) => {
  return (
    <div className="flex h-16 items-center border-b border-[#2d3748] px-4 bg-[#0b1120]">
      <h2 className="text-lg font-semibold text-white flex items-center">
        <span className="text-[#f6ad55] mr-2">•</span>
        Navigation
      </h2>
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="ml-auto text-white hover:bg-[#1a202c]"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close sidebar</span>
        </Button>
      )}
    </div>
  );
};

export default SidebarHeader;
