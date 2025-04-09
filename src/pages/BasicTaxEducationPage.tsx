
import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { STANDARD_DEDUCTION_BY_YEAR } from '@/utils/taxBracketData';

// Import all the new component sections
import YearFilingSelector from '@/components/tax-education/YearFilingSelector';
import TaxBracketsSection from '@/components/tax-education/TaxBracketsSection';
import FilingStatusSection from '@/components/tax-education/FilingStatusSection';
import TaxFormsSection from '@/components/tax-education/TaxFormsSection';
import DeductionsVsCreditsSection from '@/components/tax-education/DeductionsVsCreditsSection';
import TaxRatesSection from '@/components/tax-education/TaxRatesSection';
import CapitalGainsSection from '@/components/tax-education/CapitalGainsSection';
import RothVsTraditionalSection from '@/components/tax-education/RothVsTraditionalSection';
import FilingStatusOverviewSection from '@/components/tax-education/FilingStatusOverviewSection';
import NavigationButtons from '@/components/tax-education/NavigationButtons';

const BasicTaxEducationPage = () => {
  const [selectedYear, setSelectedYear] = useState<number>(2023); // Default year
  const [selectedFilingStatus, setSelectedFilingStatus] = useState<'single' | 'married' | 'head_of_household'>('single');
  
  // Get available years from tax data
  const availableYears = Object.keys(STANDARD_DEDUCTION_BY_YEAR)
    .map(Number)
    .sort((a, b) => b - a); // Sort in descending order
  
  return (
    <div className="container content-padding section-margin">
      <div className="flex flex-col items-start justify-between space-y-2">
        <div className="space-y-0.5">
          <h2 className="text-3xl font-bold tracking-tight neptune-gold flex items-center">
            <BookOpen className="mr-2 h-6 w-6" />
            Basic Tax Education
          </h2>
          <p className="text-muted-foreground">
            Learn the fundamentals of how taxes work in the United States, common tax forms, and key definitions.
          </p>
        </div>
      </div>
      
      {/* Year and Filing Status Selectors */}
      <YearFilingSelector
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedFilingStatus={selectedFilingStatus}
        setSelectedFilingStatus={setSelectedFilingStatus}
        availableYears={availableYears}
      />

      <div className="grid gap-6 py-6">
        {/* Tax Brackets Section */}
        <TaxBracketsSection
          selectedYear={selectedYear}
          selectedFilingStatus={selectedFilingStatus}
        />

        {/* Filing Status & Tax Brackets */}
        <FilingStatusSection
          selectedYear={selectedYear}
          selectedFilingStatus={selectedFilingStatus}
        />

        {/* Common Tax Forms Section */}
        <TaxFormsSection />

        {/* Deductions vs. Credits Section */}
        <DeductionsVsCreditsSection />

        {/* Marginal vs. Effective Tax Rates */}
        <TaxRatesSection />

        {/* Capital Gains Basics */}
        <CapitalGainsSection
          selectedYear={selectedYear}
          selectedFilingStatus={selectedFilingStatus}
        />

        {/* Roth vs. Traditional Accounts */}
        <RothVsTraditionalSection
          selectedYear={selectedYear}
        />

        {/* Filing Status Overview */}
        <FilingStatusOverviewSection />

        {/* Navigation Buttons */}
        <NavigationButtons />
      </div>
    </div>
  );
};

export default BasicTaxEducationPage;
