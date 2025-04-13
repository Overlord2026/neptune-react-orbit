
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
  FileCheck,
  AlertTriangle,
  Gift,
  HandCoins
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from 'react-router-dom';

interface TaxToolCardProps {
  title: string;
  description: string;
  bullets: string[];
  icon: React.ReactNode;
  link: string;
}

const TaxToolCard: React.FC<TaxToolCardProps> = ({ title, description, bullets, icon, link }) => {
  return (
    <Link to={link} className="block transition-all duration-200 hover:scale-[1.02]">
      <Card className="h-full border-[#2A2F3C] bg-[#1A1F2C] hover:border-[#00C47C] transition-colors">
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-xl font-semibold text-white flex items-center gap-3">
            {icon}
            {title}
          </CardTitle>
          <p className="text-sm text-[#B0B0B0]">{description}</p>
        </CardHeader>
        <CardContent className="pt-2">
          <ul className="list-disc pl-5 space-y-1">
            {bullets.map((bullet, index) => (
              <li key={index} className="text-sm text-[#B0B0B0]">{bullet}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </Link>
  );
};

const TaxToolsPage: React.FC = () => {
  const taxTools = [
    {
      title: "Roth Conversion & Multi-Year Planner",
      description: "Plan long-term Roth conversion strategies across multiple tax years",
      bullets: [
        "Model how Roth conversions reduce future RMD tax liability",
        "Compare single-year vs multi-year conversion strategies",
        "Visualize impact on IRMAA surcharges"
      ],
      icon: <Banknote className="w-10 h-10 text-[#FFD700]" />,
      link: "/tax-planning/roth"
    },
    {
      title: "Estate & Gifting Scenarios",
      description: "Analyze lifetime gifting vs inheritance tax implications",
      bullets: [
        "Compare annual gifting vs. lump sum strategies",
        "Project estate tax calculations with various strategies",
        "Evaluate trust structures and their tax benefits"
      ],
      icon: <Gift className="w-10 h-10 text-[#FFD700]" />,
      link: "/tax-planning/estate-gifting"
    },
    {
      title: "Charitable Contribution Planning",
      description: "Evaluate how donor-advised funds, QCDs, and other giving strategies impact taxes",
      bullets: [
        "Model itemized deductions vs. standard deduction",
        "Calculate multi-year bunching strategies",
        "Compare QCD from IRA after age 70½"
      ],
      icon: <HandCoins className="w-10 h-10 text-[#FFD700]" />,
      link: "/tax-planning/charitable-planning"
    },
    {
      title: "Tax Trap Checker",
      description: "Identify threshold issues that could trigger unexpected tax increases",
      bullets: [
        "Avoid IRMAA Medicare premium surcharges",
        "Prevent Social Security taxation thresholds",
        "Manage ACA subsidy cliffs"
      ],
      icon: <AlertTriangle className="w-10 h-10 text-[#FFD700]" />,
      link: "/tax-planning/tax-traps"
    },
    {
      title: "Tax Return Analyzer",
      description: "Upload and analyze your tax returns to find optimization opportunities",
      bullets: [
        "Identify missed deductions and credits",
        "Compare year-over-year tax strategies",
        "Receive AI-generated optimization insights"
      ],
      icon: <FileText className="w-10 h-10 text-[#FFD700]" />,
      link: "/tax-planning/analyzer"
    },
    {
      title: "Tax Document Aggregator",
      description: "Organize all your tax documents in one secure location",
      bullets: [
        "Auto-categorize W2s, 1099s, and other forms",
        "Track receipt submission status",
        "Share securely with your tax professional"
      ],
      icon: <FolderSearch className="w-10 h-10 text-[#FFD700]" />,
      link: "/tax-planning/aggregator"
    },
    {
      title: "Dynamic Bracket Manager",
      description: "Visualize your current tax bracket position and optimize strategies",
      bullets: [
        "See where you stand in your current tax bracket",
        "Model income shifting between tax years",
        "Identify bracket-filling opportunities"
      ],
      icon: <BarChart2 className="w-10 h-10 text-[#FFD700]" />,
      link: "/tax-planning/bracket-manager"
    },
    {
      title: "Social Security Calculator",
      description: "Optimize when to take Social Security benefits based on your tax situation",
      bullets: [
        "Compare early vs. delayed claiming strategies",
        "Calculate taxation of benefits at different income levels",
        "Integrate with your overall retirement plan"
      ],
      icon: <HeartHandshake className="w-10 h-10 text-[#FFD700]" />,
      link: "/tax-planning/social-security"
    }
  ];

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Tax Tools</h1>
        <p className="text-lg text-muted-foreground">
          Access powerful scenarios for Roth conversions, multi-year planning, tax trap checks, and more.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {taxTools.map((tool, index) => (
          <TaxToolCard
            key={index}
            title={tool.title}
            description={tool.description}
            bullets={tool.bullets}
            icon={tool.icon}
            link={tool.link}
          />
        ))}
      </div>
    </div>
  );
};

export default TaxToolsPage;
