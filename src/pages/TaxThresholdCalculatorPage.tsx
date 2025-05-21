
import React from 'react';
import { TaxTrapContainer } from '@/components/tax/TaxTrapContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TaxThresholdCalculatorPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#f59e0b] mb-2">
            Tax Threshold Calculator
          </h1>
          <p className="text-[#e2e8f0]">
            Plan around tax thresholds and avoid costly surcharges
          </p>
        </div>
        <Link 
          to="/tax-planning" 
          className="mt-4 sm:mt-0 flex items-center gap-2 text-[#3b82f6] hover:text-[#2563eb] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Tax Planning</span>
        </Link>
      </div>
      
      <Card className="border-[#202a42] bg-[#141c2e] shadow-xl">
        <CardHeader className="border-b border-[#202a42]/70">
          <CardTitle className="text-white">Tax Trap Analysis Calculator</CardTitle>
          <CardDescription className="text-[#94a3b8]">
            Enter your financial details to analyze potential tax traps and thresholds
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <TaxTrapContainer />
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxThresholdCalculatorPage;
