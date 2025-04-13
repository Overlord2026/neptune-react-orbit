
import React, { useEffect } from 'react';
import { CharitableScenario } from '../types/CharitableTypes';
import ResultHeader from '../components/ResultHeader';
import ResultMetricsDashboard from '../components/ResultMetricsDashboard';
import StrategyList from '../components/StrategyList';
import YearlyPlanTable from '../components/YearlyPlanTable';
import ResultDisclaimer from '../components/ResultDisclaimer';
import ResultActions from '../components/ResultActions';
import CrtResultsSection from '../components/CrtResultsSection';
import { ExternalLink, Info, HandCoins, FileText, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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
  const isMultipleStrategies = [isUsingQcd, isUsingCrt, isUsingDaf].filter(Boolean).length > 1;

  // Calculate total charitable impact
  const totalCharitableImpact = (
    (isUsingCrt ? scenario.results.crtDeduction || 0 : 0) +
    (scenario.annualGiving.amount || 0) +
    (isUsingQcd ? scenario.qcd.amount : 0)
  );

  // Strategy-specific metrics for comparison
  const generateStrategyMetrics = () => {
    const metrics = [];

    if (scenario.annualGiving.amount > 0) {
      metrics.push({
        title: "Standard Charitable Giving",
        amount: scenario.annualGiving.amount,
        benefit: "Standard tax deduction for charitable contributions",
        isItemizing: scenario.isItemizing
      });
    }

    if (isUsingDaf) {
      metrics.push({
        title: "Donor-Advised Fund",
        amount: scenario.dafStrategy.bunchingAmount || (scenario.annualGiving.amount * scenario.dafStrategy.bunchingYears),
        benefit: `Bunching ${scenario.dafStrategy.bunchingYears} years of donations for maximum itemized deduction`,
        isItemizing: true
      });
    }

    if (isUsingQcd) {
      metrics.push({
        title: "Qualified Charitable Distribution",
        amount: scenario.qcd.amount,
        benefit: "Direct IRA distribution to charity, excluded from AGI",
        isItemizing: false
      });
    }

    if (isUsingCrt) {
      metrics.push({
        title: "Charitable Remainder Trust",
        amount: scenario.crt.fundingAmount,
        deduction: scenario.results.crtDeduction || 0,
        annualPayout: scenario.results.crtAnnualPayout || 0,
        benefit: "Immediate tax deduction plus income stream",
        trustTerm: scenario.crt.trustTerm,
        isItemizing: true
      });
    }

    return metrics;
  };

  const strategyMetrics = generateStrategyMetrics();

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
          
          {/* Strategy Comparison Section */}
          {isMultipleStrategies && (
            <div className="bg-[#1A1F2C] p-4 rounded-md border border-slate-700 mt-4">
              <div className="flex items-center gap-2 mb-3">
                <BarChart className="text-primary" size={18} />
                <h5 className="text-primary font-medium">Charitable Strategy Comparison</h5>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {strategyMetrics.map((metric, index) => (
                  <Card key={index} className="bg-[#242A38] border-slate-700">
                    <CardContent className="p-4">
                      <h6 className="font-medium text-white mb-2">{metric.title}</h6>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="text-white">${metric.amount.toLocaleString()}</span>
                        </div>
                        
                        {'deduction' in metric && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tax Deduction:</span>
                            <span className="text-white">${metric.deduction.toLocaleString()}</span>
                          </div>
                        )}
                        
                        {'annualPayout' in metric && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Annual Income:</span>
                            <span className="text-white">${metric.annualPayout.toLocaleString()}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tax Treatment:</span>
                          <span className="text-white">{metric.isItemizing ? "Itemized Deduction" : "Excluded from AGI"}</span>
                        </div>
                        
                        <div className="mt-2 text-xs text-muted-foreground">{metric.benefit}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
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

