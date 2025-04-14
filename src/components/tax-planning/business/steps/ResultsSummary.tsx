
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft, AlertTriangle, Download, Info, Share2, FileText, Briefcase, Calculator, TrendingUp, ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BusinessIncomeInput, BusinessTaxResult, calculateSmallBusinessTax } from '@/utils/tax/businessTaxCalculator';
import { formatCurrency, formatPercent } from '@/utils/formatUtils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TaxTrapChecker } from '@/components/tax/TaxTrapChecker';
import { checkTaxTraps, TaxTrapResult } from '@/utils/taxTraps';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

interface ResultsSummaryProps {
  businessInput: BusinessIncomeInput;
  taxResult: BusinessTaxResult | null;
  onReset: () => void;
  onPrev: () => void;
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({ 
  businessInput, 
  taxResult,
  onReset,
  onPrev
}) => {
  const [activeTab, setActiveTab] = useState<string>('summary');
  const [sCorpComparison, setSCorpComparison] = useState<BusinessTaxResult | null>(null);

  // Initialize S-Corp comparison when component mounts
  React.useEffect(() => {
    if (businessInput.businessType !== 's_corp' && taxResult) {
      // Create a simulated S-Corp scenario with 60% wages, 40% distributions
      const sCorpInput: BusinessIncomeInput = {
        ...businessInput,
        businessType: 's_corp',
        sCorpWages: businessInput.income * 0.6, // 60% as wages (reasonable compensation)
        sCorpDistributions: businessInput.income * 0.4 // 40% as distributions
      };
      
      const result = calculateSmallBusinessTax(sCorpInput);
      setSCorpComparison(result);
    }
  }, [businessInput, taxResult]);

  if (!taxResult) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">No tax results available. Please go back and try again.</p>
        <Button variant="outline" onClick={onPrev} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Previous Step
        </Button>
      </div>
    );
  }
  
  const getBusinessTypeText = () => {
    switch(businessInput.businessType) {
      case 'sole_proprietorship':
        return 'Sole Proprietorship';
      case 'single_member_llc':
        return 'Single-Member LLC';
      case 's_corp':
        return 'S Corporation';
      case 'partnership':
        return 'Partnership';
      default:
        return 'Business';
    }
  };
  
  const getCurrentYear = () => {
    return businessInput.year || new Date().getFullYear();
  };
  
  const getQBIStatusBadge = () => {
    if (taxResult.qbiDeduction) {
      const qbiWarning = taxResult.warnings.find(w => w.type === 'qbi_limitation');
      if (qbiWarning) {
        return <Badge variant="outline" className="bg-yellow-600/20 text-yellow-500">QBI Limited</Badge>;
      }
      return <Badge variant="outline" className="bg-green-600/20 text-green-500">QBI Eligible</Badge>;
    }
    return <Badge variant="outline" className="bg-gray-600/20 text-gray-400">No QBI</Badge>;
  };

  // Generate data for multi-year chart if projectedGrowth is available
  const generateMultiYearData = () => {
    if (!businessInput.projectedGrowth || !taxResult) return [];
    
    const years = 5; // Show 5 year projection
    const data = [];
    let currentProfit = taxResult.netProfit;
    let currentTax = businessInput.businessType === 's_corp' ? 
      taxResult.payrollTaxes : taxResult.selfEmploymentTax;
    
    for (let i = 0; i < years; i++) {
      const year = getCurrentYear() + i;
      data.push({
        year,
        netProfit: currentProfit,
        taxes: currentTax,
      });
      
      // Increase profit and taxes based on growth rate
      currentProfit *= (1 + businessInput.projectedGrowth);
      currentTax *= (1 + businessInput.projectedGrowth);
    }
    
    return data;
  };
  
  // Calculate tax savings from S-Corp (if applicable)
  const calculateSCorpSavings = () => {
    if (businessInput.businessType === 's_corp' || !sCorpComparison || !taxResult) {
      return 0;
    }
    
    return taxResult.selfEmploymentTax - sCorpComparison.payrollTaxes;
  };

  // Create tax trap scenario data
  const createTaxTrapScenario = () => {
    // This is a simplified version for demonstration - in a real app
    // you would need more complete tax information
    return {
      year: getCurrentYear(),
      filing_status: 'single',
      agi: taxResult.netProfit - taxResult.selfEmploymentTaxDeduction,
      total_income: taxResult.netProfit,
      taxable_income: taxResult.netTaxableIncome,
      capital_gains_long: 0,
      capital_gains_short: 0,
      social_security_amount: 0,
      household_size: 1,
      medicare_enrollment: taxResult.netProfit > 150000, // Assume Medicare enrollment for high income
      aca_enrollment: false
    };
  };
  
  const multiYearData = generateMultiYearData();
  const sCorpSavings = calculateSCorpSavings();
  const taxTrapScenario = createTaxTrapScenario();
  
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-[#FFD700]" />
          <div>
            <h3 className="text-xl font-semibold text-white">{getBusinessTypeText()} Tax Summary</h3>
            <p className="text-muted-foreground">Tax year: {getCurrentYear()}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {getQBIStatusBadge()}
        </div>
      </div>
      
      {/* Main Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="comparison">Entity Comparison</TabsTrigger>
          {businessInput.projectedGrowth ? (
            <TabsTrigger value="projection">Multi-Year Projection</TabsTrigger>
          ) : (
            <TabsTrigger value="tax-traps">Tax Trap Analysis</TabsTrigger>
          )}
        </TabsList>

        {/* Summary Tab Content */}
        <TabsContent value="summary" className="space-y-4 pt-4">
          {/* Business Income Summary Card */}
          <Card className="border-[#2A2F3C] bg-[#1A1F2C]/70">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="h-5 w-5 text-[#FFD700]" />
                Business Income Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Net Profit</p>
                  <p className="text-xl font-semibold text-white">{formatCurrency(taxResult.netProfit)}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    {businessInput.businessType === 's_corp' ? 'Payroll Taxes' : 'Self-Employment Tax'}
                  </p>
                  <p className="text-xl font-semibold text-white">
                    {businessInput.businessType === 's_corp' 
                      ? formatCurrency(taxResult.payrollTaxes)
                      : formatCurrency(taxResult.selfEmploymentTax)}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">QBI Deduction</p>
                  <p className="text-xl font-semibold text-white">
                    {taxResult.qbiDeduction 
                      ? formatCurrency(taxResult.qbiDeduction)
                      : "N/A"}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Effective Tax Rate</p>
                  <p className="text-xl font-semibold text-white">
                    {formatPercent(taxResult.effectiveTaxRate)}
                  </p>
                </div>
              </div>
              
              {businessInput.businessType === 's_corp' && (
                <>
                  <Separator className="my-4" />
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Owner's Salary (W-2)</p>
                      <p className="text-lg font-semibold text-white">{formatCurrency(businessInput.sCorpWages || 0)}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Distributions</p>
                      <p className="text-lg font-semibold text-white">{formatCurrency(businessInput.sCorpDistributions || 0)}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          {/* Warnings Section */}
          {taxResult.warnings.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-white flex items-center gap-1">
                <ShieldAlert className="h-4 w-4 text-amber-500" />
                Tax Considerations
              </h4>
              
              {taxResult.warnings.map((warning, index) => (
                <Alert 
                  key={index}
                  className={`
                    ${warning.severity === 'error' ? 'bg-red-600/10 text-red-500 border-red-600/20' : ''}
                    ${warning.severity === 'warning' ? 'bg-yellow-600/10 text-yellow-500 border-yellow-600/20' : ''}
                    ${warning.severity === 'info' ? 'bg-blue-600/10 text-blue-500 border-blue-600/20' : ''}
                  `}
                >
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle className="font-medium">
                    {warning.type === 'reasonable_compensation' && 'Reasonable Compensation'}
                    {warning.type === 'qbi_limitation' && 'QBI Deduction Limitation'}
                    {warning.type === 'home_office' && 'Home Office Deduction'}
                    {warning.type === 'general' && 'Tax Consideration'}
                  </AlertTitle>
                  <AlertDescription className="text-sm">
                    {warning.message}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Entity Comparison Tab Content */}
        <TabsContent value="comparison" className="space-y-4 pt-4">
          {businessInput.businessType === 's_corp' ? (
            <div className="p-6 text-center">
              <p className="text-muted-foreground">
                You are already operating as an S-Corporation. To view other entity options, please go back and select a different entity type.
              </p>
              <Button variant="outline" onClick={onPrev} className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Previous Step
              </Button>
            </div>
          ) : sCorpComparison ? (
            <>
              <h4 className="font-medium text-white">S-Corporation vs. {getBusinessTypeText()} Comparison</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Structure Card */}
                <Card className="border-[#2A2F3C] bg-[#1A1F2C]/70">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Current: {getBusinessTypeText()}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Net Profit:</span>
                        <span className="font-medium">{formatCurrency(taxResult.netProfit)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Self-Employment Tax:</span>
                        <span className="font-medium">{formatCurrency(taxResult.selfEmploymentTax)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">QBI Deduction:</span>
                        <span className="font-medium">{taxResult.qbiDeduction ? formatCurrency(taxResult.qbiDeduction) : "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">SE Tax Rate:</span>
                        <span className="font-medium">{formatPercent(taxResult.selfEmploymentTax / taxResult.netProfit)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* S-Corp Structure Card */}
                <Card className="border-[#2A2F3C] bg-[#1A1F2C]/70">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">S-Corporation</CardTitle>
                      {sCorpSavings > 0 && (
                        <Badge className="bg-green-600/20 text-green-500">
                          Save {formatCurrency(sCorpSavings)}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Owner's Wages:</span>
                        <span className="font-medium">{formatCurrency(businessInput.income * 0.6)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Distributions:</span>
                        <span className="font-medium">{formatCurrency(businessInput.income * 0.4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payroll Taxes:</span>
                        <span className="font-medium">{formatCurrency(sCorpComparison.payrollTaxes)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">QBI Deduction:</span>
                        <span className="font-medium">{sCorpComparison.qbiDeduction ? formatCurrency(sCorpComparison.qbiDeduction) : "N/A"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Alert variant="default" className="bg-amber-50/10 border-amber-600/20">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertTitle>S-Corporation Considerations</AlertTitle>
                <AlertDescription className="text-sm">
                  <p>While an S-Corp may reduce self-employment taxes, consider these additional costs:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>State filing fees and annual reports ($50-$800 depending on state)</li>
                    <li>Payroll processing costs ($50-200/month)</li>
                    <li>Additional accounting/tax preparation fees ($800-$2,500/year)</li>
                    <li>Separate tax return filing requirements</li>
                  </ul>
                  <p className="mt-2">Generally, S-Corps become advantageous when saving at least $2,000-3,000 in SE taxes annually.</p>
                </AlertDescription>
              </Alert>
            </>
          ) : (
            <div className="p-6 text-center">
              <p className="text-muted-foreground">
                Unable to generate S-Corporation comparison at this time.
              </p>
            </div>
          )}
        </TabsContent>
        
        {/* Multi-Year Projection Tab Content */}
        <TabsContent value="projection" className="space-y-4 pt-4">
          {businessInput.projectedGrowth && multiYearData.length > 0 ? (
            <>
              <h4 className="font-medium text-white flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-[#FFD700]" />
                Multi-Year Projection
              </h4>
              
              <Card className="border-[#2A2F3C] bg-[#1A1F2C]/70">
                <CardContent className="pt-6">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={multiYearData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#3A3F4C" />
                        <XAxis dataKey="year" stroke="#8E9196" />
                        <YAxis stroke="#8E9196" />
                        <RechartsTooltip 
                          formatter={(value: number) => [`$${value.toLocaleString()}`, null]} 
                          labelFormatter={(label) => `Year: ${label}`}
                          contentStyle={{ backgroundColor: '#2A2F3C', border: '1px solid #3A3F4C' }}
                        />
                        <Legend />
                        <Bar dataKey="netProfit" name="Net Profit" fill="#9b87f5" />
                        <Bar dataKey="taxes" name="Tax Burden" fill="#ea384c" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead>Net Profit</TableHead>
                    <TableHead>Tax Burden</TableHead>
                    <TableHead>Tax Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {multiYearData.map((yearData, index) => (
                    <TableRow key={yearData.year}>
                      <TableCell>{yearData.year}</TableCell>
                      <TableCell>{formatCurrency(yearData.netProfit)}</TableCell>
                      <TableCell>{formatCurrency(yearData.taxes)}</TableCell>
                      <TableCell>{formatPercent(yearData.taxes / yearData.netProfit)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {multiYearData.length > 0 && multiYearData[multiYearData.length - 1].netProfit > 200000 && (
                <Alert className="bg-amber-50/10 border-amber-600/20">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertTitle>Tax Planning Opportunity</AlertTitle>
                  <AlertDescription>
                    With projected growth, your business income may reach levels where additional tax planning strategies could be beneficial,
                    including retirement plans, entity structure optimization, and timing of income/expenses.
                  </AlertDescription>
                </Alert>
              )}
            </>
          ) : (
            <div className="p-6 text-center">
              <p className="text-muted-foreground">
                Multi-year projection isn't available. To enable this feature, please go back and add projected growth information.
              </p>
              <Button variant="outline" onClick={onPrev} className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Previous Step
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Tax Trap Analysis Tab Content */}
        <TabsContent value="tax-traps" className="space-y-4 pt-4">
          <h4 className="font-medium text-white flex items-center gap-1">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            Tax Trap Analysis
          </h4>
          
          <Card className="border-[#2A2F3C] bg-[#1A1F2C]/70">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-4">
                This analysis checks how your business income might trigger tax thresholds that cause disproportionate increases in your overall tax burden.
              </p>
              
              <TaxTrapChecker 
                scenarioId="business-income-analysis"
                scenarioData={taxTrapScenario}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* "Did You Know" Section */}
      <Card className="border-[#2A2F3C] bg-[#1A1F2C]/70 overflow-hidden">
        <CardHeader className="bg-[#2A2F3C]/30">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Info className="h-5 w-5 text-[#FFD700]" />
            Did You Know?
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            {
              businessInput.businessType === 's_corp'
                ? "S-Corporations can help save on self-employment taxes, but the IRS requires you to pay yourself a 'reasonable salary' that's comparable to what others in your field earn for similar work."
                : "For 2024, the 20% qualified business income (QBI) deduction allows eligible pass-through business owners to deduct up to 20% of their qualified business income. This deduction has income limitations for certain service businesses."
            }
          </p>
        </CardContent>
      </Card>
      
      {/* Action Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <FileText className="mr-2 h-4 w-4" /> View Detailed Report
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Tax Report: {getBusinessTypeText()}</DialogTitle>
              <DialogDescription>
                Detailed analysis of your {getCurrentYear()} business tax situation.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <h4 className="font-medium text-white">Business Information</h4>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <p className="text-muted-foreground">Business Type:</p>
                  <p>{getBusinessTypeText()}</p>
                  <p className="text-muted-foreground">Tax Year:</p>
                  <p>{getCurrentYear()}</p>
                  <p className="text-muted-foreground">Net Profit:</p>
                  <p>{formatCurrency(taxResult.netProfit)}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-white">Tax Summary</h4>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  {businessInput.businessType === 's_corp' ? (
                    <>
                      <p className="text-muted-foreground">Owner's Salary:</p>
                      <p>{formatCurrency(businessInput.sCorpWages || 0)}</p>
                      <p className="text-muted-foreground">Distributions:</p>
                      <p>{formatCurrency(businessInput.sCorpDistributions || 0)}</p>
                      <p className="text-muted-foreground">Payroll Taxes:</p>
                      <p>{formatCurrency(taxResult.payrollTaxes)}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-muted-foreground">Self-Employment Tax:</p>
                      <p>{formatCurrency(taxResult.selfEmploymentTax)}</p>
                      <p className="text-muted-foreground">SE Tax Deduction:</p>
                      <p>{formatCurrency(taxResult.selfEmploymentTaxDeduction)}</p>
                    </>
                  )}
                  <p className="text-muted-foreground">QBI Deduction:</p>
                  <p>{taxResult.qbiDeduction ? formatCurrency(taxResult.qbiDeduction) : "Not Applicable"}</p>
                  <p className="text-muted-foreground">Net Taxable Income:</p>
                  <p>{formatCurrency(taxResult.netTaxableIncome)}</p>
                  <p className="text-muted-foreground">Effective Tax Rate:</p>
                  <p>{formatPercent(taxResult.effectiveTaxRate)}</p>
                </div>
              </div>
              
              {/* Tax Considerations */}
              <div className="space-y-2">
                <h4 className="font-medium text-white">Tax Considerations</h4>
                {taxResult.warnings.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    {taxResult.warnings.map((warning, index) => (
                      <li key={index} className="text-muted-foreground">
                        {warning.message}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No specific tax considerations identified.</p>
                )}
              </div>
              
              {/* Recommendations */}
              <div className="space-y-2">
                <h4 className="font-medium text-white">Recommendations</h4>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  {businessInput.businessType !== 's_corp' && taxResult.netProfit > 40000 && (
                    <li className="text-muted-foreground">
                      Consider evaluating S-Corporation structure to potentially reduce self-employment taxes.
                    </li>
                  )}
                  {businessInput.businessType === 's_corp' && businessInput.sCorpWages && businessInput.sCorpWages / taxResult.netProfit < 0.4 && (
                    <li className="text-muted-foreground">
                      Review owner's salary for reasonable compensation standards to reduce IRS audit risk.
                    </li>
                  )}
                  {taxResult.netProfit > 150000 && (
                    <li className="text-muted-foreground">
                      Explore retirement plan options like Solo 401(k) or SEP IRA to reduce taxable income.
                    </li>
                  )}
                  <li className="text-muted-foreground">
                    Track business expenses diligently throughout the year to maximize deductions.
                  </li>
                  <li className="text-muted-foreground">
                    Consult with a tax professional for personalized advice specific to your situation.
                  </li>
                </ul>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Share2 className="mr-2 h-4 w-4" /> Share Results
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sharing functionality coming soon!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button variant="outline" onClick={onPrev} className="w-full sm:w-auto">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <Button onClick={onReset} className="w-full sm:ml-auto sm:w-auto">
          Start Over
        </Button>
      </div>
      
      {/* Disclaimer */}
      <div className="border border-[#2A2F3C] bg-[#1A1F2C]/30 p-4 rounded-md">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Disclaimer:</span> This tool provides estimates only and is not a substitute for professional tax advice. Tax calculations are simplified and may not account for all tax scenarios. Always consult with a tax professional for advice specific to your situation.
        </p>
      </div>
    </div>
  );
};

export default ResultsSummary;
