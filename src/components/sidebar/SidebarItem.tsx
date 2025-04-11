
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
  tooltip?: string;
}

const SidebarItem = ({ icon, label, href, isActive }: SidebarItemProps) => {
  return (
    <Link to={href} className="block mb-1">
      <Button 
        variant="ghost" 
        className={cn(
          "w-full justify-start gap-2 transition-all duration-200",
          isActive 
            ? "bg-[#242A38] text-[#FFFFFF] border-l-2 border-l-[#00C47C]" 
            : "text-[#9AA0AC] hover:bg-[#242A38] hover:text-[#FFFFFF]"
        )}
      >
        {icon}
        <span className="truncate">{label}</span>
      </Button>
    </Link>
  );
};

export default SidebarItem;
