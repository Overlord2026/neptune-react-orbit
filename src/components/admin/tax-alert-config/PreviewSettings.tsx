
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatAlertTemplate, TaxAlertTemplateVars } from "@/utils/taxUpdateUtils";

interface PreviewSettingsProps {
  previewType: string;
  setPreviewType: (value: string) => void;
  previewYear: number;
  setPreviewYear: (value: number) => void;
  previewPercentChange: number;
  setPreviewPercentChange: (value: number) => void;
  initialYear: number;
  majorTemplate: string;
  minorTemplate: string;
  infoTemplate: string;
}

const PreviewSettings: React.FC<PreviewSettingsProps> = ({
  previewType,
  setPreviewType,
  previewYear,
  setPreviewYear,
  previewPercentChange,
  setPreviewPercentChange,
  initialYear,
  majorTemplate,
  minorTemplate,
  infoTemplate
}) => {
  // Format example preview with actual values using our utility function
  const formatPreview = (template: string) => {
    const variables: TaxAlertTemplateVars = {
      type: previewType,
      year: previewYear,
      percentChange: previewPercentChange
    };
    return formatAlertTemplate(template, variables);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="preview-type">Update Type</Label>
          <Select 
            value={previewType} 
            onValueChange={setPreviewType}
          >
            <SelectTrigger id="preview-type" className="w-full mt-1">
              <SelectValue placeholder="Select update type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tax_bracket">Tax Bracket</SelectItem>
              <SelectItem value="standard_deduction">Standard Deduction</SelectItem>
              <SelectItem value="retirement_limits">Retirement Limits</SelectItem>
              <SelectItem value="tax_forms">Tax Forms</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="preview-year">Tax Year</Label>
          <Input
            id="preview-year"
            type="number"
            value={previewYear}
            onChange={(e) => setPreviewYear(parseInt(e.target.value, 10) || initialYear)}
            className="mt-1"
            min="2020"
            max="2030"
          />
        </div>
        
        <div>
          <div className="flex justify-between">
            <Label htmlFor="preview-percent">Percent Change ({previewPercentChange}%)</Label>
          </div>
          <Slider
            id="preview-percent"
            defaultValue={[previewPercentChange]}
            value={[previewPercentChange]}
            onValueChange={(value) => setPreviewPercentChange(value[0])}
            max={20}
            step={0.5}
            className="mt-2"
          />
        </div>
        
        <div className="pt-6 border-t">
          <h3 className="text-md font-medium mb-3">Template Previews</h3>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 border border-red-100 rounded-md">
              <p className="text-sm font-semibold text-red-800">Major:</p>
              <p className="text-sm">{formatPreview(majorTemplate)}</p>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-md">
              <p className="text-sm font-semibold text-amber-800">Minor:</p>
              <p className="text-sm">{formatPreview(minorTemplate)}</p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
              <p className="text-sm font-semibold text-blue-800">Info:</p>
              <p className="text-sm">{formatPreview(infoTemplate)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewSettings;
