import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
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
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import StationaryBanner from './common/StationaryBanner';

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
          "flex items-center px-3 py-2 rounded-md text-[#9AA0AC] hover:bg-[#242A38] hover:text-[#FFFFFF] group transition-colors duration-200",
          isActive && !hasSubMenu && "bg-[#242A38] text-white border-l-2 border-l-[#007BFF] pl-[10px]"
        )}
      >
        <span className="flex items-center w-full">
          <span className={cn(
            "mr-3 group-hover:text-[#FFFFFF] transition-colors duration-200",
            isActive && "text-white"
          )}>
            {icon}
          </span>
          <span className="flex-1 group-hover:text-[#FFFFFF] transition-colors duration-200">{label}</span>
          {hasSubMenu && (
            <span className="ml-auto group-hover:text-[#FFFFFF] transition-colors duration-200">
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
        "flex items-center pl-9 py-2 text-sm rounded-md text-[#9AA0AC] hover:bg-[#242A38] hover:text-[#FFFFFF] transition-colors duration-200",
        isActive && "bg-[#242A38] text-white border-l-2 border-l-[#007BFF] pl-[34px]"
      )}
    >
      {label}
    </Link>
  );
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    'education': false,
    'family': false,
    'tax': false
  });
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  useEffect(() => {
    // Update menu state based on path
    const path = location.pathname;
    const newOpenMenus = { ...openMenus };
    
    if (path.includes('/tax-planning') || path.includes('/tax-filing')) {
      newOpenMenus.tax = true;
    }
    
    if (path.includes('/investments') || 
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
    
    // Close sidebar on mobile when navigating
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);
  
  const toggleSubmenu = (key: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const SidebarContent = () => (
    <nav className="px-4 py-6 space-y-6">
      <div>
        <NavItem 
          icon={<Home size={18} />} 
          label="Home" 
          href="/" 
          isActive={location.pathname === '/'} 
        />
        
        {/* Added Tax Planning section */}
        <NavItem 
          icon={<FileText size={18} />} 
          label="Tax Planning" 
          href="#" 
          isActive={false} 
          hasSubMenu={true} 
          isOpen={openMenus.tax}
          toggleSubmenu={() => toggleSubmenu('tax')}
        />
        
        {openMenus.tax && (
          <div className="ml-2 mt-1 space-y-1">
            <NavSubItem 
              label="Tax Dashboard" 
              href="/tax-planning" 
              isActive={location.pathname === '/tax-planning'} 
            />
            <NavSubItem 
              label="Tax Filing" 
              href="/tax-filing" 
              isActive={location.pathname === '/tax-filing'} 
            />
            <NavSubItem 
              label="Tax Tools" 
              href="/tax-planning/tax-tools" 
              isActive={location.pathname.includes('/tax-planning/tax-tools')} 
            />
            <NavSubItem 
              label="Roth Conversion" 
              href="/tax-planning/roth" 
              isActive={location.pathname.includes('/tax-planning/roth')} 
            />
          </div>
        )}
        
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
  );

  return (
    <div className="flex min-h-screen">
      {!isMobile && sidebarOpen && (
        <aside className="fixed left-0 top-0 h-full w-64 bg-[#101521] border-r border-[#242A38] shadow-xl z-20 pt-16">
          <SidebarContent />
        </aside>
      )}
      
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-[80%] max-w-[300px] bg-[#101521] border-r border-[#242A38]">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      )}
      
      <div className={`flex-1 ${sidebarOpen && !isMobile ? 'ml-64' : 'ml-0'}`}>
        <StationaryBanner
          title={getPageTitle(location.pathname)}
          showMenu={!sidebarOpen}
          onToggleMenu={toggleSidebar}
          isMobile={isMobile}
        />
        
        <main className="p-4 sm:p-6 bg-[#101521] min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  );
};

// Helper function to get page title from pathname
const getPageTitle = (pathname: string): string => {
  if (pathname === '/') return 'Dashboard';
  
  if (pathname.includes('tax-planning')) return 'Tax Planning';
  if (pathname.includes('tax-filing')) return 'Tax Filing';
  
  // Extract title from pathname
  const segment = pathname.split('/').pop() || '';
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default DashboardLayout;
