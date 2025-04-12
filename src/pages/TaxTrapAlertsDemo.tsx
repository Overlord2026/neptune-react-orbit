
import React from 'react';
import TaxTrapAlerts, { TrapAlert } from '@/components/tax/TaxTrapAlerts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TaxTrapAlertsDemo: React.FC = () => {
  // Sample trap alerts for demonstration
  const sampleAlerts: TrapAlert[] = [
    {
      trapType: 'irmaa',
      severity: 'warning',
      message: 'IRMAA Surcharge Risk: Your income triggers a higher Medicare premium.',
      details: 'Your MAGI of $95,000 exceeds the threshold by $7,000, potentially increasing your Medicare premiums by $800 annually.'
    },
    {
      trapType: 'capital_gains',
      severity: 'critical',
      message: 'Capital Gains Bracket Increase: You may pay 20% instead of 15%.',
      details: 'Your taxable income of $492,500 exceeds the 15% capital gains bracket by $200, triggering the 20% rate on all gains.'
    },
    {
      trapType: 'social_security',
      severity: 'info',
      message: 'Social Security Taxation: 85% of benefits may be taxable.',
      details: 'Your combined income exceeds the threshold for maximum Social Security taxation.'
    },
    {
      trapType: 'aca',
      severity: 'warning',
      message: 'ACA Subsidy Reduction: Income approaching subsidy cliff.',
      details: 'Your projected MAGI is within $5,000 of the subsidy reduction threshold.'
    }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 neptune-gold">Tax Trap Alerts Demo</h1>
      
      <Card className="bg-card border-primary/20 mb-6">
        <CardHeader>
          <CardTitle>Tax Planning Scenario</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            This is a demonstration of the TaxTrapAlerts component, which displays
            various tax threshold issues that may impact your financial situation.
          </p>
          
          <TaxTrapAlerts alerts={sampleAlerts} />
          
          <div className="border-t border-border pt-4 mt-6">
            <h3 className="font-medium mb-2">Component Usage:</h3>
            <pre className="bg-slate-800 p-3 rounded-md text-xs overflow-x-auto">
              {`<TaxTrapAlerts alerts={alerts} />`}
            </pre>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card border-primary/20">
        <CardHeader>
          <CardTitle>Individual Alert Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Critical Alert</h3>
            <TaxTrapAlerts alerts={[sampleAlerts[1]]} />
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Warning Alert</h3>
            <TaxTrapAlerts alerts={[sampleAlerts[0]]} />
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Info Alert</h3>
            <TaxTrapAlerts alerts={[sampleAlerts[2]]} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxTrapAlertsDemo;
