
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

interface ChartDataItem {
  name: string;
  totalTax: number;
  effectiveRate: number;
  scenario: string;
}

interface ScenarioComparisonChartProps {
  chartData: ChartDataItem[];
}

const ScenarioComparisonChart: React.FC<ScenarioComparisonChartProps> = ({ chartData }) => {
  return (
    <div className="h-80">
      <ChartContainer
        config={{
          "2021": { color: "#1e40af" },
          "2022": { color: "#047857" },
          "2023": { color: "#FFD700" },
        }}
      >
        <BarChart 
          data={chartData} 
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar 
            yAxisId="left" 
            dataKey="totalTax" 
            name="Total Tax ($)" 
            fill="var(--color-2021)" 
            className="opacity-80 hover:opacity-100" 
            barSize={40} 
          />
          <Bar 
            yAxisId="right" 
            dataKey="effectiveRate" 
            name="Effective Rate (%)" 
            fill="var(--color-2023)" 
            className="opacity-80 hover:opacity-100" 
            barSize={40} 
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default ScenarioComparisonChart;
