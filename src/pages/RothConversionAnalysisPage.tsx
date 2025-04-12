import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, LineChart, TrendingUp, BarChart, BookOpen } from "lucide-react";
import { calculateTaxScenario, TaxInput } from '@/utils/taxCalculator';
import GlossaryTerm from '@/components/GlossaryTerm';
import InfoTooltip from '@/components/tax/InfoTooltip';
import RealTimeBracketPreview from '@/components/tax/RealTimeBracketPreview';
import ShareFeature from '@/components/tax-planning/ShareFeature';

const RothConversionAnalysisPage = () => {
  // State for the bracket preview
  const [conversionAmount, setConversionAmount] = useState(0);

  // Handle conversion amount change
  const handleConversionChange = (amount: number) => {
    setConversionAmount(amount);
  };
  
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row items-center justify-between pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight neptune-gold">
            Roth Conversion Analysis: Compare Different Scenarios
          </h1>
          <p className="text-muted-foreground">
            Use this section to see how converting portions of your <GlossaryTerm termId="traditional_ira">Traditional IRA</GlossaryTerm> to a <GlossaryTerm termId="roth_ira">Roth IRA</GlossaryTerm> might 
            affect your overall tax situation across different years.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ShareFeature 
            title="Roth Conversion Analysis" 
            description="Compare different Roth conversion scenarios across multiple tax years."
            variant="button"
          />
          <Link to="/tax-planning" className="border border-primary hover:bg-primary/10 px-4 py-2 rounded-md text-primary transition-colors flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Tax Planning Hub
          </Link>
        </div>
      </div>

      {/* New Real-Time Bracket Preview Section */}
      <div className="mb-6">
        <RealTimeBracketPreview 
          baseIncome={120000} 
          year={2023} 
          filingStatus="married"
          capitalGains={15000}
          maxConversion={500000}
          onChange={handleConversionChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="bg-card border-primary/20 hover:border-primary/50 transition-all duration-200 hover:shadow-md relative">
          <ShareFeature title="2021 Scenario" position="top-right" />
          <CardHeader className="bg-blue-950/30 rounded-t-lg border-b border-primary/10">
            <CardTitle className="text-xl neptune-gold flex items-center gap-3">
              <FileText className="h-5 w-5" />
              2021 Scenario
              <InfoTooltip 
                text="This baseline scenario shows your tax situation without any Roth conversions." 
                link="/tax-planning/basic-education#baseline-scenario"
                linkText="Understanding baseline scenarios"
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              View your 2021 tax information and baseline scenario without any <GlossaryTerm termId="roth_conversion">Roth conversions</GlossaryTerm>.
            </p>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <div className="flex justify-between">
                  <span>Tax Bracket:</span>
                  <span className="font-medium text-white">24%</span>
                </div>
                <div className="flex justify-between">
                  <span><GlossaryTerm termId="effective_tax_rate">Effective Rate</GlossaryTerm>:</span>
                  <span className="font-medium text-white">18.2%</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/20 rounded-b-lg border-t border-primary/10 flex justify-end p-4">
            <Link to="/tax-planning/roth-analysis/2021">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                View 2021 Scenario
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="bg-card border-primary/20 hover:border-primary/50 transition-all duration-200 hover:shadow-md relative">
          <ShareFeature title="2022 Scenario" position="top-right" />
          <CardHeader className="bg-green-950/30 rounded-t-lg border-b border-primary/10">
            <CardTitle className="text-xl neptune-gold flex items-center gap-3">
              <LineChart className="h-5 w-5" />
              2022 Scenario
              <InfoTooltip 
                text="This scenario shows the impact of preliminary Roth conversion planning." 
                link="/tax-planning/roth-conversion" 
                linkText="Learn about conversion planning"
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              View your 2022 tax information with preliminary <GlossaryTerm termId="roth_conversion">Roth conversion</GlossaryTerm> planning.
            </p>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <div className="flex justify-between">
                  <span><GlossaryTerm termId="marginal_tax_rate">Tax Bracket</GlossaryTerm>:</span>
                  <span className="font-medium text-white">24%</span>
                </div>
                <div className="flex justify-between">
                  <span>Effective Rate:</span>
                  <span className="font-medium text-white">19.5%</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/20 rounded-b-lg border-t border-primary/10 flex justify-end p-4">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              View 2022 Scenario
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-card border-primary/20 hover:border-primary/50 transition-all duration-200 hover:shadow-md relative">
          <ShareFeature title="2023 Scenario" position="top-right" />
          <CardHeader className="bg-amber-950/30 rounded-t-lg border-b border-primary/10">
            <CardTitle className="text-xl neptune-gold flex items-center gap-3">
              <TrendingUp className="h-5 w-5" />
              2023 Scenario
              <InfoTooltip 
                text="This optimized scenario includes our recommended Roth conversion strategy."
                icon="help"
                link="/tax-planning/advanced-strategies"
                linkText="See advanced optimization techniques"
                isAdvanced={true} 
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              View your 2023 projection with recommended <GlossaryTerm termId="roth_conversion">Roth conversion</GlossaryTerm> strategy.
            </p>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <div className="flex justify-between">
                  <span>Tax Bracket:</span>
                  <span className="font-medium text-white">24%</span>
                </div>
                <div className="flex justify-between">
                  <span>Effective Rate:</span>
                  <span className="font-medium text-white">20.1%</span>
                </div>
                <div className="flex justify-between text-[#FFD700]">
                  <span>Conversion:</span>
                  <span className="font-medium">$50,000</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/20 rounded-b-lg border-t border-primary/10 flex justify-end p-4">
            <Link to="/tax-planning/roth-analysis/2023">
              <Button className="bg-[#FFD700] hover:bg-[#E5C100] text-black">
                View 2023 Scenario
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-4 flex justify-center">
        <Link to="/tax-planning/roth-analysis/compare">
          <Button className="bg-primary hover:bg-primary/90 flex gap-2 items-center">
            <BarChart className="h-4 w-4" />
            Compare All Scenarios
          </Button>
        </Link>
      </div>

      <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground flex items-center">
            You can add or modify scenarios to customize your <GlossaryTerm termId="roth_conversion">Roth conversion</GlossaryTerm> plans.
            <InfoTooltip 
              text="Planning multiple conversion scenarios across different years can help minimize your overall tax burden."
              link="/tax-planning/advanced-strategies#multi-year-planning"
              linkText="Advanced multi-year planning strategies"
              isAdvanced={true}
            />
          </p>
          <Button variant="outline" className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10">
            Create New Scenario
          </Button>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-slate-50/10 border border-slate-200/20 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 neptune-gold flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          Related Educational Resources
        </h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/tax-planning/avoiding-tax-traps" className="text-primary hover:underline flex items-center">
            How Roth Conversions Impact IRMAA
          </Link>
          <Link to="/tax-planning/recommended-reading" className="text-primary hover:underline flex items-center">
            The Ultimate Roth Conversion Blueprint
          </Link>
          <Link to="/tax-planning/bracket-manager" className="text-primary hover:underline flex items-center">
            Tax Bracket Management Strategies
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RothConversionAnalysisPage;
