
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatCurrency } from '../utils/formatUtils';

interface EstateDistributionPieChartProps {
  data: Array<{ name: string; value: number }>;
  title: string;
  footerData: Array<{ label: string; value: string; className?: string }>;
}

const COLORS = ['#00C47C', '#FF4D4F'];

const EstateDistributionPieChart: React.FC<EstateDistributionPieChartProps> = ({ 
  data, 
  title,
  footerData 
}) => {
  return (
    <div className="h-full">
      <h4 className="text-white font-medium mb-2">{title}</h4>
      <div className="h-[180px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              fill="#8884d8"
              paddingAngle={3}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="space-y-2 text-sm mt-4">
        {footerData.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span className={item.className || "text-[#B0B0B0]"}>{item.label}</span>
            <span className={item.className || "text-white"}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EstateDistributionPieChart;
