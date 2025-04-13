
import React from 'react';
import ResultMetricCard from './ResultMetricCard';

interface ResultMetricsDashboardProps {
  taxableIncomeReduction: number;
  bracketSavings: number;
  irmaaSavings: number;
  showIrmaa: boolean;
  totalCharitableImpact?: number;
}

const ResultMetricsDashboard: React.FC<ResultMetricsDashboardProps> = ({ 
  taxableIncomeReduction,
  bracketSavings,
  irmaaSavings,
  showIrmaa,
  totalCharitableImpact
}) => {
  // Determine if we should show the total charitable impact card
  const showTotalImpact = totalCharitableImpact !== undefined && totalCharitableImpact > 0;
  
  // Determine how many cards we're showing to adjust grid columns
  const gridCols = showIrmaa && showTotalImpact ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-4" :
                   showIrmaa || showTotalImpact ? "grid-cols-1 sm:grid-cols-3" :
                   "grid-cols-1 sm:grid-cols-2";

  return (
    <div className={`grid ${gridCols} gap-4 mb-6`}>
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
      
      {showTotalImpact && (
        <ResultMetricCard 
          title="Total Charitable Impact"
          value={totalCharitableImpact || 0}
          description="Combined charitable giving"
          highlight={true}
        />
      )}
    </div>
  );
};

export default ResultMetricsDashboard;
