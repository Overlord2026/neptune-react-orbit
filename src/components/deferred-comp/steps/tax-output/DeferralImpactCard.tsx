
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEquityForm } from "../../context/EquityFormContext";
import { formatCurrency } from "../../utils/formatUtils";

interface DeferralImpactCardProps {
  currentYear: number;
}

export const DeferralImpactCard: React.FC<DeferralImpactCardProps> = ({ currentYear }) => {
  const { formState, calculateDeferralBenefit } = useEquityForm();
  
  const deferralBenefit = calculateDeferralBenefit();
  const taxSavingsPercentage = (deferralBenefit / formState.deferralAmount) * 100;
  
  const getTaxImpactDescription = () => {
    if (formState.deferralStrategy === "next-year") {
      return (
        <>
          By deferring {formatCurrency(formState.deferralAmount)} to {currentYear + 1}, 
          you'll reduce your {currentYear} taxable income and potentially lower your tax bracket.
        </>
      );
    } else if (formState.deferralStrategy === "multi-year") {
      const endYear = currentYear + (formState.deferralYears || 2);
      return (
        <>
          By spreading {formatCurrency(formState.deferralAmount)} across {formState.deferralYears || 2} years 
          ({currentYear + 1} to {endYear}), you'll reduce income spikes and potentially stay in lower tax brackets.
        </>
      );
    }
    return null;
  };

  const getAverageAnnualAmount = () => {
    if (formState.deferralStrategy === "next-year") {
      return formState.deferralAmount;
    } else if (formState.deferralStrategy === "multi-year") {
      return formState.deferralAmount / (formState.deferralYears || 2);
    }
    return 0;
  };

  return (
    <Card className="bg-gradient-to-br from-blue-950 to-indigo-950 border-[#3B4A75] text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-blue-200">Deferred Compensation Impact</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-900/30 rounded-lg">
              <div className="text-sm text-blue-200">Total Deferral</div>
              <div className="text-xl font-semibold">{formatCurrency(formState.deferralAmount)}</div>
            </div>
            <div className="p-3 bg-blue-900/30 rounded-lg">
              <div className="text-sm text-blue-200">Tax Savings</div>
              <div className="text-xl font-semibold text-green-400">{formatCurrency(deferralBenefit)}</div>
              <div className="text-xs text-blue-300">~{taxSavingsPercentage.toFixed(1)}% benefit</div>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium text-blue-200">Deferral Strategy</h4>
            <p className="text-sm mt-1 text-blue-100">
              {getTaxImpactDescription()}
            </p>
          </div>
          
          <div className="mt-4 p-3 bg-blue-900/30 rounded-lg">
            <div className="text-sm text-blue-200">Future Annual Payments</div>
            <div className="mt-1 flex justify-between items-center">
              <div>
                <div className="text-lg font-semibold">{formatCurrency(getAverageAnnualAmount())}</div>
                <div className="text-xs text-blue-300">per year</div>
              </div>
              <div className="text-xs text-blue-300">
                {formState.deferralStrategy === "next-year" ? (
                  <>In {currentYear + 1}</>
                ) : (
                  <>{currentYear + 1} - {currentYear + (formState.deferralYears || 2)}</>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-3 text-xs text-blue-300 italic">
            Note: Future taxation will depend on your income and tax rates in those years.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeferralImpactCard;
