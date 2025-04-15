
import React from 'react';
import TaxTrapAlerts, { TrapAlert } from '@/components/tax/TaxTrapAlerts';

const TaxTrapAlertsDemo: React.FC = () => {
  // Sample trap alerts for demonstration
  const sampleTraps: TrapAlert[] = [
    {
      trapType: 'irmaa',
      severity: 'critical',
      message: 'Medicare IRMAA Surcharge Alert',
      details: 'Your income exceeds the threshold for IRMAA surcharges, adding $504.90 per person to your Medicare premiums.'
    },
    {
      trapType: 'capital_gains',
      severity: 'warning',
      message: 'Capital Gains Rate Increase',
      details: 'Your income pushes you into the 20% capital gains tax bracket from the 15% bracket.'
    },
    {
      trapType: 'social_security',
      severity: 'info',
      message: 'Social Security Taxation Threshold',
      details: 'Up to 85% of your Social Security benefits may be subject to income tax.'
    }
  ];

  return (
    <div className="container mx-auto my-8 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6">Tax Trap Alerts Demo</h1>
      <TaxTrapAlerts alerts={sampleTraps} />
    </div>
  );
};

export default TaxTrapAlertsDemo;
