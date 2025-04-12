
import React, { useState } from 'react';
import { TaxReturnData } from '../types/TaxReturnTypes';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EligibilityStepProps {
  data: TaxReturnData;
  onComplete: (data: Partial<TaxReturnData>) => void;
}

const EligibilityStep: React.FC<EligibilityStepProps> = ({ data, onComplete }) => {
  const [hasOnlyW2Income, setHasOnlyW2Income] = useState<boolean | null>(data.hasOnlyW2Income);
  const [hasDependents, setHasDependents] = useState<boolean | null>(data.hasDependents);
  const [hasSelfEmploymentIncome, setHasSelfEmploymentIncome] = useState<boolean | null>(data.hasSelfEmploymentIncome);
  
  // Check eligibility based on answers
  const checkEligibility = () => {
    // For this simplified version, let's say users are eligible if they have only W-2 income
    // and no self-employment income
    const isEligible = hasOnlyW2Income === true && hasSelfEmploymentIncome === false;
    
    onComplete({
      hasOnlyW2Income,
      hasDependents,
      hasSelfEmploymentIncome,
      isEligible
    });
  };

  const canContinue = hasOnlyW2Income !== null && 
                     hasDependents !== null && 
                     hasSelfEmploymentIncome !== null;
  
  const isIneligible = hasOnlyW2Income === false || hasSelfEmploymentIncome === true;
                     
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold">Welcome to Simple Return Filing</h3>
        <p className="text-muted-foreground">Let's check if you're eligible for the simple filing process.</p>
      </div>
      
      <div className="space-y-4">
        {/* Do you have only W-2 income? */}
        <div className="space-y-2">
          <h4 className="font-medium">Do you have only W-2 income?</h4>
          <RadioGroup value={hasOnlyW2Income?.toString()} onValueChange={(v) => setHasOnlyW2Income(v === 'true')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="w2-yes" />
              <Label htmlFor="w2-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="w2-no" />
              <Label htmlFor="w2-no">No</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Do you have any dependents? */}
        <div className="space-y-2">
          <h4 className="font-medium">Do you have any dependents?</h4>
          <RadioGroup value={hasDependents?.toString()} onValueChange={(v) => setHasDependents(v === 'true')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="dependents-yes" />
              <Label htmlFor="dependents-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="dependents-no" />
              <Label htmlFor="dependents-no">No</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Any self-employment or rental income? */}
        <div className="space-y-2">
          <h4 className="font-medium">Do you have any self-employment or rental income?</h4>
          <RadioGroup value={hasSelfEmploymentIncome?.toString()} onValueChange={(v) => setHasSelfEmploymentIncome(v === 'true')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="self-emp-yes" />
              <Label htmlFor="self-emp-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="self-emp-no" />
              <Label htmlFor="self-emp-no">No</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      
      {isIneligible && (
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Complex Tax Situation Detected</AlertTitle>
          <AlertDescription>
            <p className="mb-4">Based on your answers, your tax situation may be better handled by a professional.</p>
            <Button asChild>
              <Link to="/tax-planning/filing-options">Connect with a Tax Professional</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-end space-x-2">
        <Button
          onClick={checkEligibility}
          disabled={!canContinue}
        >
          Continue
        </Button>
      </div>

      {/* Disclaimer */}
      <div className="text-xs text-muted-foreground bg-slate-100 dark:bg-slate-900/30 p-3 rounded-lg mt-6">
        <div className="flex items-start gap-2">
          <FileCheck className="h-4 w-4 text-slate-500 mt-0.5" />
          <p>
            This tool is for simple returns only. Always verify the accuracy of your data. 
            By continuing, you acknowledge that you're responsible for ensuring all information 
            provided is correct and complete.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EligibilityStep;
