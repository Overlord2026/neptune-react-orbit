
import React from 'react';
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
  severity: "info" | "warning" | "critical" | "low" | "medium" | "high";
  message: string;
  details?: string;
  description?: string;
  title?: string;
}

interface TaxTrapAlertsProps {
  alerts: TrapAlert[];
  className?: string;
}

const TaxTrapAlerts: React.FC<TaxTrapAlertsProps> = ({ alerts, className = "" }) => {
  const [isOpen, setIsOpen] = React.useState(true);
  
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
    // Map severity values from either naming convention
    const normalizedSeverity = 
      severity === 'low' || severity === 'info' ? 'info' :
      severity === 'medium' || severity === 'warning' ? 'warning' :
      'critical'; // high or critical
    
    switch (normalizedSeverity) {
      case 'critical':
        return {
          icon: AlertCircle,
          containerClass: 'bg-red-950/30 dark:bg-red-900/20 border-red-700 dark:border-red-600',
          textClass: 'text-white',
          iconClass: 'text-red-400'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          containerClass: 'bg-amber-950/30 dark:bg-amber-900/20 border-amber-700 dark:border-amber-600',
          textClass: 'text-white',
          iconClass: 'text-amber-400'
        };
      case 'info':
      default:
        return {
          icon: Info,
          containerClass: 'bg-slate-800/30 dark:bg-slate-800/20 border-blue-700 dark:border-blue-600',
          textClass: 'text-white',
          iconClass: 'text-blue-400'
        };
    }
  };
  
  return (
    <div className={`mb-6 ${className}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            Tax Trap Alerts ({alerts.length})
          </h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 w-9 h-9 text-white hover:bg-white/10">
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
              <span className="sr-only">Toggle tax trap alerts</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <div className="space-y-3">
            {alerts.map((alert, index) => {
              const { icon: Icon, containerClass, textClass, iconClass } = getSeverityDetails(alert.severity);
              const displayMessage = alert.title || alert.message;
              const displayDetails = alert.description || alert.details;
              
              return (
                <div 
                  key={`${alert.trapType}-${index}`}
                  className={`p-4 rounded-md border ${containerClass}`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`h-5 w-5 mt-0.5 ${iconClass}`} />
                    <div className="flex-1">
                      <h4 className={`font-medium text-base mb-1 ${textClass}`}>
                        {displayMessage}
                      </h4>
                      {displayDetails && (
                        <p className="text-sm text-gray-200 mb-2">
                          {typeof displayDetails === 'string' 
                            ? displayDetails 
                            : JSON.stringify(displayDetails)}
                        </p>
                      )}
                      <Link 
                        to={getEducationalLink(alert.trapType)} 
                        className="text-sm flex items-center text-blue-400 hover:text-blue-300 gap-1 mt-2"
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
