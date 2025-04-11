
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home,
  FileText, 
  BookOpen, 
  Calculator, 
  FileCheck,
  ChevronDown,
  ChevronRight,
  X,
  BarChart3,
  Shield,
  Banknote,
  Scroll,
  Briefcase,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
  tooltip?: string;
}

interface SidebarGroupProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
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

const SidebarGroup = ({ title, icon, children, defaultOpen = false }: SidebarGroupProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-2">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-[#E5E5E5] hover:bg-[#242A38]"
          >
            {icon}
            <span className="flex-1 text-left truncate">{title}</span>
            {isOpen ? (
              <ChevronDown className="h-4 w-4 shrink-0 text-[#9AA0AC]" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0 text-[#9AA0AC]" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-4 mt-1">
          {children}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

interface AppSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
}

const AppSidebar = ({ isOpen, toggleSidebar, isMobile }: AppSidebarProps) => {
  const location = useLocation();
  
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
      
      <div className="flex-1 overflow-y-auto p-4">
        <SidebarItem 
          icon={<Home className="h-5 w-5" />} 
          label="Dashboard" 
          href="/" 
          isActive={location.pathname === '/'} 
        />
        
        <SidebarGroup 
          title="Tax Education" 
          icon={<BookOpen className="h-5 w-5" />}
          defaultOpen={location.pathname.includes('/tax-planning/education')}
        >
          <SidebarItem 
            icon={<FileText className="h-5 w-5" />} 
            label="Basic Education" 
            href="/tax-planning/basic-education" 
            isActive={location.pathname === '/tax-planning/basic-education'} 
          />
          <SidebarItem 
            icon={<FileText className="h-5 w-5" />} 
            label="Advanced Education" 
            href="/tax-planning/advanced-tax-education" 
            isActive={location.pathname === '/tax-planning/advanced-tax-education'} 
          />
          <SidebarItem 
            icon={<FileText className="h-5 w-5" />} 
            label="Tax Glossary" 
            href="/tax-planning/glossary" 
            isActive={location.pathname === '/tax-planning/glossary'} 
          />
        </SidebarGroup>
        
        <SidebarGroup 
          title="Tax Tools" 
          icon={<Calculator className="h-5 w-5" />}
          defaultOpen={location.pathname.includes('/tax-planning/')}
        >
          <SidebarItem 
            icon={<FileCheck className="h-5 w-5" />} 
            label="Return Analyzer" 
            href="/tax-planning/analyzer" 
            isActive={location.pathname === '/tax-planning/analyzer'} 
          />
          <SidebarItem 
            icon={<Briefcase className="h-5 w-5" />} 
            label="Tax Document Hub" 
            href="/tax-planning/aggregator" 
            isActive={location.pathname === '/tax-planning/aggregator'} 
          />
          <SidebarItem 
            icon={<BarChart3 className="h-5 w-5" />} 
            label="Roth Conversion" 
            href="/tax-planning/roth-conversion" 
            isActive={location.pathname === '/tax-planning/roth-conversion'} 
          />
          <SidebarItem 
            icon={<Shield className="h-5 w-5" />} 
            label="Bracket Manager" 
            href="/tax-planning/bracket-manager" 
            isActive={location.pathname === '/tax-planning/bracket-manager'} 
          />
          <SidebarItem 
            icon={<Banknote className="h-5 w-5" />} 
            label="Social Security" 
            href="/tax-planning/social-security" 
            isActive={location.pathname === '/tax-planning/social-security'} 
          />
          <SidebarItem 
            icon={<Scroll className="h-5 w-5" />} 
            label="Tax Vault" 
            href="/tax-planning/tax-vault" 
            isActive={location.pathname === '/tax-planning/tax-vault'} 
          />
        </SidebarGroup>

        <SidebarGroup 
          title="Advanced Planning" 
          icon={<BarChart3 className="h-5 w-5" />}
          defaultOpen={location.pathname.includes('/tax-planning/advanced-strategies')}
        >
          <SidebarItem 
            icon={<FileCheck className="h-5 w-5" />} 
            label="Advanced Strategies" 
            href="/tax-planning/advanced-strategies" 
            isActive={location.pathname === '/tax-planning/advanced-strategies'} 
          />
        </SidebarGroup>
        
        <SidebarItem 
          icon={<Settings className="h-5 w-5" />} 
          label="Settings" 
          href="/settings" 
          isActive={location.pathname === '/settings'} 
        />
      </div>
    </div>
  );
};

export default AppSidebar;
