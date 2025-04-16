import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { STANDARD_DEDUCTION_BY_YEAR } from '@/utils/taxBracketData';
import { getTaxYears } from '@/utils/taxYearUtils';
import { FilingStatusType } from '@/types/tax/filingTypes';

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
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [selectedFilingStatus, setSelectedFilingStatus] = useState<string>('single');
  
  const availableYears = getTaxYears().sort((a, b) => b - a);
  
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
          {selectedYear === 2025 && (
            <p className="text-xs text-gray-400 mt-1">
              Tax rates and thresholds for 2025 are projected/estimated and may change once official IRS figures are released. For the most accurate information, consult the latest IRS publications.
            </p>
          )}
        </div>
      </div>
      
      <YearFilingSelector
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedFilingStatus={selectedFilingStatus}
        setSelectedFilingStatus={(status) => setSelectedFilingStatus(status)}
        availableYears={availableYears}
      />

      <div className="grid gap-6 py-6">
        <TaxBracketsSection
          selectedYear={selectedYear}
          selectedFilingStatus={selectedFilingStatus}
        />

        <FilingStatusSection
          selectedYear={selectedYear}
          selectedFilingStatus={selectedFilingStatus}
        />

        <TaxFormsSection />

        <DeductionsVsCreditsSection />

        <TaxRatesSection selectedYear={selectedYear} />

        <CapitalGainsSection
          selectedYear={selectedYear}
          selectedFilingStatus={selectedFilingStatus}
        />

        <RothVsTraditionalSection
          selectedYear={selectedYear}
        />

        <FilingStatusOverviewSection />

        <NavigationButtons />
      </div>
    </div>
  );
};

export default BasicTaxEducationPage;
