
import { toast } from "sonner";

export interface MultiYearPlanData {
  finalBalance: number;
  endYear: number;
  annualGiftingAmount?: number;
  numberOfRecipients?: number;
  growthRate?: number;
}

export const fetchMultiYearPlanData = (): MultiYearPlanData | null => {
  // In a real implementation, this would fetch from a database or state store
  // For now, we'll check localStorage for demo purposes
  try {
    const multiYearScenarios = JSON.parse(localStorage.getItem('multi_year_roth_scenarios') || '[]');
    
    if (multiYearScenarios.length === 0) {
      toast.info("No Multi-Year Plan data found. Please create a plan first.");
      return null;
    }
    
    // Use the most recent scenario
    const latestScenario = multiYearScenarios[multiYearScenarios.length - 1];
    
    // Get the last year's data from the scenario
    const yearlyResults = latestScenario.results || [];
    if (yearlyResults.length === 0) {
      toast.warning("Multi-Year Plan has no results to import");
      return null;
    }
    
    const finalYearData = yearlyResults[yearlyResults.length - 1];
    
    return {
      finalBalance: finalYearData.traditionalIRABalance + finalYearData.rothIRABalance,
      endYear: finalYearData.year,
      growthRate: latestScenario.expectedAnnualReturn || 0.05,
      annualGiftingAmount: latestScenario.annualGift || 0,
      numberOfRecipients: latestScenario.numberOfRecipients || 1
    };
  } catch (error) {
    console.error("Error fetching multi-year plan data:", error);
    toast.error("Could not load Multi-Year Plan data");
    return null;
  }
};
