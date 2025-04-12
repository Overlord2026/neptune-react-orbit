
import React from 'react';
import { Button } from '@/components/ui/button';
import { Info, AlertCircle, HelpCircle } from 'lucide-react';

interface TaxTrapInfoBoxProps {
  icon?: 'info' | 'alert' | 'help';
}

const TaxTrapInfoBox: React.FC<TaxTrapInfoBoxProps> = ({ icon = 'info' }) => {
  const IconComponent = 
    icon === 'alert' ? AlertCircle :
    icon === 'help' ? HelpCircle :
    Info;
  
  return (
    <div className="rounded-md border p-4 bg-muted/50">
      <div className="flex gap-2">
        <IconComponent className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-medium">What are tax traps?</h4>
          <p className="text-sm text-muted-foreground">
            Tax traps occur when small increases in income trigger disproportionately large tax increases due to 
            phaseouts of deductions, credits, or benefits, or movement into higher tax brackets.
          </p>
          <Button variant="link" className="p-0 h-auto text-sm" asChild>
            <a href="/tax-planning/avoiding-tax-traps">Learn more about tax traps</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaxTrapInfoBox;
