
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, FileText, CircleDollarSign, Shield, Book, SquareAsterisk, Lightbulb } from "lucide-react";
import FinancialDashboard from "@/components/tax/FinancialDashboard";

const TaxPlanningLandingPage = () => {
  const features = [
    {
      title: "Tax Return Analyzer",
      description: "Analyze your tax returns for missed deductions and optimization opportunities.",
      icon: <FileText className="h-8 w-8 mb-4 neptune-gold" />,
      comingSoon: false,
      path: "/tax-planning/analyzer"
    },
    {
      title: "Tax Document Aggregator",
      description: "Centralize and organize all your tax documents in one secure location.",
      icon: <Book className="h-8 w-8 mb-4 neptune-gold" />,
      comingSoon: true,
      path: "/tax-planning/aggregator"
    },
    {
      title: "Roth Conversion Analyzer",
      description: "Evaluate the benefits and tax implications of Roth IRA conversions over time.",
      icon: <Calculator className="h-8 w-8 mb-4 neptune-gold" />,
      comingSoon: false,
      path: "/tax-planning/roth-conversion"
    },
    {
      title: "Social Security Tax Calculator",
      description: "Determine how Social Security benefits impact your overall tax situation.",
      icon: <CircleDollarSign className="h-8 w-8 mb-4 neptune-gold" />,
      comingSoon: false,
      path: "/tax-planning/social-security"
    },
    {
      title: "Dynamic Bracket Manager",
      description: "Visualize and plan around tax brackets to minimize overall tax burden.",
      icon: <SquareAsterisk className="h-8 w-8 mb-4 neptune-gold" />,
      comingSoon: false,
      path: "/tax-planning/bracket-manager"
    },
    {
      title: "Tax Vault",
      description: "Securely store tax documents with encryption and organization features.",
      icon: <Shield className="h-8 w-8 mb-4 neptune-gold" />,
      comingSoon: false,
      path: "/tax-planning/tax-vault"
    },
    {
      title: "Advanced Tax Strategies",
      description: "Access sophisticated tax planning strategies tailored to your financial situation.",
      icon: <Lightbulb className="h-8 w-8 mb-4 neptune-gold" />,
      comingSoon: false,
      path: "/tax-planning/advanced-strategies"
    }
  ];

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight neptune-gold">Tax Planning</h1>
          <p className="text-muted-foreground">Optimize your tax situation with our specialized tools and strategies.</p>
        </div>
        <Link to="/" className="border border-primary hover:bg-primary/10 px-4 py-2 rounded-md text-primary transition-colors w-full sm:w-auto text-center sm:text-left">
          Back to Home
        </Link>
      </div>
      
      {/* Financial Dashboard */}
      <FinancialDashboard />
      
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight neptune-gold mt-8">Available Tools</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="bg-card border-primary/20 hover:border-primary/40 transition-colors overflow-hidden">
            <CardHeader className="pb-2">
              <div className="mb-2">{feature.icon}</div>
              <CardTitle className="text-lg sm:text-xl neptune-gold">{feature.title}</CardTitle>
              {feature.comingSoon && (
                <span className="inline-block bg-primary/20 text-primary text-xs px-2 py-1 rounded-md mt-1">
                  Coming Soon
                </span>
              )}
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-muted-foreground">
                {feature.description}
              </CardDescription>
            </CardContent>
            <CardFooter>
              {feature.comingSoon ? (
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              ) : (
                <Link to={feature.path} className="w-full">
                  <Button className="w-full justify-between">
                    <span>Open Tool</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TaxPlanningLandingPage;
