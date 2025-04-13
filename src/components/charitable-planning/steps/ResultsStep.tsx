
import React, { useEffect } from 'react';
import { CharitableScenario } from '../types/CharitableTypes';
import ResultHeader from '../components/ResultHeader';
import ResultMetricsDashboard from '../components/ResultMetricsDashboard';
import StrategyList from '../components/StrategyList';
import YearlyPlanTable from '../components/YearlyPlanTable';
import ResultDisclaimer from '../components/ResultDisclaimer';
import ResultActions from '../components/ResultActions';
import CrtResultsSection from '../components/CrtResultsSection';
import { ExternalLink, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ResultsStepProps {
  scenario: CharitableScenario;
  onBack: () => void;
  recalculate: () => void;
}

export const ResultsStep: React.FC<ResultsStepProps> = ({ 
  scenario, 
  onBack, 
  recalculate 
}) => {
  useEffect(() => {
    // Recalculate results when component mounts
    recalculate();
  }, [recalculate]);

  // Determine what strategies are being used
  const isUsingQcd = scenario.qcd.useQcd;
  const isUsingCrt = scenario.crt?.useCrt;
  const isUsingDaf = scenario.dafStrategy?.useDaf;

  // Calculate total charitable impact
  const totalCharitableImpact = (
    (isUsingCrt ? scenario.results.crtDeduction || 0 : 0) +
    (scenario.annualGiving.amount || 0) +
    (isUsingQcd ? scenario.qcd.amount : 0)
  );

  return (
    <div className="space-y-6">
      <div className="bg-[#242A38] p-6 rounded-md">
        <ResultHeader title="Charitable Planning Results" />
        
        <ResultMetricsDashboard
          taxableIncomeReduction={scenario.results.taxableIncomeReduction}
          bracketSavings={scenario.results.bracketSavings}
          irmaaSavings={scenario.results.irmaaSavings}
          showIrmaa={isUsingQcd}
          totalCharitableImpact={totalCharitableImpact}
        />
        
        <div className="space-y-6">
          <h4 className="font-medium text-white">Your Charitable Giving Strategy:</h4>
          
          <StrategyList scenario={scenario} />
          
          {/* CRT Results Section - displays if CRT strategy is selected */}
          {isUsingCrt && scenario.results.crtDeduction && scenario.results.crtAnnualPayout && (
            <>
              <CrtResultsSection
                type={scenario.crt.type}
                fundingAmount={scenario.crt.fundingAmount}
                payoutRate={scenario.crt.payoutRate}
                deduction={scenario.results.crtDeduction}
                annualPayout={scenario.results.crtAnnualPayout}
                trustTerm={scenario.crt.trustTerm}
                estateTaxSavings={scenario.results.estateTaxSavings || 0}
              />
              
              {/* CRT Disclaimers */}
              <div className="bg-primary/5 border border-primary/10 p-3 rounded-md mt-2">
                <div className="flex items-start gap-2">
                  <Info size={16} className="text-primary/80 shrink-0 mt-0.5" />
                  <div className="text-xs text-muted-foreground">
                    <p className="mb-1">
                      <strong className="text-primary/80">Important CRT Information:</strong>
                    </p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Charitable Remainder Trust calculations require precise IRS tables & discount rates. This tool uses approximate factors. Consult an attorney or specialized planning software to finalize any CRT plan.</li>
                      <li>CRTs must pass the 10% remainder test and follow specific IRS rules. Additional constraints apply for CRAT vs. CRUT regarding payout rates.</li>
                      <li>Advanced variations like NIMCRUTs or Flip CRUTs require more complex calculations and specialized legal guidance.</li>
                    </ul>
                    <Link 
                      to="/tax-education/charitable-giving" 
                      className="flex items-center mt-2 text-primary text-xs hover:underline"
                    >
                      Learn more about CRT strategies
                      <ExternalLink size={12} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {/* Combined Strategy Warning - displays if multiple strategies are used */}
          {((isUsingCrt && (isUsingQcd || isUsingDaf)) || (isUsingQcd && isUsingDaf)) && (
            <div className="bg-yellow-900/20 border border-yellow-600/30 p-4 rounded-md">
              <h5 className="text-yellow-500 font-medium mb-2">Combined Strategy Considerations</h5>
              <p className="text-sm text-muted-foreground">
                You're using multiple charitable strategies in the same year. Be aware that different charitable 
                giving methods have different AGI limitation percentages (60% for cash, 30% for appreciated securities, 
                special rules for CRTs). Consult your tax professional to optimize the timing and coordination of these strategies.
              </p>
            </div>
          )}
          
          <YearlyPlanTable scenario={scenario} />
          
          <ResultDisclaimer scenario={scenario} />
        </div>
        
        <ResultActions 
          onBack={onBack}
          onRecalculate={recalculate}
        />
      </div>
    </div>
  );
};

export default ResultsStep;
