
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { CharitableScenario } from '../types/CharitableTypes';
import { Download, FileCheck, ArrowLeft, AlertTriangle, Calculator, Share2 } from 'lucide-react';

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

  const annualGivingAmount = scenario.annualGiving.amount;
  const totalGivingImpact = annualGivingAmount * 5; // Simplified 5-year impact
  
  // Determine what strategies are being used
  const isUsingQcd = scenario.qcd.useQcd;
  const isUsingDaf = scenario.dafStrategy.useDaf;
  const isUsingBunching = isUsingDaf && scenario.dafStrategy.approach === "bunching";

  return (
    <div className="space-y-6">
      <div className="bg-[#242A38] p-6 rounded-md">
        <div className="flex items-center space-x-3 mb-4">
          <FileCheck className="text-[#FFD700]" size={24} />
          <h3 className="font-semibold text-xl text-white">Charitable Planning Results</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#1A1F2C] p-4 rounded-md">
            <h4 className="text-[#FFD700] text-sm font-medium mb-1">Taxable Income Reduction</h4>
            <div className="text-2xl font-bold text-white">
              ${scenario.results.taxableIncomeReduction.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Potential reduction in taxable income
            </p>
          </div>
          
          <div className="bg-[#1A1F2C] p-4 rounded-md">
            <h4 className="text-[#FFD700] text-sm font-medium mb-1">Tax Savings</h4>
            <div className="text-2xl font-bold text-white">
              ${scenario.results.bracketSavings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Estimated annual tax savings
            </p>
          </div>
          
          {isUsingQcd && (
            <div className="bg-[#1A1F2C] p-4 rounded-md">
              <h4 className="text-[#FFD700] text-sm font-medium mb-1">IRMAA Savings</h4>
              <div className="text-2xl font-bold text-white">
                ${scenario.results.irmaaSavings.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Potential Medicare premium savings
              </p>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-white">Your Charitable Giving Strategy:</h4>
          
          <div className="bg-[#1A1F2C] p-4 rounded-md">
            <h5 className="font-medium text-white mb-2">Primary Strategies:</h5>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <div className="h-5 w-5 rounded-full bg-[#00C47C] flex items-center justify-center text-xs font-medium text-black mt-0.5">✓</div>
                <div>
                  <p className="text-white">Annual Charitable Giving</p>
                  <p className="text-sm text-muted-foreground">
                    {scenario.annualGiving.type === "fixed" 
                      ? `$${annualGivingAmount.toLocaleString()} per year` 
                      : "Variable giving amounts over time"}
                  </p>
                </div>
              </li>
              
              {isUsingDaf && (
                <li className="flex items-start space-x-3">
                  <div className="h-5 w-5 rounded-full bg-[#00C47C] flex items-center justify-center text-xs font-medium text-black mt-0.5">✓</div>
                  <div>
                    <p className="text-white">Donor-Advised Fund</p>
                    <p className="text-sm text-muted-foreground">
                      {isUsingBunching 
                        ? `Bunching ${scenario.dafStrategy.bunchingYears} years of contributions in one year` 
                        : "Annual contributions to DAF"}
                    </p>
                  </div>
                </li>
              )}
              
              {isUsingQcd && (
                <li className="flex items-start space-x-3">
                  <div className="h-5 w-5 rounded-full bg-[#00C47C] flex items-center justify-center text-xs font-medium text-black mt-0.5">✓</div>
                  <div>
                    <p className="text-white">Qualified Charitable Distributions</p>
                    <p className="text-sm text-muted-foreground">
                      ${scenario.qcd.amount.toLocaleString()} annual QCD from IRA, reducing AGI and potentially RMDs
                    </p>
                  </div>
                </li>
              )}
            </ul>
          </div>
          
          {scenario.multiYearPlan.isIntegrated && (
            <div className="bg-[#1A1F2C] p-4 rounded-md">
              <h5 className="font-medium text-white mb-2">5-Year Projection:</h5>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px] text-sm">
                  <thead>
                    <tr className="text-muted-foreground border-b border-[#333]">
                      <th className="text-left py-2 font-medium">Year</th>
                      <th className="text-right py-2 font-medium">Contribution</th>
                      <th className="text-right py-2 font-medium">Strategy</th>
                      <th className="text-right py-2 font-medium">Tax Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scenario.multiYearPlan.years.map((year, index) => (
                      <tr key={index} className="border-b border-[#333] last:border-0">
                        <td className="py-3 text-white">{year.year}</td>
                        <td className="py-3 text-right text-white">
                          ${year.contribution.toLocaleString()}
                        </td>
                        <td className="py-3 text-right">
                          {year.isItemizing ? (
                            <span className="text-[#00C47C]">Itemize</span>
                          ) : (
                            <span className="text-amber-500">Standard</span>
                          )}
                        </td>
                        <td className="py-3 text-right text-white">
                          ${year.taxSavings.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          <div className="bg-[#1A1F2C]/50 p-4 rounded-md flex items-start space-x-3 text-sm">
            <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
            <div>
              <p className="font-medium text-white">Important Disclaimers</p>
              <p className="text-muted-foreground">
                This analysis is for educational purposes only and not tax advice. Actual tax outcomes depend on your complete financial picture, 
                future tax law changes, and other factors. Consult with a tax professional before implementing any strategy.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          
          <div className="flex-1 flex justify-end gap-3">
            <Button
              variant="outline"
              className="flex items-center"
            >
              <Calculator className="mr-2 h-4 w-4" /> Recalculate
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center"
            >
              <Share2 className="mr-2 h-4 w-4" /> Share Results
            </Button>
            
            <Button
              className="bg-[#007BFF] hover:bg-[#0069d9] flex items-center"
            >
              <Download className="mr-2 h-4 w-4" /> Save Plan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsStep;
