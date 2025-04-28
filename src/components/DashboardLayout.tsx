
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

const DashboardLayout = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    'education': false,
    'family': false
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
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

  const SidebarContent = () => (
    <nav className="px-4 py-6 space-y-6">
      <div>
        <NavItem 
          icon={<Home size={18} />} 
          label="Home" 
          href="/" 
          isActive={location.pathname === '/'} 
        />
        
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
      {!isMobile && (
        <aside className="fixed left-0 top-0 h-full w-64 bg-[#101521] border-r border-[#242A38] shadow-xl z-20">
          <div className="flex items-center justify-center h-16 border-b border-[#242A38] px-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-[#007BFF] flex items-center justify-center">
                <span className="font-bold text-white text-lg">B</span>
              </div>
              <span className="font-bold text-xl text-white">Family Office</span>
            </Link>
          </div>
          
          <SidebarContent />
        </aside>
      )}
      
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-[80%] max-w-[300px] bg-[#101521] border-r border-[#242A38]">
            <div className="flex items-center justify-center h-16 border-b border-[#242A38] px-4">
              <Link to="/" className="flex items-center space-x-2" onClick={() => setSidebarOpen(false)}>
                <div className="h-8 w-8 rounded-full bg-[#007BFF] flex items-center justify-center">
                  <span className="font-bold text-white text-lg">B</span>
                </div>
                <span className="font-bold text-xl text-white">Family Office</span>
              </Link>
              <button 
                className="ml-auto text-[#E5E5E5] hover:text-white transition-colors duration-200"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            
            <SidebarContent />
          </SheetContent>
        </Sheet>
      )}
      
      <div className={`flex-1 ${!isMobile ? 'ml-64' : 'ml-0'}`}>
        <header className="sticky top-0 z-10 h-16 border-b border-[#2d3748] bg-[#1F2937] px-6 flex items-center justify-between">
          {isMobile && (
            <button 
              className="mr-4 p-1 text-white hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#4299e1]"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
          )}
          
          <h1 className="text-xl font-semibold text-white">
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
            <span className="text-sm text-white hidden sm:block">John Doe</span>
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback className="bg-[#4299e1] text-white">JD</AvatarFallback>
            </Avatar>
          </div>
        </header>
        
        <main className="p-4 sm:p-6 bg-[#101521] min-h-[calc(100vh-64px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
