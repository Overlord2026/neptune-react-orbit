
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Save } from "lucide-react";
import { formatCurrency, formatPercent } from '@/utils/taxBracketData';
import { saveTaxScenario } from '@/utils/taxScenario/storage';
import { TaxScenario } from '@/types/tax/taxCalculationTypes';
import { toast } from "sonner";

interface ResultsSummaryProps {
  title: string;
  description: string;
  scenarioData: TaxScenario;
  onContinue: () => void;
  isSaving?: boolean;
  setIsSaving?: (value: boolean) => void;
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  title,
  description,
  scenarioData,
  onContinue,
  isSaving = false,
  setIsSaving = () => {}
}) => {
  const router = useRouter();
  
  const handleSaveScenario = async () => {
    if (isSaving) return;
    
    try {
      setIsSaving(true);
      await saveTaxScenario(scenarioData);
      toast.success("Scenario saved successfully!");
      router.push('/scenarios');
    } catch (error) {
      console.error("Failed to save scenario:", error);
      toast.error("Failed to save scenario. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Total Income:</p>
              <p className="text-xl font-semibold">
                {formatCurrency(scenarioData.total_income)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Adjusted Gross Income:</p>
              <p className="text-xl font-semibold">
                {formatCurrency(scenarioData.agi)}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Taxable Income:</p>
              <p className="text-xl font-semibold">
                {formatCurrency(scenarioData.taxable_income)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Total Estimated Tax:</p>
              <p className="text-xl font-semibold text-red-500 dark:text-red-400">
                {formatCurrency(scenarioData.total_tax)}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Ordinary Tax:</p>
              <p className="text-lg font-semibold">
                {formatCurrency(scenarioData.ordinary_tax)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Capital Gains Tax:</p>
              <p className="text-lg font-semibold">
                {formatCurrency(scenarioData.capital_gains_tax)}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div>
              <p className="text-sm font-medium">Marginal Tax Rate:</p>
              <p className="text-lg font-semibold">
                {formatPercent(scenarioData.marginal_rate)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Effective Tax Rate:</p>
              <p className="text-lg font-semibold">
                {formatPercent(scenarioData.effective_rate)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onContinue} disabled={isSaving}>
          <Check className="mr-2 h-4 w-4" /> Continue
        </Button>
        <Button onClick={handleSaveScenario} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" /> Save Scenario
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResultsSummary;
