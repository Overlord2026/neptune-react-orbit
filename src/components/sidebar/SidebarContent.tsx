
import React from 'react';
import { useLocation } from 'react-router-dom';
import SidebarItem from './SidebarItem';
import SidebarGroup from './SidebarGroup';
import { 
  Home,
  FileText, 
  BookOpen, 
  Calculator, 
  FileCheck,
  BarChart3,
  Shield,
  Banknote,
  Scroll,
  Briefcase,
  Settings,
  AlertTriangle,
  LayoutGrid,
  Gift,
  HandCoins,
  BarChart
} from 'lucide-react';

const SidebarContent = () => {
  const location = useLocation();
  
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <SidebarItem 
        icon={<Home className="h-5 w-5" />} 
        label="Dashboard" 
        href="/" 
        isActive={location.pathname === '/'} 
      />
      
      <SidebarItem 
        icon={<LayoutGrid className="h-5 w-5" />} 
        label="Tax Tools" 
        href="/tax-planning/tax-tools" 
        isActive={location.pathname === '/tax-planning/tax-tools'} 
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
          label="Roth Conversion Planner" 
          href="/tax-planning/roth" 
          isActive={location.pathname === '/tax-planning/roth'} 
        />
        <SidebarItem 
          icon={<Gift className="h-5 w-5" />} 
          label="Estate & Gifting" 
          href="/tax-planning/estate-gifting" 
          isActive={location.pathname === '/tax-planning/estate-gifting'} 
        />
        <SidebarItem 
          icon={<HandCoins className="h-5 w-5" />} 
          label="Charitable Planning" 
          href="/tax-planning/charitable-planning" 
          isActive={location.pathname === '/tax-planning/charitable-planning'} 
        />
        <SidebarItem 
          icon={<Briefcase className="h-5 w-5" />} 
          label="Small Business" 
          href="/tax-planning/small-business" 
          isActive={location.pathname === '/tax-planning/small-business'} 
        />
        <SidebarItem 
          icon={<BarChart className="h-5 w-5" />} 
          label="Deferred Comp & Stock Options" 
          href="/tax-planning/deferred-comp" 
          isActive={location.pathname === '/tax-planning/deferred-comp'} 
        />
        <SidebarItem 
          icon={<Shield className="h-5 w-5" />} 
          label="Bracket Manager" 
          href="/tax-planning/bracket-manager" 
          isActive={location.pathname === '/tax-planning/bracket-manager'} 
        />
        <SidebarItem 
          icon={<AlertTriangle className="h-5 w-5" />} 
          label="Tax Trap Checker" 
          href="/tax-planning/tax-traps" 
          isActive={location.pathname === '/tax-planning/tax-traps'} 
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
  );
};

export default SidebarContent;
