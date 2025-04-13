
import React from "react";
import { formatCurrency } from "../../utils/formatUtils";

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: any[];
}

export const ChartTooltipContent: React.FC<ChartTooltipContentProps> = ({ 
  active, 
  payload 
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-md">
        <div className="grid grid-cols-2 gap-2">
          <div className="col-span-2 border-b pb-2 text-center font-medium">
            Year: {payload[0].payload.name}
          </div>
          {payload.map((entry) => (
            <div key={entry.name} className="flex justify-between text-sm">
              <span className="font-medium mr-2">{entry.name}:</span>
              <span>{formatCurrency(Number(entry.value))}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};
