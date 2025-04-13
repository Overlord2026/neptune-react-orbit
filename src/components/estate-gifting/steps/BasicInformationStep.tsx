
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { EstateGiftingData } from '../EstateGiftingWizard';
import { InfoIcon } from "lucide-react";

interface BasicInformationStepProps {
  data: EstateGiftingData;
  onUpdateField: (field: keyof EstateGiftingData, value: any) => void;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

const BasicInformationStep: React.FC<BasicInformationStepProps> = ({ data, onUpdateField }) => {
  const handleExemptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
    onUpdateField('estateExemption', isNaN(value) ? 0 : value * 1000000); // Convert millions to actual value
  };

  const handleNetWorthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
    const netWorth = isNaN(value) ? 0 : value * 1000000;
    onUpdateField('netWorth', netWorth);
    
    // Update threshold indicator based on net worth vs exemption
    onUpdateField('aboveThreshold', netWorth > data.estateExemption);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white">Estate Information</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="netWorth" className="text-white">
            Your Estimated Net Worth / Total Estate Size
          </Label>
          <div className="mt-1 relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
            <Input
              id="netWorth"
              type="text"
              placeholder="0.00"
              value={data.netWorth === 0 ? "" : (data.netWorth / 1000000).toString()}
              onChange={handleNetWorthChange}
              className="pl-8 bg-[#1A1F2C] border-[#353e52] text-white"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">million</span>
          </div>
          <p className="text-sm text-[#B0B0B0] mt-1">
            Include all assets: real estate, investments, retirement accounts, life insurance, and personal property
          </p>
        </div>

        <div>
          <Label htmlFor="estateExemption" className="text-white flex items-center gap-2">
            Current Federal Estate Tax Exemption
            <span className="text-[#FFD700] cursor-pointer hover:text-opacity-80" title="The amount that can be transferred free of federal estate tax. This amount is subject to change based on tax laws.">
              <InfoIcon className="w-4 h-4" />
            </span>
          </Label>
          <div className="mt-1 relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
            <Input
              id="estateExemption"
              type="text"
              placeholder="12.92"
              value={data.estateExemption === 0 ? "" : (data.estateExemption / 1000000).toString()}
              onChange={handleExemptionChange}
              className="pl-8 bg-[#1A1F2C] border-[#353e52] text-white"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">million</span>
          </div>
          <p className="text-sm text-[#B0B0B0] mt-1">
            Default is $12.92 million per person (2023). This amount is scheduled to be reduced in 2026.
          </p>
        </div>

        {data.netWorth > 0 && data.estateExemption > 0 && (
          <div className={`p-4 rounded-md ${data.aboveThreshold ? "bg-amber-50/10 border border-amber-200/30" : "bg-emerald-50/10 border border-emerald-200/30"}`}>
            <p className={`text-sm font-medium ${data.aboveThreshold ? "text-amber-400" : "text-emerald-400"}`}>
              {data.aboveThreshold 
                ? `Your estate may be subject to federal estate taxes. The amount above the exemption (${formatCurrency(Math.max(0, data.netWorth - data.estateExemption))}) could be taxed at up to 40%.` 
                : "Based on current law, your estate is below the federal estate tax exemption threshold."}
            </p>
          </div>
        )}

        <div className="flex items-start space-x-2 pt-2">
          <Checkbox 
            id="above-threshold-checkbox" 
            checked={data.aboveThreshold}
            onCheckedChange={(checked) => onUpdateField('aboveThreshold', checked === true)}
          />
          <Label 
            htmlFor="above-threshold-checkbox" 
            className="text-sm cursor-pointer"
          >
            I expect my estate value will exceed the exemption threshold (either through asset growth or future change in tax laws)
          </Label>
        </div>
      </div>
    </div>
  );
};

export default BasicInformationStep;
