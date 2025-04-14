import React from 'react';
import { useEquityForm } from '../../context/EquityFormContext';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '../../utils/formatUtils';
import { AlertTriangle, Info, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { EquityCompEvent } from '../../types/EquityTypes';
import ShareScenarioCard from '@/components/tax-planning/collaboration/ShareScenarioCard';

export const TaxSummaryCard = () => {
  const { 
    formState, 
    getEquityEvents, 
    getDeferralEvents, 
    calculateMultiYearImpact 
  } = useEquityForm();
  
  const equityEvents = getEquityEvents();
  const deferralEvents = getDeferralEvents();
  const multiYearImpact = calculateMultiYearImpact();
  const currentYear = new Date().getFullYear();
  
  const currentYearData = multiYearImpact.find(year => year.year === currentYear);
  const nextYearData = multiYearImpact.find(year => year.year === currentYear + 1);
  
  const totalDeferred = deferralEvents.reduce((sum, event) => sum + event.amount, 0);
  const totalTaxSavings = deferralEvents.reduce((sum, event) => sum + event.taxSavings, 0);
  
  const currentYearExercise = equityEvents.find(event => event.year === currentYear);
  const nextYearExercise = equityEvents.find(event => event.year === currentYear + 1);
  
  const generateTaxStrategySummary = () => {
    const summaries: string[] = [];
    
    if (currentYearExercise) {
      const exerciseSummary = `Year ${currentYear}: ${currentYearExercise.sharesExercised.toLocaleString()} ${formState.equityType} shares exercised, total tax = ${formatCurrency(currentYearData?.totalTax || 0)}, bracket = ${currentYearData?.incomeBracket || 'N/A'}`;
      summaries.push(exerciseSummary);
    }
    
    if (formState.equityType === 'ISO' && currentYearData?.amtAdjustment > 0) {
      summaries.push(`Potential AMT: ${formatCurrency(currentYearData.amtAdjustment)}`);
    }
    
    if (formState.hasDeferredComp && totalDeferred > 0) {
      const deferralSummary = formState.deferralStrategy === 'next-year'
        ? `Deferring ${formatCurrency(totalDeferred)} from ${currentYear} to ${currentYear + 1}`
        : `Staggering ${formatCurrency(totalDeferred)} across ${formState.deferralYears} years`;
      summaries.push(deferralSummary);
    }
    
    return summaries;
  };
  
  const calculateSplitExerciseBenefit = () => {
    if (!nextYearExercise || formState.exerciseStrategy !== 'split') return 0;
    
    const singleYearTax = currentYearExercise && nextYearExercise 
      ? (currentYearExercise.spread + nextYearExercise.spread) * 0.35
      : 0;
      
    const splitYearTax = (currentYearExercise?.spread || 0) * 0.32 + 
                         (nextYearExercise?.spread || 0) * 0.32;
    
    return singleYearTax - splitYearTax;
  };
  
  const splitBenefit = calculateSplitExerciseBenefit();
  const taxStrategySummaries = generateTaxStrategySummary();
  
  const taxVaultDocuments = [
    { id: '1', name: 'Stock Options.pdf', type: 'pdf' },
    { id: '2', name: 'Grant Agreement.pdf', type: 'pdf' },
    { id: '3', name: 'Equity Compensation Plan.pdf', type: 'pdf' }
  ];
  
  return (
    <div className="mb-6">
      <Card className="bg-gradient-to-br from-[#1D2433] to-[#1A1F2C] border-[#2A2F3C]">
        <CardContent className="pt-6 pb-6">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">Tax Strategy Impact Summary</h3>
            
            <div className="bg-[#16192A] border border-[#2A2F3C] rounded-md p-4">
              <div className="space-y-2">
                {taxStrategySummaries.map((summary, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Info className="h-4 w-4 text-blue-400 flex-shrink-0 mt-1" />
                    <p className="text-sm text-muted-foreground">{summary}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-[#16192A] border border-[#2A2F3C] rounded-md p-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-900/30 text-blue-400 p-1.5 rounded-full">
                  <Info className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Strategic Insights</h4>
                  <div className="space-y-2 mt-2 text-sm">
                    {formState.exerciseStrategy === 'split' && splitBenefit > 0 && (
                      <div className="flex items-center space-x-2 text-green-400">
                        <p>
                          Exercising {nextYearExercise?.sharesExercised.toLocaleString()} {formState.equityType} shares 
                          in {currentYear + 1} instead of {currentYear} saves an estimated {formatCurrency(splitBenefit)} in taxes.
                        </p>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                This estimate assumes consistent tax rates. Actual savings may vary 
                                due to market changes, share price fluctuations, and future tax law modifications.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                    
                    {formState.hasDeferredComp && totalTaxSavings > 0 && (
                      <p className="text-green-400">
                        Deferring {formatCurrency(totalDeferred)} from {currentYear} saves an estimated {formatCurrency(totalTaxSavings)} in taxes.
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
      
      <ShareScenarioCard
        scenarioId={`deferred-comp-${new Date().getTime()}`}
        scenarioType="deferred"
        scenarioName={`${formState.equityType} Equity Compensation Analysis`}
        documents={taxVaultDocuments}
      />
    </div>
  );
};
