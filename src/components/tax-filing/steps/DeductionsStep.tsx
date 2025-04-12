
import React from 'react';
import { TaxReturnData } from '../types/TaxReturnTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import GlossaryTerm from '@/components/GlossaryTerm';

interface DeductionsStepProps {
  data: TaxReturnData;
  onComplete: (data: Partial<TaxReturnData>) => void;
}

const DeductionsStep: React.FC<DeductionsStepProps> = ({ data, onComplete }) => {
  const [useStandardDeduction, setUseStandardDeduction] = React.useState(data.useStandardDeduction);
  const [itemizedDeductions, setItemizedDeductions] = React.useState(data.itemizedDeductions);
  const [childTaxCredit, setChildTaxCredit] = React.useState(data.childTaxCredit);
  const [educationCredit, setEducationCredit] = React.useState(data.educationCredit);

  const handleItemizedDeductionChange = (field: keyof typeof itemizedDeductions, value: string) => {
    setItemizedDeductions({
      ...itemizedDeductions,
      [field]: Number(value)
    });
  };

  const totalItemized = Object.values(itemizedDeductions).reduce((sum, value) => sum + value, 0);
  const standardDeductionAmount = 12950; // Example for 2023 single filer

  const handleSubmit = () => {
    onComplete({
      useStandardDeduction,
      itemizedDeductions,
      childTaxCredit,
      educationCredit
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold">Deductions & Credits</h3>
        <p className="text-muted-foreground">Choose your deduction method and applicable tax credits.</p>
      </div>

      {/* Standard vs Itemized Deduction */}
      <div className="space-y-4">
        <h4 className="font-medium">Deduction Method</h4>
        <RadioGroup 
          value={useStandardDeduction ? "standard" : "itemized"} 
          onValueChange={(v) => setUseStandardDeduction(v === "standard")}
        >
          <div className="flex items-start space-x-2 pb-2">
            <RadioGroupItem value="standard" id="standard-deduction" className="mt-1" />
            <div className="grid gap-1.5">
              <Label htmlFor="standard-deduction" className="font-medium">Standard Deduction</Label>
              <p className="text-sm text-muted-foreground">
                Take the standard deduction of ${standardDeductionAmount.toLocaleString()}. 
                This is the simplest option and benefits most taxpayers.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="itemized" id="itemized-deduction" className="mt-1" />
            <div className="grid gap-1.5">
              <Label htmlFor="itemized-deduction" className="font-medium">Itemized Deduction</Label>
              <p className="text-sm text-muted-foreground">
                Itemize your deductions if their total exceeds the standard deduction amount.
              </p>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Itemized Deduction Details (conditionally shown) */}
      {!useStandardDeduction && (
        <Card className="p-4 space-y-4 bg-slate-50 dark:bg-slate-900/30">
          <h4 className="font-medium">Itemized Deductions</h4>
          <div className="space-y-3">
            <div>
              <Label htmlFor="medical-expenses">
                <GlossaryTerm termId="medical-expenses">Medical Expenses</GlossaryTerm>
              </Label>
              <Input
                id="medical-expenses"
                type="number"
                value={itemizedDeductions.medicalExpenses}
                onChange={(e) => handleItemizedDeductionChange('medicalExpenses', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="state-taxes">State & Local Taxes</Label>
              <Input
                id="state-taxes"
                type="number"
                value={itemizedDeductions.stateTaxes}
                onChange={(e) => handleItemizedDeductionChange('stateTaxes', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="property-taxes">Property Taxes</Label>
              <Input
                id="property-taxes"
                type="number"
                value={itemizedDeductions.propertyTaxes}
                onChange={(e) => handleItemizedDeductionChange('propertyTaxes', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="mortgage-interest">
                <GlossaryTerm termId="mortgage-interest">Mortgage Interest</GlossaryTerm>
              </Label>
              <Input
                id="mortgage-interest"
                type="number"
                value={itemizedDeductions.mortgageInterest}
                onChange={(e) => handleItemizedDeductionChange('mortgageInterest', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="charitable-contributions">
                <GlossaryTerm termId="charitable-contributions">Charitable Contributions</GlossaryTerm>
              </Label>
              <Input
                id="charitable-contributions"
                type="number"
                value={itemizedDeductions.charitableContributions}
                onChange={(e) => handleItemizedDeductionChange('charitableContributions', e.target.value)}
              />
            </div>
            
            <div className="pt-2 border-t">
              <div className="flex justify-between font-medium">
                <span>Total Itemized Deductions:</span>
                <span>${totalItemized.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Standard Deduction:</span>
                <span>${standardDeductionAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-medium mt-1 pt-1 border-t">
                <span>Better option:</span>
                <span className={totalItemized > standardDeductionAmount ? "text-green-600" : "text-amber-600"}>
                  {totalItemized > standardDeductionAmount 
                    ? "Itemize" 
                    : "Standard Deduction"}
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Common Credits */}
      <div className="space-y-4">
        <h4 className="font-medium">Tax Credits</h4>
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="child-tax-credit" 
              checked={childTaxCredit}
              onCheckedChange={(checked) => setChildTaxCredit(checked === true)}
            />
            <div>
              <Label 
                htmlFor="child-tax-credit" 
                className="font-medium"
              >
                <GlossaryTerm termId="child-tax-credit">Child Tax Credit</GlossaryTerm>
              </Label>
              <p className="text-sm text-muted-foreground">
                For qualifying children under 17. Worth up to $2,000 per qualifying child.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="education-credit" 
              checked={educationCredit}
              onCheckedChange={(checked) => setEducationCredit(checked === true)}
            />
            <div>
              <Label 
                htmlFor="education-credit" 
                className="font-medium"
              >
                <GlossaryTerm termId="education-credit">Education Credit</GlossaryTerm>
              </Label>
              <p className="text-sm text-muted-foreground">
                For qualified education expenses paid for eligible students.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button onClick={handleSubmit}>Continue</Button>
      </div>
    </div>
  );
};

export default DeductionsStep;
