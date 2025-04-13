
import React from "react";
import { InfoTooltip } from "../InfoTooltip";

interface MetricCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  tooltipContent?: React.ReactNode;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  tooltipContent, 
  className = "p-4 bg-[#20273B] rounded-md"
}) => {
  return (
    <div className={className}>
      <div className="flex items-center">
        <div className="text-sm text-muted-foreground mb-1">{title}</div>
        {tooltipContent && <InfoTooltip content={tooltipContent} />}
      </div>
      <div className="font-medium">{value}</div>
      {subtitle && <div className="text-xs mt-1">{subtitle}</div>}
    </div>
  );
};
