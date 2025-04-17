import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { CharitableContribution } from '@/types/tax/rothConversionTypes';

interface CharitableContributionImpactProps {
  charitableContribution: CharitableContribution;
}

const CharitableContributionImpact: React.FC<CharitableContributionImpactProps> = ({
  charitableContribution,
}) => {
  const { amount, isItemizing, taxSavings, trapAvoidance = [] } = charitableContribution;

  if (amount === 0) {
    return null;
  }

  return (
    <Card className="bg-green-50/30 dark:bg-green-900/10">
      <CardContent className="pt-4">
        <h4 className="font-medium mb-2">Charitable Contribution Impact</h4>
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span>Contribution Amount:</span>
            <span className="font-medium">${amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>{isItemizing ? 'Itemized Deduction:' : 'Standard Deduction:'}</span>
            <span className="font-medium">
              ${(isItemizing ? charitableContribution.itemizedDeduction : charitableContribution.standardDeduction)?.toLocaleString() || '0'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Tax Savings:</span>
            <span className="font-medium">${taxSavings?.toLocaleString()}</span>
          </div>
        </div>

        {trapAvoidance.length > 0 && (
          <div className="mt-4">
            <h5 className="text-xs font-medium text-muted-foreground">Tax Trap Avoidance:</h5>
            {trapAvoidance.map((avoidance, idx) => (
              <div key={`${avoidance.type}-${idx}`} className="flex items-start mt-2 gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">
                    {avoidance.name || avoidance.type}: ${avoidance.savings.toLocaleString()}
                  </p>
                  {avoidance.description && (
                    <p className="text-xs text-muted-foreground">{avoidance.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CharitableContributionImpact;
