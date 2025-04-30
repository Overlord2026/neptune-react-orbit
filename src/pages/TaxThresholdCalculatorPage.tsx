
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
          <h1 className="text-3xl font-bold tracking-tight text-[#f6ad55] mb-2">
            Tax Threshold Calculator
          </h1>
          <p className="text-muted-foreground">
            Plan around tax thresholds and avoid costly surcharges
          </p>
        </div>
        <Link 
          to="/tax-planning" 
          className="mt-4 sm:mt-0 flex items-center gap-2 text-[#4299e1] hover:text-[#4299e1]/80 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Tax Planning</span>
        </Link>
      </div>
      
      <Card className="border-[#334155] bg-[#1a202c] shadow-xl">
        <CardHeader>
          <CardTitle className="text-white">Tax Trap Analysis Calculator</CardTitle>
          <CardDescription className="text-[#a0aec0]">
            Enter your financial details to analyze potential tax traps and thresholds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TaxTrapContainer />
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxThresholdCalculatorPage;
