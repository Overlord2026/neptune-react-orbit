
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

  return (
    <Card className="bg-[#1A1F2C] border border-[#8E9196] overflow-hidden mt-6">
      <CardHeader>
        <CardTitle className="text-xl text-[#FFD700]">Current Tax Limits ({selectedYear})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-3">Retirement Accounts</h4>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>IRA Contribution Limit:</span>
                <DynamicContentText options={contentOptions} className="font-semibold">
                  {`IRA_limit`}
                </DynamicContentText>
              </li>
              <li className="flex justify-between">
                <span>401(k) Contribution Limit:</span>
                <DynamicContentText options={contentOptions} className="font-semibold">
                  {`401k_limit`}
                </DynamicContentText>
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
