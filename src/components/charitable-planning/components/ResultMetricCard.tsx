
import React from 'react';

interface ResultMetricCardProps {
  title: string;
  value: number;
  description: string;
  highlight?: boolean;
}

const ResultMetricCard: React.FC<ResultMetricCardProps> = ({ 
  title, 
  value, 
  description,
  highlight = false
}) => {
  const formattedValue = value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });
  
  const bgColor = highlight ? "bg-primary/20" : "bg-[#1A1F2C]";
  const borderColor = highlight ? "border-primary/30" : "border-slate-700";
  const titleColor = highlight ? "text-white font-medium" : "text-muted-foreground";
  const valueColor = highlight ? "text-primary" : "text-white";
  
  return (
    <div className={`${bgColor} ${borderColor} border rounded-lg p-4 transition-all hover:border-primary/40`}>
      <h5 className={`${titleColor} text-sm`}>{title}</h5>
      <div className={`text-xl font-bold ${valueColor} mt-1`}>{formattedValue}</div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  );
};

export default ResultMetricCard;
