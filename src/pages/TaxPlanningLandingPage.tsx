
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, FolderSearch, Banknote, HeartHandshake, BarChart2, Lock, Lightbulb, LineChart, BookOpen, ExternalLink, BookText, Library } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const TaxPlanningLandingPage = () => {
  const [tooltipMessage, setTooltipMessage] = useState<string | null>(null);
  const [isEducationOpen, setIsEducationOpen] = useState<boolean>(true);

  const renderEducationResources = () => {
    return (
      <Collapsible 
        open={isEducationOpen} 
        onOpenChange={setIsEducationOpen}
        className="w-full mb-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight neptune-gold">Tax Education & Resources</h2>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <span className="sr-only">{isEducationOpen ? "Close" : "Open"}</span>
              {isEducationOpen ? (
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                  <path d="M4 9.5L7.5 6L11 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                  <path d="M4 6L7.5 9.5L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="pt-2">
          <Card className="bg-[#1A1F2C] border border-[#8E9196]">
            <CardContent className="pt-6">
              <p className="text-[#E5DEFF] mb-4">
                Explore guides, books, and courses to deepen your understanding of key tax concepts.
              </p>

              <div className="flex flex-wrap gap-4 mb-6">
                <Button className="bg-[#9b87f5] hover:bg-[#8a76e4] text-white" asChild>
                  <Link to="/tax-planning/basic-education">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Basic Tax Education
                  </Link>
                </Button>
                <Button variant="outline" className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#1A1F2C]/50" asChild>
                  <Link to="/tax-planning/advanced-tax-education">
                    <BookText className="mr-2 h-4 w-4" />
                    Advanced Tax Education (Paid Course)
                  </Link>
                </Button>
                <Button variant="outline" className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#1A1F2C]/50" asChild>
                  <Link to="/tax-planning/recommended-reading">
                    <Library className="mr-2 h-4 w-4" />
                    Recommended Reading & Guides
                  </Link>
                </Button>
                <Button variant="outline" className="border-[#FFD700] text-[#FFD700] hover:bg-[#1A1F2C]/50" asChild>
                  <Link to="/tax-planning/glossary">
                    <BookText className="mr-2 h-4 w-4" />
                    View Full Glossary
                  </Link>
                </Button>
              </div>

              <div>
                <h3 className="text-lg font-medium text-[#E5DEFF] mb-2">Recommended Reading</h3>
                <ul className="space-y-2 text-[#F1F0FB]">
                  <li className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-[#9b87f5]" />
                    <Link to="/tax-planning/recommended-reading" className="hover:underline">Browse All Guides & Books</Link>
                  </li>
                  <li className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-[#9b87f5]" />
                    <Link to="/tax-planning/guides/understanding-tax-brackets" className="hover:underline">Guide 1: Understanding Tax Brackets</Link>
                  </li>
                  <li className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-[#9b87f5]" />
                    <Link to="/tax-planning/guides/retirement-tax-strategies" className="hover:underline">Guide 2: Retirement Tax Strategies</Link>
                  </li>
                  <li className="flex items-center">
                    <BookText className="mr-2 h-4 w-4 text-[#9b87f5]" />
                    <a href="https://example.com/books/tax-optimization" target="_blank" rel="noopener noreferrer" className="flex items-center hover:underline">
                      My Book on Tax Optimization
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                  <li className="flex items-center">
                    <ExternalLink className="mr-2 h-4 w-4 text-[#9b87f5]" />
                    <a href="https://www.irs.gov/forms-instructions" target="_blank" rel="noopener noreferrer" className="flex items-center hover:underline">
                      IRS Forms & Publications
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    );
  };

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
      <div className="py-4">
        {renderEducationResources()}
        {renderTaxTools()}
      </div>
    </div>
  );
};

export default TaxPlanningLandingPage;
