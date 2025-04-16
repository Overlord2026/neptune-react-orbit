
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { StateCode } from '@/utils/stateTax';

interface ReviewSummaryCardProps {
  refund: number;
  owed: number;
  stateTax?: number;
  residentState?: StateCode;
}

const ReviewSummaryCard: React.FC<ReviewSummaryCardProps> = ({ 
  refund, 
  owed,
  stateTax,
  residentState
}) => {
  const showRefund = refund > 0;
  
  return (
    <Card className={`${showRefund ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'} shadow-sm`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium">
              {showRefund ? 'Your Tax Refund' : 'Your Tax Amount Due'}
            </h2>
            <h3 className={`text-3xl font-bold ${showRefund ? 'text-green-600' : 'text-amber-600'}`}>
              ${(showRefund ? refund : owed).toLocaleString()}
            </h3>
          </div>
          <div className={`p-4 rounded-full ${showRefund ? 'bg-green-100' : 'bg-amber-100'}`}>
            {showRefund ? (
              <ArrowDown className="h-8 w-8 text-green-600" />
            ) : (
              <ArrowUp className="h-8 w-8 text-amber-600" />
            )}
          </div>
        </div>
        
        {/* State Tax Information */}
        {stateTax !== undefined && residentState && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-medium">Tax Breakdown</h4>
            <div className="text-sm mt-2">
              <div className="flex justify-between">
                <span>Federal Tax:</span>
                <span className="font-medium">${(owed + refund - stateTax).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>State Tax ({residentState}):</span>
                <span className="font-medium">${stateTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold mt-1 pt-1 border-t border-gray-200">
                <span>Total Tax:</span>
                <span>${(owed + refund).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewSummaryCard;
