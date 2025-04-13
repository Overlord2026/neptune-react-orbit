
import React from 'react';
import { calculateCrtBenefits } from '../../utils/crtCalculationUtils';

interface CrtBenefitsPreviewProps {
  type: "CRAT" | "CRUT";
  fundingAmount: number;
  payoutRate: number;
  trustTerm: number | "lifetime";
  beneficiaryAge: number;
  spouseBeneficiary: boolean;
  spouseAge?: number;
}

const CrtBenefitsPreview: React.FC<CrtBenefitsPreviewProps> = ({
  type,
  fundingAmount,
  payoutRate,
  trustTerm,
  beneficiaryAge,
  spouseBeneficiary,
  spouseAge
}) => {
  const crtBenefits = calculateCrtBenefits({
    type,
    fundingAmount,
    payoutRate,
    trustTerm,
    beneficiaryAge,
    spouseBeneficiary,
    spouseAge
  });

  return (
    <div className="bg-primary/5 rounded-md p-4">
      <h4 className="font-medium mb-2">Estimated Benefits</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-muted-foreground">Charitable Deduction</div>
          <div className="text-xl font-medium">${Math.round(crtBenefits.immediateDeduction).toLocaleString()}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Annual Payout</div>
          <div className="text-xl font-medium">${Math.round(crtBenefits.annualPayout).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export default CrtBenefitsPreview;
