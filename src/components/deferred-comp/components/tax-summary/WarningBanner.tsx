
import React from "react";
import { AlertCircle, InfoIcon } from "lucide-react";

interface WarningBannerProps {
  variant: "info" | "warning";
  title?: string;
  children: React.ReactNode;
}

export const WarningBanner: React.FC<WarningBannerProps> = ({ 
  variant, 
  title,
  children 
}) => {
  const isInfo = variant === "info";
  const bgColor = isInfo ? "bg-blue-900/20" : "bg-amber-900/20";
  const borderColor = isInfo ? "border-blue-800/30" : "border-amber-800/30";
  const textColor = isInfo ? "text-blue-400" : "text-amber-400";
  const textContentColor = isInfo ? "text-blue-300" : "text-amber-300";
  const Icon = isInfo ? InfoIcon : AlertCircle;

  return (
    <div className={`p-3 ${bgColor} border ${borderColor} rounded-md`}>
      <div className="flex items-start space-x-3">
        <Icon className={`h-4 w-4 flex-shrink-0 mt-0.5 ${textColor}`} />
        <div className={`text-xs ${textContentColor}`}>
          {title && <span className="font-medium">{title}</span>}
          {children}
        </div>
      </div>
    </div>
  );
};
