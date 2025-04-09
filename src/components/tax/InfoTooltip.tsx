
import React from 'react';
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface InfoTooltipProps {
  text: string;
  icon?: "help" | "info";
  className?: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ 
  text, 
  icon = "help",
  className = "" 
}) => {
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <span className={`inline-flex ml-1.5 cursor-help text-muted-foreground/70 hover:text-muted-foreground ${className}`}>
          <HelpCircle className="h-4 w-4" />
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs text-sm p-3 bg-slate-900/95 border-slate-800">
        {text}
      </TooltipContent>
    </Tooltip>
  );
};

export default InfoTooltip;
