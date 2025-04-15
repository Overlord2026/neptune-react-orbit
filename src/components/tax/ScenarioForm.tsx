
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { TaxInput, FilingStatusType } from '@/types/tax';
import { STANDARD_DEDUCTION } from '@/utils/taxBracketData';

interface ScenarioFormProps {
  onSubmit: (data: TaxInput) => void;
}

const ScenarioForm: React.FC<ScenarioFormProps> = ({ onSubmit }) => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [wages, setWages] = useState<number | string>('');
  const [interest, setInterest] = useState<number | string>('');
  const [dividends, setDividends] = useState<number | string>('');
  const [capital_gains, setCapitalGains] = useState<number | string>('');
  const [ira_distributions, setIraDistributions] = useState<number | string>('');
  const [roth_conversion, setRothConversion] = useState<number | string>('');
  const [social_security, setSocialSecurity] = useState<number | string>('');
  const [isItemizedDeduction, setIsItemizedDeduction] = useState(false);
  const [itemizedDeductionAmount, setItemizedDeductionAmount] = useState<number | string>('');
  const [filing_status, setFilingStatus] = useState<FilingStatusType>('single');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: TaxInput = {
      year: parseInt(year.toString()),
      wages: parseFloat(wages.toString()),
      interest: parseFloat(interest.toString()),
      dividends: parseFloat(dividends.toString()),
      capital_gains: parseFloat(capital_gains.toString()),
      ira_distributions: parseFloat(ira_distributions.toString()),
      roth_conversion: parseFloat(roth_conversion.toString()),
      social_security: parseFloat(social_security.toString()),
      isItemizedDeduction: isItemizedDeduction,
      itemizedDeductionAmount: parseFloat(itemizedDeductionAmount.toString()),
      filing_status: filing_status,
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="year">Year</Label>
        <Select value={year.toString()} onValueChange={(value) => setYear(parseInt(value))}>
          <SelectTrigger>
            <SelectValue placeholder="Select a year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2021">2021</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="wages">Wages</Label>
        <Input
          type="number"
          id="wages"
          value={wages}
          onChange={(e) => setWages(e.target.value)}
          placeholder="Enter wages"
        />
      </div>

      <div>
        <Label htmlFor="interest">Interest</Label>
        <Input
          type="number"
          id="interest"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          placeholder="Enter interest"
        />
      </div>

      <div>
        <Label htmlFor="dividends">Dividends</Label>
        <Input
          type="number"
          id="dividends"
          value={dividends}
          onChange={(e) => setDividends(e.target.value)}
          placeholder="Enter dividends"
        />
      </div>

      <div>
        <Label htmlFor="capital_gains">Capital Gains</Label>
        <Input
          type="number"
          id="capital_gains"
          value={capital_gains}
          onChange={(e) => setCapitalGains(e.target.value)}
          placeholder="Enter capital gains"
        />
      </div>

      <div>
        <Label htmlFor="ira_distributions">IRA Distributions</Label>
        <Input
          type="number"
          id="ira_distributions"
          value={ira_distributions}
          onChange={(e) => setIraDistributions(e.target.value)}
          placeholder="Enter IRA distributions"
        />
      </div>

      <div>
        <Label htmlFor="roth_conversion">Roth Conversion</Label>
        <Input
          type="number"
          id="roth_conversion"
          value={roth_conversion}
          onChange={(e) => setRothConversion(e.target.value)}
          placeholder="Enter Roth conversion"
        />
      </div>

      <div>
        <Label htmlFor="social_security">Social Security</Label>
        <Input
          type="number"
          id="social_security"
          value={social_security}
          onChange={(e) => setSocialSecurity(e.target.value)}
          placeholder="Enter Social Security"
        />
      </div>

      <div>
        <Label htmlFor="filing_status">Filing Status</Label>
        <Select value={filing_status} onValueChange={value => setFilingStatus(value as FilingStatusType)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a filing status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single</SelectItem>
            <SelectItem value="married_joint">Married Filing Jointly</SelectItem>
            <SelectItem value="head_of_household">Head of Household</SelectItem>
            <SelectItem value="married_separate">Married Filing Separately</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="itemized_deduction" checked={isItemizedDeduction} onCheckedChange={setIsItemizedDeduction} />
        <Label htmlFor="itemized_deduction">Itemized Deduction</Label>
      </div>

      {isItemizedDeduction && (
        <div>
          <Label htmlFor="itemized_deduction_amount">Itemized Deduction Amount</Label>
          <Input
            type="number"
            id="itemized_deduction_amount"
            value={itemizedDeductionAmount}
            onChange={(e) => setItemizedDeductionAmount(e.target.value)}
            placeholder="Enter itemized deduction amount"
          />
        </div>
      )}

      <Button type="submit">Calculate</Button>
    </form>
  );
};

export default ScenarioForm;
