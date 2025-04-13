
import React from 'react';

interface ResultMetricCardProps {
  title: string;
  value: string | number;
  description: string;
}

const ResultMetricCard: React.FC<ResultMetricCardProps> = ({ title, value, description }) => {
  return (
    <div className="bg-[#1A1F2C] p-4 rounded-md">
      <h4 className="text-[#FFD700] text-sm font-medium mb-1">{title}</h4>
      <div className="text-2xl font-bold text-white">
        {typeof value === 'number' ? `$${value.toLocaleString()}` : value}
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {description}
      </p>
    </div>
  );
};

export default ResultMetricCard;
