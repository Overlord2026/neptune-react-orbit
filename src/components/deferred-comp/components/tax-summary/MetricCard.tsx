
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
  className = "p-4 bg-[#141c2e] rounded-md border border-[#202a42] shadow-md hover:shadow-lg transition-all duration-200"
}) => {
  return (
    <div className={className}>
      <div className="flex items-center">
        <div className="text-sm text-[#94a3b8] mb-1">{title}</div>
        {tooltipContent && <InfoTooltip content={tooltipContent} />}
      </div>
      <div className="font-medium text-white text-lg">{value}</div>
      {subtitle && <div className="text-xs mt-1 text-[#e2e8f0]">{subtitle}</div>}
    </div>
  );
};
