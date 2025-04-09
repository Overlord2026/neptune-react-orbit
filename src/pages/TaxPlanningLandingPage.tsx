import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, FolderSearch, Banknote, HeartHandshake, BarChart2, Lock, Lightbulb, LineChart } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const TaxPlanningLandingPage = () => {
  const [tooltipMessage, setTooltipMessage] = useState<string | null>(null);

  const renderTaxTools = () => {
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
    ];
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <TooltipProvider key={tool.id}>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <Link to={tool.link} className="neptune-card interactive">
                  <Card>
                    <CardHeader className="space-y-1">
                      <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-3">
                        {tool.icon}
                        {tool.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-sm text-muted-foreground">
                        {tool.description}
                        {tool.comingSoon && <span className="ml-1 text-xs text-yellow-500">(Coming Soon)</span>}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center">
                {tool.comingSoon ? `Feature "${tool.title}" is coming soon!` : `Go to ${tool.title}`}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    );
  };

  return (
    <div className="container content-padding section-margin">
      <div className="flex flex-col items-start justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <div className="space-y-0.5">
          <h2 className="text-3xl font-bold tracking-tight neptune-gold">Tax Planning Hub</h2>
          <p className="text-muted-foreground">
            Optimize your tax strategy with our suite of advanced tools.
          </p>
        </div>
      </div>
      <div className="py-4">{renderTaxTools()}</div>
    </div>
  );
};

export default TaxPlanningLandingPage;
