
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, FileCheck, FileSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TaxFilingOptionsPage = () => {
  return (
    <div className="container content-padding section-margin">
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight neptune-gold">Tax Filing Options</h2>
          <p className="text-muted-foreground mt-2">
            Choose the tax filing method that works best for your situation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start mb-4">
              <FileText className="h-10 w-10 text-[#FFD700] mr-4" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Simple Tax Return</h3>
                <p className="text-muted-foreground mb-4">
                  Ideal for W-2 income, standard deduction, and simple tax situations.
                </p>
              </div>
            </div>
            <Button className="w-full" asChild>
              <Link to="/file-my-taxes">Start Simple Return</Link>
            </Button>
          </div>
          
          <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start mb-4">
              <FileSearch className="h-10 w-10 text-[#9b87f5] mr-4" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Advanced Tax Return</h3>
                <p className="text-muted-foreground mb-4">
                  For self-employment, investments, multiple income streams and itemized deductions.
                </p>
              </div>
            </div>
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
            </Button>
          </div>
        </div>
        
        <div className="flex justify-center mt-8">
          <Button variant="outline" className="border-[#FFD700] text-[#FFD700]" asChild>
            <Link to="/tax-planning">Back to Tax Planning Hub</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaxFilingOptionsPage;
