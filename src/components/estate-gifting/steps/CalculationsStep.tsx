
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { EstateGiftingData } from '../EstateGiftingWizard';
import { ArrowRight, Database } from "lucide-react";

interface CalculationsStepProps {
  data: EstateGiftingData;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

const CalculationsStep: React.FC<CalculationsStepProps> = ({ data }) => {
  const [futureEstateNoGifting, setFutureEstateNoGifting] = useState(0);
  const [futureEstateWithGifting, setFutureEstateWithGifting] = useState(0);
  const [totalGiftValue, setTotalGiftValue] = useState(0);
  const [estimatedFutureExemption, setEstimatedFutureExemption] = useState(0);

  const CURRENT_YEAR = new Date().getFullYear();
  const ANNUAL_GIFT_EXCLUSION = 17000;
  const TAX_RATE = 0.40;

  useEffect(() => {
    const calculateValues = () => {
      const yearsUntilPassing = data.yearOfPassing - CURRENT_YEAR;
      
      // Calculate future estate value with no gifting
      const calculatedFutureEstateNoGifting = data.netWorth * Math.pow(1 + data.growthRate, yearsUntilPassing);
      setFutureEstateNoGifting(calculatedFutureEstateNoGifting);
      
      // Calculate value of gifting
      let calculatedTotalGiftValue = 0;
      
      if (data.giftingStrategy === 'annual') {
        const annualGiftTotal = data.useAnnualGifts ? 
          ANNUAL_GIFT_EXCLUSION * data.numberOfDonees : 0;
          
        // Compound value of annual gifts over years
        for (let year = 0; year < yearsUntilPassing; year++) {
          calculatedTotalGiftValue += annualGiftTotal * Math.pow(1 + data.growthRate, yearsUntilPassing - year);
        }
      } else {
        // Lump sum gifting grows until passing
        calculatedTotalGiftValue = data.lumpSumAmount * Math.pow(1 + data.growthRate, yearsUntilPassing);
      }
      
      setTotalGiftValue(calculatedTotalGiftValue);
      
      // Future estate value with gifting
      const calculatedFutureEstateWithGifting = Math.max(0, calculatedFutureEstateNoGifting - calculatedTotalGiftValue);
      setFutureEstateWithGifting(calculatedFutureEstateWithGifting);
      
      // Adjust exemption for inflation (simplified)
      const calculatedFutureExemption = data.estateExemption * Math.pow(1.025, yearsUntilPassing);
      setEstimatedFutureExemption(calculatedFutureExemption);
    };
    
    calculateValues();
  }, [data]);

  const calculateTaxableAmount = (estateValue: number) => {
    return Math.max(0, estateValue - estimatedFutureExemption - data.lifetimeGiftsUsed);
  };

  const calculateTax = (taxableAmount: number) => {
    return taxableAmount * TAX_RATE;
  };

  const taxableEstateNoGifting = calculateTaxableAmount(futureEstateNoGifting);
  const taxableEstateWithGifting = calculateTaxableAmount(futureEstateWithGifting);
  
  const taxNoGifting = calculateTax(taxableEstateNoGifting);
  const taxWithGifting = calculateTax(taxableEstateWithGifting);
  
  const taxSavings = taxNoGifting - taxWithGifting;
  const netBenefitToHeirs = taxSavings;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white mb-4">Preliminary Calculations</h3>

      {data.multiYearPlanImported && (
        <div className="bg-blue-900/30 border border-blue-700/40 rounded-md p-4 text-sm mb-4">
          <h4 className="font-medium text-blue-300 flex items-center gap-2 mb-2">
            <Database className="h-4 w-4" />
            Based on Multi-Year Plan Projections
          </h4>
          <p className="text-[#B0B0B0]">
            These calculations incorporate data from your Multi-Year Plan, using the projected final balance 
            of {formatCurrency(data.finalMultiYearBalance || data.netWorth)} in year {data.yearOfPassing}.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-[#353e52] bg-[#1A1F2C]">
          <CardContent className="p-4">
            <h4 className="text-white font-medium mb-2">Scenario A: No Gifting</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#B0B0B0]">Current Estate:</span>
                <span className="text-white">{formatCurrency(data.netWorth)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#B0B0B0]">Growth Factor:</span>
                <span className="text-white">{Math.pow(1 + data.growthRate, data.yearOfPassing - CURRENT_YEAR).toFixed(2)}x</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-[#B0B0B0]">Future Estate Value:</span>
                <span className="text-white">{formatCurrency(futureEstateNoGifting)}</span>
              </div>
              <hr className="border-[#353e52] my-2" />
              <div className="flex justify-between">
                <span className="text-[#B0B0B0]">Est. Future Exemption:</span>
                <span className="text-white">{formatCurrency(estimatedFutureExemption)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#B0B0B0]">Lifetime Gifts Used:</span>
                <span className="text-white">{formatCurrency(data.lifetimeGiftsUsed)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#B0B0B0]">Taxable Amount:</span>
                <span className="text-white">{formatCurrency(taxableEstateNoGifting)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-[#B0B0B0]">Estate Tax (40%):</span>
                <span className={`${taxNoGifting > 0 ? "text-red-400" : "text-white"}`}>
                  {formatCurrency(taxNoGifting)}
                </span>
              </div>
              <hr className="border-[#353e52] my-2" />
              <div className="flex justify-between font-medium">
                <span className="text-[#B0B0B0]">Net to Heirs:</span>
                <span className="text-white">{formatCurrency(futureEstateNoGifting - taxNoGifting)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#353e52] bg-[#1A1F2C]">
          <CardContent className="p-4">
            <h4 className="text-white font-medium mb-2">Scenario B: With Gifting</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#B0B0B0]">
                  {data.giftingStrategy === 'annual' ? 'Annual Gifts:' : 'Lump Sum Gift:'}
                </span>
                <span className="text-white">
                  {data.giftingStrategy === 'annual' 
                    ? `${formatCurrency(ANNUAL_GIFT_EXCLUSION * data.numberOfDonees)}/year` 
                    : formatCurrency(data.lumpSumAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#B0B0B0]">Total Gift Value at Death:</span>
                <span className="text-white">{formatCurrency(totalGiftValue)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-[#B0B0B0]">Remaining Estate Value:</span>
                <span className="text-white">{formatCurrency(futureEstateWithGifting)}</span>
              </div>
              <hr className="border-[#353e52] my-2" />
              <div className="flex justify-between">
                <span className="text-[#B0B0B0]">Est. Future Exemption:</span>
                <span className="text-white">{formatCurrency(estimatedFutureExemption)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#B0B0B0]">Lifetime Gifts Used:</span>
                <span className="text-white">{formatCurrency(data.lifetimeGiftsUsed)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#B0B0B0]">Taxable Amount:</span>
                <span className="text-white">{formatCurrency(taxableEstateWithGifting)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-[#B0B0B0]">Estate Tax (40%):</span>
                <span className={`${taxWithGifting > 0 ? "text-red-400" : "text-white"}`}>
                  {formatCurrency(taxWithGifting)}
                </span>
              </div>
              <hr className="border-[#353e52] my-2" />
              <div className="flex justify-between font-medium">
                <span className="text-[#B0B0B0]">Net to Heirs:</span>
                <span className="text-white">{formatCurrency(futureEstateWithGifting - taxWithGifting + totalGiftValue)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-[#242A38] p-4 rounded-lg border border-green-800/30 mt-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-white font-medium">Potential Tax Savings</h4>
          <span className={`text-lg font-bold ${taxSavings > 0 ? "text-green-400" : "text-white"}`}>
            {formatCurrency(taxSavings)}
          </span>
        </div>
        <div className="flex items-center text-sm">
          <span className="text-[#B0B0B0] flex-grow">
            Total Benefit to Heirs from Gifting Strategy
          </span>
          <span className="text-white mx-2">
            <ArrowRight className="h-4 w-4" />
          </span>
          <span className="text-green-400 font-medium">
            {formatCurrency(totalGiftValue + taxSavings)}
          </span>
        </div>
        
        <div className="bg-blue-950/30 border border-blue-800/30 rounded p-3 mt-4 text-blue-200 text-sm">
          The calculations above show potential benefits of your gifting strategy. These estimates are based on your inputs and 
          current tax laws. The next page will provide a detailed comparison of both scenarios.
        </div>
      </div>
    </div>
  );
};

export default CalculationsStep;
