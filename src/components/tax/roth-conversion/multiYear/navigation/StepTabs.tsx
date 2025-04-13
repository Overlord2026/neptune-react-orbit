
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, ChevronRight, User, Clock, Users, ChartLine, BarChart4 } from "lucide-react";
import { useMultiYearContext } from '../context/MultiYearContext';

interface StepTabsProps {
  currentStep: string;
  onStepChange: (step: string) => void;
}

const StepTabs: React.FC<StepTabsProps> = ({
  currentStep, 
  onStepChange
}) => {
  const { hasCalculated } = useMultiYearContext();
  
  return (
    <TabsList className="grid grid-cols-6 mb-6">
      <TabsTrigger 
        value="bracket-fill"
        className="flex items-center gap-2"
        onClick={() => onStepChange("bracket-fill")}
      >
        <Calculator className="h-4 w-4" />
        <span className="hidden sm:inline">Bracket Fill</span>
        <span className="sm:hidden">1</span>
      </TabsTrigger>
      <TabsTrigger 
        value="spouse-details"
        className="flex items-center gap-2"
        onClick={() => onStepChange("spouse-details")}
      >
        <Users className="h-4 w-4" />
        <span className="hidden sm:inline">Spouse Details</span>
        <span className="sm:hidden">2</span>
      </TabsTrigger>
      <TabsTrigger 
        value="rmd"
        className="flex items-center gap-2"
        onClick={() => onStepChange("rmd")}
      >
        <Clock className="h-4 w-4" />
        <span className="hidden sm:inline">RMDs</span>
        <span className="sm:hidden">3</span>
      </TabsTrigger>
      <TabsTrigger 
        value="beneficiary"
        className="flex items-center gap-2"
        onClick={() => onStepChange("beneficiary")}
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">Beneficiary</span>
        <span className="sm:hidden">4</span>
      </TabsTrigger>
      <TabsTrigger 
        value="results"
        className="flex items-center gap-2"
        disabled={!hasCalculated}
        onClick={() => onStepChange("results")}
      >
        <ChartLine className="h-4 w-4" />
        <span className="hidden sm:inline">Results</span>
        <span className="sm:hidden">5</span>
      </TabsTrigger>
      <TabsTrigger 
        value="summary"
        className="flex items-center gap-2"
        disabled={!hasCalculated}
        onClick={() => onStepChange("summary")}
      >
        <BarChart4 className="h-4 w-4" />
        <span className="hidden sm:inline">Summary</span>
        <span className="sm:hidden">6</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default StepTabs;
