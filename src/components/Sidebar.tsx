
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  CalendarDays, 
  FileText, 
  Users, 
  BarChart3, 
  Settings,
  PlusCircle,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
}

const SidebarItem = ({ icon, label, href, isActive }: SidebarItemProps) => {
  return (
    <Link to={href}>
      <Button 
        variant={isActive ? "secondary" : "ghost"} 
        className={cn(
          "w-full justify-start gap-2 transition-all duration-200",
          isActive 
            ? "bg-neptune-100 text-neptune-800 hover:bg-neptune-200 hover:text-neptune-800" 
            : "hover:bg-[#222222] hover:text-[#FFD700]"
        )}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </Link>
  );
};

const Sidebar = ({ isOpen, toggleSidebar, isMobile }: SidebarProps) => {
  const location = useLocation();
  
  // If the sidebar is not open and not on mobile, return null
  if (!isOpen && !isMobile) return null;
  
  // If the sidebar is not open and on mobile, also return null
  if (!isOpen && isMobile) return null;

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-background transition-transform duration-300 ease-in-out",
      isMobile && !isOpen && "-translate-x-full",
      isMobile && isOpen && "translate-x-0"
    )}>
      <div className="flex h-16 items-center border-b px-4">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-neptune-600 flex items-center justify-center">
            <span className="font-bold text-white text-lg">N</span>
          </div>
          <span className="font-bold text-xl">ProjectNeptune</span>
        </Link>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto hover:bg-[#222222] hover:text-[#FFD700]">
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          <SidebarItem 
            icon={<LayoutDashboard className="h-5 w-5" />} 
            label="Dashboard" 
            href="/" 
            isActive={location.pathname === '/'}
          />
          <SidebarItem 
            icon={<CalendarDays className="h-5 w-5" />} 
            label="Calendar" 
            href="/calendar" 
            isActive={location.pathname === '/calendar'}
          />
          <SidebarItem 
            icon={<FileText className="h-5 w-5" />} 
            label="Projects" 
            href="/projects" 
            isActive={location.pathname === '/projects'}
          />
          <SidebarItem 
            icon={<Users className="h-5 w-5" />} 
            label="Team" 
            href="/team" 
            isActive={location.pathname === '/team'}
          />
          <SidebarItem 
            icon={<BarChart3 className="h-5 w-5" />} 
            label="Reports" 
            href="/reports" 
            isActive={location.pathname === '/reports'}
          />
          <SidebarItem 
            icon={<Settings className="h-5 w-5" />} 
            label="Settings" 
            href="/settings" 
            isActive={location.pathname === '/settings'}
          />
        </div>
      </div>
      <div className="border-t p-4">
        <Button className="w-full justify-start gap-2 bg-[#FFD700] text-black hover:bg-[#E5C100] transition-all duration-200 focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2">
          <PlusCircle className="h-5 w-5" />
          <span>New Project</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
