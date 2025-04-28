
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const TaxTrapHeader: React.FC = () => {
  return (
    <div className="flex flex-col space-y-4 bg-[#1F2937] p-6 rounded-lg mb-6 border border-[#2d3748]">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="h-7 w-7 text-[#f6ad55]" />
            Tax Trap Checker
          </h1>
          <p className="text-white">
            Identify potential tax traps and threshold issues in your financial situation
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="gold" 
            size="sm" 
            asChild
          >
            <Link to="/tax-planning/threshold-calculator">
              Advanced Threshold Calculator
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaxTrapHeader;
