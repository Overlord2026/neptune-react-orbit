
import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, AlertCircle, HelpCircle, AlertTriangle } from 'lucide-react';

type IconType = 'info' | 'help' | 'alertCircle' | 'alertTriangle';

interface InfoTooltipProps {
  text: string;
  icon?: IconType;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  maxWidth?: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ 
  text, 
  icon = 'info',
  className = "",
  side = "top",
  align = "center",
  maxWidth = "xs"
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'help':
        return <HelpCircle className={`h-4 w-4 text-muted-foreground hover:text-primary ${className}`} />;
      case 'alertCircle':
        return <AlertCircle className={`h-4 w-4 text-amber-500 hover:text-amber-400 ${className}`} />;
      case 'alertTriangle':
        return <AlertTriangle className={`h-4 w-4 text-amber-500 hover:text-amber-400 ${className}`} />;
      case 'info':
      default:
        return <Info className={`h-4 w-4 text-muted-foreground hover:text-primary ${className}`} />;
    }
  };

  // Determine max width class
  let maxWidthClass = "max-w-xs";
  if (maxWidth === "sm") maxWidthClass = "max-w-sm";
  if (maxWidth === "md") maxWidthClass = "max-w-md";
  if (maxWidth === "lg") maxWidthClass = "max-w-lg";
  if (maxWidth === "none") maxWidthClass = "";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center ml-1 cursor-help">
            {getIcon()}
          </span>
        </TooltipTrigger>
        <TooltipContent side={side} align={align} className={maxWidthClass}>
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InfoTooltip;
