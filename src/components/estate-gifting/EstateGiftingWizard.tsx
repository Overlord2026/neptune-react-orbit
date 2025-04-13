
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TaxDisclaimerWithCheckbox from "@/components/tax/TaxDisclaimerWithCheckbox";
import TaxProjectionDisclaimer from "@/components/tax/TaxProjectionDisclaimer";
import BasicInformationStep from './steps/BasicInformationStep';
import GiftingStrategyStep from './steps/GiftingStrategyStep';
import InheritanceScenarioStep from './steps/InheritanceScenarioStep';
import CalculationsStep from './steps/CalculationsStep';
import ResultsStep from './steps/ResultsStep';
import { toast } from "sonner";

export type EstateGiftingData = {
  // Basic Information
  netWorth: number;
  estateExemption: number;
  aboveThreshold: boolean;
  
  // Gifting Strategy
  useAnnualGifts: boolean;
  numberOfDonees: number;
  lifetimeGiftsUsed: number;
  giftingStrategy: 'lump-sum' | 'annual';
  lumpSumAmount: number;
  
  // Inheritance Scenario
  yearOfPassing: number;
  growthRate: number;
  useTrustApproach: boolean;
  lifeCycleStage: 'young-adult' | 'mid-career' | 'pre-retirement' | 'retirement';
  trustType?: 'none' | 'revocable' | 'ilit' | 'grat' | 'slat' | 'dynasty';
  trustReductionFactor: number;
  
  // Calculations (will be computed)
  noGiftingTax: number;
  giftingTax: number;
  taxSavings: number;
  heirsBenefit: number;
};

const DEFAULT_ESTATE_EXEMPTION = 12.92 * 1000000; // $12.92 million in 2023
const ANNUAL_GIFT_EXCLUSION = 17000; // $17,000 per donee in 2023
const CURRENT_YEAR = new Date().getFullYear();

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
    heirsBenefit: 0
  });

  const calculateEstateValues = () => {
    // Calculate estate values based on current inputs
    const yearsUntilPassing = wizardData.yearOfPassing - CURRENT_YEAR;
    
    // Calculate future estate value with no gifting
    const futureEstateNoGifting = wizardData.netWorth * Math.pow(1 + wizardData.growthRate, yearsUntilPassing);
    
    // Calculate value of gifting
    let totalGiftValue = 0;
    
    if (wizardData.giftingStrategy === 'annual') {
      const annualGiftTotal = wizardData.useAnnualGifts ? 
        ANNUAL_GIFT_EXCLUSION * wizardData.numberOfDonees : 0;
        
      // Compound value of annual gifts over years
      for (let year = 0; year < yearsUntilPassing; year++) {
        totalGiftValue += annualGiftTotal * Math.pow(1 + wizardData.growthRate, yearsUntilPassing - year);
      }
    } else {
      // Lump sum gifting grows until passing
      totalGiftValue = wizardData.lumpSumAmount * Math.pow(1 + wizardData.growthRate, yearsUntilPassing);
    }
    
    // Future estate value with gifting
    const futureEstateWithGifting = Math.max(0, futureEstateNoGifting - totalGiftValue);
    
    // Calculate potential estate taxes (simplified calculation)
    // Assuming 40% tax rate on amounts exceeding exemption
    const TAX_RATE = 0.40;
    
    // Adjust exemption for inflation (simplified)
    const estimatedFutureExemption = wizardData.estateExemption * Math.pow(1.025, yearsUntilPassing);
    
    // Apply trust reduction factor if applicable
    const trustReductionAmount = wizardData.useTrustApproach ? 
      (futureEstateWithGifting * wizardData.trustReductionFactor) : 0;
      
    const adjustedFutureEstateWithGifting = Math.max(0, futureEstateWithGifting - trustReductionAmount);
    
    const taxableEstateNoGifting = Math.max(0, futureEstateNoGifting - estimatedFutureExemption - wizardData.lifetimeGiftsUsed);
    const taxableEstateWithGifting = Math.max(0, adjustedFutureEstateWithGifting - estimatedFutureExemption - wizardData.lifetimeGiftsUsed);
    
    const noGiftingTax = taxableEstateNoGifting * TAX_RATE;
    const giftingTax = taxableEstateWithGifting * TAX_RATE;
    const taxSavings = noGiftingTax - giftingTax;
    const heirsBenefit = taxSavings + totalGiftValue + trustReductionAmount;
    
    return {
      noGiftingTax,
      giftingTax,
      taxSavings,
      heirsBenefit,
      futureEstateNoGifting,
      futureEstateWithGifting,
      adjustedFutureEstateWithGifting,
      trustReductionAmount
    };
  };

  const handleNext = () => {
    if (currentStep === 0 && !disclaimerAcknowledged) {
      toast.warning("Please acknowledge the disclaimer before proceeding.");
      return;
    }

    if (currentStep === 3) {
      // Before moving to results, calculate the values
      const calculatedValues = calculateEstateValues();
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
                </>
              }
            />
            <BasicInformationStep 
              data={wizardData} 
              onUpdateField={handleUpdateField}
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
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#FFD700] text-[#1A1F2C] font-bold flex items-center justify-center">
              {currentStep + 1}
            </div>
            <div className="ml-3">
              <h2 className="text-xl font-semibold text-white">
                {currentStep === 0 && "Basic Information"}
                {currentStep === 1 && "Gifting Strategy"}
                {currentStep === 2 && "Inheritance Scenario"}
                {currentStep === 3 && "Calculations"}
                {currentStep === 4 && "Results"}
              </h2>
              <p className="text-[#B0B0B0] text-sm">
                {currentStep === 0 && "Enter your estate details"}
                {currentStep === 1 && "Define your gifting approach"}
                {currentStep === 2 && "Set inheritance timing and growth"}
                {currentStep === 3 && "Review your scenario calculations"}
                {currentStep === 4 && "Compare scenarios and save results"}
              </p>
            </div>
          </div>
          <div>
            <span className="text-[#B0B0B0]">Step {currentStep + 1} of 5</span>
          </div>
        </div>

        <Card className="border-[#2A2F3C] bg-[#242A38]">
          <CardContent className="p-6">
            {renderCurrentStep()}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button 
            onClick={handleBack} 
            disabled={currentStep === 0}
            variant="outline"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button onClick={handleNext} disabled={currentStep === 4}>
            {currentStep < 4 ? "Next" : "Complete"} <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EstateGiftingWizard;
