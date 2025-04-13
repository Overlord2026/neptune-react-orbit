
import { useEquityForm } from "../../context/EquityFormContext";

export const useChartData = () => {
  const { formState, calculateMultiYearImpact } = useEquityForm();
  const yearlyImpact = calculateMultiYearImpact();
  
  const generateChartData = () => {
    const data = [];
    
    for (const yearData of yearlyImpact) {
      const dataPoint: any = {
        name: `${yearData.year}`,
        actualIncome: Number(yearData.ordinaryIncome),
        noStrategyIncome: Number(yearData.ordinaryIncome + yearData.taxSavings),
        actualTax: Number(yearData.totalTax),
        noStrategyTax: Number(yearData.taxWithoutStrategy),
        taxSavings: yearData.taxSavings > 0 ? Number(yearData.taxSavings) : 0
      };
      
      if (formState.equityType === "ISO" && yearData.amtAdjustment > 0) {
        dataPoint.amtImpact = Number(yearData.amtAdjustment);
      }
      
      data.push(dataPoint);
    }
    
    return data;
  };

  const chartConfig = {
    incomeWithStrategy: { label: "Income with Strategy", color: "#9b87f5" },
    incomeWithoutStrategy: { label: "Income without Strategy", color: "#6b7280" },
    taxWithStrategy: { label: "Tax with Strategy", color: "#F87171" },
    taxWithoutStrategy: { label: "Tax without Strategy", color: "#ef4444" },
    amtImpact: { label: "Potential AMT", color: "#f59e0b" },
    taxSavings: { label: "Tax Savings", color: "#34d399" }
  };
  
  return {
    data: generateChartData(),
    config: chartConfig,
    hasAmt: formState.equityType === "ISO"
  };
};
