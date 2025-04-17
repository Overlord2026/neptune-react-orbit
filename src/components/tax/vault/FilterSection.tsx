
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getTaxYears } from "@/utils/taxYearUtils";

interface FilterSectionProps {
  selectedTaxYear: string | null;
  setSelectedTaxYear: (year: string | null) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ 
  selectedTaxYear, 
  setSelectedTaxYear 
}) => {
  const availableTaxYears = getTaxYears().map(year => year.toString());
  
  return (
    <Card className="bg-[#1f2937] border-[#374151] mx-4 sm:mx-6">
      <CardHeader>
        <CardTitle className="text-lg text-white">Filter by Tax Year</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Button 
          variant={selectedTaxYear === null ? "filterActive" : "filter"} 
          onClick={() => setSelectedTaxYear(null)}
        >
          All Years
        </Button>
        {availableTaxYears.map(year => (
          <Button 
            key={year} 
            variant={selectedTaxYear === year ? "filterActive" : "filter"}
            onClick={() => setSelectedTaxYear(year)}
          >
            {year}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default FilterSection;
