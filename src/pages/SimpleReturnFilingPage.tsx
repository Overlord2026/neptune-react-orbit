
import React from 'react';
import { Link } from 'react-router-dom';
import SimpleReturnFilingFlow from '@/components/tax-filing/SimpleReturnFilingFlow';
import { Button } from '@/components/ui/button';

const SimpleReturnFilingPage = () => {
  return (
    <div className="container content-padding section-margin">
      <div className="space-y-4 max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight neptune-gold">File a Simple Tax Return</h2>
          <Button variant="outline" className="border-[#9b87f5] text-[#9b87f5]" asChild>
            <Link to="/tax-planning/filing-options">Back to Options</Link>
          </Button>
        </div>
        
        <SimpleReturnFilingFlow />
      </div>
    </div>
  );
};

export default SimpleReturnFilingPage;
