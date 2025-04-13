
import React from "react";
import { useEquityForm } from "../../context/EquityFormContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { TaxResultsSummary } from "../../components/TaxResultsSummary";
import { TaxSummaryCard } from "../../components/tax-summary/TaxSummaryCard";
import { BracketChangeVisualizer } from "../../components/tax-summary/BracketChangeVisualizer";
import { EquityStrategySummary } from "../../components/EquityStrategySummary";
import { TaxVisualization } from "./TaxVisualization";
import { EquityImpactCards } from "./EquityImpactCards";
import { DeferralImpactCard } from "./DeferralImpactCard";
import { EquityDisclaimerSection } from "./EquityDisclaimerSection";
import LoadingState from "./LoadingState";
import { toast } from "sonner";
import { saveScenario, EquityScenario } from "@/utils/taxScenarioStorage";
import { FilingStatusType } from "@/utils/taxBracketData";

interface TaxOutputStepProps {
  onPrevious: () => void;
}

export const TaxOutputStep: React.FC<TaxOutputStepProps> = ({ onPrevious }) => {
  const { formState, calculateAmtImpact, calculateDeferralBenefit, calculateMultiYearImpact } = useEquityForm();
  const [loading, setLoading] = React.useState(true);
  const [disclaimerAcknowledged, setDisclaimerAcknowledged] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSaveAnalysis = async () => {
    if (!disclaimerAcknowledged) {
      toast.warning("Please acknowledge the disclaimer before saving your analysis.");
      return;
    }

    try {
      const currentYear = new Date().getFullYear();
      const results = calculateMultiYearImpact();
      const yearData = results.find(y => y.year === currentYear) || results[0];
      
      const scenarioData: EquityScenario = {
        scenario_name: `${formState.equityType || "Deferred"} Analysis - ${new Date().toLocaleDateString()}`,
        type: "equity-compensation",
        year: currentYear,
        filing_status: "single" as FilingStatusType,
        total_income: yearData.ordinaryIncome,
        agi: yearData.ordinaryIncome,
        taxable_income: yearData.ordinaryIncome * 0.9,
        total_tax: yearData.totalTax,
        ordinary_tax: yearData.totalTax,
        capital_gains_tax: 0,
        marginal_rate: yearData.marginalRate,
        marginal_capital_gains_rate: 0,
        effective_rate: yearData.totalTax / yearData.ordinaryIncome,
        updated_at: new Date(),
        id: `equity-${Date.now()}`,
        
        formState,
        results: calculateMultiYearImpact(),
        amtImpact: formState.equityType === "ISO" ? calculateAmtImpact() : 0,
        deferralBenefit: formState.hasDeferredComp ? calculateDeferralBenefit() : 0
      };

      await saveScenario(scenarioData);
      toast.success("Your analysis has been saved successfully.");
    } catch (error) {
      console.error("Error saving scenario:", error);
      toast.error("There was a problem saving your analysis. Please try again.");
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  const hasEquity = formState.equityType === "NSO" || formState.equityType === "ISO";
  const hasDeferred = formState.hasDeferredComp;
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-6">
      <TaxSummaryCard />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EquityStrategySummary />
        <BracketChangeVisualizer />
      </div>
      
      {(hasEquity || hasDeferred) && formState.planningApproach === "multi-year" && (
        <TaxVisualization currentYear={currentYear} />
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {hasEquity && (
          <EquityImpactCards 
            equityType={formState.equityType} 
            isDisqualifyingDisposition={formState.equityType === "ISO" && formState.isDisqualifyingDisposition} 
          />
        )}

        {hasDeferred && (
          <DeferralImpactCard currentYear={currentYear} />
        )}
      </div>

      <EquityDisclaimerSection 
        acknowledged={disclaimerAcknowledged} 
        onAcknowledgeChange={setDisclaimerAcknowledged} 
      />

      <div className="flex space-x-4">
        <Button onClick={onPrevious} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <Button 
          className="bg-primary" 
          onClick={handleSaveAnalysis}
          disabled={!disclaimerAcknowledged}
        >
          <Save className="mr-2 h-4 w-4" />
          Save This Analysis
        </Button>
      </div>
    </div>
  );
};

export default TaxOutputStep;
