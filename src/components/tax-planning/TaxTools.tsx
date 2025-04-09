
import React from 'react';
import { 
  FileText, 
  FolderSearch, 
  Banknote, 
  LineChart, 
  HeartHandshake, 
  BarChart2, 
  Lock, 
  Lightbulb,
  FileCheck
} from "lucide-react";
import TaxToolCard from './TaxToolCard';

const TaxTools: React.FC = () => {
  const tools = [
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
      comingSoon: true,
      link: "/tax-planning/aggregator"
    },
    {
      id: "roth-conversion",
      title: "Roth Conversion Analyzer",
      icon: <Banknote className="w-10 h-10 text-[#FFD700]" />,
      description: "Calculate tax implications of converting traditional IRA assets to Roth accounts over time.",
      comingSoon: false,
      link: "/tax-planning/roth-conversion"
    },
    {
      id: "roth-analysis",
      title: "Roth Conversion Analysis",
      icon: <LineChart className="w-10 h-10 text-[#FFD700]" />,
      description: "Compare different Roth conversion scenarios across multiple tax years.",
      comingSoon: false,
      link: "/tax-planning/roth-analysis"
    },
    {
      id: "social-security",
      title: "Social Security Calculator",
      icon: <HeartHandshake className="w-10 h-10 text-[#FFD700]" />,
      description: "Optimize when to take Social Security benefits based on your unique tax situation.",
      comingSoon: true,
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
      id: "tax-vault",
      title: "Tax Vault",
      icon: <Lock className="w-10 h-10 text-[#FFD700]" />,
      description: "Securely store all your tax documents with bank-level encryption and easy retrieval.",
      comingSoon: true,
      link: "/tax-planning/tax-vault"
    },
    {
      id: "advanced-strategies",
      title: "Advanced Tax Strategies",
      icon: <Lightbulb className="w-10 h-10 text-[#FFD700]" />,
      description: "Learn advanced tax optimization strategies including estate planning, charitable giving and more.",
      comingSoon: false,
      link: "/tax-planning/advanced-strategies"
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
        />
      ))}
    </div>
  );
};

export default TaxTools;
