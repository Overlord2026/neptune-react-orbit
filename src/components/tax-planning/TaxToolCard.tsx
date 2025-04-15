import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TaxToolProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  comingSoon: boolean;
  link: string;
  documentCount?: number;
  lastUpdated?: string;
  recommended?: boolean;
}

const TaxToolCard: React.FC<TaxToolProps> = ({ 
  id, 
  title, 
  icon, 
  description, 
  comingSoon, 
  link,
  documentCount,
  lastUpdated,
  recommended
}) => {
  // Add bullets for estate and gifting, charitable planning, roth tools, and deferred comp tools
  const showBullets = id === "estate-gifting" || id === "roth-conversion" || id === "charitable-planning" || id === "deferred-comp" || id === "small-business";
  
  const getBullets = () => {
    if (id === "estate-gifting") {
      return [
        "Compare annual gifting vs. inheritance",
        "Check for estate tax thresholds",
        "Factor in trust structures if relevant"
      ];
    } else if (id === "roth-conversion") {
      return [
        "Model how Roth conversions reduce future RMD tax liability",
        "Compare single-year vs multi-year conversion strategies",
        "Visualize impact on IRMAA surcharges"
      ];
    } else if (id === "charitable-planning") {
      return [
        "Model itemized deductions vs. standard deduction",
        "Calculate multi-year bunching strategies",
        "Compare QCD from IRA after age 70½"
      ];
    } else if (id === "deferred-comp") {
      return [
        "Analyze NSO vs ISO taxation differences",
        "Calculate AMT implications of stock options",
        "Model optimal timing of deferred compensation"
      ];
    } else if (id === "small-business") {
      return [
        "Compare S-Corp vs. sole proprietorship for better tax efficiency",
        "Calculate self-employment tax implications",
        "Analyze qualified business income (QBI) deductions"
      ];
    }
    return [];
  };
  
  const getButtonText = () => {
    switch (id) {
      case "estate-gifting": return "Start Estate & Gifting Analysis";
      case "roth-conversion": return "Start Roth Conversion Planning";
      case "tax-analyzer": return "Analyze My Tax Return";
      case "charitable-planning": return "Start Charitable Analysis";
      case "deferred-comp": return "Start Equity Compensation Analysis";
      case "small-business": return "Start Business Income Analysis";
      case "tax-vault": return "Open Tax Vault";
      default: return "Start Tool";
    }
  };
  
  // Create a slug from the title for the tooltip finder to target
  const titleSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  return (
    <Link to={link} className="block transition-all duration-200 hover:scale-[1.02]">
      <Card 
        className={`h-full border-[#2A2F3C] bg-[#1A1F2C] hover:border-[#00C47C] transition-colors ${recommended ? 'ring-2 ring-[#FFD700] ring-opacity-30' : ''}`}
        id={titleSlug}
      >
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl font-semibold text-white flex items-center gap-3">
            {icon}
            <div className="flex-1">
              {title}
              {recommended && (
                <Badge className="ml-2 bg-[#FFD700] text-black font-normal">Recommended</Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <p className="text-sm text-[#B0B0B0]">
            {description}
            {comingSoon && <span className="ml-1 text-xs text-yellow-500">(Coming Soon)</span>}
          </p>
          
          {showBullets && (
            <ul className="list-disc pl-5 space-y-1 text-sm text-[#B0B0B0]">
              {getBullets().map((bullet, idx) => (
                <li key={idx}>{bullet}</li>
              ))}
            </ul>
          )}
          
          {id === "tax-vault" && documentCount !== undefined && lastUpdated && (
            <div className="text-sm text-[#B0B0B0] bg-[#2A2F3C]/50 p-3 rounded-md">
              <div className="flex justify-between items-center">
                <span>{documentCount} documents stored</span>
                <span>Last updated: {lastUpdated}</span>
              </div>
            </div>
          )}
          
          <Button 
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
          >
            {getButtonText()} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TaxToolCard;
