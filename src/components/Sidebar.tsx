import React from 'react';
import { Link } from 'react-router-dom';
import SidebarHeader from './sidebar/SidebarHeader';

export interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, isMobile }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={`bg-[#1A1F2C] text-white z-50 ${isMobile ? 'fixed inset-y-0 left-0 w-64' : 'w-64'}`}>
      <div className="h-full flex flex-col">
        <SidebarHeader toggleSidebar={toggleSidebar} isMobile={isMobile} />
        <div className="flex-1 overflow-y-auto py-2">
          <nav className="px-4 space-y-1">
            {/* Navigation items */}
            <Link to="/" className="block py-2 px-4 rounded hover:bg-[#242A38] transition-colors">
              Dashboard
            </Link>
            <Link to="/tax-planning" className="block py-2 px-4 rounded hover:bg-[#242A38] transition-colors">
              Tax Planning
            </Link>
            <Link to="/tax-filing" className="block py-2 px-4 rounded hover:bg-[#242A38] transition-colors">
              Tax Filing
            </Link>
            {/* More navigation items */}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
