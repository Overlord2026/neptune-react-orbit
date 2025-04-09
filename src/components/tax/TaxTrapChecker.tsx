
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { TaxTrapResult, TaxTrapInput, checkTaxTraps, saveTaxTrapResults } from '@/utils/taxTrapChecker';
import TaxTrapWarnings from './TaxTrapWarnings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface TaxTrapCheckerProps {
  scenarioId: string;
  scenarioData: {
    year: number;
    filing_status: 'single' | 'married' | 'married_separate' | 'head_of_household';
    agi: number;
    magi?: number;
    total_income: number;
    taxable_income: number;
    capital_gains_long: number;
    capital_gains_short: number;
    social_security_amount: number;
    household_size: number;
    medicare_enrollment: boolean;
    aca_enrollment: boolean;
    state_of_residence?: string;
  };
}

const TaxTrapChecker: React.FC<TaxTrapCheckerProps> = ({ scenarioId, scenarioData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<TaxTrapResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const checkForTaxTraps = async () => {
    setIsLoading(true);
    try {
      // Prepare the input for the tax trap checker
      const input: TaxTrapInput = {
        scenario_id: scenarioId,
        ...scenarioData
      };
      
      // Run the tax trap checker
      const trapResults = checkTaxTraps(input);
      
      // Save the results (in a real app, this would go to a database)
      await saveTaxTrapResults(trapResults);
      
      // Update the UI
      setResults(trapResults);
      setShowResults(true);
      
      toast({
        title: "Tax Trap Analysis Complete",
        description: `Found ${trapResults.warnings.length} potential tax issues in your scenario.`,
      });
    } catch (error) {
      console.error("Error checking tax traps:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "There was an error analyzing tax thresholds.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {!showResults ? (
        <Button
          onClick={checkForTaxTraps}
          className="bg-amber-500 hover:bg-amber-600 text-white"
          disabled={isLoading}
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          {isLoading ? "Analyzing Tax Thresholds..." : "Check for Tax Traps"}
        </Button>
      ) : results ? (
        <Card className="mt-6 border-amber-200 bg-amber-50/30 dark:border-amber-900/40 dark:bg-amber-900/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
              Tax Threshold Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TaxTrapWarnings warnings={results.warnings} />
            
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowResults(false)}
              >
                Hide Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default TaxTrapChecker;
