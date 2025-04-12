
import React, { useState } from 'react';
import { 
  AlertCircle, 
  AlertTriangle,
  Info,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Define the TrapAlert interface
export interface TrapAlert {
  trapType: string;
  severity: "info" | "warning" | "critical";
  message: string;
  details?: any;
}

interface TaxTrapAlertsProps {
  alerts: TrapAlert[];
  className?: string;
}

const TaxTrapAlerts: React.FC<TaxTrapAlertsProps> = ({ alerts, className = "" }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  if (!alerts || alerts.length === 0) {
    return (
      <div className="text-sm text-muted-foreground p-4 bg-slate-800/10 rounded-md border border-slate-700/30">
        No additional surcharges or bracket issues detected for your tax situation.
      </div>
    );
  }
  
  // Get the educational page link based on trap type
  const getEducationalLink = (trapType: string) => {
    const links: Record<string, string> = {
      'irmaa': '/tax-planning/avoiding-tax-traps#irmaa',
      'capital_gains': '/tax-planning/avoiding-tax-traps#capital-gains',
      'social_security': '/tax-planning/avoiding-tax-traps#social-security',
      'aca': '/tax-planning/avoiding-tax-traps#aca-subsidies',
      'default': '/tax-planning/avoiding-tax-traps'
    };
    
    return links[trapType] || links.default;
  };
  
  // Get the severity level icon and styling
  const getSeverityDetails = (severity: TrapAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          icon: AlertCircle,
          containerClass: 'bg-red-950/20 dark:bg-red-900/20 border-red-800/30 dark:border-red-700/30',
          textClass: 'text-red-200',
          iconClass: 'text-red-500'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          containerClass: 'bg-amber-950/20 dark:bg-amber-900/20 border-amber-800/30 dark:border-amber-700/30',
          textClass: 'text-amber-200',
          iconClass: 'text-amber-500'
        };
      case 'info':
      default:
        return {
          icon: Info,
          containerClass: 'bg-slate-800/30 dark:bg-slate-800/20 border-slate-700/30 dark:border-slate-700/30',
          textClass: 'text-slate-200',
          iconClass: 'text-slate-400'
        };
    }
  };
  
  return (
    <div className={`mb-6 ${className}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold neptune-gold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Tax Trap Alerts ({alerts.length})
          </h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 w-9 h-9">
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
              <span className="sr-only">Toggle tax trap alerts</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <div className="space-y-3">
            {alerts.map((alert, index) => {
              const { icon: Icon, containerClass, textClass, iconClass } = getSeverityDetails(alert.severity);
              
              return (
                <div 
                  key={`${alert.trapType}-${index}`}
                  className={`p-4 rounded-md border ${containerClass}`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`h-5 w-5 mt-0.5 ${iconClass}`} />
                    <div className="flex-1">
                      <h4 className={`font-medium text-base mb-1 ${textClass}`}>
                        {alert.message}
                      </h4>
                      {alert.details && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {typeof alert.details === 'string' 
                            ? alert.details 
                            : JSON.stringify(alert.details)}
                        </p>
                      )}
                      <Link 
                        to={getEducationalLink(alert.trapType)} 
                        className="text-sm flex items-center text-primary hover:text-primary/80 gap-1 mt-2"
                      >
                        Learn more about this tax trap
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default TaxTrapAlerts;
