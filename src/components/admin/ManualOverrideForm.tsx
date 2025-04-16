
import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { recordManualOverride, getCurrentUserId } from '@/utils/audit';
import { toast } from 'sonner';

interface ManualOverrideFormProps {
  dataFeedId: string;
  onOverrideComplete?: () => void;
}

interface OverrideField {
  year: string;
  type: string;
  field: string;
  value: string;
}

const ManualOverrideForm: React.FC<ManualOverrideFormProps> = ({
  dataFeedId,
  onOverrideComplete,
}) => {
  const [overrideReason, setOverrideReason] = useState('');
  const [fields, setFields] = useState<OverrideField[]>([
    { year: '', type: '', field: '', value: '' }
  ]);
  
  const addField = () => {
    setFields([...fields, { year: '', type: '', field: '', value: '' }]);
  };
  
  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };
  
  const updateField = (index: number, key: keyof OverrideField, value: string) => {
    const updatedFields = [...fields];
    updatedFields[index][key] = value;
    setFields(updatedFields);
  };
  
  const handleOverride = () => {
    if (!overrideReason.trim()) {
      toast.error("Please provide a reason for this manual override");
      return;
    }
    
    // Validate all fields are filled
    for (const field of fields) {
      if (!field.year || !field.type || !field.field || !field.value) {
        toast.error("Please fill in all override fields");
        return;
      }
    }
    
    try {
      const userId = getCurrentUserId();
      const affectedYears = [...new Set(fields.map(f => parseInt(f.year)))];
      
      // Record the override in the audit log
      recordManualOverride(
        userId,
        dataFeedId,
        {
          modified: fields.length,
          details: {
            fields: fields.map(f => ({
              year: f.year,
              type: f.type,
              field: f.field,
              value: f.value
            }))
          }
        },
        overrideReason,
        affectedYears
      );
      
      toast.success("Manual override applied successfully");
      
      // Reset form
      setOverrideReason('');
      setFields([{ year: '', type: '', field: '', value: '' }]);
      
      // Callback
      if (onOverrideComplete) {
        onOverrideComplete();
      }
    } catch (error) {
      console.error("Error applying manual override:", error);
      toast.error("Failed to apply manual override");
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Tax Data Override</CardTitle>
        <CardDescription>
          Use this form to manually override tax data values. All changes will be recorded in the audit log.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive" className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-yellow-800">Warning</AlertTitle>
          <AlertDescription className="text-yellow-800">
            Manual overrides should be used with caution. These changes will immediately affect all tax calculations
            and may cause inconsistencies if not properly validated.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-md">
              <div>
                <Label htmlFor={`year-${index}`}>Tax Year</Label>
                <Input 
                  id={`year-${index}`}
                  type="number"
                  placeholder="e.g. 2024" 
                  value={field.year}
                  onChange={(e) => updateField(index, 'year', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor={`type-${index}`}>Data Type</Label>
                <Select
                  value={field.type}
                  onValueChange={(value) => updateField(index, 'type', value)}
                >
                  <SelectTrigger id={`type-${index}`}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tax_bracket">Tax Bracket</SelectItem>
                    <SelectItem value="standard_deduction">Standard Deduction</SelectItem>
                    <SelectItem value="retirement_limits">Retirement Limit</SelectItem>
                    <SelectItem value="tax_forms">Tax Form</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor={`field-${index}`}>Field Name</Label>
                <Input 
                  id={`field-${index}`}
                  placeholder="e.g. rate, bracket_min" 
                  value={field.field}
                  onChange={(e) => updateField(index, 'field', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor={`value-${index}`}>New Value</Label>
                <Input 
                  id={`value-${index}`}
                  placeholder="e.g. 0.22, 50000" 
                  value={field.value}
                  onChange={(e) => updateField(index, 'value', e.target.value)}
                />
              </div>
              
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => removeField(index)}
                  disabled={fields.length === 1}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
          
          <Button 
            variant="outline" 
            onClick={addField}
          >
            Add Another Field
          </Button>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="override-reason">Reason for Override</Label>
          <Textarea 
            id="override-reason"
            placeholder="Please provide a detailed explanation for this manual override"
            value={overrideReason}
            onChange={(e) => setOverrideReason(e.target.value)}
            rows={4}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="default"
          className="w-full"
          onClick={handleOverride}
        >
          Apply Manual Override
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ManualOverrideForm;
