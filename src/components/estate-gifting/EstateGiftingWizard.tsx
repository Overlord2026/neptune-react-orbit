
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import TaxDisclaimerWithCheckbox from "@/components/tax/TaxDisclaimerWithCheckbox";
import TaxProjectionDisclaimer from "@/components/tax/TaxProjectionDisclaimer";
import BasicInformationStep from './steps/BasicInformationStep';
import GiftingStrategyStep from './steps/GiftingStrategyStep';
import InheritanceScenarioStep from './steps/InheritanceScenarioStep';
import CalculationsStep from './steps/CalculationsStep';
import ResultsStep from './steps/ResultsStep';
import WizardHeader from './WizardHeader';
import WizardNavigation from './WizardNavigation';
import { EstateGiftingData } from './types/EstateGiftingTypes';
import { calculateEstateValues } from './utils/calculationUtils';
import { fetchMultiYearPlanData, MultiYearPlanData } from './utils/multiYearPlanUtils';
import { DEFAULT_ESTATE_EXEMPTION, CURRENT_YEAR } from './utils/constants';

const EstateGiftingWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [disclaimerAcknowledged, setDisclaimerAcknowledged] = useState(false);
  const [wizardData, setWizardData] = useState<EstateGiftingData>({
    netWorth: 0,
    estateExemption: DEFAULT_ESTATE_EXEMPTION,
    aboveThreshold: false,
    useAnnualGifts: false,
    numberOfDonees: 1,
    lifetimeGiftsUsed: 0,
    giftingStrategy: 'annual',
    lumpSumAmount: 0,
    yearOfPassing: CURRENT_YEAR + 30,
    growthRate: 0.05, // 5% annual growth
    useTrustApproach: false,
    lifeCycleStage: 'mid-career',
    trustType: 'none',
    trustReductionFactor: 0,
    noGiftingTax: 0,
    giftingTax: 0,
    taxSavings: 0,
    heirsBenefit: 0,
    multiYearPlanImported: false
  });

  // Function to import multi-year plan data
  const importMultiYearPlanData = (planData: MultiYearPlanData) => {
    // Update the wizard data with the imported values
    setWizardData(prevData => ({
      ...prevData,
      netWorth: planData.finalBalance,
      yearOfPassing: planData.endYear,
      growthRate: planData.growthRate || prevData.growthRate,
      useAnnualGifts: !!planData.annualGiftingAmount && planData.annualGiftingAmount > 0,
      numberOfDonees: planData.numberOfRecipients || prevData.numberOfDonees,
      giftingStrategy: 'annual',
      multiYearPlanImported: true,
      finalMultiYearBalance: planData.finalBalance,
      // Check if estate is above threshold based on imported values
      aboveThreshold: planData.finalBalance > prevData.estateExemption
    }));

    toast.success("Multi-Year Plan data imported successfully!");
  };

  const loadMultiYearPlan = () => {
    const planData = fetchMultiYearPlanData();
    if (planData) {
      importMultiYearPlanData(planData);
    }
  };

  const handleNext = () => {
    if (currentStep === 0 && !disclaimerAcknowledged) {
      toast.warning("Please acknowledge the disclaimer before proceeding.");
      return;
    }

    if (currentStep === 3) {
      // Before moving to results, calculate the values
      const calculatedValues = calculateEstateValues(wizardData);
      setWizardData({
        ...wizardData,
        noGiftingTax: calculatedValues.noGiftingTax,
        giftingTax: calculatedValues.giftingTax,
        taxSavings: calculatedValues.taxSavings,
        heirsBenefit: calculatedValues.heirsBenefit
      });
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleUpdateField = (field: keyof EstateGiftingData, value: any) => {
    setWizardData({
      ...wizardData,
      [field]: value
    });
  };

  const saveScenario = () => {
    // In a real implementation, this would save to a database or state store
    const scenarioData = {
      ...wizardData,
      scenarioDate: new Date().toISOString(),
      id: Date.now().toString()
    };
    
    // For now, we'll just save to localStorage as an example
    const existingScenarios = JSON.parse(localStorage.getItem('estate_gifting_scenarios') || '[]');
    localStorage.setItem('estate_gifting_scenarios', JSON.stringify([...existingScenarios, scenarioData]));
    
    toast.success("Scenario saved successfully!");
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 0: return "Basic Information";
      case 1: return "Gifting Strategy";
      case 2: return "Inheritance Scenario";
      case 3: return "Calculations";
      case 4: return "Results";
      default: return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 0: return "Enter your estate details";
      case 1: return "Define your gifting approach";
      case 2: return "Set inheritance timing and growth";
      case 3: return "Review your scenario calculations";
      case 4: return "Compare scenarios and save results";
      default: return "";
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <TaxDisclaimerWithCheckbox
              acknowledged={disclaimerAcknowledged}
              onAcknowledgeChange={setDisclaimerAcknowledged}
              title="Estate & Gift Planning Disclaimer"
              content={
                <>
                  <p className="text-amber-500 font-medium mb-2">
                    This tool is for educational purposes only.
                  </p>
                  <p>
                    The estate and gift tax calculations provided are estimates based on current laws and your inputs. 
                    Actual results may vary based on future law changes, market conditions, and your personal circumstances.
                  </p>
                  <p className="mt-2">
                    We strongly recommend consulting with a qualified estate planning attorney and tax advisor before implementing any gifting or estate strategy.
                  </p>
                  <p className="mt-2 text-amber-400">
                    <strong>Important:</strong> The federal estate tax exemption is scheduled to be reduced after 2025, 
                    potentially impacting your estate planning needs significantly.
                  </p>
                </>
              }
            />
            <BasicInformationStep 
              data={wizardData} 
              onUpdateField={handleUpdateField}
              onImportMultiYearPlan={loadMultiYearPlan}
            />
          </>
        );
      case 1:
        return <GiftingStrategyStep data={wizardData} onUpdateField={handleUpdateField} />;
      case 2:
        return (
          <>
            <InheritanceScenarioStep data={wizardData} onUpdateField={handleUpdateField} />
            {wizardData.yearOfPassing > CURRENT_YEAR && (
              <TaxProjectionDisclaimer 
                taxYear={wizardData.yearOfPassing} 
                className="mt-4" 
              />
            )}
          </>
        );
      case 3:
        return <CalculationsStep data={wizardData} />;
      case 4:
        return <ResultsStep data={wizardData} onSave={saveScenario} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#1A1F2C] border border-[#2A2F3C] rounded-lg p-4">
        <WizardHeader 
          currentStep={currentStep}
          stepTitle={getStepTitle()}
          stepDescription={getStepDescription()}
          totalSteps={5}
        />

        <Card className="border-[#2A2F3C] bg-[#242A38]">
          <CardContent className="p-6">
            {renderCurrentStep()}
          </CardContent>
        </Card>

        <WizardNavigation 
          currentStep={currentStep}
          totalSteps={5}
          onNext={handleNext}
          onBack={handleBack}
          disableNext={currentStep === 4}
        />
      </div>
    </div>
  );
};

export default EstateGiftingWizard;
