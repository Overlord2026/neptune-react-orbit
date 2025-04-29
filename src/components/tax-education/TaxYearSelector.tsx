
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilingStatusType } from '@/types/tax/filingTypes';
import TaxDataLastUpdate from '@/components/tax/TaxDataLastUpdate';
import { getTaxYears } from '@/utils/taxYearUtils';

interface TaxYearSelectorProps {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  selectedFilingStatus: FilingStatusType;
  setSelectedFilingStatus: (status: FilingStatusType) => void;
}

const TaxYearSelector: React.FC<TaxYearSelectorProps> = ({
  selectedYear,
  setSelectedYear,
  selectedFilingStatus,
  setSelectedFilingStatus
}) => {
  // Get available tax years from utility
  const years = getTaxYears().sort((a, b) => b - a);
  
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6 p-4 border border-[#2d3748] rounded-lg bg-[#1a202c]">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="space-y-2">
          <label htmlFor="year-select" className="text-sm font-medium text-[#e2e8f0]">Tax Year</label>
          <Select 
            value={selectedYear.toString()} 
            onValueChange={(value) => setSelectedYear(Number(value))}
          >
            <SelectTrigger id="year-select" className="w-[180px] bg-[#0b1120] border-[#2d3748] text-white">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a202c] border-[#2d3748] text-white">
              {years.map(year => (
                <SelectItem key={year} value={year.toString()} className="text-white hover:bg-[#2d3748]">
                  {year}{year === 2025 && " (Projected)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="filing-status-select" className="text-sm font-medium text-[#e2e8f0]">Filing Status</label>
          <Select 
            value={selectedFilingStatus} 
            onValueChange={(value) => setSelectedFilingStatus(value as FilingStatusType)}
          >
            <SelectTrigger id="filing-status-select" className="w-[180px] bg-[#0b1120] border-[#2d3748] text-white">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a202c] border-[#2d3748] text-white">
              <SelectItem value="single" className="text-white hover:bg-[#2d3748]">Single</SelectItem>
              <SelectItem value="married_joint" className="text-white hover:bg-[#2d3748]">Married Filing Jointly</SelectItem>
              <SelectItem value="head_of_household" className="text-white hover:bg-[#2d3748]">Head of Household</SelectItem>
              <SelectItem value="married_separate" className="text-white hover:bg-[#2d3748]">Married Filing Separately</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="text-xs text-[#a0aec0]">
        <p>Tax data last updated: <TaxDataLastUpdate /></p>
        {selectedYear === 2025 && (
          <p className="text-[#f6ad55] mt-1">2025 rates are projected and may change</p>
        )}
      </div>
    </div>
  );
};

export default TaxYearSelector;
