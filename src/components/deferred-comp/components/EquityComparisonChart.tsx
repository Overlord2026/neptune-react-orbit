
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { ChartTooltipContent } from "./chart/ChartTooltipContent";
import { useChartData } from "./chart/ChartData";

export const EquityComparisonChart: React.FC = () => {
  const { data, config, hasAmt } = useChartData();
  
  return (
    <ChartContainer className="aspect-[16/9] w-full" config={config}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(value) => `$${(value / 1000).toLocaleString()}k`} />
        <ChartTooltip content={props => <ChartTooltipContent {...props} />} />
        <Legend />
        <Bar name="Income with Strategy" dataKey="actualIncome" fill="#9b87f5" barSize={30} />
        <Bar name="Income without Strategy" dataKey="noStrategyIncome" fill="#6b7280" barSize={30} />
        <Bar name="Tax with Strategy" dataKey="actualTax" fill="#F87171" barSize={30} />
        <Bar name="Tax without Strategy" dataKey="noStrategyTax" fill="#ef4444" barSize={30} />
        {hasAmt && (
          <Bar name="Potential AMT" dataKey="amtImpact" fill="#f59e0b" barSize={30} />
        )}
        <Bar name="Tax Savings" dataKey="taxSavings" fill="#34d399" barSize={30} />
      </BarChart>
    </ChartContainer>
  );
};
