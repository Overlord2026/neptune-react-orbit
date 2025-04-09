
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  timeframe?: string;
  budgetLabel?: string;
  budgetAmount?: string;
  icon?: React.ReactNode;
  className?: string;
}

const StatCard = ({
  title,
  value,
  change,
  timeframe,
  budgetLabel,
  budgetAmount,
  icon,
  className
}: StatCardProps) => {
  // Determine if change is positive, negative or neutral
  const isPositive = change?.startsWith('+');
  const isNegative = change?.startsWith('-');
  const isNeutral = !isPositive && !isNegative;

  return (
    <Card className={cn("bg-[#1E1E1E] border-[#333333] hover:border-[#444444] transition-colors", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[#FFD700] text-sm font-medium">{title}</h3>
          {icon && <div>{icon}</div>}
        </div>
        
        <div className="mt-4">
          <div className="text-2xl font-bold text-white">{value}</div>
          
          <div className="flex items-center mt-2">
            {change && (
              <div className={cn("flex items-center text-sm", 
                isPositive ? "text-[#4CAF50]" : 
                isNegative ? "text-[#FF4D4D]" : 
                "text-[#A0A0A0]")}>
                {isPositive && <ArrowUp className="h-3.5 w-3.5 mr-1" />}
                {isNegative && <ArrowDown className="h-3.5 w-3.5 mr-1" />}
                <span>{change}</span>
                {timeframe && <span className="ml-1 text-[#A0A0A0]">{timeframe}</span>}
              </div>
            )}
          </div>
          
          {budgetLabel && budgetAmount && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#A0A0A0]">{budgetLabel}</span>
                <span className="text-[#FFD700]">{budgetAmount}</span>
              </div>
              <div className="mt-2 h-1 w-full bg-[#333333] rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full",
                    isPositive ? "bg-[#4CAF50]" : 
                    isNegative ? "bg-[#FF4D4D]" : 
                    "bg-[#FFD700]"
                  )}
                  style={{ 
                    width: '65%' 
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
