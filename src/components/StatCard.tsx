
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  timeframe?: string;
  budget?: string;
  icon?: React.ReactNode;
  className?: string;
}

const StatCard = ({
  title,
  value,
  change,
  timeframe,
  budget,
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
          
          {budget && (
            <div className="mt-2 text-xs text-[#A0A0A0]">{budget}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
