
import React from "react";
import { WarningBanner } from "./WarningBanner";

interface WarningsSectionProps {
  triggersAmt: boolean;
  hasDeferred: boolean;
  isDisqualifyingDisposition: boolean;
}

export const WarningsSection: React.FC<WarningsSectionProps> = ({
  triggersAmt,
  hasDeferred,
  isDisqualifyingDisposition
}) => {
  const showFirstWarning = triggersAmt || hasDeferred;
  
  return (
    <>
      {showFirstWarning && (
        <WarningBanner variant="info">
          {triggersAmt && (
            <>
              <span className="font-medium">ISO AMT Consideration:</span> Exercising ISOs may trigger Alternative Minimum Tax. 
              The actual AMT calculation is complex and depends on your full tax situation.
              {' '}
            </>
          )}
          {hasDeferred && (
            <>
              <span className="font-medium">Deferral Note:</span> Tax benefits from deferral depend on future tax rates 
              and your income level when deferred amounts are received.
            </>
          )}
        </WarningBanner>
      )}
      
      {isDisqualifyingDisposition && (
        <WarningBanner variant="warning" title="Disqualifying Disposition: ">
          Selling ISO shares less than 1 year after exercise 
          or within 2 years of grant creates a disqualifying disposition, causing the spread to be taxed as ordinary income.
        </WarningBanner>
      )}
    </>
  );
};
