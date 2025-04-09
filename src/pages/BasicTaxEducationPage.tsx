import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, BookOpen, ExternalLink } from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GlossaryTerm from '@/components/GlossaryTerm';
import DynamicContentText from '@/components/DynamicContentText';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { 
  STANDARD_DEDUCTION_BY_YEAR, 
  formatCurrency, 
  getBrackets
} from '@/utils/taxBracketData';

const BasicTaxEducationPage = () => {
  const [selectedYear, setSelectedYear] = useState<number>(2023); // Default year
  const [selectedFilingStatus, setSelectedFilingStatus] = useState<'single' | 'married' | 'head_of_household'>('single');
  
  // Get example brackets for comparison
  const singleBrackets = getBrackets(selectedYear, "single", "ordinary");
  const marriedBrackets = getBrackets(selectedYear, "married", "ordinary");
  const hohBrackets = getBrackets(selectedYear, "head_of_household", "ordinary");
  
  // Get available years from tax data
  const availableYears = Object.keys(STANDARD_DEDUCTION_BY_YEAR)
    .map(Number)
    .sort((a, b) => b - a); // Sort in descending order

  const contentOptions = {
    year: selectedYear,
    filingStatus: selectedFilingStatus,
    format: 'currency'
  };
  
  return (
    <div className="container content-padding section-margin">
      <div className="flex flex-col items-start justify-between space-y-2">
        <div className="space-y-0.5">
          <h2 className="text-3xl font-bold tracking-tight neptune-gold flex items-center">
            <BookOpen className="mr-2 h-6 w-6" />
            Basic Tax Education
          </h2>
          <p className="text-muted-foreground">
            Learn the fundamentals of how taxes work in the United States, common tax forms, and key definitions.
          </p>
        </div>
      </div>
      
      {/* Year and Filing Status Selectors */}
      <div className="flex flex-col md:flex-row gap-4 my-6 p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-card">
        <div className="space-y-2">
          <label htmlFor="year-select" className="text-sm font-medium">Tax Year</label>
          <Select 
            value={selectedYear.toString()} 
            onValueChange={(value) => setSelectedYear(Number(value))}
          >
            <SelectTrigger id="year-select" className="w-[180px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="filing-status-select" className="text-sm font-medium">Filing Status</label>
          <Select 
            value={selectedFilingStatus} 
            onValueChange={(value) => setSelectedFilingStatus(value as 'single' | 'married' | 'head_of_household')}
          >
            <SelectTrigger id="filing-status-select" className="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="married">Married Filing Jointly</SelectItem>
              <SelectItem value="head_of_household">Head of Household</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-end ml-auto">
          <p className="text-xs text-muted-foreground">
            Data last updated: <DynamicContentText as="span">{{tax_data_last_update}}</DynamicContentText>
          </p>
        </div>
      </div>

      <div className="grid gap-6 py-6">
        {/* Tax Brackets Section */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-[#1A1F2C]">
            <CardTitle id="tax-brackets">How Tax Brackets Work</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <DynamicContentText options={contentOptions}>
                The U.S. uses a <strong>progressive tax system</strong> where different portions of your income are taxed at increasing rates. This system is organized into <GlossaryTerm termId="tax_bracket">tax brackets</GlossaryTerm>, which are income ranges that are taxed at specific rates.
              </DynamicContentText>
              
              <DynamicContentText options={contentOptions}>
                For example, in {{selectedYear}}, a single filer might pay 10% on the first $11,000 of income, 12% on income from $11,001 to $44,725, and so on. This means not all of your income is taxed at your highest bracket rate.
              </DynamicContentText>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="bracket-example">
                  <AccordionTrigger className="text-[#9b87f5]">
                    See Example Calculation
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 bg-[#1A1F2C] rounded-md">
                      <DynamicContentText options={contentOptions}>
                        For a {{selectedFilingStatus}} filer with $60,000 taxable income in {{selectedYear}}:
                      </DynamicContentText>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Pay 10% on first $11,000 = $1,100</li>
                        <li>Pay 12% on next $33,725 (from $11,001 to $44,725) = $4,047</li>
                        <li>Pay 22% on remaining $15,275 (from $44,726 to $60,000) = $3,361</li>
                        <li>Total tax = $8,508</li>
                        <li><GlossaryTerm termId="effective_tax_rate">Effective tax rate</GlossaryTerm> = 14.2% ($8,508 ÷ $60,000)</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </CardContent>
        </Card>

        {/* NEW SECTION: Filing Status & Tax Brackets */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-[#1A1F2C]">
            <CardTitle id="filing-status-brackets">Why Filing Status Matters for Your Brackets</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p>
                Your <GlossaryTerm termId="filing_status">filing status</GlossaryTerm> significantly impacts how much tax you pay by determining your tax brackets, standard deduction amount, and eligibility for certain credits and deductions.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                  <h4 className="font-semibold mb-2">Single</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Unmarried individuals</li>
                    <li>Legally separated under state law</li>
                    <li>Divorced as of December 31</li>
                    <li>
                      Standard Deduction: <DynamicContentText 
                        options={{...contentOptions, filingStatus: 'single'}}
                      >
                        {{current_standard_deduction}}
                      </DynamicContentText>
                    </li>
                  </ul>
                </div>
                
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                  <h4 className="font-semibold mb-2">Married Filing Jointly</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Married couples combining income</li>
                    <li>Widows/widowers in certain cases</li>
                    <li>Generally most tax-advantageous</li>
                    <li>
                      Standard Deduction: <DynamicContentText 
                        options={{...contentOptions, filingStatus: 'married'}}
                      >
                        {{current_standard_deduction}}
                      </DynamicContentText>
                    </li>
                  </ul>
                </div>
                
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                  <h4 className="font-semibold mb-2">Head of Household</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Unmarried with qualifying dependents</li>
                    <li>Pays more than half of household costs</li>
                    <li>Better rates than Single status</li>
                    <li>
                      Standard Deduction: <DynamicContentText 
                        options={{...contentOptions, filingStatus: 'head_of_household'}}
                      >
                        {{current_standard_deduction}}
                      </DynamicContentText>
                    </li>
                  </ul>
                </div>
              </div>
              
              <h4 className="font-medium mt-6">Bracket Threshold Comparison ({selectedYear})</h4>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tax Rate</TableHead>
                      <TableHead>Single</TableHead>
                      <TableHead>Married Filing Jointly</TableHead>
                      <TableHead>Head of Household</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {singleBrackets.map((bracket, index) => (
                      <TableRow key={index}>
                        <TableCell>{(bracket.rate * 100).toFixed(0)}%</TableCell>
                        <TableCell>
                          {formatCurrency(bracket.bracket_min)} - {bracket.bracket_max === Infinity ? "$∞" : formatCurrency(bracket.bracket_max)}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(marriedBrackets[index].bracket_min)} - {marriedBrackets[index].bracket_max === Infinity ? "$∞" : formatCurrency(marriedBrackets[index].bracket_max)}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(hohBrackets[index].bracket_min)} - {hohBrackets[index].bracket_max === Infinity ? "$∞" : formatCurrency(hohBrackets[index].bracket_max)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex mt-4">
                <Button className="bg-[#9b87f5] hover:bg-[#8a76e4]" asChild>
                  <Link to="/tax-planning/which-bracket" className="flex items-center">
                    Find Your Tax Bracket
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="filing-status-faq">
                  <AccordionTrigger className="text-[#9b87f5]">
                    Frequently Asked Questions
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium">What if I'm married but filing separately?</h5>
                        <p className="text-sm mt-1">
                          Married Filing Separately uses different brackets than Married Filing Jointly. This status is generally less tax-advantageous but may be beneficial in specific situations like when one spouse has significant medical expenses or income-based student loan payments.
                        </p>
                      </div>
                      
                      <div>
                        <h5 className="font-medium">Can I choose any filing status?</h5>
                        <p className="text-sm mt-1">
                          No, you must qualify for a filing status based on your actual marital and household situation as of December 31st of the tax year. However, if you qualify for multiple statuses (e.g., both Single and Head of Household), you can choose the more advantageous one.
                        </p>
                      </div>
                      
                      <div>
                        <h5 className="font-medium">Does my filing status affect my tax credits?</h5>
                        <p className="text-sm mt-1">
                          Yes, many credits have different income thresholds and phase-out amounts based on filing status, including the Child Tax Credit, Earned Income Credit, and education credits.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-md mt-4">
                <p className="text-sm">
                  <strong>For Advanced Users:</strong> Learn about advanced strategies for choosing or planning around filing status in our <Link to="/tax-planning/advanced-tax-education" className="text-indigo-600 dark:text-indigo-400 hover:underline">Advanced Tax Education</Link> course.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Tax Forms Section */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-[#1A1F2C]">
            <CardTitle>Common Tax Forms</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p>
                Understanding tax forms is essential for proper tax filing. Each form serves a specific purpose in reporting different types of income or claiming deductions and credits.
              </p>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="form-w2">
                  <AccordionTrigger className="text-[#9b87f5]">
                    W-2 (Wage and Tax Statement)
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>
                      The W-2 is issued by employers to employees, showing annual wages earned and taxes withheld. This includes federal, state, and other taxes, as well as contributions to retirement plans and benefits. You'll receive this by January 31st for the previous tax year.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="form-1099">
                  <AccordionTrigger className="text-[#9b87f5]">
                    1099 Forms (Independent Contractor Income)
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>
                      1099 forms report income from sources other than employment. Common types include:
                    </p>
                    <ul className="list-disc list-inside mt-2">
                      <li>1099-NEC: For independent contractor/freelance income</li>
                      <li>1099-INT: For interest income from banks</li>
                      <li>1099-DIV: For dividends from investments</li>
                      <li>1099-MISC: For miscellaneous income</li>
                      <li>1099-R: For distributions from retirement accounts</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="form-1040">
                  <AccordionTrigger className="text-[#9b87f5]">
                    1040 (Individual Income Tax Return)
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Form 1040 is the main tax return form for individuals. It summarizes your income, deductions, credits, and calculates your final tax obligation or refund. Most taxpayers file this form annually by April 15th, though extensions are available.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </CardContent>
        </Card>

        {/* Deductions vs. Credits Section */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-[#1A1F2C]">
            <CardTitle>Deductions vs. Credits</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p>
                <strong><GlossaryTerm termId="tax_deduction">Tax deductions</GlossaryTerm></strong> reduce your taxable income before the tax rate is applied. For example, a $1,000 deduction for someone in the 22% tax bracket saves $220 in taxes.
              </p>
              <p>
                <strong><GlossaryTerm termId="tax_credit">Tax credits</GlossaryTerm></strong> reduce your tax bill dollar-for-dollar after taxes are calculated. A $1,000 tax credit saves you exactly $1,000 in taxes, regardless of your tax bracket. This generally makes credits more valuable than deductions of the same amount.
              </p>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="examples">
                  <AccordionTrigger className="text-[#9b87f5]">
                    Common Examples
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-[#1A1F2C] rounded-md">
                        <h4 className="font-semibold mb-2">Common Deductions:</h4>
                        <ul className="list-disc list-inside">
                          <li>Mortgage interest</li>
                          <li>State and local taxes (SALT)</li>
                          <li>Charitable contributions</li>
                          <li>Student loan interest</li>
                          <li>Health Savings Account (HSA) contributions</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-[#1A1F2C] rounded-md">
                        <h4 className="font-semibold mb-2">Common Credits:</h4>
                        <ul className="list-disc list-inside">
                          <li>Child Tax Credit</li>
                          <li>Earned Income Tax Credit</li>
                          <li>American Opportunity Credit (education)</li>
                          <li>Lifetime Learning Credit (education)</li>
                          <li>Residential energy credits</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </CardContent>
        </Card>

        {/* Marginal vs. Effective Tax Rates */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-[#1A1F2C]">
            <CardTitle>Marginal vs. Effective Tax Rates</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p>
                Your <strong><GlossaryTerm termId="marginal_tax_rate">marginal tax rate</GlossaryTerm></strong> is the rate you pay on the last dollar of income earned (your highest tax bracket). This is often what people refer to when they say "I'm in the 24% bracket."
              </p>
              <p>
                Your <strong><GlossaryTerm termId="effective_tax_rate">effective tax rate</GlossaryTerm></strong> is the actual percentage of your income that you pay in taxes, calculated as total tax divided by total taxable income. Because of the progressive bracket system, your effective rate is always lower than your marginal rate.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Capital Gains Basics */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-[#1A1F2C]">
            <CardTitle>Capital Gains Basics</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p>
                <strong><GlossaryTerm termId="capital_gain">Capital gains</GlossaryTerm></strong> are profits from selling assets that have increased in value, such as stocks, real estate, or collectibles. These are generally taxed at lower rates than ordinary income.
              </p>
              <p>
                <strong><GlossaryTerm termId="short_term_capital_gain">Short-term capital gains</GlossaryTerm></strong> (assets held for one year or less) are taxed at your ordinary income tax rates, while <strong><GlossaryTerm termId="long_term_capital_gain">long-term capital gains</GlossaryTerm></strong> (assets held longer than one year) are taxed at 0%, 15%, or 20% depending on your income level.
              </p>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="capital-gains-rates">
                  <AccordionTrigger className="text-[#9b87f5]">
                    Long-Term Capital Gains Rates ({selectedYear})
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 bg-[#1A1F2C] rounded-md">
                      <ul className="list-disc list-inside">
                        <li><strong>0% rate:</strong> Income up to <DynamicContentText 
                            options={{...contentOptions, filingStatus: 'single'}}
                          >{{capital_gains_0_rate_max}}</DynamicContentText> (single) or <DynamicContentText 
                            options={{...contentOptions, filingStatus: 'married'}}
                          >{{capital_gains_0_rate_max}}</DynamicContentText> (married filing jointly)
                        </li>
                        <li><strong>15% rate:</strong> Income from $44,626 to $492,300 (single) or $89,251 to $553,850 (married filing jointly)</li>
                        <li><strong>20% rate:</strong> Income above $492,300 (single) or $553,850 (married filing jointly)</li>
                      </ul>
                      <p className="mt-2 text-sm text-yellow-300">Note: An additional 3.8% Net Investment Income Tax may apply to high-income earners.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </CardContent>
        </Card>

        {/* Roth vs. Traditional Accounts */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-[#1A1F2C]">
            <CardTitle>Roth vs. Traditional Accounts</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p>
                <strong><GlossaryTerm termId="traditional_ira">Traditional accounts</GlossaryTerm></strong> (like Traditional IRAs and 401(k)s) offer tax-deferred growth. Contributions may be tax-deductible now, but withdrawals in retirement are taxed as ordinary income.
              </p>
              <p>
                <strong><GlossaryTerm termId="roth_ira">Roth accounts</GlossaryTerm></strong> (like Roth IRAs and Roth 401(k)s) are funded with after-tax dollars, offering no immediate tax benefit. However, qualified withdrawals in retirement are completely tax-free, including all growth and earnings.
              </p>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="account-comparison">
                  <AccordionTrigger className="text-[#9b87f5]">
                    When to Choose Each Type
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-[#1A1F2C] rounded-md">
                        <h4 className="font-semibold mb-2">Consider Traditional when:</h4>
                        <ul className="list-disc list-inside">
                          <li>You expect to be in a lower tax bracket in retirement</li>
                          <li>You want to reduce your current taxable income</li>
                          <li>You need the tax deduction now</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-[#1A1F2C] rounded-md">
                        <h4 className="font-semibold mb-2">Consider Roth when:</h4>
                        <ul className="list-disc list-inside">
                          <li>You expect to be in a higher tax bracket in retirement</li>
                          <li>You want tax-free withdrawals in retirement</li>
                          <li>You want to avoid Required Minimum Distributions</li>
                          <li>You want to leave tax-free assets to heirs</li>
                        </ul>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                      <h4 className="font-semibold mb-2">Current Contribution Limits ({selectedYear}):</h4>
                      <ul className="list-disc list-inside">
                        <li>
                          IRA Contribution Limit: <DynamicContentText options={contentOptions}>{{IRA_limit}}</DynamicContentText>
                        </li>
                        <li>
                          401(k) Contribution Limit: <DynamicContentText options={contentOptions}>{{401k_limit}}</DynamicContentText>
                        </li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </CardContent>
        </Card>

        {/* Filing Status Overview */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-[#1A1F2C]">
            <CardTitle>Filing Status Overview</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p>
                Your filing status determines your tax rates, deduction amounts, and eligibility for certain tax benefits. The status you choose depends on your marital status and family situation as of December 31st of the tax year.
              </p>

              <Accordion type="multiple" className="w-full">
                <AccordionItem value="filing-statuses">
                  <AccordionTrigger className="text-[#9b87f5]">
                    Filing Status Types
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-[#1A1F2C] rounded-md">
                        <h4 className="font-semibold">Single</h4>
                        <p className="text-sm">For unmarried individuals or those legally separated from their spouse.</p>
                      </div>
                      
                      <div className="p-3 bg-[#1A1F2C] rounded-md">
                        <h4 className="font-semibold">Married Filing Jointly</h4>
                        <p className="text-sm">For married couples who combine their income and deductions on one return. Generally offers the most tax benefits.</p>
                      </div>
                      
                      <div className="p-3 bg-[#1A1F2C] rounded-md">
                        <h4 className="font-semibold">Married Filing Separately</h4>
                        <p className="text-sm">For married couples who file separate returns. May benefit couples with significant differences in income or deductions.</p>
                      </div>
                      
                      <div className="p-3 bg-[#1A1F2C] rounded-md">
                        <h4 className="font-semibold">Head of Household</h4>
                        <p className="text-sm">For unmarried individuals who pay more than half the cost of keeping up a home for themselves and a qualifying dependent.</p>
                      </div>
                      
                      <div className="p-3 bg-[#1A1F2C] rounded-md">
                        <h4 className="font-semibold">Qualifying Widow(er)</h4>
                        <p className="text-sm">For individuals whose spouse died in the previous two years and who have a dependent child.</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex flex-wrap gap-4 pt-4">
          <Button asChild>
            <Link to="/tax-planning">
              Return to Tax Planning
            </Link>
          </Button>
          <Button className="bg-[#9b87f5] hover:bg-[#8a76e4]" asChild>
            <Link to="/tax-planning/advanced-tax-education">
              Proceed to Advanced Tax Education
            </Link>
          </Button>
          <Button variant="outline" className="border-[#FFD700] text-[#FFD700] hover:bg-[#1A1F2C]/50" asChild>
            <Link to="/tax-planning/glossary">
              View Tax Glossary
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BasicTaxEducationPage;
