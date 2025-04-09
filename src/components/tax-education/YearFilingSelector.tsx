
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DynamicContentText from '@/components/DynamicContentText';

interface YearFilingSelectorProps {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  selectedFilingStatus: 'single' | 'married' | 'head_of_household';
  setSelectedFilingStatus: (status: 'single' | 'married' | 'head_of_household') => void;
  availableYears: number[];
}

const YearFilingSelector: React.FC<YearFilingSelectorProps> = ({
  selectedYear,
  setSelectedYear,
  selectedFilingStatus,
  setSelectedFilingStatus,
  availableYears
}) => {
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
            {availableYears.map(year => (
              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
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
          Data last updated: <DynamicContentText as="span">tax_data_last_update</DynamicContentText>
        </p>
      </div>
    </div>
  );
};

export default YearFilingSelector;
