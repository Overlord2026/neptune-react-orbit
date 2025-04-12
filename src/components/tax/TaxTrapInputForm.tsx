
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface TaxTrapInputFormProps {
  filingStatus: 'single' | 'married' | 'married_separate' | 'head_of_household';
  setFilingStatus: (value: 'single' | 'married' | 'married_separate' | 'head_of_household') => void;
  year: number;
  setYear: (value: number) => void;
  agi: number;
  setAgi: (value: number) => void;
  capitalGains: number;
  setCapitalGains: (value: number) => void;
  socialSecurityAmount: number;
  setSocialSecurityAmount: (value: number) => void;
  isOnMedicare: boolean;
  setIsOnMedicare: (value: boolean) => void;
  hasACA: boolean;
  setHasACA: (value: boolean) => void;
  householdSize: number;
  setHouseholdSize: (value: number) => void;
}

const TaxTrapInputForm: React.FC<TaxTrapInputFormProps> = ({
  filingStatus,
  setFilingStatus,
  year,
  setYear,
  agi,
  setAgi,
  capitalGains,
  setCapitalGains,
  socialSecurityAmount,
  setSocialSecurityAmount,
  isOnMedicare,
  setIsOnMedicare,
  hasACA,
  setHasACA,
  householdSize,
  setHouseholdSize
}) => {
  return (
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
  );
};

export default TaxTrapInputForm;
