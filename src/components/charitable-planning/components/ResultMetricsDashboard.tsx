
import React from 'react';
import ResultMetricCard from './ResultMetricCard';

interface ResultMetricsDashboardProps {
  taxableIncomeReduction: number;
  bracketSavings: number;
  irmaaSavings: number;
  showIrmaa: boolean;
}

const ResultMetricsDashboard: React.FC<ResultMetricsDashboardProps> = ({ 
  taxableIncomeReduction,
  bracketSavings,
  irmaaSavings,
  showIrmaa
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <ResultMetricCard 
        title="Taxable Income Reduction"
        value={taxableIncomeReduction}
        description="Potential reduction in taxable income"
      />
      
      <ResultMetricCard 
        title="Tax Savings"
        value={bracketSavings}
        description="Estimated annual tax savings"
      />
      
      {showIrmaa && (
        <ResultMetricCard 
          title="IRMAA Savings"
          value={irmaaSavings}
          description="Potential Medicare premium savings"
        />
      )}
    </div>
  );
};

export default ResultMetricsDashboard;
