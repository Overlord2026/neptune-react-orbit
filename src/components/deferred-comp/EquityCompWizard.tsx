
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { OptionDetailsStep } from "./steps/OptionDetailsStep";
import { DeferralStrategyStep } from "./steps/DeferralStrategyStep";
import { MultiYearApproachStep } from "./steps/MultiYearApproachStep";
import { TaxOutputStep } from "./steps/TaxOutputStep";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { EquityFormProvider, useEquityForm } from "./context/EquityFormContext";
import { HoldingPeriodStep } from "./steps/HoldingPeriodStep";

export const EquityCompWizard = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["basic-info", "option-details", "holding-period", "deferral-strategy", "multi-year-approach", "tax-output"];

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  // Step visibility controller based on form data
  const StepController = ({ children }: { children: React.ReactNode }) => {
    const { formState } = useEquityForm();
    
    // Skip holding period step if not ISO
    if (activeStep === 2 && formState.equityType !== "ISO") {
      handleNext();
      return null;
    }
    
    // Skip deferral strategy step if no deferred comp
    if (activeStep === 3 && !formState.hasDeferredComp) {
      handleNext();
      return null;
    }
    
    return <>{children}</>;
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <BasicInfoStep onNext={handleNext} />;
      case 1:
        return <OptionDetailsStep onNext={handleNext} onPrevious={handlePrevious} />;
      case 2:
        return <HoldingPeriodStep onNext={handleNext} onPrevious={handlePrevious} />;
      case 3:
        return <DeferralStrategyStep onNext={handleNext} onPrevious={handlePrevious} />;
      case 4:
        return <MultiYearApproachStep onNext={handleNext} onPrevious={handlePrevious} />;
      case 5:
        return <TaxOutputStep onPrevious={handlePrevious} />;
      default:
        return <BasicInfoStep onNext={handleNext} />;
    }
  };

  const WizardContent = () => {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-white">
              {activeStep === 0 && "Basic Information"}
              {activeStep === 1 && "Option Details"}
              {activeStep === 2 && "Holding Period"}
              {activeStep === 3 && "Deferral Strategy"}
              {activeStep === 4 && "Planning Approach"}
              {activeStep === 5 && "Tax Calculation Results"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {activeStep === 0 && "Tell us about your equity compensation"}
              {activeStep === 1 && "Provide details about your stock options"}
              {activeStep === 2 && "Specify your ISO holding strategy"}
              {activeStep === 3 && "Plan your deferral strategy"}
              {activeStep === 4 && "Choose between multi-year or single-year planning"}
              {activeStep === 5 && "Review your tax implications"}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <div className="flex space-x-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-8 rounded-full ${
                    index <= activeStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <StepController>
          {getStepContent(activeStep)}
        </StepController>
      </div>
    );
  };

  return (
    <EquityFormProvider>
      <WizardContent />
    </EquityFormProvider>
  );
};
