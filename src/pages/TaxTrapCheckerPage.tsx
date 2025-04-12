
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TaxTrapChecker } from '@/components/tax/TaxTrapChecker';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Info } from 'lucide-react';

const TaxTrapCheckerPage: React.FC = () => {
  const [filingStatus, setFilingStatus] = useState<'single' | 'married' | 'married_separate' | 'head_of_household'>('single');
  const [year, setYear] = useState(2023);
  const [agi, setAgi] = useState(85000);
  const [capitalGains, setCapitalGains] = useState(5000);
  const [socialSecurityAmount, setSocialSecurityAmount] = useState(0);
  const [isOnMedicare, setIsOnMedicare] = useState(false);
  const [hasACA, setHasACA] = useState(false);
  const [householdSize, setHouseholdSize] = useState(1);
  
  // Generated scenario ID for the tax trap checker
  const scenarioId = `user-scenario-${Math.random().toString(36).substring(2, 9)}`;
  
  // Derived values
  const magi = agi; // Simplified for demo purposes
  const totalIncome = agi + capitalGains;
  const taxableIncome = Math.max(0, agi - (filingStatus === 'single' ? 12950 : filingStatus === 'married' ? 25900 : 19400));

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Tax Trap Checker</h1>
        <p className="text-muted-foreground">
          Identify potential tax traps and threshold issues in your financial situation
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Your Tax Situation</CardTitle>
              <CardDescription>Enter your details to check for tax traps</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="year">Tax Year</Label>
                <Select value={year.toString()} onValueChange={(val) => setYear(parseInt(val))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="filingStatus">Filing Status</Label>
                <Select value={filingStatus} onValueChange={(val) => setFilingStatus(val as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select filing status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married Filing Jointly</SelectItem>
                    <SelectItem value="married_separate">Married Filing Separately</SelectItem>
                    <SelectItem value="head_of_household">Head of Household</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="agi">Adjusted Gross Income (AGI)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                  <Input 
                    id="agi" 
                    type="number" 
                    className="pl-7" 
                    value={agi} 
                    onChange={(e) => setAgi(Number(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capitalGains">Long-term Capital Gains</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                  <Input 
                    id="capitalGains" 
                    type="number" 
                    className="pl-7" 
                    value={capitalGains} 
                    onChange={(e) => setCapitalGains(Number(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="socialSecurity">Social Security Benefits</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                  <Input 
                    id="socialSecurity" 
                    type="number" 
                    className="pl-7" 
                    value={socialSecurityAmount} 
                    onChange={(e) => setSocialSecurityAmount(Number(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="householdSize">Household Size</Label>
                <Input 
                  id="householdSize" 
                  type="number" 
                  min={1}
                  value={householdSize} 
                  onChange={(e) => setHouseholdSize(Number(e.target.value))}
                />
              </div>
              
              <div className="flex flex-col gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="medicare"
                    checked={isOnMedicare}
                    onChange={(e) => setIsOnMedicare(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="medicare">On Medicare</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="aca"
                    checked={hasACA}
                    onChange={(e) => setHasACA(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="aca">ACA Health Insurance</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span>Tax Trap Analysis</span>
              </CardTitle>
              <CardDescription>
                Review potential tax surcharges and threshold issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TaxTrapChecker 
                scenarioId={scenarioId}
                scenarioData={{
                  year,
                  filing_status: filingStatus,
                  agi,
                  magi,
                  total_income: totalIncome,
                  taxable_income: taxableIncome,
                  capital_gains_long: capitalGains,
                  capital_gains_short: 0,
                  social_security_amount: socialSecurityAmount,
                  household_size: householdSize,
                  medicare_enrollment: isOnMedicare,
                  aca_enrollment: hasACA,
                }}
              />
              
              <Separator className="my-6" />
              
              <div className="rounded-md border p-4 bg-muted/50">
                <div className="flex gap-2">
                  <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">What are tax traps?</h4>
                    <p className="text-sm text-muted-foreground">
                      Tax traps occur when small increases in income trigger disproportionately large tax increases due to 
                      phaseouts of deductions, credits, or benefits, or movement into higher tax brackets.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-sm" asChild>
                      <a href="/tax-planning/avoiding-tax-traps">Learn more about tax traps</a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaxTrapCheckerPage;
