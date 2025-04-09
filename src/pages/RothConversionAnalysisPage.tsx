
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, LineChart, TrendingUp } from "lucide-react";

const RothConversionAnalysisPage = () => {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row items-center justify-between pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight neptune-gold">
            Roth Conversion Analysis: Compare Different Scenarios
          </h1>
          <p className="text-muted-foreground">
            Use this section to see how converting portions of your IRA to a Roth might affect your overall
            tax situation across different years.
          </p>
        </div>
        <Link to="/tax-planning" className="border border-primary hover:bg-primary/10 px-4 py-2 rounded-md text-primary transition-colors flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Tax Planning Hub
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="bg-card border-primary/20 hover:border-primary/50 transition-all duration-200 hover:shadow-md">
          <CardHeader className="bg-blue-950/30 rounded-t-lg border-b border-primary/10">
            <CardTitle className="text-xl neptune-gold flex items-center gap-3">
              <FileText className="h-5 w-5" />
              2021 Scenario
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              View your 2021 tax information and baseline scenario without any Roth conversions.
            </p>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <div className="flex justify-between">
                  <span>Tax Bracket:</span>
                  <span className="font-medium text-white">24%</span>
                </div>
                <div className="flex justify-between">
                  <span>Effective Rate:</span>
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

        <Card className="bg-card border-primary/20 hover:border-primary/50 transition-all duration-200 hover:shadow-md">
          <CardHeader className="bg-green-950/30 rounded-t-lg border-b border-primary/10">
            <CardTitle className="text-xl neptune-gold flex items-center gap-3">
              <LineChart className="h-5 w-5" />
              2022 Scenario
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              View your 2022 tax information with preliminary Roth conversion planning.
            </p>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <div className="flex justify-between">
                  <span>Tax Bracket:</span>
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

        <Card className="bg-card border-primary/20 hover:border-primary/50 transition-all duration-200 hover:shadow-md">
          <CardHeader className="bg-amber-950/30 rounded-t-lg border-b border-primary/10">
            <CardTitle className="text-xl neptune-gold flex items-center gap-3">
              <TrendingUp className="h-5 w-5" />
              2023 Scenario
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              View your 2023 projection with recommended Roth conversion strategy.
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
            <Button className="bg-[#FFD700] hover:bg-[#E5C100] text-black">
              View 2023 Scenario
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            You can add or modify scenarios to customize your Roth conversion plans.
          </p>
          <Button variant="outline" className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10">
            Create New Scenario
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RothConversionAnalysisPage;
