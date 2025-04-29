
import React from 'react';
import { TaxReturnData } from '../../types/TaxReturnTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatUtils';

interface DeductionsReviewProps {
  data: TaxReturnData;
}

const DeductionsReview: React.FC<DeductionsReviewProps> = ({ data }) => {
  const totalItemized = Object.values(data.itemizedDeductions).reduce((sum, value) => sum + Number(value), 0);
  const standardDeduction = data.filingStatus === 'married_joint' ? 25900 : 
                           data.filingStatus === 'head_of_household' ? 19400 : 12950;
                           
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Deductions & Credits</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium">Deduction Method</h3>
          <p className="text-muted-foreground">
            {data.useStandardDeduction ? 
              `Standard Deduction: $${formatCurrency(standardDeduction)}` : 
              `Itemized Deductions: $${formatCurrency(totalItemized)}`}
          </p>
        </div>
        
        {!data.useStandardDeduction && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Itemized Deductions Breakdown</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex justify-between">
                <span>Medical Expenses</span>
                <span>${formatCurrency(data.itemizedDeductions.medicalExpenses)}</span>
              </li>
              <li className="flex justify-between">
                <span>State & Local Taxes</span>
                <span>${formatCurrency(data.itemizedDeductions.stateTaxes)}</span>
              </li>
              <li className="flex justify-between">
                <span>Property Taxes</span>
                <span>${formatCurrency(data.itemizedDeductions.propertyTaxes)}</span>
              </li>
              <li className="flex justify-between">
                <span>Mortgage Interest</span>
                <span>${formatCurrency(data.itemizedDeductions.mortgageInterest)}</span>
              </li>
              <li className="flex justify-between">
                <span>Charitable Contributions</span>
                <span>${formatCurrency(data.itemizedDeductions.charitableContributions)}</span>
              </li>
              <li className="flex justify-between font-medium border-t pt-1 mt-1">
                <span>Total</span>
                <span>${formatCurrency(totalItemized)}</span>
              </li>
            </ul>
          </div>
        )}
        
        <div>
          <h3 className="font-medium">Tax Credits</h3>
          <ul className="text-sm text-muted-foreground">
            {data.childTaxCredit && (
              <li>Child Tax Credit: Applied for {data.dependents.length} dependent(s)</li>
            )}
            {data.educationCredit && (
              <li>Education Credit: Applied</li>
            )}
            {!data.childTaxCredit && !data.educationCredit && (
              <li>No tax credits applied</li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeductionsReview;
