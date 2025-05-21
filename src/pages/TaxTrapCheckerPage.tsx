
import React from 'react';
import { Link } from 'react-router-dom';
import TaxTrapHeader from '@/components/tax/TaxTrapHeader';
import TaxTrapContainer from '@/components/tax/TaxTrapContainer';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';

const TaxTrapCheckerPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Tax Trap Checker
          </h1>
          <p className="text-[#e2e8f0]">
            Identify potential tax thresholds that could impact your tax liability
          </p>
        </div>
        <Link to="/tax-planning/threshold-calculator">
          <Button variant="outline" className="flex items-center gap-2 border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6]/10 shadow-sm">
            <Calculator className="h-4 w-4" />
            <span>Open Threshold Calculator</span>
          </Button>
        </Link>
      </div>
      <TaxTrapContainer />
    </div>
  );
};

export default TaxTrapCheckerPage;
