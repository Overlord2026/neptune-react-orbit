
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface ThresholdSettingsProps {
  thresholds: {
    tax_bracket: number;
    standard_deduction: number;
    retirement_limits: number;
    tax_forms: number;
    other: number;
  };
  onThresholdChange: (key: string, value: number[]) => void;
}

const ThresholdSettings: React.FC<ThresholdSettingsProps> = ({
  thresholds,
  onThresholdChange
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Tax Bracket Changes ({thresholds.tax_bracket}%)</Label>
          <span className="text-sm text-muted-foreground">
            Changes exceeding this percentage are considered major
          </span>
        </div>
        <Slider 
          defaultValue={[thresholds.tax_bracket]} 
          max={20} 
          step={1}
          onValueChange={(value) => onThresholdChange('tax_bracket', value)} 
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Standard Deduction Changes ({thresholds.standard_deduction}%)</Label>
          <span className="text-sm text-muted-foreground">
            Changes exceeding this percentage are considered major
          </span>
        </div>
        <Slider 
          defaultValue={[thresholds.standard_deduction]} 
          max={20} 
          step={1}
          onValueChange={(value) => onThresholdChange('standard_deduction', value)} 
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Retirement Limits Changes ({thresholds.retirement_limits}%)</Label>
          <span className="text-sm text-muted-foreground">
            Changes exceeding this percentage are considered major
          </span>
        </div>
        <Slider 
          defaultValue={[thresholds.retirement_limits]} 
          max={20} 
          step={1}
          onValueChange={(value) => onThresholdChange('retirement_limits', value)} 
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Tax Forms</Label>
          <span className="text-sm text-muted-foreground">
            Any change to tax forms is considered major
          </span>
        </div>
        <Slider 
          defaultValue={[0]} 
          max={5} 
          step={1}
          disabled
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Other Tax Updates ({thresholds.other}%)</Label>
          <span className="text-sm text-muted-foreground">
            Changes exceeding this percentage are considered major
          </span>
        </div>
        <Slider 
          defaultValue={[thresholds.other]} 
          max={20} 
          step={1}
          onValueChange={(value) => onThresholdChange('other', value)} 
        />
      </div>
    </div>
  );
};

export default ThresholdSettings;
