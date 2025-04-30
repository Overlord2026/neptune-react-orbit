
import React from 'react';
import { Link } from 'react-router-dom';
import TaxTrapHeader from '@/components/tax/TaxTrapHeader';
import TaxTrapContainer from '@/components/tax/TaxTrapContainer';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';

const TaxTrapCheckerPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <TaxTrapHeader />
        <Link to="/tax-planning/threshold-calculator">
          <Button variant="outline" className="flex items-center gap-2">
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
