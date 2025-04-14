
import React from 'react';
import { 
  FileText, 
  FolderSearch, 
  Banknote, 
  LineChart, 
  HeartHandshake, 
  BarChart2, 
  Lock, 
  AlertTriangle,
  FileCheck,
  Gift,
  HandCoins,
  BarChart,
  Briefcase,
  Vault
} from "lucide-react";
import TaxToolCard from './TaxToolCard';

const TaxTools: React.FC = () => {
  const tools = [
    {
      id: "roth-conversion",
      title: "Roth Conversion & Multi-Year Planner",
      icon: <Banknote className="w-10 h-10 text-[#FFD700]" />,
      description: "Plan single-year or long-term Roth conversion strategies. Model RMDs, bracket filling, and tax implications.",
      comingSoon: false,
      link: "/tax-planning/roth"
    },
    {
      id: "tax-vault",
      title: "Tax Vault & Documents",
      icon: <Lock className="w-10 h-10 text-[#FFD700]" />,
      description: "Securely store your tax documents and share them with your accountant, advisors, or family members.",
      comingSoon: false,
      link: "/tax-planning/aggregator",
      documentCount: 8,
      lastUpdated: "Apr 2, 2025"
    },
    {
      id: "estate-gifting",
      title: "Estate & Gifting Scenarios",
      icon: <Gift className="w-10 h-10 text-[#FFD700]" />,
      description: "Analyze the impact of gifting during your lifetime vs. leaving assets at death, including potential estate tax calculations and trust planning considerations.",
      comingSoon: false,
      link: "/tax-planning/estate-gifting"
    },
    {
      id: "charitable-planning",
      title: "Charitable Contribution Planning",
      icon: <HandCoins className="w-10 h-10 text-[#FFD700]" />,
      description: "Evaluate how donor-advised funds, QCDs, and other giving strategies can reduce your taxable income and enhance your philanthropic impact.",
      comingSoon: false,
      link: "/tax-planning/charitable-planning"
    },
    {
      id: "small-business",
      title: "Small Business & Side-Hustle",
      icon: <Briefcase className="w-10 h-10 text-[#FFD700]" />,
      description: "Estimate self-employment taxes, explore pass-through deductions, and see how side income affects your overall tax plan.",
      comingSoon: false,
      link: "/tax-planning/small-business"
    },
    {
      id: "deferred-comp",
      title: "Deferred Comp & Stock Option Analysis",
      icon: <BarChart className="w-10 h-10 text-[#FFD700]" />,
      description: "Plan how exercising stock options or deferring bonuses affects your taxable income, potential bracket jumps, AMT, or multi-year planning.",
      comingSoon: false,
      link: "/tax-planning/deferred-comp"
    },
    {
      id: "tax-analyzer",
      title: "Tax Return Analyzer",
      icon: <FileText className="w-10 h-10 text-[#FFD700]" />,
      description: "Upload and analyze your tax returns to identify potential savings and optimization opportunities.",
      comingSoon: false,
      link: "/tax-planning/analyzer"
    },
    {
      id: "document-aggregator",
      title: "Tax Document Aggregator",
      icon: <FolderSearch className="w-10 h-10 text-[#FFD700]" />,
      description: "Organize all your tax documents in one place. Auto-categorize receipts, W2s, 1099s and more.",
      comingSoon: false,
      link: "/tax-planning/aggregator"
    },
    {
      id: "tax-trap-checker",
      title: "Tax Trap Checker",
      icon: <AlertTriangle className="w-10 h-10 text-[#FFD700]" />,
      description: "Identify threshold issues that could trigger unexpected tax increases like IRMAA and ACA subsidies.",
      comingSoon: false,
      link: "/tax-planning/tax-traps"
    },
    {
      id: "social-security",
      title: "Social Security Calculator",
      icon: <HeartHandshake className="w-10 h-10 text-[#FFD700]" />,
      description: "Optimize when to take Social Security benefits based on your unique tax situation.",
      comingSoon: false,
      link: "/tax-planning/social-security"
    },
    {
      id: "bracket-manager",
      title: "Dynamic Bracket Manager",
      icon: <BarChart2 className="w-10 h-10 text-[#FFD700]" />,
      description: "Visualize your current tax bracket position and model changes to optimize your tax strategies.",
      comingSoon: false,
      link: "/tax-planning/bracket-manager"
    },
    {
      id: "filing-options",
      title: "File My Taxes",
      icon: <FileCheck className="w-10 h-10 text-[#FFD700]" />,
      description: "Choose a simple do-it-yourself filing tool for basic returns, or connect with a tax professional.",
      comingSoon: false,
      link: "/tax-planning/filing-options"
    },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => (
        <TaxToolCard
          key={tool.id}
          id={tool.id}
          title={tool.title}
          icon={tool.icon}
          description={tool.description}
          comingSoon={tool.comingSoon}
          link={tool.link}
          documentCount={tool.documentCount}
          lastUpdated={tool.lastUpdated}
        />
      ))}
    </div>
  );
};

export default TaxTools;
