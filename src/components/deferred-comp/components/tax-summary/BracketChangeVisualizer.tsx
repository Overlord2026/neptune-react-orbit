
import React from 'react';
import { useEquityForm } from '../../context/EquityFormContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '../../utils/formatUtils';

export const BracketChangeVisualizer = () => {
  const { calculateMultiYearImpact } = useEquityForm();
  const multiYearImpact = calculateMultiYearImpact();
  const currentYear = new Date().getFullYear();
  
  // Get year-specific data
  const year1Data = multiYearImpact.find(year => year.year === currentYear);
  const year2Data = multiYearImpact.find(year => year.year === currentYear + 1);
  
  if (!year1Data || !year2Data) return null;
  
  // Define bracket colors
  const getBracketColor = (bracket: string) => {
    const rate = parseInt(bracket);
    if (rate <= 12) return 'bg-green-900/20 text-green-400';
    if (rate <= 22) return 'bg-emerald-900/20 text-emerald-400';
    if (rate <= 24) return 'bg-yellow-900/20 text-yellow-400';
    if (rate <= 32) return 'bg-orange-900/20 text-orange-400';
    if (rate <= 35) return 'bg-amber-900/20 text-amber-400';
    return 'bg-red-900/20 text-red-400';
  };
  
  return (
    <Card className="bg-[#1D2433] border-[#2A2F3C]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Tax Bracket Impact</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{currentYear} Tax Bracket:</p>
              <div className={`px-3 py-2 rounded-md ${getBracketColor(year1Data.incomeBracket)}`}>
                <span className="text-lg font-medium">{year1Data.incomeBracket}</span>
                <p className="text-xs opacity-80 mt-1">
                  Income: {formatCurrency(year1Data.ordinaryIncome)}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{currentYear + 1} Tax Bracket:</p>
              <div className={`px-3 py-2 rounded-md ${getBracketColor(year2Data.incomeBracket)}`}>
                <span className="text-lg font-medium">{year2Data.incomeBracket}</span>
                <p className="text-xs opacity-80 mt-1">
                  Income: {formatCurrency(year2Data.ordinaryIncome)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            {year1Data.taxSavings > 0 && (
              <div className="flex items-center text-green-400 text-sm">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>
                  Your strategy saves approximately {formatCurrency(year1Data.taxSavings)} in {currentYear} taxes
                </span>
              </div>
            )}
            
            {year2Data.taxSavings > 0 && (
              <div className="flex items-center text-green-400 text-sm mt-1">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>
                  Your strategy saves approximately {formatCurrency(year2Data.taxSavings)} in {currentYear + 1} taxes
                </span>
              </div>
            )}
            
            {year1Data.distanceToNextBracket < 25000 && (
              <div className="flex items-center text-amber-400 text-sm mt-2">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>
                  You're only {formatCurrency(year1Data.distanceToNextBracket)} from entering the {year1Data.nextBracket} bracket in {currentYear}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
