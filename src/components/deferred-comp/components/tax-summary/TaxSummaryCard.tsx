
import React from 'react';
import { useEquityForm } from '../../context/EquityFormContext';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '../../utils/formatUtils';
import { AlertTriangle, Info } from 'lucide-react';
import { EquityCompEvent } from '../../types/EquityTypes';

export const TaxSummaryCard = () => {
  const { formState, getEquityEvents, getDeferralEvents, calculateMultiYearImpact } = useEquityForm();
  
  const equityEvents = getEquityEvents();
  const deferralEvents = getDeferralEvents();
  const multiYearImpact = calculateMultiYearImpact();
  const currentYear = new Date().getFullYear();
  
  // Get current and next year data
  const currentYearData = multiYearImpact.find(year => year.year === currentYear);
  const nextYearData = multiYearImpact.find(year => year.year === currentYear + 1);
  
  // Calculate tax savings and total deferred
  const totalDeferred = deferralEvents.reduce((sum, event) => sum + event.amount, 0);
  const totalTaxSavings = deferralEvents.reduce((sum, event) => sum + event.taxSavings, 0);
  
  // Get share exercise info
  const currentYearExercise = equityEvents.find(event => event.year === currentYear);
  const nextYearExercise = equityEvents.find(event => event.year === currentYear + 1);
  
  // Calculate multi-year exercise benefit
  const calculateSplitExerciseBenefit = () => {
    if (!nextYearExercise || formState.exerciseStrategy !== 'split') return 0;
    
    // Simple calculation of benefit from splitting exercise across years
    const singleYearTax = currentYearExercise && nextYearExercise 
      ? (currentYearExercise.spread + nextYearExercise.spread) * 0.35 // Assume higher bracket
      : 0;
      
    const splitYearTax = (currentYearExercise?.spread || 0) * 0.32 + 
                         (nextYearExercise?.spread || 0) * 0.32; // Assume lower brackets
    
    return singleYearTax - splitYearTax;
  };
  
  const splitBenefit = calculateSplitExerciseBenefit();
  
  // Check for IRMAA impacts
  const currentYearIRMAA = currentYearData?.irmaaImpact;
  const nextYearIRMAA = nextYearData?.irmaaImpact;
  
  // Get notable equity amount exercised
  const getEquityExercised = (event?: EquityCompEvent) => {
    if (!event) return '';
    
    return `${event.sharesExercised.toLocaleString()} ${formState.equityType} shares`;
  };
  
  return (
    <Card className="bg-[#1D2433] border-[#2A2F3C] mb-4">
      <CardContent className="pt-6 pb-6">
        <div className="space-y-5">
          <h3 className="text-xl font-semibold text-white">Tax Strategy Impact Summary</h3>
          
          {/* Year 1 Summary */}
          <div className="border-l-4 border-blue-500 pl-4 py-1">
            <p className="text-white font-medium">
              {currentYear}: {getEquityExercised(currentYearExercise)}
              {currentYearExercise && formState.hasDeferredComp && " and "}
              {formState.hasDeferredComp && `${formatCurrency(totalDeferred)} deferred compensation`}
            </p>
            {currentYearData && (
              <div className="text-sm text-muted-foreground mt-1">
                <span>Total taxable income: {formatCurrency(currentYearData.ordinaryIncome)}</span>
                <span className="mx-2">•</span>
                <span>Est. tax: {formatCurrency(currentYearData.totalTax)}</span>
                <span className="mx-2">•</span>
                <span>Tax bracket: {currentYearData.incomeBracket}</span>
                
                {currentYearIRMAA && (
                  <div className="flex items-center text-amber-400 mt-1">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span>May trigger IRMAA Medicare premium surcharge</span>
                  </div>
                )}
                
                {formState.equityType === 'ISO' && currentYearData.amtAdjustment > 0 && (
                  <div className="flex items-center text-amber-400 mt-1">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    <span>Potential AMT: {formatCurrency(currentYearData.amtAdjustment)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Year 2 Summary - only show if there's next year activity */}
          {(nextYearExercise || (formState.hasDeferredComp && formState.deferralStrategy !== "multi-year")) && (
            <div className="border-l-4 border-indigo-400 pl-4 py-1">
              <p className="text-white font-medium">
                {currentYear + 1}: {getEquityExercised(nextYearExercise)}
                {nextYearExercise && formState.hasDeferredComp && " and "}
                {formState.hasDeferredComp && formState.deferralStrategy === "next-year" && 
                  `${formatCurrency(formState.deferralAmount)} received from deferral`}
              </p>
              {nextYearData && (
                <div className="text-sm text-muted-foreground mt-1">
                  <span>Total taxable income: {formatCurrency(nextYearData.ordinaryIncome)}</span>
                  <span className="mx-2">•</span>
                  <span>Est. tax: {formatCurrency(nextYearData.totalTax)}</span>
                  <span className="mx-2">•</span>
                  <span>Tax bracket: {nextYearData.incomeBracket}</span>
                  
                  {nextYearIRMAA && (
                    <div className="flex items-center text-amber-400 mt-1">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      <span>May trigger IRMAA Medicare premium surcharge</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Strategy Benefits */}
          <div className="bg-[#16192A] border border-[#2A2F3C] rounded-md p-4 mt-4">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-900/30 text-blue-400 p-1.5 rounded-full">
                <Info className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-white font-medium">Strategy Benefits</h4>
                <div className="space-y-2 mt-2 text-sm">
                  {formState.hasDeferredComp && totalTaxSavings > 0 && (
                    <p className="text-green-400">
                      Deferring {formatCurrency(totalDeferred)} from {currentYear} saves an estimated {formatCurrency(totalTaxSavings)} in taxes.
                    </p>
                  )}
                  
                  {formState.exerciseStrategy === 'split' && splitBenefit > 0 && (
                    <p className="text-green-400">
                      Exercising {nextYearExercise?.sharesExercised.toLocaleString()} {formState.equityType} shares in {currentYear + 1} 
                      instead of {currentYear} saves an estimated {formatCurrency(splitBenefit)} in taxes.
                    </p>
                  )}
                  
                  {currentYearData && currentYearData.distanceToNextBracket < 25000 && (
                    <p className="text-amber-400">
                      You're only {formatCurrency(currentYearData.distanceToNextBracket)} away from the next tax bracket ({currentYearData.nextBracket}).
                    </p>
                  )}
                  
                  {(formState.exerciseStrategy === 'split' || formState.deferralStrategy === 'multi-year') && (
                    <p className="text-muted-foreground">
                      <span className="text-amber-400">Note:</span> Spreading income across tax years can lower your overall tax burden, 
                      but also exposes you to market risks and potential tax law changes.
                    </p>
                  )}
                  
                  {formState.equityType === 'ISO' && currentYearData?.amtAdjustment > 0 && (
                    <p className="text-muted-foreground">
                      <span className="text-amber-400">AMT Alert:</span> Your ISO exercise may trigger Alternative Minimum Tax.
                      Consider a multi-year exercise strategy to minimize AMT impact.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
