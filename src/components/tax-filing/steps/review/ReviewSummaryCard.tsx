
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ReviewSummaryCardProps {
  refund: number;
  owed: number;
}

const ReviewSummaryCard: React.FC<ReviewSummaryCardProps> = ({ refund, owed }) => {
  return (
    <Card className="border-2 border-primary/30 overflow-hidden shadow-md">
      <div className={`p-4 text-white ${refund > 0 ? "bg-green-600" : "bg-amber-600"}`}>
        <h4 className="text-xl font-bold">
          {refund > 0 
            ? `Tax Refund: $${refund.toLocaleString()}` 
            : `Tax Owed: $${owed.toLocaleString()}`
          }
        </h4>
      </div>
      <CardContent className="p-4">
        <p className="text-sm">
          Based on the information you've provided, our calculations show that you will 
          {refund > 0 
            ? ` receive a refund of $${refund.toLocaleString()}.` 
            : ` owe $${owed.toLocaleString()}.`
          }
        </p>
      </CardContent>
    </Card>
  );
};

export default ReviewSummaryCard;
