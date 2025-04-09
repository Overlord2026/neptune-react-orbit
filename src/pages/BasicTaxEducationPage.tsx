
import React from 'react';
import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, FileText, Book, Info, CircleCheck, ArrowDown, HelpCircle } from "lucide-react";

const BasicTaxEducationPage = () => {
  return (
    <div className="container content-padding section-margin">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight neptune-gold">Basic Tax Education</h1>
        <p className="text-muted-foreground text-lg">
          Learn the fundamentals of how taxes work in the United States, common tax forms, and key definitions.
        </p>
      </div>

      {/* Tax Brackets Section */}
      <section className="mb-10">
        <Card className="bg-[#1A1F2C] border border-[#8E9196]">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#9b87f5]/20 rounded-full">
                <BookOpen className="h-6 w-6 text-[#9b87f5]" />
              </div>
              <h2 className="text-2xl font-semibold text-[#E5DEFF]">How Tax Brackets Work</h2>
            </div>
            
            <div className="space-y-4 text-[#F1F0FB]">
              <p>
                Tax brackets are ranges of income that are taxed at specific rates. The U.S. uses a progressive tax 
                system, meaning higher portions of your income are taxed at higher rates.
              </p>
              <p>
                Each tax bracket applies only to the portion of your income that falls within that range. This is 
                a common misunderstanding - moving into a higher bracket does not mean all your income is taxed at 
                that higher rate.
              </p>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="brackets-example" className="border-[#8E9196]">
                  <AccordionTrigger className="text-[#9b87f5]">
                    <span className="flex items-center gap-2">
                      <Info className="h-4 w-4" /> See Example: 2023 Tax Brackets
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-[#1E2334] p-4 rounded-md">
                      <h4 className="font-medium mb-2">Example: Single Filer with $65,000 Income</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>First $11,000 taxed at 10% = $1,100</li>
                        <li>$11,001 to $44,725 taxed at 12% = $4,047</li>
                        <li>$44,726 to $65,000 taxed at 22% = $4,460</li>
                        <li>Total tax = $9,607</li>
                        <li>Effective tax rate = 14.8% ($9,607 ÷ $65,000)</li>
                      </ul>
                      
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">2023 Federal Income Tax Brackets (Single Filers)</h4>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-[#8E9196]">
                              <th className="text-left py-2">Tax Rate</th>
                              <th className="text-left py-2">Taxable Income Range</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-[#8E9196]/50">
                              <td className="py-2">10%</td>
                              <td className="py-2">Up to $11,000</td>
                            </tr>
                            <tr className="border-b border-[#8E9196]/50">
                              <td className="py-2">12%</td>
                              <td className="py-2">$11,001 to $44,725</td>
                            </tr>
                            <tr className="border-b border-[#8E9196]/50">
                              <td className="py-2">22%</td>
                              <td className="py-2">$44,726 to $95,375</td>
                            </tr>
                            <tr className="border-b border-[#8E9196]/50">
                              <td className="py-2">24%</td>
                              <td className="py-2">$95,376 to $182,100</td>
                            </tr>
                            <tr className="border-b border-[#8E9196]/50">
                              <td className="py-2">32%</td>
                              <td className="py-2">$182,101 to $231,250</td>
                            </tr>
                            <tr className="border-b border-[#8E9196]/50">
                              <td className="py-2">35%</td>
                              <td className="py-2">$231,251 to $578,125</td>
                            </tr>
                            <tr>
                              <td className="py-2">37%</td>
                              <td className="py-2">$578,126 or more</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Common Tax Forms Section */}
      <section className="mb-10">
        <Card className="bg-[#1A1F2C] border border-[#8E9196]">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#9b87f5]/20 rounded-full">
                <FileText className="h-6 w-6 text-[#9b87f5]" />
              </div>
              <h2 className="text-2xl font-semibold text-[#E5DEFF]">Common Tax Forms</h2>
            </div>
            
            <div className="space-y-4 text-[#F1F0FB]">
              <p>
                Understanding tax forms is essential for accurate filing. Each form serves a specific purpose in 
                reporting different types of income, deductions, and credits.
              </p>
              <p>
                The IRS uses these forms to track your income, calculate your tax liability, and determine if 
                you're entitled to refunds or owe additional taxes.
              </p>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="common-forms" className="border-[#8E9196]">
                  <AccordionTrigger className="text-[#9b87f5]">
                    <span className="flex items-center gap-2">
                      <Info className="h-4 w-4" /> Common Tax Forms Explained
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-[#9b87f5]">Form W-2: Wage and Tax Statement</h4>
                        <p className="text-sm mt-1">
                          Provided by employers, showing wages earned and taxes withheld for the year. You'll receive 
                          this by January 31st for the previous tax year.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-[#9b87f5]">Form 1099 Series</h4>
                        <ul className="list-disc pl-5 text-sm mt-1 space-y-1">
                          <li><span className="font-medium">1099-NEC:</span> For independent contractors/freelancers (non-employee compensation)</li>
                          <li><span className="font-medium">1099-INT:</span> Interest income from banks, investments</li>
                          <li><span className="font-medium">1099-DIV:</span> Dividend income from investments</li>
                          <li><span className="font-medium">1099-MISC:</span> Miscellaneous income</li>
                          <li><span className="font-medium">1099-R:</span> Distributions from retirement accounts</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-[#9b87f5]">Form 1040: Individual Income Tax Return</h4>
                        <p className="text-sm mt-1">
                          The main tax form for individuals. Everyone files some version of the 1040, where you report 
                          total income, deductions, credits, and calculate your final tax obligation.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-[#9b87f5]">Schedule A: Itemized Deductions</h4>
                        <p className="text-sm mt-1">
                          Used to claim itemized deductions like mortgage interest, charitable donations, and medical expenses 
                          (as an alternative to the standard deduction).
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-[#9b87f5]">Schedule C: Profit or Loss from Business</h4>
                        <p className="text-sm mt-1">
                          For reporting income and expenses from self-employment or small business activities.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-[#9b87f5]">Schedule D: Capital Gains and Losses</h4>
                        <p className="text-sm mt-1">
                          For reporting profits or losses from the sale of capital assets (stocks, property, etc.).
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Deductions vs. Credits Section */}
      <section className="mb-10">
        <Card className="bg-[#1A1F2C] border border-[#8E9196]">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#9b87f5]/20 rounded-full">
                <CircleCheck className="h-6 w-6 text-[#9b87f5]" />
              </div>
              <h2 className="text-2xl font-semibold text-[#E5DEFF]">Deductions vs. Credits</h2>
            </div>
            
            <div className="space-y-4 text-[#F1F0FB]">
              <p>
                Tax deductions and tax credits both reduce your tax bill, but they work in fundamentally different 
                ways. Understanding this difference is crucial for maximizing your tax savings.
              </p>
              <p>
                <span className="font-medium text-[#9b87f5]">Tax deductions</span> reduce your taxable income 
                before tax rates are applied. <span className="font-medium text-[#9b87f5]">Tax credits</span> reduce 
                your tax liability directly, dollar-for-dollar, after tax rates are applied.
              </p>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="deduction-credit-example" className="border-[#8E9196]">
                  <AccordionTrigger className="text-[#9b87f5]">
                    <span className="flex items-center gap-2">
                      <Info className="h-4 w-4" /> Compare: $1,000 Deduction vs. $1,000 Credit
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-[#1E2334] p-4 rounded-md">
                      <h4 className="font-medium mb-2">Example: $60,000 Income in 22% Tax Bracket</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium text-[#9b87f5]">With $1,000 Tax Deduction:</h5>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Taxable income reduced to $59,000</li>
                            <li>Tax savings = $1,000 × 22% = $220</li>
                            <li>Your tax bill is reduced by $220</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-[#9b87f5]">With $1,000 Tax Credit:</h5>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Taxable income remains $60,000</li>
                            <li>Tax calculated on $60,000</li>
                            <li>$1,000 is subtracted directly from your tax bill</li>
                            <li>Your tax bill is reduced by $1,000</li>
                          </ul>
                        </div>
                        
                        <div className="bg-[#2A2F42] p-3 rounded-md">
                          <p className="font-medium text-[#9b87f5]">Key Takeaway:</p>
                          <p>A $1,000 tax credit is worth more than a $1,000 tax deduction. Credits directly reduce your tax bill dollar-for-dollar, while deductions only reduce the income that's subject to tax.</p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Marginal vs. Effective Tax Rates Section */}
      <section className="mb-10">
        <Card className="bg-[#1A1F2C] border border-[#8E9196]">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#9b87f5]/20 rounded-full">
                <ArrowDown className="h-6 w-6 text-[#9b87f5]" />
              </div>
              <h2 className="text-2xl font-semibold text-[#E5DEFF]">Marginal vs. Effective Tax Rates</h2>
            </div>
            
            <div className="space-y-4 text-[#F1F0FB]">
              <p>
                Your <span className="font-medium text-[#9b87f5]">marginal tax rate</span> is the rate applied to your last dollar of income 
                (your highest tax bracket). This is often what people refer to when they mention their "tax bracket."
              </p>
              <p>
                Your <span className="font-medium text-[#9b87f5]">effective tax rate</span> is your total tax paid divided by your total taxable 
                income—essentially, the average rate you pay across all your income. This is always lower than 
                your marginal rate in a progressive system.
              </p>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="rates-visualization" className="border-[#8E9196]">
                  <AccordionTrigger className="text-[#9b87f5]">
                    <span className="flex items-center gap-2">
                      <Info className="h-4 w-4" /> See Example: Tax Rate Visualization
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-[#1E2334] p-4 rounded-md">
                      <div className="space-y-4">
                        <h4 className="font-medium mb-2">Example: $90,000 Income (Single Filer)</h4>
                        
                        <div className="space-y-2">
                          <div className="relative h-16">
                            <div className="absolute top-0 left-0 h-full w-[12%] bg-blue-500 rounded-l flex items-center justify-center text-xs text-white">10%</div>
                            <div className="absolute top-0 left-[12%] h-full w-[37%] bg-blue-600 flex items-center justify-center text-xs text-white">12%</div>
                            <div className="absolute top-0 left-[49%] h-full w-[51%] bg-blue-700 rounded-r flex items-center justify-center text-xs text-white">22%</div>
                          </div>
                          
                          <div className="flex text-xs justify-between">
                            <span>$0</span>
                            <span>$11,000</span>
                            <span>$44,725</span>
                            <span>$90,000</span>
                          </div>
                          
                          <div className="mt-6">
                            <p><span className="font-medium">Marginal rate:</span> 22% (highest bracket reached)</p>
                            <p><span className="font-medium">Effective rate:</span> ~15.2% (total tax divided by $90,000)</p>
                          </div>
                          
                          <div className="bg-[#2A2F42] p-3 rounded-md mt-4">
                            <p className="font-medium text-[#9b87f5]">Important Point:</p>
                            <p>Many people incorrectly believe that if they reach a higher tax bracket, all their income is taxed at that rate. In reality, only the dollars that fall within each bracket are taxed at that bracket's rate.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Capital Gains Section */}
      <section className="mb-10">
        <Card className="bg-[#1A1F2C] border border-[#8E9196]">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#9b87f5]/20 rounded-full">
                <Book className="h-6 w-6 text-[#9b87f5]" />
              </div>
              <h2 className="text-2xl font-semibold text-[#E5DEFF]">Capital Gains Basics</h2>
            </div>
            
            <div className="space-y-4 text-[#F1F0FB]">
              <p>
                Capital gains are profits from selling capital assets such as stocks, bonds, real estate, or other 
                investments. How these gains are taxed depends largely on how long you've held the asset.
              </p>
              <p>
                <span className="font-medium text-[#9b87f5]">Short-term capital gains</span> (assets held ≤ 1 year) are taxed at your ordinary income 
                tax rates. <span className="font-medium text-[#9b87f5]">Long-term capital gains</span> (assets held > 1 year) are generally taxed at 
                preferential, lower rates.
              </p>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="capital-gains-rates" className="border-[#8E9196]">
                  <AccordionTrigger className="text-[#9b87f5]">
                    <span className="flex items-center gap-2">
                      <Info className="h-4 w-4" /> Long-Term Capital Gains Tax Rates (2023)
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-[#1E2334] p-4 rounded-md">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-[#8E9196]">
                            <th className="text-left py-2">Filing Status</th>
                            <th className="text-left py-2">0% Rate</th>
                            <th className="text-left py-2">15% Rate</th>
                            <th className="text-left py-2">20% Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-[#8E9196]/50">
                            <td className="py-2">Single</td>
                            <td className="py-2">Up to $44,625</td>
                            <td className="py-2">$44,626 - $492,300</td>
                            <td className="py-2">Over $492,300</td>
                          </tr>
                          <tr className="border-b border-[#8E9196]/50">
                            <td className="py-2">Married Filing Jointly</td>
                            <td className="py-2">Up to $89,250</td>
                            <td className="py-2">$89,251 - $553,850</td>
                            <td className="py-2">Over $553,850</td>
                          </tr>
                          <tr>
                            <td className="py-2">Head of Household</td>
                            <td className="py-2">Up to $59,750</td>
                            <td className="py-2">$59,751 - $523,050</td>
                            <td className="py-2">Over $523,050</td>
                          </tr>
                        </tbody>
                      </table>
                      
                      <div className="mt-4 space-y-2">
                        <p className="font-medium text-[#9b87f5]">Example:</p>
                        <p>If you're in the 22% ordinary income tax bracket but sell stocks you've held for over a year:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Your long-term capital gains would likely be taxed at just 15%</li>
                          <li>If you sold stocks held for less than a year, the gains would be taxed at your normal 22% rate</li>
                        </ul>
                        
                        <div className="bg-[#2A2F42] p-3 rounded-md mt-4">
                          <p className="text-[#9b87f5] font-medium">Tax Planning Opportunity:</p>
                          <p>Holding investments for more than one year before selling can result in significant tax savings.</p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Roth vs. Traditional Accounts Section */}
      <section className="mb-10">
        <Card className="bg-[#1A1F2C] border border-[#8E9196]">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#9b87f5]/20 rounded-full">
                <Book className="h-6 w-6 text-[#9b87f5]" />
              </div>
              <h2 className="text-2xl font-semibold text-[#E5DEFF]">Roth vs. Traditional Accounts</h2>
            </div>
            
            <div className="space-y-4 text-[#F1F0FB]">
              <p>
                The main difference between Traditional and Roth retirement accounts is when you pay taxes on the money.
              </p>
              <p>
                With <span className="font-medium text-[#9b87f5]">Traditional IRAs/401(k)s</span>, you contribute pre-tax dollars (reducing your current taxable 
                income), but pay taxes when you withdraw in retirement. With <span className="font-medium text-[#9b87f5]">Roth IRAs/401(k)s</span>, 
                you contribute after-tax dollars now, but withdrawals in retirement are tax-free.
              </p>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="retirement-accounts-comparison" className="border-[#8E9196]">
                  <AccordionTrigger className="text-[#9b87f5]">
                    <span className="flex items-center gap-2">
                      <Info className="h-4 w-4" /> Comparison Chart: Traditional vs. Roth
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-[#1E2334] p-4 rounded-md">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-[#8E9196]">
                            <th className="text-left py-2">Feature</th>
                            <th className="text-left py-2">Traditional IRA/401(k)</th>
                            <th className="text-left py-2">Roth IRA/401(k)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-[#8E9196]/50">
                            <td className="py-2 font-medium">Tax Treatment of Contributions</td>
                            <td className="py-2">Pre-tax (tax deduction now)</td>
                            <td className="py-2">After-tax (no deduction)</td>
                          </tr>
                          <tr className="border-b border-[#8E9196]/50">
                            <td className="py-2 font-medium">Tax Treatment of Withdrawals</td>
                            <td className="py-2">Taxed as ordinary income</td>
                            <td className="py-2">Tax-free (if qualified)</td>
                          </tr>
                          <tr className="border-b border-[#8E9196]/50">
                            <td className="py-2 font-medium">Required Minimum Distributions (RMDs)</td>
                            <td className="py-2">Yes, starting at age 73</td>
                            <td className="py-2">No (for Roth IRAs, yes for Roth 401(k)s)</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-medium">Ideal If You Believe...</td>
                            <td className="py-2">Your tax rate will be lower in retirement</td>
                            <td className="py-2">Your tax rate will be higher in retirement</td>
                          </tr>
                        </tbody>
                      </table>
                      
                      <div className="mt-6 space-y-4">
                        <div>
                          <h4 className="font-medium text-[#9b87f5] mb-1">Example: $6,000 Annual Contribution</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-[#2A2F42] p-3 rounded-md">
                              <h5 className="font-medium mb-1">Traditional IRA (22% Tax Bracket)</h5>
                              <ul className="list-disc pl-5 space-y-1">
                                <li>$6,000 contribution</li>
                                <li>$1,320 tax savings now ($6,000 × 22%)</li>
                                <li>Grows tax-deferred</li>
                                <li>Withdrawals taxed as ordinary income</li>
                              </ul>
                            </div>
                            
                            <div className="bg-[#2A2F42] p-3 rounded-md">
                              <h5 className="font-medium mb-1">Roth IRA</h5>
                              <ul className="list-disc pl-5 space-y-1">
                                <li>$6,000 contribution</li>
                                <li>No immediate tax benefit</li>
                                <li>Grows tax-free</li>
                                <li>Withdrawals are tax-free</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-[#2A2F42] p-3 rounded-md">
                          <p className="text-[#9b87f5] font-medium">Tax Planning Strategy:</p>
                          <p>Consider having both types of accounts to diversify your tax situation in retirement, giving you flexibility in how you withdraw funds.</p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Filing Status Overview Section */}
      <section className="mb-10">
        <Card className="bg-[#1A1F2C] border border-[#8E9196]">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#9b87f5]/20 rounded-full">
                <HelpCircle className="h-6 w-6 text-[#9b87f5]" />
              </div>
              <h2 className="text-2xl font-semibold text-[#E5DEFF]">Filing Status Overview</h2>
            </div>
            
            <div className="space-y-4 text-[#F1F0FB]">
              <p>
                Your filing status determines your tax rate, standard deduction amount, and eligibility for certain 
                credits. The IRS recognizes five filing statuses, each with different rules and implications.
              </p>
              <p>
                Choosing the correct filing status is important, as it can significantly impact your tax liability 
                and refund amount.
              </p>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="filing-statuses" className="border-[#8E9196]">
                  <AccordionTrigger className="text-[#9b87f5]">
                    <span className="flex items-center gap-2">
                      <Info className="h-4 w-4" /> The Five Filing Statuses Explained
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-[#9b87f5]">1. Single</h4>
                        <p className="text-sm mt-1">
                          For unmarried individuals who don't qualify for another filing status. This generally has 
                          higher tax rates than some other statuses.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-[#9b87f5]">2. Married Filing Jointly</h4>
                        <p className="text-sm mt-1">
                          For married couples who combine their income and deductions. Often provides the most 
                          favorable tax treatment, with lower tax rates and higher deduction thresholds.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-[#9b87f5]">3. Married Filing Separately</h4>
                        <p className="text-sm mt-1">
                          Allows married couples to file separate returns. May be beneficial in specific situations 
                          (e.g., one spouse has significant medical expenses or separate finances), but often results 
                          in higher combined taxes.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-[#9b87f5]">4. Head of Household</h4>
                        <p className="text-sm mt-1">
                          For unmarried individuals who pay more than half the cost of keeping up a home for a 
                          qualifying person (like a dependent child). Provides more favorable tax rates and higher 
                          standard deductions than the single status.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-[#9b87f5]">5. Qualifying Widow(er) with Dependent Child</h4>
                        <p className="text-sm mt-1">
                          For widows or widowers with dependent children who meet certain requirements. Allows use 
                          of the married filing jointly rates and standard deduction for up to two years after a 
                          spouse's death.
                        </p>
                      </div>
                      
                      <div className="bg-[#1E2334] p-4 rounded-md mt-2">
                        <h4 className="font-medium mb-2">2023 Standard Deduction by Filing Status</h4>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-[#8E9196]">
                              <th className="text-left py-2">Filing Status</th>
                              <th className="text-left py-2">Standard Deduction</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-[#8E9196]/50">
                              <td className="py-2">Single</td>
                              <td className="py-2">$13,850</td>
                            </tr>
                            <tr className="border-b border-[#8E9196]/50">
                              <td className="py-2">Married Filing Jointly</td>
                              <td className="py-2">$27,700</td>
                            </tr>
                            <tr className="border-b border-[#8E9196]/50">
                              <td className="py-2">Married Filing Separately</td>
                              <td className="py-2">$13,850</td>
                            </tr>
                            <tr className="border-b border-[#8E9196]/50">
                              <td className="py-2">Head of Household</td>
                              <td className="py-2">$20,800</td>
                            </tr>
                            <tr>
                              <td className="py-2">Qualifying Widow(er)</td>
                              <td className="py-2">$27,700</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mt-8 mb-12">
        <Button
          variant="outline"
          className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/10"
          asChild
        >
          <Link to="/tax-planning">
            <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
            Return to Tax Planning
          </Link>
        </Button>
        
        <Button
          className="bg-[#9b87f5] hover:bg-[#8a76e4] text-white"
          asChild
        >
          <Link to="/tax-planning">
            Advanced Tax Education (Paid Course)
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default BasicTaxEducationPage;
