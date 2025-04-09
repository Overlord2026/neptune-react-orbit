
import React, { useEffect } from 'react';
import { TaxReturnData } from '../SimpleReturnFilingFlow';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { CheckCircle2, Download, PanelRight, Clock, FileCheck } from 'lucide-react';

interface ConfirmationStepProps {
  data: TaxReturnData;
  onComplete: (data: Partial<TaxReturnData>) => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ data }) => {
  const isRefundExpected = data.calculatedRefund > 0;
  
  useEffect(() => {
    // In a real application, this would trigger an email send with the PDF
    console.log("Sending confirmation email with tax return PDF");
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center text-center space-y-3 py-6">
        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold">Return Successfully Filed!</h3>
        <p className="text-muted-foreground">
          Your tax return has been submitted to the IRS. You'll receive a confirmation email shortly.
        </p>
      </div>
      
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Reference Number</p>
              <p className="font-medium">{data.referenceNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Filing Date</p>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">
                  {isRefundExpected ? "Expected Refund" : "Amount Due"}
                </p>
                <p className="font-medium text-xl">
                  ${(isRefundExpected ? data.calculatedRefund : data.calculatedOwed).toLocaleString()}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full ${isRefundExpected ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                {isRefundExpected ? "Refund" : "Payment Required"}
              </div>
            </div>
            
            {isRefundExpected && (
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                <span>Expected deposit within 21 days</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h4 className="font-medium">Next Steps</h4>
        
        {/* Next steps cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="transition-all hover:shadow-md">
            <CardContent className="p-4 flex items-start space-x-3">
              <Download className="h-5 w-5 mt-0.5 text-[#9b87f5]" />
              <div>
                <h5 className="font-medium mb-1">Download Your Return</h5>
                <p className="text-sm text-muted-foreground">
                  Save a PDF copy of your filed tax return for your records.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="transition-all hover:shadow-md">
            <CardContent className="p-4 flex items-start space-x-3">
              <PanelRight className="h-5 w-5 mt-0.5 text-[#9b87f5]" />
              <div>
                <h5 className="font-medium mb-1">Track Your Refund</h5>
                <p className="text-sm text-muted-foreground">
                  Check the status of your refund through the IRS refund tracker.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Track Refund
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="transition-all hover:shadow-md">
            <CardContent className="p-4 flex items-start space-x-3">
              <FileCheck className="h-5 w-5 mt-0.5 text-[#9b87f5]" />
              <div>
                <h5 className="font-medium mb-1">Store in Tax Vault</h5>
                <p className="text-sm text-muted-foreground">
                  Save your return in our secure Tax Vault for future reference.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Add to Vault
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-center pt-4">
        <Button variant="outline" asChild>
          <Link to="/tax-planning">Return to Tax Planning Hub</Link>
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;
