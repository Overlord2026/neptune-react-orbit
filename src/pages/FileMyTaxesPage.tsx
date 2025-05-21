
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SimpleReturnFilingFlow from '@/components/tax-filing/SimpleReturnFilingFlow';
import { Card, CardContent } from '@/components/ui/card';

const FileMyTaxesPage = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-2">
            <FileText className="h-8 w-8 text-[#f59e0b]" />
            File My Taxes
          </h1>
          <p className="text-[#e2e8f0]">
            Complete your tax return with our step-by-step guided process
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6]/10 shadow-sm" 
            asChild
          >
            <Link to="/tax-planning" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Tax Planning</span>
            </Link>
          </Button>
        </div>
      </div>
      
      <Card className="border-[#202a42] bg-[#141c2e] shadow-xl">
        <CardContent className="pt-6">
          <SimpleReturnFilingFlow />
        </CardContent>
      </Card>
    </div>
  );
};

export default FileMyTaxesPage;
