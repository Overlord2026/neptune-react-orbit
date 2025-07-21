
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
      id: 'roth-conversion',
      title: 'Roth Conversion Planner',
      description: 'Analyze the tax implications of converting traditional IRA funds to Roth IRA.',
      icon: <BarChart3 className="h-6 w-6" />,
      link: '/tax-planning/roth-conversion',
      comingSoon: false
    },
    {
      id: 'compare-roth-scenarios',
      title: 'Compare Roth Scenarios',
      description: 'Compare different Roth conversion strategies side-by-side.',
      icon: <TrendingUp className="h-6 w-6" />,
      link: '/tax-planning/compare-roth-scenarios',
      comingSoon: false
    },
    {
      id: 'tax-traps',
      title: 'Tax Trap Checker',
      description: 'Identify potential tax thresholds that could impact your liability.',
      icon: <AlertTriangle className="h-6 w-6" />,
      link: '/tax-planning/tax-traps',
      comingSoon: false
    },
    {
      id: 'threshold-calculator',
      title: 'Tax Threshold Calculator',
      description: 'Calculate your tax thresholds and plan ahead to minimize burden.',
      icon: <Calculator className="h-6 w-6" />,
      link: '/tax-planning/threshold-calculator',
      comingSoon: false
    },
    {
      id: 'tax-analyzer',
      title: 'Return Analyzer',
      description: 'Analyze your tax return and identify optimization opportunities.',
      icon: <FileCheck className="h-6 w-6" />,
      link: '/tax-planning/analyzer',
      comingSoon: false
    },
    {
      id: 'bracket-manager',
      title: 'Bracket Manager',
      description: 'Manage and optimize your tax bracket positioning.',
      icon: <Shield className="h-6 w-6" />,
      link: '/tax-planning/bracket-manager',
      comingSoon: false
    },
    {
      id: 'social-security',
      title: 'Social Security Optimizer',
      description: 'Optimize your Social Security claiming strategy.',
      icon: <Banknote className="h-6 w-6" />,
      link: '/tax-planning/social-security',
      comingSoon: false
    },
    {
      id: 'estate-gifting',
      title: 'Estate & Gifting',
      description: 'Plan your estate and gifting strategies for tax efficiency.',
      icon: <Gift className="h-6 w-6" />,
      link: '/tax-planning/estate-gifting',
      comingSoon: false
    },
    {
      id: 'charitable-planning',
      title: 'Charitable Planning',
      description: 'Maximize tax benefits through strategic charitable giving.',
      icon: <HandCoins className="h-6 w-6" />,
      link: '/tax-planning/charitable-planning',
      comingSoon: false
    },
    {
      id: 'small-business',
      title: 'Small Business Tools',
      description: 'Tax planning tools specifically for small business owners.',
      icon: <Briefcase className="h-6 w-6" />,
      link: '/tax-planning/small-business',
      comingSoon: false
    },
    {
      id: 'deferred-comp',
      title: 'Deferred Comp & Stock Options',
      description: 'Optimize deferred compensation and stock option strategies.',
      icon: <BarChart className="h-6 w-6" />,
      link: '/tax-planning/deferred-comp',
      comingSoon: false
    },
    {
      id: 'file-my-taxes',
      title: 'File My Taxes',
      description: 'Complete your tax return with our step-by-step process.',
      icon: <FileCheck className="h-6 w-6" />,
      link: '/file-my-taxes',
      comingSoon: false
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tools.map((tool, index) => (
        <TaxToolCard
          key={index}
          id={tool.id}
          title={tool.title}
          description={tool.description}
          icon={tool.icon}
          link={tool.link}
          comingSoon={tool.comingSoon}
        />
      ))}
    </div>
  );
};

export default TaxTools;
