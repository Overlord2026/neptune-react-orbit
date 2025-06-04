
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, 
  FileCheck, 
  BarChart3, 
  Shield, 
  AlertTriangle,
  Banknote,
  Gift,
  HandCoins,
  Briefcase,
  BarChart,
  TrendingUp
} from 'lucide-react';
import TaxToolCard from './TaxToolCard';

const TaxTools = () => {
  const tools = [
    {
      title: 'Roth Conversion Planner',
      description: 'Analyze the tax implications of converting traditional IRA funds to Roth IRA.',
      icon: <BarChart3 className="h-6 w-6" />,
      href: '/tax-planning/roth-conversion',
      color: 'bg-blue-500'
    },
    {
      title: 'Compare Roth Scenarios',
      description: 'Compare different Roth conversion strategies side-by-side.',
      icon: <TrendingUp className="h-6 w-6" />,
      href: '/tax-planning/compare-roth-scenarios',
      color: 'bg-purple-500'
    },
    {
      title: 'Tax Trap Checker',
      description: 'Identify potential tax thresholds that could impact your liability.',
      icon: <AlertTriangle className="h-6 w-6" />,
      href: '/tax-planning/tax-traps',
      color: 'bg-red-500'
    },
    {
      title: 'Tax Threshold Calculator',
      description: 'Calculate your tax thresholds and plan ahead to minimize burden.',
      icon: <Calculator className="h-6 w-6" />,
      href: '/tax-planning/threshold-calculator',
      color: 'bg-green-500'
    },
    {
      title: 'Return Analyzer',
      description: 'Analyze your tax return and identify optimization opportunities.',
      icon: <FileCheck className="h-6 w-6" />,
      href: '/tax-planning/analyzer',
      color: 'bg-orange-500'
    },
    {
      title: 'Bracket Manager',
      description: 'Manage and optimize your tax bracket positioning.',
      icon: <Shield className="h-6 w-6" />,
      href: '/tax-planning/bracket-manager',
      color: 'bg-indigo-500'
    },
    {
      title: 'Social Security Optimizer',
      description: 'Optimize your Social Security claiming strategy.',
      icon: <Banknote className="h-6 w-6" />,
      href: '/tax-planning/social-security',
      color: 'bg-teal-500'
    },
    {
      title: 'Estate & Gifting',
      description: 'Plan your estate and gifting strategies for tax efficiency.',
      icon: <Gift className="h-6 w-6" />,
      href: '/tax-planning/estate-gifting',
      color: 'bg-pink-500'
    },
    {
      title: 'Charitable Planning',
      description: 'Maximize tax benefits through strategic charitable giving.',
      icon: <HandCoins className="h-6 w-6" />,
      href: '/tax-planning/charitable-planning',
      color: 'bg-cyan-500'
    },
    {
      title: 'Small Business Tools',
      description: 'Tax planning tools specifically for small business owners.',
      icon: <Briefcase className="h-6 w-6" />,
      href: '/tax-planning/small-business',
      color: 'bg-amber-500'
    },
    {
      title: 'Deferred Comp & Stock Options',
      description: 'Optimize deferred compensation and stock option strategies.',
      icon: <BarChart className="h-6 w-6" />,
      href: '/tax-planning/deferred-comp',
      color: 'bg-violet-500'
    },
    {
      title: 'File My Taxes',
      description: 'Complete your tax return with our step-by-step process.',
      icon: <FileCheck className="h-6 w-6" />,
      href: '/file-my-taxes',
      color: 'bg-emerald-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tools.map((tool, index) => (
        <Link key={index} to={tool.href} className="block group">
          <TaxToolCard
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            color={tool.color}
          />
        </Link>
      ))}
    </div>
  );
};

export default TaxTools;
