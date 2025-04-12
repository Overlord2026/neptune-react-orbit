
import React from 'react';
import { Card } from '@/components/ui/card';
import { TaxReturnData } from '../../SimpleReturnFilingFlow';

interface IncomeReviewProps {
  data: TaxReturnData;
}

const IncomeReview: React.FC<IncomeReviewProps> = ({ data }) => {
  return (
    <>
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
    </>
  );
};

export default IncomeReview;
