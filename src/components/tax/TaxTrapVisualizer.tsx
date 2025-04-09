
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '../ui/card';
import InfoTooltip from './InfoTooltip';

interface TaxTrapVisualizerProps {
  type: 'irmaa' | 'social_security' | 'capital_gains' | 'aca';
}

const TaxTrapVisualizer: React.FC<TaxTrapVisualizerProps> = ({ type }) => {
  // Based on the type, we'll return different visualizations
  switch(type) {
    case 'irmaa':
      return <IRMAAVisualizer />;
    case 'social_security':
      return <SocialSecurityVisualizer />;
    case 'capital_gains':
      return <CapitalGainsVisualizer />;
    case 'aca':
      return <ACAVisualizer />;
    default:
      return <div>Visualization not available</div>;
  }
};

const IRMAAVisualizer: React.FC = () => {
  const data = [
    { name: '≤$97K', partB: 174.70, partD: 0, surcharge: 0 },
    { name: '$97K-$123K', partB: 174.70, partD: 0, surcharge: 65.90 + 12.20 },
    { name: '$123K-$153K', partB: 174.70, partD: 0, surcharge: 164.80 + 31.50 },
    { name: '$153K-$183K', partB: 174.70, partD: 0, surcharge: 263.70 + 50.70 },
    { name: '$183K-$500K', partB: 174.70, partD: 0, surcharge: 362.60 + 70.00 },
    { name: '>$500K', partB: 174.70, partD: 0, surcharge: 395.60 + 76.40 },
  ];

  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground">
        2023 Medicare Part B & D Monthly Premiums (Single Filers)
        <InfoTooltip text="Amounts shown are monthly costs. Surcharges are additional to base premiums." />
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(value) => `$${value}`} />
            <Tooltip 
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Monthly Cost']}
              labelFormatter={(value) => `Income: ${value}`}
            />
            <Legend />
            <Bar 
              name="Base Premium" 
              dataKey="partB" 
              stackId="a" 
              fill="#64748b" 
            />
            <Bar 
              name="IRMAA Surcharge" 
              dataKey="surcharge" 
              stackId="a" 
              fill="#f59e0b" 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const SocialSecurityVisualizer: React.FC = () => {
  const data = [
    { income: "$0-$25K", taxablePercent: 0, label: "Not Taxable" },
    { income: "$25K-$34K", taxablePercent: 50, label: "Up to 50% Taxable" },
    { income: ">$34K", taxablePercent: 85, label: "Up to 85% Taxable" },
  ];

  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground">
        Social Security Taxation Thresholds (Single Filers)
        <InfoTooltip text="Based on combined income (AGI + tax-exempt interest + 1/2 of Social Security benefits)" />
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="income" />
            <YAxis tickFormatter={(value) => `${value}%`} />
            <Tooltip 
              formatter={(value: number) => [`${value}%`, 'Taxable Portion']}
              labelFormatter={(value) => `Income: ${value}`}
            />
            <Bar 
              name="Maximum Taxable Percentage" 
              dataKey="taxablePercent" 
              fill="#0284c7" 
              label={{ position: 'top', formatter: (value: number) => `${value}%` }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const CapitalGainsVisualizer: React.FC = () => {
  const data = [
    { bracket: "0%", income: "$0-$44,625", rate: 0 },
    { bracket: "15%", income: "$44,626-$492,300", rate: 15 },
    { bracket: "20%", income: ">$492,300", rate: 20 },
  ];

  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground">
        2023 Long-Term Capital Gains Rates (Single Filers)
        <InfoTooltip text="Based on taxable income. Additional 3.8% NIIT may apply above $200,000." />
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="income" />
            <YAxis tickFormatter={(value) => `${value}%`} />
            <Tooltip 
              formatter={(value: number) => [`${value}%`, 'Tax Rate']}
              labelFormatter={(income) => `Income: ${income}`}
            />
            <Bar 
              name="Capital Gains Rate" 
              dataKey="rate" 
              fill="#10b981" 
              label={{ position: 'top', formatter: (value: number) => `${value}%` }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const ACAVisualizer: React.FC = () => {
  const data = [
    { fpl: "0-150% FPL", premium: 0, label: "0% of Income" },
    { fpl: "150-200% FPL", premium: 2, label: "Up to 2%" },
    { fpl: "200-250% FPL", premium: 4, label: "Up to 4%" },
    { fpl: "250-300% FPL", premium: 6, label: "Up to 6%" },
    { fpl: "300-400% FPL", premium: 8.5, label: "Up to 8.5%" },
    { fpl: ">400% FPL", premium: 8.5, label: "Up to 8.5%" },
  ];

  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground">
        Maximum Premium as % of Income (2023)
        <InfoTooltip text="Based on temporary ACA subsidy enhancements through 2025. >400% FPL cap may change after 2025." />
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="fpl" />
            <YAxis tickFormatter={(value) => `${value}%`} />
            <Tooltip 
              formatter={(value: number) => [`${value}%`, 'Maximum Premium']}
              labelFormatter={(fpl) => `Income level: ${fpl}`}
            />
            <Bar 
              name="Premium Cap" 
              dataKey="premium" 
              fill="#8b5cf6" 
              label={{ position: 'top', formatter: (value: number) => `${value}%` }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TaxTrapVisualizer;
