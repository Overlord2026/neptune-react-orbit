
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { BusinessIncomeInput, BusinessTaxResult, calculateSmallBusinessTax } from '@/utils/tax/businessTaxCalculator';
import { formatCurrency, formatPercent } from '@/utils/formatUtils';
import { ArrowLeft, ArrowRight, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  const [sCorpWages, setSCorpWages] = useState(businessInput.sCorpWages || businessInput.income * 0.5);
  const [sCorpDistributions, setSCorpDistributions] = useState(
    businessInput.sCorpDistributions || 
    (businessInput.income - (businessInput.sCorpWages || businessInput.income * 0.5))
  );
  const [sCorpResult, setSCorpResult] = useState<BusinessTaxResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Calculate S-Corp tax results when inputs change
  useEffect(() => {
    if (businessInput.income > 0) {
      const sCorpInput: BusinessIncomeInput = {
        ...businessInput,
        businessType: 's_corp',
        sCorpWages,
        sCorpDistributions
      };
      
      const result = calculateSmallBusinessTax(sCorpInput);
      setSCorpResult(result);
    }
  }, [businessInput, sCorpWages, sCorpDistributions]);

  // Update parent state before proceeding
  const handleNext = () => {
    updateBusinessInput({
      sCorpWages,
      sCorpDistributions
    });
    onNext();
  };

  // Toggle detailed comparison
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // Update wages and ensure distributions also update
  const handleWageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const wages = Number(event.target.value);
    setSCorpWages(wages);
    // Ensure wages + distributions = net profit
    setSCorpDistributions(Math.max(0, businessInput.income - wages));
  };

  // Update distributions and ensure wages also update
  const handleDistributionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const distributions = Number(event.target.value);
    setSCorpDistributions(distributions);
    // Ensure wages + distributions = net profit
    setSCorpWages(Math.max(0, businessInput.income - distributions));
  };

  // Calculate tax savings
  const calculateSavings = () => {
    if (!taxResult || !sCorpResult) return 0;
    return taxResult.selfEmploymentTax - sCorpResult.payrollTaxes;
  };

  const taxSavings = calculateSavings();
  const isLowWage = sCorpWages / businessInput.income < 0.4;
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Entity Structure Comparison</h3>
      
      <p className="text-muted-foreground">
        Compare your current structure with an S-Corporation to see potential tax savings. Adjust the wage and distribution amounts below.
      </p>
      
      {isLowWage && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Reasonable Compensation Warning</AlertTitle>
          <AlertDescription>
            Your S-Corp wages may be too low compared to industry standards. The IRS requires S-Corp owners to pay themselves "reasonable compensation" before taking distributions.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Structure Card */}
        <Card className="border-[#2A2F3C] bg-[#1A1F2C]/70">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Current Structure</CardTitle>
              <Badge variant="outline" className="bg-blue-600/20 text-blue-400">
                {businessInput.businessType === 'sole_proprietorship' ? 'Sole Prop' : 
                 businessInput.businessType === 'single_member_llc' ? 'LLC' : 
                 businessInput.businessType === 'partnership' ? 'Partnership' : 'Other'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Net Profit</p>
              <p className="text-xl font-semibold">{formatCurrency(businessInput.income)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {businessInput.businessType === 'sole_proprietorship' || businessInput.businessType === 'single_member_llc' ? 
                  'Self-Employment Tax' : 'Tax Burden'}
              </p>
              <p className="text-xl font-semibold">{formatCurrency(taxResult?.selfEmploymentTax || 0)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Effective SE Tax Rate</p>
              <p className="text-xl font-semibold">{formatPercent((taxResult?.selfEmploymentTax || 0) / businessInput.income)}</p>
            </div>
          </CardContent>
        </Card>
        
        {/* S-Corp Structure Card */}
        <Card className="border-[#2A2F3C] bg-[#1A1F2C]/70">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">S-Corporation Structure</CardTitle>
              {taxSavings > 0 ? (
                <Badge className="bg-green-600/20 text-green-500">
                  Save {formatCurrency(taxSavings)}
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-yellow-600/20 text-yellow-500">
                  No Savings
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="wages" className="text-sm text-muted-foreground mb-1 block">Owner's Wages</label>
                <input
                  id="wages"
                  type="number"
                  value={sCorpWages}
                  onChange={handleWageChange}
                  className="w-full px-3 py-2 bg-[#2A2F3C] border border-[#3A3F4C] rounded-md text-white"
                />
              </div>
              <div>
                <label htmlFor="distributions" className="text-sm text-muted-foreground mb-1 block">Distributions</label>
                <input
                  id="distributions"
                  type="number"
                  value={sCorpDistributions}
                  onChange={handleDistributionChange}
                  className="w-full px-3 py-2 bg-[#2A2F3C] border border-[#3A3F4C] rounded-md text-white"
                />
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Payroll Taxes</p>
              <p className="text-xl font-semibold">{formatCurrency(sCorpResult?.payrollTaxes || 0)}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Effective Tax Rate</p>
              <p className="text-xl font-semibold">{formatPercent((sCorpResult?.payrollTaxes || 0) / businessInput.income)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex items-center justify-center">
        <Button variant="link" onClick={toggleDetails} className="flex items-center gap-1">
          {showDetails ? "Hide Detailed Comparison" : "Show Detailed Comparison"}
          {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      
      {showDetails && (
        <Card className="border-[#2A2F3C] bg-[#1A1F2C]/70">
          <CardHeader>
            <CardTitle className="text-lg">Detailed Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Current Structure</TableHead>
                  <TableHead>S-Corporation</TableHead>
                  <TableHead>Difference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Net Profit</TableCell>
                  <TableCell>{formatCurrency(businessInput.income)}</TableCell>
                  <TableCell>{formatCurrency(businessInput.income)}</TableCell>
                  <TableCell>$0</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Owner's Wages</TableCell>
                  <TableCell>N/A</TableCell>
                  <TableCell>{formatCurrency(sCorpWages)}</TableCell>
                  <TableCell>N/A</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Distributions</TableCell>
                  <TableCell>N/A</TableCell>
                  <TableCell>{formatCurrency(sCorpDistributions)}</TableCell>
                  <TableCell>N/A</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>SE Tax / Payroll Tax</TableCell>
                  <TableCell>{formatCurrency(taxResult?.selfEmploymentTax || 0)}</TableCell>
                  <TableCell>{formatCurrency(sCorpResult?.payrollTaxes || 0)}</TableCell>
                  <TableCell className={taxSavings > 0 ? "text-green-500" : "text-red-500"}>
                    {taxSavings > 0 ? "-" : ""}{formatCurrency(Math.abs(taxSavings))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>QBI Deduction</TableCell>
                  <TableCell>{formatCurrency(taxResult?.qbiDeduction || 0)}</TableCell>
                  <TableCell>{formatCurrency(sCorpResult?.qbiDeduction || 0)}</TableCell>
                  <TableCell>{formatCurrency((sCorpResult?.qbiDeduction || 0) - (taxResult?.qbiDeduction || 0))}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      <Alert variant="default" className="bg-amber-50/10 border-amber-600/20">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertTitle>S-Corporation Considerations</AlertTitle>
        <AlertDescription className="text-sm text-muted-foreground">
          S-Corporations require additional administrative overhead, including payroll filings, separate tax returns, and potentially higher accounting fees.
          Many states also charge minimum franchise taxes or fees for corporations. Consult with a tax professional before making any entity changes.
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev} className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={handleNext} className="flex items-center">
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default EntityComparisonStep;
