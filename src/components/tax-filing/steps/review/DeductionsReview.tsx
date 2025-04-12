
import React from 'react';
import { Card } from '@/components/ui/card';
import { TaxReturnData } from '../../types/TaxReturnTypes';

interface DeductionsReviewProps {
  data: TaxReturnData;
}

const DeductionsReview: React.FC<DeductionsReviewProps> = ({ data }) => {
  // Calculate the total itemized deductions safely
  const totalItemizedDeductions = Object.values(data.itemizedDeductions).reduce(
    (sum, value) => sum + (typeof value === 'number' ? value : 0), 
    0
  );

  return (
    <>
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
              <dd>${totalItemizedDeductions.toLocaleString()}</dd>
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
    </>
  );
};

export default DeductionsReview;
