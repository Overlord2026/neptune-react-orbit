import React from 'react';
import { TaxReturnData } from '../SimpleReturnFilingFlow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, Upload } from 'lucide-react';

interface IncomeStepProps {
  data: TaxReturnData;
  onComplete: (data: Partial<TaxReturnData>) => void;
}

const IncomeStep: React.FC<IncomeStepProps> = ({ data, onComplete }) => {
  const [w2Forms, setW2Forms] = React.useState(data.w2Forms);
  const [interestIncome, setInterestIncome] = React.useState(data.interestIncome);
  const [dividendIncome, setDividendIncome] = React.useState(data.dividendIncome);

  const handleAddW2 = () => {
    setW2Forms([...w2Forms, { employer: '', wages: 0, federalWithholding: 0, stateWithholding: 0 }]);
  };

  const handleRemoveW2 = (index: number) => {
    setW2Forms(w2Forms.filter((_, i) => i !== index));
  };

  const handleW2Change = (index: number, field: string, value: string | number) => {
    const updatedW2Forms = [...w2Forms];
    // @ts-ignore - We know these fields exist on the W2 form object
    updatedW2Forms[index][field] = field === 'employer' ? value : Number(value);
    setW2Forms(updatedW2Forms);
  };

  const handleSubmit = () => {
    onComplete({
      w2Forms,
      interestIncome,
      dividendIncome
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold">Income & Withholding</h3>
        <p className="text-muted-foreground">Enter your income and withholding information from your W-2 and other forms.</p>
      </div>

      {/* W-2 Forms */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-medium">W-2 Forms</h4>
          <div className="space-x-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload W-2
            </Button>
            <Button variant="outline" size="sm" onClick={handleAddW2}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Manual Entry
            </Button>
          </div>
        </div>

        {w2Forms.map((form, index) => (
          <div key={index} className="border rounded-md p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h5 className="font-medium">W-2 Form {index + 1}</h5>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveW2(index)}
                disabled={w2Forms.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`employer-${index}`}>Employer Name</Label>
                <Input
                  id={`employer-${index}`}
                  value={form.employer}
                  onChange={(e) => handleW2Change(index, 'employer', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor={`wages-${index}`}>Wages (Box 1)</Label>
                <Input
                  id={`wages-${index}`}
                  type="number"
                  value={form.wages}
                  onChange={(e) => handleW2Change(index, 'wages', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor={`federal-${index}`}>Federal Withholding (Box 2)</Label>
                <Input
                  id={`federal-${index}`}
                  type="number"
                  value={form.federalWithholding}
                  onChange={(e) => handleW2Change(index, 'federalWithholding', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor={`state-${index}`}>State Withholding (Box 17)</Label>
                <Input
                  id={`state-${index}`}
                  type="number"
                  value={form.stateWithholding}
                  onChange={(e) => handleW2Change(index, 'stateWithholding', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Other Income */}
      <div className="space-y-4">
        <h4 className="font-medium">Other Income</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="interest-income">Interest Income (1099-INT)</Label>
            <Input
              id="interest-income"
              type="number"
              value={interestIncome}
              onChange={(e) => setInterestIncome(Number(e.target.value))}
            />
          </div>
          
          <div>
            <Label htmlFor="dividend-income">Dividend Income (1099-DIV)</Label>
            <Input
              id="dividend-income"
              type="number"
              value={dividendIncome}
              onChange={(e) => setDividendIncome(Number(e.target.value))}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button onClick={handleSubmit}>Continue</Button>
      </div>
    </div>
  );
};

export default IncomeStep;
