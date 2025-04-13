import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useCharitableContext } from '../context/CharitableContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import InfoTooltip from '@/components/tax/InfoTooltip';
import StepNavButtons from '../components/StepNavButtons';
import { calculateCrtBenefits } from '../utils/crtCalculationUtils';
import { Separator } from '@/components/ui/separator';

const CrtStep = () => {
  const { crtData, setCrtData, nextStep, prevStep } = useCharitableContext();
  const [results, setResults] = useState<any>(null);

  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      trustType: crtData?.trustType || 'crat',
      fundingAmount: crtData?.fundingAmount || 100000,
      payoutRate: crtData?.payoutRate || 6,
      annuityAmount: crtData?.annuityAmount || 6000,
      trustTerm: crtData?.trustTerm || 20,
      beneficiaryAge: crtData?.beneficiaryAge || 60,
      deferralYears: crtData?.deferralYears || 0,
      growthRate: crtData?.growthRate || 7,
      discountRate: crtData?.discountRate || 5,
      taxRate: crtData?.taxRate || 20,
      useFixedTerm: crtData?.useFixedTerm !== undefined ? crtData.useFixedTerm : true,
    },
  });

  const trustType = watch("trustType");
  const useFixedTerm = watch("useFixedTerm");

  useEffect(() => {
    if (trustType === 'crat') {
      const fundingAmount = watch("fundingAmount");
      const payoutRate = watch("payoutRate");
      const newAnnuityAmount = (fundingAmount * (payoutRate / 100));
      setValue("annuityAmount", newAnnuityAmount);
    }
  }, [watch("fundingAmount"), watch("payoutRate"), trustType, setValue]);

  useEffect(() => {
    if (trustType === 'crat') {
      const fundingAmount = watch("fundingAmount");
      const annuityAmount = watch("annuityAmount");
      const newPayoutRate = (annuityAmount / fundingAmount) * 100;
      setValue("payoutRate", newPayoutRate);
    }
  }, [watch("fundingAmount"), watch("annuityAmount"), trustType, setValue]);

  const onSubmit = (data: any) => {
    const calculatedResults = calculateCrtBenefits(data);
    setResults(calculatedResults);
    setCrtData(data);
    nextStep();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Trust Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="flex items-center">
                  Trust Type
                  <InfoTooltip tooltip="A CRAT pays a fixed dollar amount annually, while a CRUT pays a fixed percentage of the trust's value each year." />
                </Label>
                <Controller
                  control={control}
                  name="trustType"
                  render={({ field }) => (
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="crat" id="r1" />
                        <Label htmlFor="r1">CRAT (Annuity Trust)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="crut" id="r2" />
                        <Label htmlFor="r2">CRUT (Unitrust)</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>

              {trustType === 'crat' && (
                <div>
                  <Label className="flex items-center">
                    Annuity Amount ($)
                    <InfoTooltip tooltip="The fixed dollar amount paid to the beneficiary each year." />
                  </Label>
                  <Controller
                    name="annuityAmount"
                    control={control}
                    render={({ field }) => (
                      <Input type="number" {...field} />
                    )}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <Label className="flex items-center">
              Funding Amount
              <InfoTooltip tooltip="The assets you'll transfer to the CRT. Can be cash, securities, real estate, or other appreciated assets." />
            </Label>
            <Controller
              name="fundingAmount"
              control={control}
              render={({ field }) => (
                <Input type="number" {...field} />
              )}
            />
          </div>
          
          <div>
            <Label className="flex items-center">
              Payout Rate (%)
              <InfoTooltip tooltip="The percentage of the trust that will be paid to income beneficiaries annually. IRS requires 5-50%, and at least 10% must ultimately go to charity." />
            </Label>
            <Controller
              name="payoutRate"
              control={control}
              render={({ field }) => (
                <Input type="number" {...field} />
              )}
            />
          </div>
          
          <div>
            <Label className="flex items-center">
              Growth Rate (%)
              <InfoTooltip tooltip="The projected annual growth rate of the trust's assets." />
            </Label>
            <Controller
              name="growthRate"
              control={control}
              render={({ field }) => (
                <Input type="number" {...field} />
              )}
            />
          </div>
          
          <div>
            <Label className="flex items-center">
              Discount Rate (%)
              <InfoTooltip tooltip="The discount rate used to calculate the present value of future payments." />
            </Label>
            <Controller
              name="discountRate"
              control={control}
              render={({ field }) => (
                <Input type="number" {...field} />
              )}
            />
          </div>
          
          <div>
            <Label className="flex items-center">
              Tax Rate (%)
              <InfoTooltip tooltip="The estimated tax rate on income received from the trust." />
            </Label>
            <Controller
              name="taxRate"
              control={control}
              render={({ field }) => (
                <Input type="number" {...field} />
              )}
            />
          </div>
          
          <div>
            <Label className="flex items-center">
              Trust Term
              <InfoTooltip tooltip="CRTs can last for a specified number of years (up to 20) or for the lifetime of the beneficiary(ies)." />
            </Label>
            <Controller
              name="useFixedTerm"
              control={control}
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="useFixedTerm"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label htmlFor="useFixedTerm">Use Fixed Term</Label>
                </div>
              )}
            />
          </div>
          
          {!useFixedTerm && (
            <div>
              <Label className="flex items-center">
                Primary Beneficiary Age
                <InfoTooltip tooltip="The age of the primary income beneficiary, used to calculate lifetime payments based on actuarial tables." />
              </Label>
              <Controller
                name="beneficiaryAge"
                control={control}
                render={({ field }) => (
                  <Input type="number" {...field} />
                )}
              />
            </div>
          )}
          
          {useFixedTerm && (
            <div>
              <Label className="flex items-center">
                Trust Term (Years)
                <InfoTooltip tooltip="The number of years the trust will last. Maximum is typically 20 years." />
              </Label>
              <Controller
                name="trustTerm"
                control={control}
                render={({ field }) => (
                  <Input type="number" {...field} />
                )}
              />
            </div>
          )}
          
          <div>
            <Label className="flex items-center">
              Deferral Years
              <InfoTooltip tooltip="The number of years before payments from the trust begin." />
            </Label>
            <Controller
              name="deferralYears"
              control={control}
              render={({ field }) => (
                <Input type="number" {...field} />
              )}
            />
          </div>
        </div>

        {results && (
          <Card className="mt-6 border-primary/20">
            <CardHeader>
              <CardTitle>Projected Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Total Payments: ${results.totalPayments.toLocaleString()}</p>
                <p>Tax Savings: ${results.taxSavings.toLocaleString()}</p>
                <p>Charitable Deduction: ${results.charitableDeduction.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <StepNavButtons prevStep={prevStep} />
      </form>
    </div>
  );
};

export default CrtStep;
