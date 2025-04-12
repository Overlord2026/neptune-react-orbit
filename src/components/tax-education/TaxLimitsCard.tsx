
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import DynamicContentText from '@/components/DynamicContentText';

interface TaxLimitsCardProps {
  selectedYear: number;
}

const TaxLimitsCard: React.FC<TaxLimitsCardProps> = ({ selectedYear }) => {
  const contentOptions = {
    year: selectedYear,
    format: 'currency' as const
  };

  // Projected retirement limits for 2025
  const getLimitValue = (key: string): string => {
    if (selectedYear === 2025) {
      switch (key) {
        case "IRA_limit": return "$7,000";
        case "401k_limit": return "$23,500";
        case "IRA_catchup": return "$1,000";
        case "401k_catchup": return "$7,500";
        default: return "Data not available";
      }
    }
    return `{${key}}`;
  };

  return (
    <Card className="bg-[#1A1F2C] border border-[#8E9196] overflow-hidden mt-6">
      <CardHeader>
        <CardTitle className="text-xl text-[#FFD700]">Current Tax Limits ({selectedYear})</CardTitle>
        {selectedYear === 2025 && (
          <p className="text-xs text-gray-400">
            Tax rates and thresholds for 2025 are projected/estimated and may change once official IRS figures are released. For the most accurate information, consult the latest IRS publications.
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-3">Retirement Accounts</h4>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>IRA Contribution Limit:</span>
                {selectedYear === 2025 ? (
                  <span className="font-semibold">{getLimitValue("IRA_limit")}</span>
                ) : (
                  <DynamicContentText options={contentOptions} className="font-semibold">
                    {`IRA_limit`}
                  </DynamicContentText>
                )}
              </li>
              <li className="flex justify-between">
                <span>401(k) Contribution Limit:</span>
                {selectedYear === 2025 ? (
                  <span className="font-semibold">{getLimitValue("401k_limit")}</span>
                ) : (
                  <DynamicContentText options={contentOptions} className="font-semibold">
                    {`401k_limit`}
                  </DynamicContentText>
                )}
              </li>
              <li className="flex justify-between">
                <span>Catch-up Contribution (50+):</span>
                {selectedYear === 2025 ? (
                  <span className="font-semibold">{getLimitValue("401k_catchup")}</span>
                ) : (
                  <DynamicContentText options={contentOptions} className="font-semibold">
                    {`401k_catchup`}
                  </DynamicContentText>
                )}
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">Standard Deductions</h4>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Single:</span>
                <DynamicContentText 
                  options={{...contentOptions, filingStatus: 'single'}} 
                  className="font-semibold"
                >
                  {`current_standard_deduction`}
                </DynamicContentText>
              </li>
              <li className="flex justify-between">
                <span>Married Filing Jointly:</span>
                <DynamicContentText 
                  options={{...contentOptions, filingStatus: 'married'}} 
                  className="font-semibold"
                >
                  {`current_standard_deduction`}
                </DynamicContentText>
              </li>
              <li className="flex justify-between">
                <span>Head of Household:</span>
                <DynamicContentText 
                  options={{...contentOptions, filingStatus: 'head_of_household'}} 
                  className="font-semibold"
                >
                  {`current_standard_deduction`}
                </DynamicContentText>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxLimitsCard;
