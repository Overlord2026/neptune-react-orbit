
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import Header from '@/components/ui/header';

const TaxTrapHeader: React.FC = () => {
  return (
    <Header
      title="Tax Trap Checker"
      description="Identify potential tax traps and threshold issues in your financial situation"
      icon={<AlertTriangle className="h-7 w-7 text-[#f6ad55]" />}
      actions={
        <Button 
          variant="gold" 
          size="sm" 
          asChild
        >
          <Link to="/tax-planning/threshold-calculator">
            Advanced Threshold Calculator
          </Link>
        </Button>
      }
    />
  );
};

export default TaxTrapHeader;
