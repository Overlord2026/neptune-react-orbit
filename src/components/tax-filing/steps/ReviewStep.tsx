
import React, { useEffect, useState } from 'react';
import { TaxReturnData } from '../types/TaxReturnTypes';
import { Button } from '@/components/ui/button';
import DisclaimerSection from '@/components/tax/DisclaimerSection';
import ReviewSummaryCard from './review/ReviewSummaryCard';
import PersonalInfoReview from './review/PersonalInfoReview';
import IncomeReview from './review/IncomeReview';
import DeductionsReview from './review/DeductionsReview';
import TaxTrapSection from './review/TaxTrapSection';
import { calculateTaxValues } from './review/TaxCalculationLogic';

interface ReviewStepProps {
  data: TaxReturnData;
  onComplete: (data: Partial<TaxReturnData>) => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ data, onComplete }) => {
  const [calculatedRefund, setCalculatedRefund] = useState(0);
  const [calculatedOwed, setCalculatedOwed] = useState(0);
  
  // Calculate AGI and taxable income for tax trap checks
  const { 
    calculatedAGI, 
    calculatedTaxableIncome 
  } = calculateTaxValues(data);
  
  useEffect(() => {
    const { calculatedRefund, calculatedOwed } = calculateTaxValues(data);
    setCalculatedRefund(calculatedRefund);
    setCalculatedOwed(calculatedOwed);
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
      <ReviewSummaryCard refund={calculatedRefund} owed={calculatedOwed} />
      
      {/* Tax Traps Section */}
      <TaxTrapSection 
        data={data} 
        calculatedAGI={calculatedAGI} 
        calculatedTaxableIncome={calculatedTaxableIncome} 
      />
      
      {/* Information Review */}
      <div className="space-y-4">
        <PersonalInfoReview data={data} />
        <IncomeReview data={data} />
        <DeductionsReview data={data} />
      </div>
      
      <DisclaimerSection />
      
      <div className="flex justify-end space-x-2">
        <Button onClick={handleSubmit}>Proceed to E-File</Button>
      </div>
    </div>
  );
};

export default ReviewStep;
