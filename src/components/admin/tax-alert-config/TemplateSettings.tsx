
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatAlertTemplate, TaxAlertTemplateVars } from "@/utils/taxUpdateUtils";

interface TemplateSettingsProps {
  majorTemplate: string;
  setMajorTemplate: (value: string) => void;
  minorTemplate: string;
  setMinorTemplate: (value: string) => void;
  infoTemplate: string;
  setInfoTemplate: (value: string) => void;
  previewType: string;
  previewYear: number;
  previewPercentChange: number;
}

const TemplateSettings: React.FC<TemplateSettingsProps> = ({
  majorTemplate,
  setMajorTemplate,
  minorTemplate,
  setMinorTemplate,
  infoTemplate,
  setInfoTemplate,
  previewType,
  previewYear,
  previewPercentChange
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
      <div>
        <Label htmlFor="major-template">Major Update Template</Label>
        <Input 
          id="major-template" 
          value={majorTemplate}
          onChange={(e) => setMajorTemplate(e.target.value)}
          className="mt-1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Use {"{type}"}, {"{year}"}, {"{percentChange}"} as placeholders
        </p>
        <div className="text-xs text-muted-foreground mt-1 p-2 bg-slate-50 rounded border">
          <p className="font-semibold">Preview:</p>
          <p>{formatPreview(majorTemplate)}</p>
        </div>
      </div>
      
      <div>
        <Label htmlFor="minor-template">Minor Update Template</Label>
        <Input 
          id="minor-template" 
          value={minorTemplate}
          onChange={(e) => setMinorTemplate(e.target.value)}
          className="mt-1"
        />
        <div className="text-xs text-muted-foreground mt-1 p-2 bg-slate-50 rounded border">
          <p className="font-semibold">Preview:</p>
          <p>{formatPreview(minorTemplate)}</p>
        </div>
      </div>
      
      <div>
        <Label htmlFor="info-template">Info Update Template</Label>
        <Input 
          id="info-template" 
          value={infoTemplate}
          onChange={(e) => setInfoTemplate(e.target.value)}
          className="mt-1"
        />
        <div className="text-xs text-muted-foreground mt-1 p-2 bg-slate-50 rounded border">
          <p className="font-semibold">Preview:</p>
          <p>{formatPreview(infoTemplate)}</p>
        </div>
      </div>
    </div>
  );
};

export default TemplateSettings;
