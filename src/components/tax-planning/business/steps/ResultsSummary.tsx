
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { ArrowLeft, AlertTriangle, Download, Info, Share2, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BusinessIncomeInput, BusinessTaxResult } from '@/utils/tax/businessTaxCalculator';
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
        return <Badge variant="warning" className="bg-yellow-600/20 text-yellow-500">QBI Limited</Badge>;
      }
      return <Badge variant="outline" className="bg-green-600/20 text-green-500">QBI Eligible</Badge>;
    }
    return <Badge variant="outline" className="bg-gray-600/20 text-gray-400">No QBI</Badge>;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{getBusinessTypeText()} Tax Summary</h3>
          <p className="text-muted-foreground">Tax year: {getCurrentYear()}</p>
        </div>
        
        <div className="flex items-center gap-2">
          {getQBIStatusBadge()}
        </div>
      </div>
      
      {/* Tax Summary Card */}
      <Card className="border-[#2A2F3C] bg-[#1A1F2C]/70">
        <CardHeader>
          <CardTitle className="text-lg">
            {businessInput.businessType === 's_corp' ? 'S-Corp Tax Summary' : 'Tax Summary'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
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
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
          <h4 className="font-medium text-white">Tax Considerations</h4>
          
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
      
      {/* Did You Know Section */}
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
