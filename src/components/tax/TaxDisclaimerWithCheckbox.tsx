
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface TaxDisclaimerWithCheckboxProps {
  acknowledged: boolean;
  onAcknowledgeChange: (checked: boolean) => void;
  className?: string;
  title?: string;
  content?: React.ReactNode;
  checkboxLabel?: string;
}

const TaxDisclaimerWithCheckbox: React.FC<TaxDisclaimerWithCheckboxProps> = ({
  acknowledged,
  onAcknowledgeChange,
  className,
  title = "Important Disclaimer",
  content,
  checkboxLabel = "I acknowledge and accept the limitations of this tool and the disclaimers provided."
}) => {
  return (
    <Card className={`border-amber-200 bg-amber-50/10 ${className || ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-amber-500">
          <AlertTriangle className="mr-2 h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm space-y-2">
          {content ? (
            content
          ) : (
            <>
              <p>
                This tool provides assistance for filing your personal taxes. It does not constitute legal or professional advice.
              </p>
              <p>
                While we strive for accuracy, you are responsible for verifying your information and ensuring timely submission.
              </p>
              <p>
                For complex or unusual situations, consult a licensed tax professional.
              </p>
            </>
          )}
        </div>
        
        <div className="flex items-start space-x-2 pt-2">
          <Checkbox 
            id="disclaimer-checkbox" 
            checked={acknowledged}
            onCheckedChange={(checked) => onAcknowledgeChange(checked === true)}
          />
          <Label 
            htmlFor="disclaimer-checkbox" 
            className="text-sm font-medium cursor-pointer"
          >
            {checkboxLabel}
          </Label>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxDisclaimerWithCheckbox;
