
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TaxDataLastUpdate from '@/components/tax/TaxDataLastUpdate';
import { getTaxYears } from '@/utils/taxYearUtils';

interface YearFilingSelectorProps {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  selectedFilingStatus: 'single' | 'married' | 'head_of_household';
  setSelectedFilingStatus: (status: 'single' | 'married' | 'head_of_household') => void;
  availableYears?: number[];
}

const YearFilingSelector: React.FC<YearFilingSelectorProps> = ({
  selectedYear,
  setSelectedYear,
  selectedFilingStatus,
  setSelectedFilingStatus,
  availableYears
}) => {
  // Use provided years or get them from the utility function
  const years = availableYears || getTaxYears().sort((a, b) => b - a);
  
  return (
    <div className="flex flex-col md:flex-row gap-4 my-6 p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-card">
      <div className="space-y-2">
        <label htmlFor="year-select" className="text-sm font-medium">Tax Year</label>
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
      
      <div className="space-y-2">
        <label htmlFor="filing-status-select" className="text-sm font-medium">Filing Status</label>
        <Select 
          value={selectedFilingStatus} 
          onValueChange={(value) => setSelectedFilingStatus(value as 'single' | 'married' | 'head_of_household')}
        >
          <SelectTrigger id="filing-status-select" className="w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single</SelectItem>
            <SelectItem value="married">Married Filing Jointly</SelectItem>
            <SelectItem value="head_of_household">Head of Household</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-end ml-auto">
        <p className="text-xs text-muted-foreground">
          Data last updated: <TaxDataLastUpdate />
        </p>
      </div>
    </div>
  );
};

export default YearFilingSelector;
