import React from "react";
import { useEquityForm } from "../context/EquityFormContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatCurrency } from "../utils/formatUtils";

export const EquityComparisonChart: React.FC = () => {
  const { formState, calculateMultiYearImpact } = useEquityForm();
  const currentYear = new Date().getFullYear();
  
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
  
  const data = generateChartData();
  
  const chartConfig = {
    incomeWithStrategy: { label: "Income with Strategy", color: "#9b87f5" },
    incomeWithoutStrategy: { label: "Income without Strategy", color: "#6b7280" },
    taxWithStrategy: { label: "Tax with Strategy", color: "#F87171" },
    taxWithoutStrategy: { label: "Tax without Strategy", color: "#ef4444" },
    amtImpact: { label: "Potential AMT", color: "#f59e0b" },
    taxSavings: { label: "Tax Savings", color: "#34d399" }
  };
  
  return (
    <ChartContainer className="aspect-[16/9] w-full" config={chartConfig}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(value) => `$${(value / 1000).toLocaleString()}k`} />
        <ChartTooltip 
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-md">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2 border-b pb-2 text-center font-medium">
                      Year: {payload[0].payload.name}
                    </div>
                    {payload.map((entry) => (
                      <div key={entry.name} className="flex justify-between text-sm">
                        <span className="font-medium mr-2">{entry.name}:</span>
                        <span>{formatCurrency(Number(entry.value))}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend />
        <Bar name="Income with Strategy" dataKey="actualIncome" fill="#9b87f5" barSize={30} />
        <Bar name="Income without Strategy" dataKey="noStrategyIncome" fill="#6b7280" barSize={30} />
        <Bar name="Tax with Strategy" dataKey="actualTax" fill="#F87171" barSize={30} />
        <Bar name="Tax without Strategy" dataKey="taxWithoutStrategy" fill="#ef4444" barSize={30} />
        {formState.equityType === "ISO" && (
          <Bar name="Potential AMT" dataKey="amtImpact" fill="#f59e0b" barSize={30} />
        )}
        <Bar name="Tax Savings" dataKey="taxSavings" fill="#34d399" barSize={30} />
      </BarChart>
    </ChartContainer>
  );
};
