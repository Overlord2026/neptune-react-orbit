
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SimpleReturnFilingFlow from '@/components/tax-filing/SimpleReturnFilingFlow';

const FileMyTaxesPage = () => {
  return (
    <div className="container content-padding section-margin">
      <div className="space-y-4 max-w-4xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h2 className="text-3xl font-bold tracking-tight neptune-gold flex items-center gap-2">
            <FileText className="h-8 w-8 text-[#FFD700]" />
            File My Taxes
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" className="border-[#9b87f5] text-[#9b87f5]" asChild>
              <Link to="/tax-filing">Back to Options</Link>
            </Button>
            <Button variant="outline" className="border-[#FFD700] text-[#FFD700]" asChild>
              <Link to="/tax-planning">Tax Planning Hub</Link>
            </Button>
          </div>
        </div>
        
        <SimpleReturnFilingFlow />
      </div>
    </div>
  );
};

export default FileMyTaxesPage;
