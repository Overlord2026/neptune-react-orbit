
import React from 'react';
import { 
  Card,
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { 
  Table,
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { MultiYearScenarioData, YearlyResult } from '../../types/ScenarioTypes';
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface RmdScheduleDisplayProps {
  scenarioData: MultiYearScenarioData;
  yearlyResults: YearlyResult[];
}

// Format currency values
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

const RmdScheduleDisplay: React.FC<RmdScheduleDisplayProps> = ({ 
  scenarioData,
  yearlyResults
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  // Filter results to only show years with RMDs
  const rmdYears = yearlyResults.filter(result => result.rmdAmount > 0);
  const spouseRmdYears = yearlyResults.filter(result => result.spouseRmdAmount && result.spouseRmdAmount > 0);
  
  // Only show if there are RMD years or the user is near retirement
  const primaryRmdStartYear = scenarioData.startYear + (scenarioData.rmdStartAge - scenarioData.startAge);
  const spouseRmdStartYear = scenarioData.includeSpouse 
    ? scenarioData.startYear + (scenarioData.spouseRmdStartAge - scenarioData.spouseAge)
    : null;
  
  const isNearRmd = (primaryRmdStartYear - scenarioData.startYear) <= 5 || 
    (spouseRmdStartYear && (spouseRmdStartYear - scenarioData.startYear) <= 5);
  
  const hasRmds = rmdYears.length > 0 || spouseRmdYears.length > 0 || isNearRmd;
  
  if (!hasRmds) {
    return null;
  }
  
  const rmdStartMessage = primaryRmdStartYear > scenarioData.startYear
    ? `RMDs begin in ${primaryRmdStartYear} (at age ${scenarioData.rmdStartAge})`
    : 'RMDs have already begun';
  
  const spouseRmdStartMessage = spouseRmdStartYear && scenarioData.includeSpouse
    ? spouseRmdStartYear > scenarioData.startYear
      ? `RMDs begin in ${spouseRmdStartYear} (at age ${scenarioData.spouseRmdStartAge})`
      : 'RMDs have already begun'
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Required Minimum Distributions (RMDs)</CardTitle>
        <CardDescription>
          {rmdStartMessage}
          {spouseRmdStartMessage && ` • Spouse: ${spouseRmdStartMessage}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="w-full"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium mb-2">RMD Schedule Summary</h3>
            <CollapsibleTrigger className="text-sm text-blue-400 flex items-center gap-1">
              {isOpen ? (
                <>Hide Details <ChevronUp className="h-4 w-4" /></>
              ) : (
                <>Show Details <ChevronDown className="h-4 w-4" /></>
              )}
            </CollapsibleTrigger>
          </div>
          
          {(!isOpen && rmdYears.length > 0) && (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">First RMD Year:</span>
                <span className="text-sm">{rmdYears[0].year} (Age {rmdYears[0].age})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">First RMD Amount:</span>
                <span className="text-sm">{formatCurrency(rmdYears[0].rmdAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Latest RMD Amount:</span>
                <span className="text-sm">{formatCurrency(rmdYears[rmdYears.length - 1].rmdAmount)}</span>
              </div>
              {scenarioData.includeSpouse && spouseRmdYears.length > 0 && (
                <>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-muted-foreground">Spouse First RMD Year:</span>
                    <span className="text-sm">{spouseRmdYears[0].year} (Age {spouseRmdYears[0].spouseAge})</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Spouse Latest RMD Amount:</span>
                    <span className="text-sm">{formatCurrency(spouseRmdYears[spouseRmdYears.length - 1].spouseRmdAmount || 0)}</span>
                  </div>
                </>
              )}
            </div>
          )}
          
          <CollapsibleContent>
            <div className="mt-4 rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead className="text-right">IRA Balance</TableHead>
                    <TableHead className="text-right">RMD Amount</TableHead>
                    {scenarioData.includeSpouse && (
                      <>
                        <TableHead>Spouse Age</TableHead>
                        <TableHead className="text-right">Spouse IRA Balance</TableHead>
                        <TableHead className="text-right">Spouse RMD</TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {yearlyResults.filter(result => 
                    result.age >= scenarioData.rmdStartAge - 2 || 
                    (scenarioData.includeSpouse && result.spouseAge && result.spouseAge >= scenarioData.spouseRmdStartAge - 2)
                  ).map((result, index) => (
                    <TableRow key={index} className={result.rmdAmount > 0 || (result.spouseRmdAmount && result.spouseRmdAmount > 0) ? "bg-amber-50/20 dark:bg-amber-950/20" : ""}>
                      <TableCell>{result.year}</TableCell>
                      <TableCell>{result.age}</TableCell>
                      <TableCell className="text-right">{formatCurrency(result.traditionalIRABalance)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(result.rmdAmount)}</TableCell>
                      {scenarioData.includeSpouse && (
                        <>
                          <TableCell>{result.spouseAge || '--'}</TableCell>
                          <TableCell className="text-right">{formatCurrency(result.spouseTraditionalIRABalance || 0)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(result.spouseRmdAmount || 0)}</TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default RmdScheduleDisplay;
