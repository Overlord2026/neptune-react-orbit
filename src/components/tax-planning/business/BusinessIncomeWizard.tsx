
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { calculateSmallBusinessTax, BusinessIncomeInput, BusinessTaxResult } from '@/utils/tax/businessTaxCalculator';
import BusinessInfoStep from './steps/BusinessInfoStep';
import ExpensesStep from './steps/ExpensesStep';
import EntityComparisonStep from './steps/EntityComparisonStep';
import MultiYearPlanStep from './steps/MultiYearPlanStep';
import ResultsSummary from './steps/ResultsSummary';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Define the step type for the wizard
type WizardStep = 'business-info' | 'expenses' | 'entity-comparison' | 'multi-year' | 'results';

interface BusinessIncomeWizardProps {
  initialIncome?: number;
  initialYear?: number;
  onComplete?: (result: BusinessTaxResult, input: BusinessIncomeInput) => void;
  isEmbedded?: boolean;
}

const BusinessIncomeWizard: React.FC<BusinessIncomeWizardProps> = ({ 
  initialIncome = 75000, 
  initialYear = new Date().getFullYear(),
  onComplete,
  isEmbedded = false
}) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<WizardStep>('business-info');
  const [businessInput, setBusinessInput] = useState<BusinessIncomeInput>({
    businessType: 'sole_proprietorship',
    income: initialIncome,
    expenses: {},
    year: initialYear,
  });
  const [taxResult, setTaxResult] = useState<BusinessTaxResult | null>(null);
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [showMultiYear, setShowMultiYear] = useState<boolean>(false);

  // Update business inputs
  const updateBusinessInput = (updates: Partial<BusinessIncomeInput>) => {
    setBusinessInput(prev => ({
      ...prev,
      ...updates
    }));
  };

  // Calculate taxes when needed
  const calculateTaxes = () => {
    try {
      const result = calculateSmallBusinessTax(businessInput);
      setTaxResult(result);
      return result;
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "There was an error calculating your taxes. Please review your inputs.",
        variant: "destructive"
      });
      return null;
    }
  };

  // Navigate to next step
  const nextStep = () => {
    switch(currentStep) {
      case 'business-info':
        setCurrentStep('expenses');
        break;
      case 'expenses':
        // Calculate taxes before moving to next steps
        const result = calculateTaxes();
        if (result) {
          if (showComparison) {
            setCurrentStep('entity-comparison');
          } else if (showMultiYear) {
            setCurrentStep('multi-year');
          } else {
            setCurrentStep('results');
          }
        }
        break;
      case 'entity-comparison':
        if (showMultiYear) {
          setCurrentStep('multi-year');
        } else {
          setCurrentStep('results');
        }
        break;
      case 'multi-year':
        setCurrentStep('results');
        break;
      case 'results':
        // Reset to beginning or trigger the onComplete callback if provided
        if (onComplete && taxResult) {
          onComplete(taxResult, businessInput);
        } else {
          setCurrentStep('business-info');
        }
        break;
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    switch(currentStep) {
      case 'expenses':
        setCurrentStep('business-info');
        break;
      case 'entity-comparison':
        setCurrentStep('expenses');
        break;
      case 'multi-year':
        if (showComparison) {
          setCurrentStep('entity-comparison');
        } else {
          setCurrentStep('expenses');
        }
        break;
      case 'results':
        if (showMultiYear) {
          setCurrentStep('multi-year');
        } else if (showComparison) {
          setCurrentStep('entity-comparison');
        } else {
          setCurrentStep('expenses');
        }
        break;
    }
  };

  // Render the appropriate step content
  const renderStepContent = () => {
    switch(currentStep) {
      case 'business-info':
        return (
          <BusinessInfoStep 
            businessInput={businessInput}
            updateBusinessInput={updateBusinessInput}
            setShowComparison={setShowComparison}
            setShowMultiYear={setShowMultiYear}
            onNext={nextStep}
          />
        );
      case 'expenses':
        return (
          <ExpensesStep 
            businessInput={businessInput}
            updateBusinessInput={updateBusinessInput}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 'entity-comparison':
        return (
          <EntityComparisonStep 
            businessInput={businessInput}
            updateBusinessInput={updateBusinessInput}
            taxResult={taxResult}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 'multi-year':
        return (
          <MultiYearPlanStep 
            businessInput={businessInput}
            updateBusinessInput={updateBusinessInput}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 'results':
        return (
          <ResultsSummary 
            businessInput={businessInput}
            taxResult={taxResult}
            onReset={() => setCurrentStep('business-info')}
            onPrev={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Business Income Tax Wizard</h2>
          <p className="text-muted-foreground">Optimize your small business tax strategy</p>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="bg-[#2A2F3C]">
                  <span className="text-yellow-400 font-semibold">Beta</span>
                </Badge>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">This tool provides tax estimates only. Always consult a qualified tax professional for advice specific to your situation.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Tabs value={currentStep} className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger 
            value="business-info"
            disabled={currentStep !== 'business-info'}
            className={currentStep === 'business-info' ? 'text-primary' : ''}
          >
            Business Info
          </TabsTrigger>
          <TabsTrigger 
            value="expenses"
            disabled={currentStep !== 'expenses'}
            className={currentStep === 'expenses' ? 'text-primary' : ''}
          >
            Expenses
          </TabsTrigger>
          <TabsTrigger 
            value="entity-comparison"
            disabled={!showComparison || currentStep !== 'entity-comparison'}
            className={currentStep === 'entity-comparison' ? 'text-primary' : ''}
          >
            Entity Options
          </TabsTrigger>
          <TabsTrigger 
            value="multi-year"
            disabled={!showMultiYear || currentStep !== 'multi-year'}
            className={currentStep === 'multi-year' ? 'text-primary' : ''}
          >
            Multi-Year
          </TabsTrigger>
          <TabsTrigger 
            value="results"
            disabled={currentStep !== 'results'}
            className={currentStep === 'results' ? 'text-primary' : ''}
          >
            Results
          </TabsTrigger>
        </TabsList>

        <Card className="border-[#2A2F3C] bg-[#1A1F2C]">
          <CardContent className="pt-6">
            {renderStepContent()}
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default BusinessIncomeWizard;
