
import React from 'react';
import { AlertTriangle } from "lucide-react";

const TaxConsiderationWarning: React.FC = () => {
  return (
    <div className="rounded-lg border border-amber-600/30 bg-amber-50/10 p-4 text-sm">
      <div className="flex gap-2">
        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
        <div>
          <p className="font-medium text-amber-500">Important Tax Considerations</p>
          <div className="space-y-2 text-muted-foreground">
            <p>
              For the most accurate results, consider your full tax situation, including other income sources
              and potential deductions. The projections use a simplified tax model and should not be the sole basis
              for financial decisions.
            </p>
            <p>
              If comparing MFJ vs. MFS filing statuses, be aware of limitations for married separate filers,
              including restrictions on certain deductions and credits. Community property rules may affect
              how income is allocated between spouses for tax purposes.
            </p>
            <p>
              IRMAA surcharges for Medicare may be triggered by higher income from Roth conversions. These surcharges
              apply to Medicare Part B and Part D premiums and are based on your Modified Adjusted Gross Income (MAGI)
              from two years prior. Consult with a qualified tax professional for personalized advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxConsiderationWarning;
