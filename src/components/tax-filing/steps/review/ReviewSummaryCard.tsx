
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, CheckCircle, CircleDollarSign, CreditCard } from 'lucide-react';
import { StateCode } from '@/utils/stateTax/types';

export interface ReviewSummaryCardProps {
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
  const isRefund = refund > 0;
  const amount = isRefund ? refund : owed;
  
  return (
    <Card className={isRefund ? "bg-green-50" : "bg-amber-50"}>
      <CardContent className="pt-6">
        <div className="flex items-start space-x-4">
          <div className={`p-2 rounded-full ${isRefund ? "bg-green-100" : "bg-amber-100"}`}>
            {isRefund ? 
              <CheckCircle className="h-8 w-8 text-green-600" /> :
              <AlertCircle className="h-8 w-8 text-amber-600" />}
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-semibold">{isRefund ? "Estimated Refund" : "Estimated Tax Due"}</h4>
            <p className="text-3xl font-bold mt-1">${amount.toLocaleString()}</p>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
              <div className="flex items-center text-gray-600">
                <CircleDollarSign className="h-4 w-4 mr-1" />
                <span className="text-sm">Federal Tax: ${(amount).toLocaleString()}</span>
              </div>
              
              {stateTax !== undefined && (
                <div className="flex items-center text-gray-600">
                  <CreditCard className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    {residentState} State Tax: ${stateTax.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewSummaryCard;
