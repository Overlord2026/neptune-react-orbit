
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SidebarHeaderProps {
  toggleSidebar: () => void;
  isMobile: boolean;
}

const SidebarHeader = ({ toggleSidebar, isMobile }: SidebarHeaderProps) => {
  return (
    <div className="flex h-16 items-center border-b border-[#242A38] px-4">
      <h2 className="text-lg font-semibold text-white">Navigation</h2>
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="ml-auto text-[#E5E5E5]"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close sidebar</span>
        </Button>
      )}
    </div>
  );
};

export default SidebarHeader;
