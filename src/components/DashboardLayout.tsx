
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { 
  Home, 
  BookOpen, 
  PieChart, 
  FileText, 
  Shield, 
  Banknote, 
  Scroll, 
  Users, 
  FileCheck, 
  BarChart3, 
  Briefcase,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
  hasSubMenu?: boolean;
  isOpen?: boolean;
  toggleSubmenu?: () => void;
}

interface NavSubItemProps {
  label: string;
  href: string;
  isActive: boolean;
}

const NavItem = ({ 
  icon, 
  label, 
  href, 
  isActive, 
  hasSubMenu = false, 
  isOpen = false, 
  toggleSubmenu 
}: NavItemProps) => {
  return (
    <div className="mb-1">
      <Link 
        to={hasSubMenu ? '#' : href}
        onClick={hasSubMenu ? (e) => {
          e.preventDefault();
          toggleSubmenu?.();
        } : undefined}
        className={cn(
          "flex items-center px-3 py-2 rounded-md text-white hover:bg-custom-background-tertiary group transition-colors",
          isActive && !hasSubMenu && "bg-custom-background-tertiary border-l-2 border-l-custom-accent pl-[10px]"
        )}
      >
        <span className="flex items-center w-full">
          <span className={cn(
            "mr-3 text-gray-400 group-hover:text-custom-accent transition-colors",
            isActive && "text-custom-accent"
          )}>
            {icon}
          </span>
          <span className="flex-1">{label}</span>
          {hasSubMenu && (
            <span className="ml-auto">
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
        </span>
      </Link>
    </div>
  );
};

const NavSubItem = ({ label, href, isActive }: NavSubItemProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center pl-9 py-2 text-sm rounded-md text-white hover:bg-custom-background-tertiary transition-colors",
        isActive && "bg-custom-background-tertiary border-l-2 border-l-custom-accent pl-[34px]"
      )}
    >
      {label}
    </Link>
  );
};

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    'education': false,
    'family': false
  });
  
  // Automatically open submenus based on current route
  useEffect(() => {
    const path = location.pathname;
    const newOpenMenus = { ...openMenus };
    
    if (path.includes('/tax-planning') || 
        path.includes('/investments') || 
        path.includes('/insurance') || 
        path.includes('/lending') || 
        path.includes('/estate-planning')) {
      newOpenMenus.education = true;
    }
    
    if (path.includes('/financial-plans') || 
        path.includes('/accounts') || 
        path.includes('/assets')) {
      newOpenMenus.family = true;
    }
    
    setOpenMenus(newOpenMenus);
  }, [location.pathname]);
  
  const toggleSubmenu = (key: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="flex min-h-screen">
      {/* Side Navigation */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#111111] border-r border-gray-800 shadow-xl z-20">
        {/* Logo Area */}
        <div className="flex items-center justify-center h-16 border-b border-gray-800 px-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-neptune-600 flex items-center justify-center">
              <span className="font-bold text-white text-lg">B</span>
            </div>
            <span className="font-bold text-xl text-white">Family Office</span>
          </Link>
        </div>
        
        {/* Nav Items */}
        <nav className="px-4 py-6 space-y-6">
          {/* Main Nav */}
          <div>
            <NavItem 
              icon={<Home size={18} />} 
              label="Home" 
              href="/" 
              isActive={location.pathname === '/'} 
            />
            
            {/* Education & Solutions */}
            <NavItem 
              icon={<BookOpen size={18} />} 
              label="Education & Solutions" 
              href="#" 
              isActive={false} 
              hasSubMenu={true} 
              isOpen={openMenus.education}
              toggleSubmenu={() => toggleSubmenu('education')}
            />
            
            {openMenus.education && (
              <div className="ml-2 mt-1 space-y-1">
                <NavSubItem 
                  label="Investments" 
                  href="/investments" 
                  isActive={location.pathname.includes('/investments')} 
                />
                <NavSubItem 
                  label="Tax Planning" 
                  href="/tax-planning" 
                  isActive={location.pathname.includes('/tax-planning')} 
                />
                <NavSubItem 
                  label="Insurance" 
                  href="/insurance" 
                  isActive={location.pathname.includes('/insurance')} 
                />
                <NavSubItem 
                  label="Lending" 
                  href="/lending" 
                  isActive={location.pathname.includes('/lending')} 
                />
                <NavSubItem 
                  label="Estate Planning" 
                  href="/estate-planning" 
                  isActive={location.pathname.includes('/estate-planning')} 
                />
              </div>
            )}
            
            {/* Family Wealth */}
            <NavItem 
              icon={<Users size={18} />} 
              label="Family Wealth" 
              href="#" 
              isActive={false} 
              hasSubMenu={true}
              isOpen={openMenus.family}
              toggleSubmenu={() => toggleSubmenu('family')}
            />
            
            {openMenus.family && (
              <div className="ml-2 mt-1 space-y-1">
                <NavSubItem 
                  label="Financial Plans" 
                  href="/financial-plans" 
                  isActive={location.pathname.includes('/financial-plans')} 
                />
                <NavSubItem 
                  label="Accounts Overview" 
                  href="/accounts" 
                  isActive={location.pathname.includes('/accounts')} 
                />
                <NavSubItem 
                  label="All Assets" 
                  href="/assets" 
                  isActive={location.pathname.includes('/assets')} 
                />
              </div>
            )}
          </div>
        </nav>
      </aside>
      
      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 h-16 border-b border-gray-800 bg-[#111111] px-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            {location.pathname === '/' 
              ? 'Dashboard' 
              : location.pathname.includes('tax-planning')
                ? 'Tax Planning'
                : location.pathname.split('/').pop()?.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ') || 'Dashboard'
            }
          </h1>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">John Doe</span>
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback className="bg-custom-accent text-black">JD</AvatarFallback>
            </Avatar>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="p-6 bg-[#111111] min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
