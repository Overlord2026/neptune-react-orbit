import React from 'react';
import { Card } from '@/components/ui/card';
import { TaxReturnData } from '../../types/TaxReturnTypes';
import PersonalInfoReview from './PersonalInfoReview';
import IncomeReview from './IncomeReview';
import DeductionsReview from './DeductionsReview';
import ReviewSummaryCard from './ReviewSummaryCard';
import TaxTrapSection from './TaxTrapSection';
import { Button } from '@/components/ui/button';

interface ReviewStepProps {
  data: TaxReturnData;
  onComplete: (data: Partial<TaxReturnData>) => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ data, onComplete }) => {
  // Calculate AGI (Adjusted Gross Income)
  const calculatedAGI = data.w2Forms.reduce((sum, form) => sum + form.wages, 0) + 
                       data.interestIncome + 
                       data.dividendIncome;
  
  // Calculate taxable income (simplified for demo)
  const standardDeduction = data.filingStatus === 'single' ? 12950 : 
                           data.filingStatus === 'married' ? 25900 : 
                           data.filingStatus === 'head_of_household' ? 19400 : 12950;
  
  const itemizedTotal = Object.values(data.itemizedDeductions).reduce((sum, val) => sum + val, 0);
  const deduction = data.useStandardDeduction ? standardDeduction : itemizedTotal;
  
  const calculatedTaxableIncome = Math.max(0, calculatedAGI - deduction);
  
  // Handle submission
  const handleSubmit = () => {
    onComplete({
      // Any updates to the data would go here
    });
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Review Your Tax Return</h2>
      <p className="text-muted-foreground">
        Please review your information carefully before proceeding to e-file.
      </p>
      
      <ReviewSummaryCard 
        refund={data.calculatedRefund} 
        owed={data.calculatedOwed} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <PersonalInfoReview data={data} />
          <IncomeReview data={data} />
        </div>
        <div className="space-y-6">
          <DeductionsReview data={data} />
          <TaxTrapSection 
            data={data}
            calculatedAGI={calculatedAGI}
            calculatedTaxableIncome={calculatedTaxableIncome}
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSubmit} size="lg">
          Continue to E-File
        </Button>
      </div>
    </div>
  );
};

export default ReviewStep;
