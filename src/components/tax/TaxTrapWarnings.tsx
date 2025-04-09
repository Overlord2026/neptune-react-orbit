
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { TaxTrapWarning } from '@/utils/taxTraps/types';
import InfoTooltip from './InfoTooltip';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface TaxTrapWarningsProps {
  warnings: TaxTrapWarning[];
  className?: string;
}

const TaxTrapWarnings: React.FC<TaxTrapWarningsProps> = ({ warnings, className = "" }) => {
  // If no warnings, show positive message
  if (!warnings || warnings.length === 0) {
    return (
      <Alert className={`bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900 ${className}`}>
        <Info className="h-5 w-5 text-green-600 dark:text-green-400" />
        <AlertTitle className="text-green-800 dark:text-green-400">No Tax Traps Detected</AlertTitle>
        <AlertDescription className="text-green-700 dark:text-green-500">
          Based on your current scenario, we haven't detected any tax threshold issues that would significantly impact your tax situation.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-medium">Potential Tax Threshold Issues ({warnings.length})</h3>
      
      {warnings.map((warning, index) => {
        // Determine styling based on severity
        let alertStyle = "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900";
        let textColor = "text-blue-800 dark:text-blue-400";
        let descColor = "text-blue-700 dark:text-blue-500";
        let IconComponent = Info;
        
        if (warning.severity === 'warning') {
          alertStyle = "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900";
          textColor = "text-amber-800 dark:text-amber-400";
          descColor = "text-amber-700 dark:text-amber-500";
          IconComponent = AlertTriangle;
        } else if (warning.severity === 'alert') {
          alertStyle = "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900";
          textColor = "text-red-800 dark:text-red-400";
          descColor = "text-red-700 dark:text-red-500";
          IconComponent = AlertCircle;
        }

        return (
          <Alert key={index} className={`${alertStyle}`}>
            <IconComponent className={`h-5 w-5 ${textColor}`} />
            <AlertTitle className={`flex items-center gap-2 ${textColor}`}>
              {warning.title}
              <InfoTooltip 
                text={getTooltipText(warning.type)} 
                icon={warning.icon || 'info'} 
                className="h-4 w-4"
              />
            </AlertTitle>
            <AlertDescription className={descColor}>
              <p className="mb-1">{warning.description}</p>
              {warning.financial_impact > 0 && (
                <p className="font-medium">
                  Estimated annual impact: ${warning.financial_impact.toLocaleString(undefined, {maximumFractionDigits: 0})}
                </p>
              )}
            </AlertDescription>
          </Alert>
        );
      })}
    </div>
  );
};

// Helper function to get detailed tooltip text
function getTooltipText(type: string): string {
  switch (type) {
    case 'irmaa':
      return "IRMAA (Income-Related Monthly Adjustment Amount) is an extra charge added to your Medicare Part B and D premiums if your income is above certain thresholds. This is based on your tax return from two years prior.";
    case 'capital_gains':
      return "Long-term capital gains tax rates (0%, 15%, or 20%) depend on your taxable income. Additional income from sources like Roth conversions can push your gains into a higher tax bracket.";
    case 'social_security':
      return "Social Security benefits may be partially taxable (up to 85%) depending on your combined income (AGI + tax-exempt interest + 1/2 of Social Security benefits). Higher income can cause more of your benefits to be subject to tax.";
    case 'aca':
      return "ACA premium tax credits (subsidies) are based on your income as a percentage of the Federal Poverty Level (FPL). As your income increases, your subsidy may decrease, and if your income exceeds 400% FPL (or higher in some states), you could lose subsidies entirely.";
    default:
      return "This warning indicates a potential tax threshold issue that could impact your financial situation.";
  }
}

export default TaxTrapWarnings;
