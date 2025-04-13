
import React from 'react';
import { AlertTriangle } from "lucide-react";

const TaxConsiderationWarning: React.FC = () => {
  return (
    <div className="rounded-lg border border-amber-600/30 bg-amber-50/10 p-4 text-sm">
      <div className="flex gap-2">
        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
        <div>
          <p className="font-medium text-amber-500">Important Tax Consideration</p>
          <p className="text-muted-foreground">
            For the most accurate results, consider your full tax situation, including other income sources
            and potential deductions. The projections use a simplified tax model and should not be the sole basis
            for financial decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaxConsiderationWarning;
