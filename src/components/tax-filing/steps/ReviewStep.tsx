
import React, { useEffect, useState } from 'react';
import { TaxReturnData } from '../SimpleReturnFilingFlow';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import DisclaimerSection from '@/components/tax/DisclaimerSection';

interface ReviewStepProps {
  data: TaxReturnData;
  onComplete: (data: Partial<TaxReturnData>) => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ data, onComplete }) => {
  const [calculatedRefund, setCalculatedRefund] = useState(0);
  const [calculatedOwed, setCalculatedOwed] = useState(0);
  
  useEffect(() => {
    // Simplified tax calculation for demonstration purposes
    // In a real app, this would call a proper tax calculation service
    
    // Calculate total income
    const totalW2Income = data.w2Forms.reduce((sum, form) => sum + form.wages, 0);
    const totalIncome = totalW2Income + data.interestIncome + data.dividendIncome;
    
    // Calculate deductions
    const deduction = data.useStandardDeduction 
      ? 12950 // Example standard deduction for single filer
      : Object.values(data.itemizedDeductions).reduce((sum, value) => sum + value, 0);
      
    // Calculate taxable income
    const taxableIncome = Math.max(0, totalIncome - deduction);
    
    // Very simplified tax bracket calculation
    // This is just for demonstration; real tax calculations are much more complex
    let tax = 0;
    if (taxableIncome <= 10275) {
      tax = taxableIncome * 0.1;
    } else if (taxableIncome <= 41775) {
      tax = 1027.50 + (taxableIncome - 10275) * 0.12;
    } else if (taxableIncome <= 89075) {
      tax = 4807.50 + (taxableIncome - 41775) * 0.22;
    } else {
      tax = 15213.50 + (taxableIncome - 89075) * 0.24;
    }
    
    // Apply tax credits (very simplified)
    if (data.childTaxCredit) {
      tax -= data.dependents.length * 2000;
    }
    if (data.educationCredit) {
      tax -= 2500; // Simplified American Opportunity Credit
    }
    tax = Math.max(0, tax);
    
    // Calculate total withholding
    const totalWithholding = data.w2Forms.reduce((sum, form) => 
      sum + form.federalWithholding, 0);
      
    // Calculate refund or amount owed
    if (totalWithholding > tax) {
      setCalculatedRefund(totalWithholding - tax);
      setCalculatedOwed(0);
    } else {
      setCalculatedRefund(0);
      setCalculatedOwed(tax - totalWithholding);
    }
  }, [data]);
  
  const handleSubmit = () => {
    onComplete({
      calculatedRefund,
      calculatedOwed
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold">Review Your Tax Return</h3>
        <p className="text-muted-foreground">
          Please review your information carefully before proceeding to file your return.
        </p>
      </div>
      
      {/* Result Summary Card */}
      <Card className="border-2 overflow-hidden">
        <div className={`p-4 text-white ${calculatedRefund > 0 ? "bg-green-600" : "bg-amber-600"}`}>
          <h4 className="text-xl font-bold">
            {calculatedRefund > 0 
              ? `Tax Refund: $${calculatedRefund.toLocaleString()}` 
              : `Tax Owed: $${calculatedOwed.toLocaleString()}`
            }
          </h4>
        </div>
        <CardContent className="p-4">
          <p className="text-sm">
            Based on the information you've provided, our calculations show that you will 
            {calculatedRefund > 0 
              ? ` receive a refund of $${calculatedRefund.toLocaleString()}.` 
              : ` owe $${calculatedOwed.toLocaleString()}.`
            }
          </p>
        </CardContent>
      </Card>
      
      {/* Information Review */}
      <div className="space-y-4">
        <h4 className="font-medium">Personal Information</h4>
        <Card className="p-4">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div className="flex justify-between md:block">
              <dt className="font-medium text-muted-foreground">Full Name:</dt>
              <dd>{data.firstName} {data.lastName}</dd>
            </div>
            <div className="flex justify-between md:block">
              <dt className="font-medium text-muted-foreground">SSN:</dt>
              <dd>{data.ssn}</dd>
            </div>
            <div className="flex justify-between md:block">
              <dt className="font-medium text-muted-foreground">Filing Status:</dt>
              <dd>{data.filingStatus === 'single' ? 'Single' : 
                   data.filingStatus === 'married' ? 'Married Filing Jointly' : 
                   data.filingStatus === 'head_of_household' ? 'Head of Household' : ''}</dd>
            </div>
            <div className="flex justify-between md:block">
              <dt className="font-medium text-muted-foreground">Address:</dt>
              <dd>{data.address.street}, {data.address.city}, {data.address.state} {data.address.zipCode}</dd>
            </div>
          </dl>
        </Card>
        
        <h4 className="font-medium">Income & Withholding</h4>
        <Card className="p-4">
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="font-medium text-muted-foreground">W-2 Income:</dt>
              <dd>${data.w2Forms.reduce((sum, form) => sum + form.wages, 0).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Other Income:</dt>
              <dd>${(data.interestIncome + data.dividendIncome).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="font-medium text-muted-foreground">Federal Withholding:</dt>
              <dd>${data.w2Forms.reduce((sum, form) => sum + form.federalWithholding, 0).toLocaleString()}</dd>
            </div>
          </dl>
        </Card>
        
        <h4 className="font-medium">Deductions & Credits</h4>
        <Card className="p-4">
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="font-medium text-muted-foreground">Deduction Type:</dt>
              <dd>{data.useStandardDeduction ? 'Standard Deduction' : 'Itemized Deductions'}</dd>
            </div>
            {!data.useStandardDeduction && (
              <div>
                <dt className="font-medium text-muted-foreground">Total Itemized Amount:</dt>
                <dd>${Object.values(data.itemizedDeductions).reduce((sum, value) => sum + value, 0).toLocaleString()}</dd>
              </div>
            )}
            <div>
              <dt className="font-medium text-muted-foreground">Credits Applied:</dt>
              <dd>
                {[
                  data.childTaxCredit && 'Child Tax Credit',
                  data.educationCredit && 'Education Credit'
                ].filter(Boolean).join(', ') || 'None'}
              </dd>
            </div>
          </dl>
        </Card>
      </div>
      
      <DisclaimerSection />
      
      <div className="flex justify-end space-x-2">
        <Button onClick={handleSubmit}>Proceed to E-File</Button>
      </div>
    </div>
  );
};

export default ReviewStep;
