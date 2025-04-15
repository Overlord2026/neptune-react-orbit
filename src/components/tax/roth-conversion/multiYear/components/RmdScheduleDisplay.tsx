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
import { ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
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

// Format percentage values
const formatPercent = (decimal: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(decimal);
};

const formatBalance = (balance: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(balance || 0);
};

const RmdScheduleDisplay: React.FC<RmdScheduleDisplayProps> = ({ 
  scenarioData,
  yearlyResults
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showSpouseTable, setShowSpouseTable] = React.useState(false);

  // Filter results to only show years with RMDs
  const rmdYears = yearlyResults.filter(result => result.rmdAmount > 0);
  const spouseRmdYears = yearlyResults.filter(result => result.spouseRmdAmount && result.spouseRmdAmount > 0);
  
  // Only show if there are RMD years or the user is near retirement
  const primaryRmdStartYear = scenarioData.startYear + (scenarioData.rmdStartAge - scenarioData.startAge);
  const spouseRmdStartYear = scenarioData.includeSpouse && scenarioData.spouseAge && scenarioData.spouseRmdStartAge
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

  // Calculate total RMDs for all years
  const totalRmds = rmdYears.reduce((sum, year) => sum + year.rmdAmount, 0);
  const totalSpouseRmds = spouseRmdYears.reduce((sum, year) => sum + (year.spouseRmdAmount || 0), 0);

  // Calculate final year RMD percentage of account
  const finalRmdYear = rmdYears.length > 0 ? rmdYears[rmdYears.length - 1] : null;
  const finalRmdPercent = finalRmdYear ? 
    finalRmdYear.rmdAmount / finalRmdYear.traditionalIraBalance : 0;
  const finalSpouseRmdPercent = finalRmdYear && finalRmdYear.spouseRmdAmount && finalRmdYear.spouseTraditionalIraBalance ? 
    finalRmdYear.spouseRmdAmount / finalRmdYear.spouseTraditionalIraBalance : 0;

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
          
          {(!isOpen) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 bg-slate-50/5 border border-border p-3 rounded-md">
                <h3 className="text-sm font-medium">Primary Account RMDs</h3>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">First RMD Year:</span>
                  <span className="text-sm">
                    {rmdYears.length > 0 ? `${rmdYears[0].year} (Age ${rmdYears[0].age})` : 
                     `${primaryRmdStartYear} (Age ${scenarioData.rmdStartAge})`}
                  </span>
                </div>
                {rmdYears.length > 0 && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">First RMD Amount:</span>
                      <span className="text-sm">{formatCurrency(rmdYears[0].rmdAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Latest RMD Amount:</span>
                      <span className="text-sm">{formatCurrency(rmdYears[rmdYears.length - 1].rmdAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-border pt-1 mt-1">
                      <span className="text-sm text-muted-foreground">Total Lifetime RMDs:</span>
                      <span className="text-sm font-medium">{formatCurrency(totalRmds)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Latest Withdrawal Rate:</span>
                      <span className="text-sm">{formatPercent(finalRmdPercent)}</span>
                    </div>
                  </>
                )}
              </div>

              {scenarioData.includeSpouse && (
                <div className="space-y-2 bg-slate-50/5 border border-border p-3 rounded-md">
                  <h3 className="text-sm font-medium">Spouse Account RMDs</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">First RMD Year:</span>
                    <span className="text-sm">
                      {spouseRmdYears.length > 0 ? `${spouseRmdYears[0].year} (Age ${spouseRmdYears[0].spouseAge})` : 
                       spouseRmdStartYear ? `${spouseRmdStartYear} (Age ${scenarioData.spouseRmdStartAge})` : 'N/A'}
                    </span>
                  </div>
                  {spouseRmdYears.length > 0 && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">First RMD Amount:</span>
                        <span className="text-sm">{formatCurrency(spouseRmdYears[0].spouseRmdAmount || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Latest RMD Amount:</span>
                        <span className="text-sm">{formatCurrency(spouseRmdYears[spouseRmdYears.length - 1].spouseRmdAmount || 0)}</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-border pt-1 mt-1">
                        <span className="text-sm text-muted-foreground">Total Lifetime RMDs:</span>
                        <span className="text-sm font-medium">{formatCurrency(totalSpouseRmds)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Latest Withdrawal Rate:</span>
                        <span className="text-sm">{formatPercent(finalSpouseRmdPercent)}</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
          
          <CollapsibleContent>
            {rmdYears.length > 0 || spouseRmdYears.length > 0 ? (
              <div className="mt-4">
                {scenarioData.includeSpouse && spouseRmdYears.length > 0 && (
                  <div className="flex gap-4 mb-3">
                    <button 
                      className={`text-sm px-3 py-1 rounded-md transition-colors ${!showSpouseTable ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                      onClick={() => setShowSpouseTable(false)}
                    >
                      Primary Account RMDs
                    </button>
                    <button 
                      className={`text-sm px-3 py-1 rounded-md transition-colors ${showSpouseTable ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                      onClick={() => setShowSpouseTable(true)}
                    >
                      Spouse Account RMDs
                    </button>
                  </div>
                )}
                
                {!showSpouseTable ? (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Year</TableHead>
                          <TableHead>Age</TableHead>
                          <TableHead className="text-right">IRA Balance</TableHead>
                          <TableHead className="text-right">RMD Amount</TableHead>
                          <TableHead className="text-right">Withdrawal %</TableHead>
                          <TableHead className="text-right">Tax Impact</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {yearlyResults.filter(result => 
                          result.age >= scenarioData.rmdStartAge - 2
                        ).map((result, index) => {
                          const withdrawalPercent = result.rmdAmount > 0 && result.traditionalIraBalance > 0 ?
                            result.rmdAmount / result.traditionalIraBalance : 0;
                            
                          return (
                            <TableRow key={index} className={result.rmdAmount > 0 ? "bg-amber-50/20 dark:bg-amber-950/20" : ""}>
                              <TableCell>{result.year}</TableCell>
                              <TableCell>{result.age}</TableCell>
                              <TableCell className="text-right">{formatBalance(result.traditionalIraBalance)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(result.rmdAmount)}</TableCell>
                              <TableCell className="text-right">{result.rmdAmount > 0 ? formatPercent(withdrawalPercent) : '-'}</TableCell>
                              <TableCell className="text-right">{formatPercent(result.marginalRate)}</TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Year</TableHead>
                          <TableHead>Age</TableHead>
                          <TableHead className="text-right">IRA Balance</TableHead>
                          <TableHead className="text-right">RMD Amount</TableHead>
                          <TableHead className="text-right">Withdrawal %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {yearlyResults.filter(result => 
                          result.spouseAge && result.spouseAge >= (scenarioData.spouseRmdStartAge || 73) - 2
                        ).map((result, index) => {
                          const withdrawalPercent = result.spouseRmdAmount && result.spouseRmdAmount > 0 && 
                            result.spouseTraditionalIraBalance && result.spouseTraditionalIraBalance > 0 ?
                            result.spouseRmdAmount / result.spouseTraditionalIraBalance : 0;
                            
                          return (
                            <TableRow key={index} className={(result.spouseRmdAmount && result.spouseRmdAmount > 0) ? "bg-amber-50/20 dark:bg-amber-950/20" : ""}>
                              <TableCell>{result.year}</TableCell>
                              <TableCell>{result.spouseAge || '--'}</TableCell>
                              <TableCell className="text-right">{formatBalance(result.spouseTraditionalIraBalance || 0)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(result.spouseRmdAmount || 0)}</TableCell>
                              <TableCell className="text-right">
                                {result.spouseRmdAmount && result.spouseRmdAmount > 0 ? formatPercent(withdrawalPercent) : '-'}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-4 bg-blue-50/10 p-3 rounded border border-blue-600/30 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">No RMDs in Current Projection Period</p>
                  <p className="text-sm text-muted-foreground">
                    Required Minimum Distributions will begin when you reach age {scenarioData.rmdStartAge}.
                    {scenarioData.includeSpouse && ` Your spouse will begin RMDs at age ${scenarioData.spouseRmdStartAge || 73}.`}
                    Consider extending your projection period to see RMD impacts.
                  </p>
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
        
        {/* RMD Tax Impact Information */}
        {rmdYears.length > 0 && (
          <div className="mt-5 bg-slate-50/5 border border-border p-3 rounded-md">
            <h3 className="text-sm font-medium mb-2">RMD Tax Impact Analysis</h3>
            <p className="text-sm text-muted-foreground mb-3">
              RMDs may increase your taxable income and potentially push you into higher tax brackets. Converting 
              Traditional IRA funds to Roth IRA before RMDs begin can help reduce future required distributions.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="p-2 border border-border rounded-md">
                <p className="font-medium mb-1">Cumulative RMDs</p>
                <p className="text-lg">{formatCurrency(totalRmds + totalSpouseRmds)}</p>
              </div>
              <div className="p-2 border border-border rounded-md">
                <p className="font-medium mb-1">RMD Tax Rate</p>
                <p className="text-lg">{formatPercent(finalRmdYear?.marginalRate || 0)}</p>
              </div>
              <div className="p-2 border border-border rounded-md">
                <p className="font-medium mb-1">Final Withdrawal %</p>
                <p className="text-lg">{formatPercent(Math.max(finalRmdPercent, finalSpouseRmdPercent))}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RmdScheduleDisplay;
