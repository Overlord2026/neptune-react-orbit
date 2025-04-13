
import React from "react";
import { useEquityForm } from "../context/EquityFormContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export const EquityComparisonChart: React.FC = () => {
  const { formState } = useEquityForm();
  const currentYear = new Date().getFullYear();
  
  // Generate simplified data for the chart
  const generateChartData = () => {
    const data = [];
    
    // Year 1 data
    const year1Data: any = {
      name: `${currentYear}`,
    };
    
    // Year 2 data
    const year2Data: any = {
      name: `${currentYear + 1}`,
    };
    
    // Add stock option exercise data if applicable
    if (formState.equityType === "NSO" || formState.equityType === "ISO") {
      if (formState.planningApproach === "multi-year") {
        // Multi-year approach data
        const year1Spread = (formState.fairMarketValue - formState.strikePrice) * (formState.year1Exercise || 0);
        const year2Spread = (formState.fairMarketValue - formState.strikePrice) * (formState.year2Exercise || 0);
        
        year1Data.stockOptions = year1Spread;
        year2Data.stockOptions = year2Spread;
      } else {
        // Single year approach
        const spread = (formState.fairMarketValue - formState.strikePrice) * formState.vestedShares;
        if (formState.exerciseStrategy === "full") {
          year1Data.stockOptions = spread;
          year2Data.stockOptions = 0;
        } else if (formState.exerciseStrategy === "partial") {
          const partialSpread = (formState.fairMarketValue - formState.strikePrice) * formState.partialShares;
          year1Data.stockOptions = partialSpread;
          year2Data.stockOptions = 0;
        } else if (formState.exerciseStrategy === "split") {
          const sharesPerYear = Math.floor(formState.vestedShares / formState.splitYears);
          const spreadPerYear = (formState.fairMarketValue - formState.strikePrice) * sharesPerYear;
          
          year1Data.stockOptions = spreadPerYear;
          year2Data.stockOptions = formState.splitYears > 1 ? spreadPerYear : 0;
        }
      }
    }
    
    // Add deferred compensation data if applicable
    if (formState.hasDeferredComp) {
      if (formState.planningApproach === "multi-year") {
        // Multi-year approach data
        year1Data.deferredComp = formState.hasDeferredComp ? formState.bonusAmount - formState.year1Deferral : 0;
        year2Data.deferredComp = formState.year2Deferral || 0;
      } else {
        // Single year approach based on deferral strategy
        if (formState.deferralStrategy === "next-year") {
          year1Data.deferredComp = formState.bonusAmount - formState.deferralAmount;
          year2Data.deferredComp = formState.deferralAmount;
        } else if (formState.deferralStrategy === "multi-year") {
          const amountPerYear = formState.deferralAmount / formState.deferralYears;
          year1Data.deferredComp = formState.bonusAmount - formState.deferralAmount;
          year2Data.deferredComp = formState.deferralYears > 0 ? amountPerYear : 0;
        }
      }
    }
    
    // Add estimated tax data
    const calcYear1Tax = (year1Data.stockOptions || 0) * 0.37 + (year1Data.deferredComp || 0) * 0.37;
    const calcYear2Tax = (year2Data.stockOptions || 0) * 0.35 + (year2Data.deferredComp || 0) * 0.35;
    
    year1Data.tax = calcYear1Tax;
    year2Data.tax = calcYear2Tax;
    
    // Add both years to chart data
    data.push(year1Data);
    data.push(year2Data);
    
    return data;
  };
  
  const data = generateChartData();
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
        <Tooltip 
          formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
          labelFormatter={(label) => `Year: ${label}`}
        />
        <Legend />
        {(formState.equityType === "NSO" || formState.equityType === "ISO") && (
          <Bar 
            name="Stock Option Income" 
            dataKey="stockOptions" 
            fill="#FFD700" 
            barSize={40}
          />
        )}
        {formState.hasDeferredComp && (
          <Bar 
            name="Deferred Compensation" 
            dataKey="deferredComp" 
            fill="#9b87f5" 
            barSize={40}
          />
        )}
        <Bar 
          name="Estimated Tax" 
          dataKey="tax" 
          fill="#F87171" 
          barSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
