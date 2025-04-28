
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
            ? "bg-[#2d3748] text-white border-l-2 border-l-[#4299e1]" 
            : "text-[#e2e8f0] hover:bg-[#1a202c] hover:text-white"
        )}
      >
        {icon}
        <span className="truncate">{label}</span>
      </Button>
    </Link>
  );
};

export default SidebarItem;
