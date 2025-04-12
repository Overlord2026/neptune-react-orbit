
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DynamicContentText from '@/components/DynamicContentText';
import { getTaxYears } from '@/utils/taxYearUtils';

interface YearSelectorBarProps {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  availableYears?: number[];
}

const YearSelectorBar: React.FC<YearSelectorBarProps> = ({ 
  selectedYear, 
  setSelectedYear,
  availableYears
}) => {
  // Use provided years or get them from the utility function
  const years = availableYears || getTaxYears().sort((a, b) => b - a);
  
  return (
    <div className="flex flex-col md:flex-row gap-4 my-6 p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-card">
      <div className="space-y-2">
        <label htmlFor="year-select" className="text-sm font-medium">Reference Tax Year</label>
        <Select 
          value={selectedYear.toString()} 
          onValueChange={(value) => setSelectedYear(Number(value))}
        >
          <SelectTrigger id="year-select" className="w-[180px]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {years.map(year => (
              <SelectItem key={year} value={year.toString()}>
                {year}{year === 2025 && " (Projected)"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-end ml-auto">
        <p className="text-xs text-muted-foreground">
          Data last updated: <DynamicContentText as="span">tax_data_last_update</DynamicContentText>
        </p>
      </div>
    </div>
  );
};

export default YearSelectorBar;
