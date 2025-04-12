
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, PlusCircle, RefreshCw } from "lucide-react";
import { getTaxYears, addTaxYear, removeTaxYear, ensureNextYearExists, isProjectedTaxYear } from '@/utils/taxYearUtils';
import { toast } from "sonner";

const ManageTaxYearsSection: React.FC = () => {
  const [years, setYears] = useState<number[]>(getTaxYears());
  const [newYear, setNewYear] = useState<string>("");

  const handleAddYear = () => {
    try {
      const yearToAdd = parseInt(newYear, 10);
      if (isNaN(yearToAdd)) {
        toast.error("Please enter a valid year");
        return;
      }

      const added = addTaxYear(yearToAdd);
      if (added) {
        toast.success(`Year ${yearToAdd} added successfully`);
        setYears(getTaxYears());
        setNewYear("");
      } else {
        toast.info(`Year ${yearToAdd} already exists`);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleRemoveYear = (year: number) => {
    try {
      const removed = removeTaxYear(year);
      if (removed) {
        toast.success(`Year ${year} removed`);
        setYears(getTaxYears());
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEnsureNextYear = () => {
    try {
      const added = ensureNextYearExists();
      if (added) {
        const nextYear = new Date().getFullYear() + 1;
        toast.success(`Year ${nextYear} added automatically`);
        setYears(getTaxYears());
      } else {
        toast.info("Next year already exists in the system");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          Manage Tax Years
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <p className="text-[#B0B0B0] text-sm mb-4">
            Add or remove tax years to manage which years are available throughout the application. 
            Years marked as "Projected" will display disclaimers about estimated data.
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {years.map(year => (
              <div key={year} className="flex items-center bg-[#2A2F3C] rounded-md px-3 py-1.5">
                <span className="mr-2">{year}</span>
                {isProjectedTaxYear(year) && (
                  <Badge variant="outline" className="bg-amber-900/20 text-amber-400 border-amber-400/30 mr-2">
                    Projected
                  </Badge>
                )}
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-5 w-5 rounded-full hover:bg-red-900/20 hover:text-red-400"
                  onClick={() => handleRemoveYear(year)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-2 flex-1">
              <Input 
                type="number" 
                placeholder="Enter year (e.g., 2026)" 
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
                className="bg-[#1A1F2C] border-[#2A2F3C] text-white"
                min="1900" 
                max="2100"
              />
              <Button onClick={handleAddYear} className="whitespace-nowrap">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Year
              </Button>
            </div>

            <Button variant="outline" onClick={handleEnsureNextYear}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Add Next Year Automatically
            </Button>
          </div>
          
          <div className="mt-4 p-3 bg-[#1A1F2C] rounded-md text-xs text-[#B0B0B0]">
            <strong className="text-amber-400">Note:</strong> Adding a new tax year will make it available throughout the application but may require additional configuration for tax brackets, rates, and other year-specific data.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManageTaxYearsSection;
