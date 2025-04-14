
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, ArrowRight, HelpCircle } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { BusinessIncomeInput, BusinessTaxResult, calculateSmallBusinessTax } from '@/utils/tax/businessTaxCalculator';
import { formatCurrency, formatPercent } from '@/utils/formatUtils';

interface EntityComparisonStepProps {
  businessInput: BusinessIncomeInput;
  updateBusinessInput: (updates: Partial<BusinessIncomeInput>) => void;
  taxResult: BusinessTaxResult | null;
  onNext: () => void;
  onPrev: () => void;
}

const EntityComparisonStep: React.FC<EntityComparisonStepProps> = ({ 
  businessInput, 
  updateBusinessInput,
  taxResult,
  onNext,
  onPrev
}) => {
  const [sCorpWagePct, setSCorpWagePct] = useState(60);
  const [sCorpResult, setSCorpResult] = useState<BusinessTaxResult | null>(null);
  const [soleProprietorshipResult, setSoleProprietorshipResult] = useState<BusinessTaxResult | null>(null);
  const netProfit = taxResult?.netProfit || businessInput.income - Object.values(businessInput.expenses || {}).reduce((sum, exp) => sum + exp, 0);
  
  // Calculate results for comparison
  useEffect(() => {
    // Calculate sole proprietorship scenario
    const soleProprietorshipTax = calculateSmallBusinessTax({
      ...businessInput,
      businessType: 'sole_proprietorship',
    });
    setSoleProprietorshipResult(soleProprietorshipTax);
    
    // Calculate S-Corp scenario
    const wageAmount = (netProfit * sCorpWagePct) / 100;
    const distributionAmount = netProfit - wageAmount;
    
    const sCorpTax = calculateSmallBusinessTax({
      ...businessInput,
      businessType: 's_corp',
      sCorpWages: wageAmount,
      sCorpDistributions: distributionAmount,
    });
    setSCorpResult(sCorpTax);
    
  }, [businessInput, sCorpWagePct, netProfit]);
  
  // Calculate tax savings
  const calculateSavings = () => {
    if (!soleProprietorshipResult || !sCorpResult) return 0;
    
    // For a simple comparison, look at total taxes paid
    const solePropTax = soleProprietorshipResult.selfEmploymentTax;
    const sCorpTax = sCorpResult.payrollTaxes;
    
    return solePropTax - sCorpTax;
  };
  
  const savings = calculateSavings();
  const savingsPct = (savings / (soleProprietorshipResult?.selfEmploymentTax || 1)) * 100;
  
  // Update the main business input with the S-Corp allocation when continuing
  const handleContinue = () => {
    const wageAmount = (netProfit * sCorpWagePct) / 100;
    const distributionAmount = netProfit - wageAmount;
    
    updateBusinessInput({
      sCorpWages: wageAmount,
      sCorpDistributions: distributionAmount
    });
    
    onNext();
  };
  
  // Get reasonable compensation warning
  const getWarningBadge = () => {
    if (!sCorpResult) return null;
    
    const reasonableCompWarning = sCorpResult.warnings.find(w => w.type === 'reasonable_compensation');
    
    if (!reasonableCompWarning) return (
      <Badge className="bg-green-600/20 text-green-500 hover:bg-green-600/30">Reasonable Compensation</Badge>
    );
    
    if (reasonableCompWarning.severity === 'error') {
      return <Badge variant="destructive">Unreasonably Low Salary</Badge>;
    } else {
      return <Badge variant="warning" className="bg-yellow-600/20 text-yellow-500 hover:bg-yellow-600/30">Questionable Compensation</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white">Entity Structure Comparison</h3>
        <p className="text-muted-foreground">Compare different business structures to optimize your tax situation</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Sole Proprietorship Card */}
        <Card className="border-[#2A2F3C] bg-[#1A1F2C]/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Sole Proprietorship</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Net Profit:</p>
                <p className="font-semibold text-white">{formatCurrency(soleProprietorshipResult?.netProfit || 0)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">SE Tax:</p>
                <p className="font-semibold text-white">{formatCurrency(soleProprietorshipResult?.selfEmploymentTax || 0)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">QBI Deduction:</p>
                <p className="font-semibold text-white">
                  {soleProprietorshipResult?.qbiDeduction 
                    ? formatCurrency(soleProprietorshipResult.qbiDeduction)
                    : "Not Applicable"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Net Taxable Income:</p>
                <p className="font-semibold text-white">{formatCurrency(soleProprietorshipResult?.netTaxableIncome || 0)}</p>
              </div>
            </div>
            
            {/* QBI Warning */}
            {soleProprietorshipResult?.warnings.find(w => w.type === 'qbi_limitation') && (
              <Alert variant="warning" className="bg-yellow-600/10 text-yellow-500 border-yellow-600/20">
                <HelpCircle className="h-4 w-4" />
                <AlertTitle>QBI Limitation</AlertTitle>
                <AlertDescription className="text-xs">
                  Your income may exceed thresholds for full QBI deduction.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
        
        {/* S-Corporation Card */}
        <Card className="border-[#2A2F3C] bg-[#1A1F2C]/70">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">S-Corporation</CardTitle>
            {getWarningBadge()}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Owner's Salary:</p>
                <p className="font-semibold text-white">
                  {formatCurrency((netProfit * sCorpWagePct) / 100)} 
                  <span className="text-xs text-muted-foreground ml-1">({sCorpWagePct}%)</span>
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Distributions:</p>
                <p className="font-semibold text-white">
                  {formatCurrency(netProfit - ((netProfit * sCorpWagePct) / 100))}
                  <span className="text-xs text-muted-foreground ml-1">({100 - sCorpWagePct}%)</span>
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Payroll Taxes:</p>
                <p className="font-semibold text-white">{formatCurrency(sCorpResult?.payrollTaxes || 0)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">QBI Deduction:</p>
                <p className="font-semibold text-white">
                  {sCorpResult?.qbiDeduction 
                    ? formatCurrency(sCorpResult.qbiDeduction)
                    : "Not Applicable"}
                </p>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <Label>Salary Percentage: {sCorpWagePct}%</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">The IRS requires S-Corp owners to pay themselves a "reasonable salary" before taking distributions. A very low salary percentage may trigger IRS scrutiny.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Slider
                value={[sCorpWagePct]}
                min={20}
                max={100}
                step={5}
                onValueChange={(values) => setSCorpWagePct(values[0])}
                className="py-4"
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Comparison Results */}
      {soleProprietorshipResult && sCorpResult && (
        <Card className="border-[#2A2F3C] bg-[#1A1F2C]/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Comparison Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-muted-foreground text-sm">Total Tax with Sole Proprietorship:</p>
                  <p className="font-semibold text-white text-lg">{formatCurrency(soleProprietorshipResult.selfEmploymentTax)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Total Tax with S-Corporation:</p>
                  <p className="font-semibold text-white text-lg">{formatCurrency(sCorpResult.payrollTaxes)}</p>
                </div>
              </div>
              
              <div className="border-t border-[#2A2F3C] pt-4">
                <p className="text-muted-foreground text-sm">Potential Tax Savings with S-Corporation:</p>
                <div className="flex items-end gap-2">
                  <p className={`font-bold text-xl ${savings > 0 ? 'text-green-500' : 'text-white'}`}>
                    {formatCurrency(savings)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ({savings > 0 ? '-' : ''}{Math.abs(savingsPct).toFixed(1)}%)
                  </p>
                </div>
              </div>
              
              {/* Disclaimer */}
              <Alert className="bg-blue-600/10 text-blue-500 border-blue-600/20">
                <HelpCircle className="h-4 w-4" />
                <AlertTitle>Important Consideration</AlertTitle>
                <AlertDescription className="text-xs">
                  S-Corps require more administrative work, including payroll processing, additional tax filings, and separate accounting. These costs may offset some tax savings.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Navigation buttons */}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={handleContinue}>
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default EntityComparisonStep;
