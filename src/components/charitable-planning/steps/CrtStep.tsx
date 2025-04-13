
import React, { useState } from 'react';
import { CharitableScenario } from '../types/CharitableTypes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import InfoTooltip from '@/components/tax/InfoTooltip';
import StepNavButtons from '../components/StepNavButtons';
import { calculateCrtBenefits } from '../utils/crtCalculationUtils';
import { Separator } from '@/components/ui/separator';
import { ArrowRight } from 'lucide-react';

interface CrtStepProps {
  scenario: CharitableScenario;
  updateScenario: (data: Partial<CharitableScenario>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const CrtStep: React.FC<CrtStepProps> = ({
  scenario,
  updateScenario,
  onNext,
  onBack
}) => {
  // Initialize form state from scenario
  const [useCrt, setUseCrt] = useState(scenario.crt?.useCrt || false);
  const [crtType, setCrtType] = useState<"CRAT" | "CRUT">(scenario.crt?.type || "CRAT");
  const [fundingAmount, setFundingAmount] = useState(scenario.crt?.fundingAmount || 100000);
  const [payoutRate, setPayoutRate] = useState(scenario.crt?.payoutRate || 5);
  const [trustTerm, setTrustTerm] = useState<number | "lifetime">(
    scenario.crt?.trustTerm || "lifetime"
  );
  const [trustTermYears, setTrustTermYears] = useState(
    typeof scenario.crt?.trustTerm === 'number' ? scenario.crt.trustTerm : 20
  );
  const [beneficiaryAge, setBeneficiaryAge] = useState(scenario.crt?.beneficiaryAge || scenario.age || 65);
  const [spouseBeneficiary, setSpouseBeneficiary] = useState(scenario.crt?.spouseBeneficiary || false);
  const [spouseAge, setSpouseAge] = useState(scenario.crt?.spouseAge || beneficiaryAge - 3);

  // Calculate potential benefits based on current inputs
  const getBenefits = () => {
    if (!useCrt) return null;
    
    return calculateCrtBenefits({
      type: crtType,
      fundingAmount,
      payoutRate,
      trustTerm: trustTerm === "lifetime" ? "lifetime" : trustTermYears,
      beneficiaryAge,
      spouseBeneficiary,
      spouseAge: spouseBeneficiary ? spouseAge : undefined
    });
  };

  const benefits = getBenefits();

  // Handle form submission
  const handleContinue = () => {
    updateScenario({
      crt: {
        useCrt,
        type: crtType,
        fundingAmount,
        payoutRate,
        trustTerm: trustTerm === "lifetime" ? "lifetime" : trustTermYears,
        beneficiaryAge,
        spouseBeneficiary,
        ...(spouseBeneficiary ? { spouseAge } : {})
      }
    });
    onNext();
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-lg font-medium">Charitable Remainder Trust</h2>
              <p className="text-muted-foreground text-sm">
                Consider a CRT to generate income while supporting charity
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="use-crt"
                checked={useCrt}
                onCheckedChange={setUseCrt}
              />
              <Label htmlFor="use-crt">
                Include CRT in planning
              </Label>
            </div>
          </div>

          {useCrt && (
            <>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="crt-type">
                      Trust Type 
                      <InfoTooltip 
                        content="CRAT pays a fixed dollar amount. CRUT pays a fixed percentage of the trust's value each year."
                      />
                    </Label>
                  </div>
                  <RadioGroup
                    id="crt-type"
                    value={crtType}
                    onValueChange={(value) => setCrtType(value as "CRAT" | "CRUT")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="CRAT" id="crat" />
                      <Label htmlFor="crat">CRAT (Fixed Payment)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="CRUT" id="crut" />
                      <Label htmlFor="crut">CRUT (Variable Payment)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="funding-amount">
                    Funding Amount 
                    <InfoTooltip content="Assets transferred to the trust" />
                  </Label>
                  <div className="flex space-x-2">
                    <span className="flex items-center px-3 bg-muted">$</span>
                    <Input
                      id="funding-amount"
                      type="number"
                      min={1000}
                      step={1000}
                      value={fundingAmount}
                      onChange={(e) => setFundingAmount(Number(e.target.value))}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>
                      Payout Rate: {payoutRate}%
                      <InfoTooltip content="Annual percentage paid to income beneficiaries. Must be at least 5% and typically not more than 8%." />
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      ${(fundingAmount * (payoutRate / 100)).toLocaleString()} per year
                    </span>
                  </div>
                  <Slider
                    value={[payoutRate]}
                    min={5}
                    max={10}
                    step={0.1}
                    onValueChange={(value) => setPayoutRate(value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trust-term">Trust Term</Label>
                  <RadioGroup
                    id="trust-term"
                    value={trustTerm === "lifetime" ? "lifetime" : "years"}
                    onValueChange={(value) => setTrustTerm(value === "lifetime" ? "lifetime" : trustTermYears)}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="lifetime" id="lifetime" />
                      <Label htmlFor="lifetime">Lifetime</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="years" id="term-years" />
                      <Label htmlFor="term-years">Term of Years</Label>
                    </div>
                  </RadioGroup>
                </div>

                {trustTerm !== "lifetime" && (
                  <div className="space-y-2">
                    <Label htmlFor="term-years-input">
                      Number of Years
                      <InfoTooltip content="Trust term must be 20 years or less" />
                    </Label>
                    <Input
                      id="term-years-input"
                      type="number"
                      min={1}
                      max={20}
                      value={trustTermYears}
                      onChange={(e) => setTrustTermYears(Number(e.target.value))}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="beneficiary-age">
                    Primary Beneficiary Age
                    <InfoTooltip content="Age affects the charitable deduction calculation" />
                  </Label>
                  <Input
                    id="beneficiary-age"
                    type="number"
                    min={18}
                    max={120}
                    value={beneficiaryAge}
                    onChange={(e) => setBeneficiaryAge(Number(e.target.value))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="spouse-beneficiary"
                    checked={spouseBeneficiary}
                    onCheckedChange={setSpouseBeneficiary}
                  />
                  <Label htmlFor="spouse-beneficiary">
                    Include spouse as income beneficiary
                    <InfoTooltip content="Adding a spouse will reduce the charitable deduction but provide income for both lives" />
                  </Label>
                </div>

                {spouseBeneficiary && (
                  <div className="space-y-2">
                    <Label htmlFor="spouse-age">Spouse Age</Label>
                    <Input
                      id="spouse-age"
                      type="number"
                      min={18}
                      max={120}
                      value={spouseAge}
                      onChange={(e) => setSpouseAge(Number(e.target.value))}
                    />
                  </div>
                )}
              </div>

              {benefits && (
                <div className="mt-6 bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Estimated Benefits</h3>
                  <div className="space-y-1 text-sm">
                    <p>Immediate Charitable Deduction: <span className="font-medium">${benefits.immediateDeduction.toLocaleString()}</span></p>
                    <p>Annual Income Payment: <span className="font-medium">${benefits.annualPayout.toLocaleString()}</span></p>
                    {benefits.estateTaxSavings > 0 && (
                      <p>Potential Estate Tax Savings: <span className="font-medium">${benefits.estateTaxSavings.toLocaleString()}</span></p>
                    )}
                  </div>
                  <Separator className="my-2" />
                  <p className="text-xs text-muted-foreground">
                    Note: These are approximate calculations. Actual results depend on IRS Section 7520 rates at time of funding.
                  </p>
                </div>
              )}
            </>
          )}

          <StepNavButtons
            onBack={onBack}
            onNext={handleContinue}
            nextLabel="Continue"
            disableNextButton={false}
          />
        </div>
      </Card>
    </div>
  );
};

export default CrtStep;
