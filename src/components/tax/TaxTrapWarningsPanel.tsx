
import React, { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { TrapAlert } from './TaxTrapAlerts';
import TaxTrapAlerts from './TaxTrapAlerts';
import { AlertTriangle, ChevronDown, FileDown, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';
import { Link } from 'react-router-dom';

interface TaxTrapWarningsPanelProps {
  alerts: TrapAlert[];
  scenarioName: string;
  onPrint?: () => void;
  className?: string;
}

const TaxTrapWarningsPanel: React.FC<TaxTrapWarningsPanelProps> = ({ 
  alerts, 
  scenarioName,
  onPrint,
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(true);

  // Handle print functionality
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      // Default print behavior
      window.print();
    }
  };
  
  return (
    <Card className={`border-primary/20 ${className}`}>
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {alerts.length > 0 ? (
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            )}
            <h3 className="text-lg font-semibold">
              {alerts.length > 0 
                ? `Tax Trap Analysis (${alerts.length})`
                : "Tax Trap Analysis"
              }
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrint}
              className="text-xs flex items-center gap-1"
            >
              <FileDown className="h-3.5 w-3.5" />
              Export PDF
            </Button>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 w-9 h-9">
                  <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
                  <span className="sr-only">Toggle tax trap analysis</span>
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </div>
        
        <Separator />
        
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Analysis for <span className="font-medium text-foreground">{scenarioName}</span>
              </p>
              
              {alerts.length > 0 ? (
                <TaxTrapAlerts alerts={alerts} />
              ) : (
                <div className="p-4 bg-green-950/20 border border-green-800/30 rounded-md">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <p className="text-sm">
                      No major bracket jumps or surcharges detected for this scenario.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="pt-2">
                <Link 
                  to="/tax-planning/avoiding-tax-traps" 
                  className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                >
                  Learn more about tax traps and strategies
                </Link>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </Card>
  );
};

export default TaxTrapWarningsPanel;
