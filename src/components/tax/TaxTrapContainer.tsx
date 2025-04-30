
import React, { useState } from 'react';
import TaxTrapInputForm from '@/components/tax/TaxTrapInputForm';
import TaxTrapAnalysis from '@/components/tax/TaxTrapAnalysis';
import { FilingStatusType } from '@/types/tax/filingTypes';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const TaxTrapContainer: React.FC = () => {
  const { toast } = useToast();
  const [filingStatus, setFilingStatus] = useState<FilingStatusType>('single');
  const [year, setYear] = useState(2023);
  const [agi, setAgi] = useState(85000);
  const [capitalGains, setCapitalGains] = useState(5000);
  const [socialSecurityAmount, setSocialSecurityAmount] = useState(0);
  const [isOnMedicare, setIsOnMedicare] = useState(false);
  const [hasACA, setHasACA] = useState(false);
  const [householdSize, setHouseholdSize] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Generated scenario ID for the tax trap checker
  const scenarioId = `user-scenario-${Math.random().toString(36).substring(2, 9)}`;
  
  // Derived values
  const magi = agi; // Simplified for demo purposes
  const totalIncome = agi + capitalGains;
  const taxableIncome = Math.max(0, agi - (filingStatus === 'single' ? 12950 : filingStatus === 'married_joint' ? 25900 : 19400));
  
  // Convert FilingStatusType to the format expected by TaxTrapInputForm
  // Use a type assertion to ensure proper compatibility
  const convertedFilingStatus = filingStatus === 'married_joint' ? 'married' as 'single' | 'married' | 'married_separate' | 'head_of_household' : filingStatus as 'single' | 'married' | 'married_separate' | 'head_of_household';

  const handleCalculate = () => {
    setIsCalculating(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      setShowResults(true);
      setIsCalculating(false);
      
      toast({
        title: "Analysis complete",
        description: "Your tax threshold analysis has been calculated."
      });
    }, 800);
  };

  const handleInputChange = () => {
    // Hide results when inputs change
    if (showResults) {
      setShowResults(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <TaxTrapInputForm 
          filingStatus={convertedFilingStatus}
          setFilingStatus={(status) => {
            setFilingStatus(status === 'married' ? 'married_joint' as FilingStatusType : status as FilingStatusType);
            handleInputChange();
          }}
          year={year}
          setYear={(y) => {
            setYear(y);
            handleInputChange();
          }}
          agi={agi}
          setAgi={(a) => {
            setAgi(a);
            handleInputChange();
          }}
          capitalGains={capitalGains}
          setCapitalGains={(c) => {
            setCapitalGains(c);
            handleInputChange();
          }}
          socialSecurityAmount={socialSecurityAmount}
          setSocialSecurityAmount={(s) => {
            setSocialSecurityAmount(s);
            handleInputChange();
          }}
          isOnMedicare={isOnMedicare}
          setIsOnMedicare={(m) => {
            setIsOnMedicare(m);
            handleInputChange();
          }}
          hasACA={hasACA}
          setHasACA={(a) => {
            setHasACA(a);
            handleInputChange();
          }}
          householdSize={householdSize}
          setHouseholdSize={(h) => {
            setHouseholdSize(h);
            handleInputChange();
          }}
        />
        
        <div className="mt-6 flex justify-center">
          <Button 
            onClick={handleCalculate} 
            disabled={isCalculating}
            className="w-full"
            size="lg"
          >
            <Calculator className="mr-2 h-4 w-4" />
            {isCalculating ? "Calculating..." : "Calculate Tax Thresholds"}
          </Button>
        </div>
      </div>
      
      <div className="lg:col-span-2">
        {showResults ? (
          <TaxTrapAnalysis
            scenarioId={scenarioId}
            scenarioData={{
              year,
              filing_status: convertedFilingStatus,
              agi,
              magi,
              total_income: totalIncome,
              taxable_income: taxableIncome,
              capital_gains_long: capitalGains,
              capital_gains_short: 0,
              social_security_amount: socialSecurityAmount,
              household_size: householdSize,
              medicare_enrollment: isOnMedicare,
              aca_enrollment: hasACA,
            }}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-10 border border-dashed rounded-lg bg-muted/5">
            <div className="space-y-2">
              <h3 className="text-xl font-medium text-muted-foreground">No Analysis Yet</h3>
              <p className="text-sm text-muted-foreground">
                Enter your information and click the Calculate button to analyze potential tax traps.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaxTrapContainer;
