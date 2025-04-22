
import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, ChevronDown, ExternalLink } from 'lucide-react';
import { TaxTrapWarning } from '@/utils/taxTrapChecker';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface TaxTrapAccordionProps {
  warnings: TaxTrapWarning[];
}

const TaxTrapAccordion: React.FC<TaxTrapAccordionProps> = ({ warnings }) => {
  if (!warnings || warnings.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No tax traps detected for this scenario.
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

  const getIconForSeverity = (severity: string) => {
    switch (severity) {
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-slate-400" />;
    }
  };

  const getClassesForSeverity = (severity: string) => {
    switch (severity) {
      case 'alert':
        return 'bg-red-950/20 border-red-800/30';
      case 'warning':
        return 'bg-amber-950/20 border-amber-800/30';
      case 'info':
      default:
        return 'bg-slate-800/20 border-slate-700/30';
    }
  };

  return (
    <Accordion type="multiple" className="space-y-3">
      {warnings.map((warning, index) => (
        <AccordionItem 
          key={`${warning.trapType}-${index}`}
          value={`item-${index}`}
          className={`rounded-md border ${getClassesForSeverity(warning.severity)}`}
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-start gap-2 text-left">
              {getIconForSeverity(warning.severity)}
              <span className="font-medium text-sm">{warning.title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-3 pt-0">
            <div className="ml-7">
              <p className="text-xs text-muted-foreground">{warning.description}</p>
              {warning.financial_impact > 0 && (
                <p className="text-xs font-medium mt-1">
                  Potential impact: ${warning.financial_impact.toLocaleString()}
                </p>
              )}
              <Link 
                to={getEducationalLink(warning.trapType)} 
                className="text-xs flex items-center text-primary hover:text-primary/80 gap-1 mt-2"
              >
                Learn more about this tax trap
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default TaxTrapAccordion;
