
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowLeft, ChevronDown } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import InfoTooltip from '@/components/tax/InfoTooltip';
import { 
  TaxTrapWarning
} from '@/utils/taxTrapChecker';
import TaxTrapVisualizer from '@/components/tax/TaxTrapVisualizer';
import TaxTrapResourceLink from '@/components/tax/TaxTrapResourceLink';

const AvoidingTaxTrapsPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row items-center justify-between pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight neptune-gold">
            Common Tax Traps and How to Avoid Them
          </h1>
          <p className="text-muted-foreground">
            Learn about potential tax pitfalls in retirement planning and strategies to avoid them
          </p>
        </div>
        <Link to="/tax-planning" className="border border-primary hover:bg-primary/10 px-4 py-2 rounded-md text-primary transition-colors flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Tax Planning
        </Link>
      </div>

      <Card className="bg-card border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg text-primary">Important Disclaimer</CardTitle>
          <CardDescription>
            The information provided on this page is for educational purposes only and should not be considered as financial or tax advice. 
            Tax laws change frequently and individual situations can vary significantly. 
            Always consult with qualified tax and financial professionals before implementing any tax strategies.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        <Accordion type="multiple" className="w-full">
          {/* IRMAA Surcharges Section */}
          <AccordionItem value="irmaa">
            <AccordionTrigger className="text-xl font-medium">
              IRMAA Surcharges
              <InfoTooltip text="Income-Related Monthly Adjustment Amount" className="ml-2" />
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="prose max-w-none dark:prose-invert">
                <h3>What are IRMAA Surcharges?</h3>
                <p>
                  Medicare Part B & D costs can increase based on your modified adjusted gross income (MAGI) from two years prior. 
                  These surcharges, known as Income-Related Monthly Adjustment Amounts (IRMAA), can significantly increase your 
                  healthcare costs in retirement.
                </p>

                <h3>Key Facts</h3>
                <ul>
                  <li>Surcharges are based on your MAGI from two years ago (e.g., 2024 premiums based on 2022 income)</li>
                  <li>MAGI includes tax-exempt interest and untaxed foreign income</li>
                  <li>Surcharges can add hundreds of dollars per month to Medicare costs</li>
                  <li>Thresholds are not inflation-adjusted, causing "bracket creep" over time</li>
                </ul>

                <h3>Strategies to Mitigate IRMAA Surcharges</h3>
                <ul>
                  <li><strong>Spread out Roth conversions</strong> over multiple years to avoid large income spikes</li>
                  <li><strong>Plan for partial conversions earlier</strong> in retirement, before Medicare enrollment at 65</li>
                  <li><strong>Manage capital gains</strong> strategically to avoid crossing IRMAA thresholds</li>
                  <li><strong>Consider qualified charitable distributions (QCDs)</strong> from IRAs, which don't count toward MAGI</li>
                  <li><strong>File for a "life-changing event" appeal</strong> if your income has decreased due to specific circumstances</li>
                </ul>
              </div>
              
              <Card className="bg-slate-50 dark:bg-slate-900/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">IRMAA Threshold Visualization</CardTitle>
                </CardHeader>
                <CardContent>
                  <TaxTrapVisualizer type="irmaa" />
                </CardContent>
              </Card>
              
              <div className="flex flex-wrap gap-3">
                <TaxTrapResourceLink 
                  title="Medicare IRMAA Information" 
                  url="https://www.medicare.gov/your-medicare-costs/income-related-monthly-adjustment-amount" 
                />
                <TaxTrapResourceLink 
                  title="SSA IRMAA Appeal Process" 
                  url="https://www.ssa.gov/forms/ssa-44-ext.pdf" 
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Social Security Taxation Section */}
          <AccordionItem value="social-security">
            <AccordionTrigger className="text-xl font-medium">
              Social Security Taxation
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="prose max-w-none dark:prose-invert">
                <h3>How Social Security Benefits are Taxed</h3>
                <p>
                  Up to 85% of Social Security benefits can become taxable if your "combined income" exceeds certain thresholds.
                  Combined income includes adjusted gross income, tax-exempt interest, and half of your Social Security benefits.
                </p>

                <h3>Key Facts</h3>
                <ul>
                  <li>Social Security taxation thresholds have not been adjusted for inflation since 1984</li>
                  <li>For singles, 50% of benefits become taxable at $25,000 of combined income</li>
                  <li>For married couples, 50% of benefits become taxable at $32,000 of combined income</li>
                  <li>At higher income levels ($34,000 single/$44,000 married), up to 85% of benefits can be taxable</li>
                </ul>

                <h3>Minimization Strategies</h3>
                <ul>
                  <li><strong>Manage distributions carefully</strong> from retirement accounts to stay under thresholds</li>
                  <li><strong>Consider Roth distributions</strong> which don't count toward AGI</li>
                  <li><strong>Plan strategic IRA-to-Roth conversions</strong> in years before Social Security begins</li>
                  <li><strong>Coordinate income sources</strong> to minimize combined income in any given year</li>
                  <li><strong>Use tax-efficient investments</strong> in taxable accounts to minimize taxable interest and dividends</li>
                </ul>
              </div>
              
              <Card className="bg-slate-50 dark:bg-slate-900/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">Social Security Taxation Thresholds</CardTitle>
                </CardHeader>
                <CardContent>
                  <TaxTrapVisualizer type="social_security" />
                </CardContent>
              </Card>
              
              <div className="flex flex-wrap gap-3">
                <TaxTrapResourceLink 
                  title="IRS on Social Security Taxation" 
                  url="https://www.irs.gov/publications/p915" 
                />
                <TaxTrapResourceLink 
                  title="SSA Benefits Planner: Income Taxes" 
                  url="https://www.ssa.gov/benefits/retirement/planner/taxes.html" 
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Capital Gains Thresholds */}
          <AccordionItem value="capital-gains">
            <AccordionTrigger className="text-xl font-medium">
              Capital Gains Thresholds
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="prose max-w-none dark:prose-invert">
                <h3>How Capital Gains Taxation Works</h3>
                <p>
                  Long-term capital gains (assets held for more than a year) are taxed at different rates than ordinary income.
                  These rates can jump from 0% to 15%, or from 15% to 20%, once you exceed certain income thresholds.
                </p>

                <h3>Key Facts</h3>
                <ul>
                  <li>2023 rates: 0% (income up to $44,625 single/$89,250 married), 15% (up to $492,300 single/$553,850 married), 20% (above)</li>
                  <li>Additional 3.8% Net Investment Income Tax applies above $200,000 single/$250,000 married</li>
                  <li>Thresholds adjust annually with inflation</li>
                  <li>State taxes are additional and vary widely</li>
                </ul>

                <h3>Planning Strategies</h3>
                <ul>
                  <li><strong>Harvest gains in lower-income years</strong> to take advantage of lower rates</li>
                  <li><strong>Coordinate large conversions with smaller gains</strong> to minimize bracket impacts</li>
                  <li><strong>Consider tax-loss harvesting</strong> to offset gains with losses</li>
                  <li><strong>Utilize step-up in basis</strong> for inherited assets</li>
                  <li><strong>Consider charitable giving of appreciated assets</strong> to avoid capital gains entirely</li>
                </ul>
              </div>
              
              <Card className="bg-slate-50 dark:bg-slate-900/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">Capital Gains Tax Brackets</CardTitle>
                </CardHeader>
                <CardContent>
                  <TaxTrapVisualizer type="capital_gains" />
                </CardContent>
              </Card>
              
              <div className="flex flex-wrap gap-3">
                <TaxTrapResourceLink 
                  title="IRS Capital Gains and Losses" 
                  url="https://www.irs.gov/taxtopics/tc409" 
                />
                <TaxTrapResourceLink 
                  title="IRS Publication 550 (Investment Income)" 
                  url="https://www.irs.gov/publications/p550" 
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* ACA Subsidy Cliffs */}
          <AccordionItem value="aca-subsidies">
            <AccordionTrigger className="text-xl font-medium">
              ACA Subsidy Cliffs
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="prose max-w-none dark:prose-invert">
                <h3>Understanding ACA Premium Subsidies</h3>
                <p>
                  When your income exceeds certain percentages of the Federal Poverty Level (FPL), healthcare premium subsidies 
                  under the Affordable Care Act can drop significantly or disappear entirely, creating a "subsidy cliff."
                </p>

                <h3>Key Facts</h3>
                <ul>
                  <li>The American Rescue Plan temporarily eliminated the 400% FPL subsidy cliff through 2025</li>
                  <li>Subsidies are based on income as a percentage of FPL</li>
                  <li>FPL varies by household size and is updated annually</li>
                  <li>Subsidy amounts can be thousands of dollars per year</li>
                </ul>

                <h3>Mitigation Strategies</h3>
                <ul>
                  <li><strong>Track income carefully</strong> throughout the year to avoid surprises</li>
                  <li><strong>Consider partial-year conversions</strong> to manage annual income</li>
                  <li><strong>Maximize tax-deductible expenses</strong> like HSA or retirement contributions to reduce MAGI</li>
                  <li><strong>Time income recognition</strong> strategically before/after ACA enrollment years</li>
                  <li><strong>Consider part-time work</strong> to gain employer-sponsored coverage for part of the year</li>
                </ul>
              </div>
              
              <Card className="bg-slate-50 dark:bg-slate-900/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">ACA Premium Subsidy by Income Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <TaxTrapVisualizer type="aca" />
                </CardContent>
              </Card>
              
              <div className="flex flex-wrap gap-3">
                <TaxTrapResourceLink 
                  title="Healthcare.gov Subsidies" 
                  url="https://www.healthcare.gov/lower-costs/" 
                />
                <TaxTrapResourceLink 
                  title="KFF Subsidy Calculator" 
                  url="https://www.kff.org/interactive/subsidy-calculator/" 
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <Card className="bg-slate-50/80 dark:bg-slate-900/20 mt-6">
        <CardHeader>
          <CardTitle className="neptune-gold text-xl">Planning Considerations</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert">
          <p>
            <strong>Integrated Planning is Essential:</strong> Each of these tax traps should not be considered in isolation.
            A comprehensive tax strategy needs to account for how these various thresholds interact with each other and your
            overall financial situation.
          </p>
          <p>
            <strong>Multi-Year Planning:</strong> Many effective strategies involve looking at multi-year tax situations,
            balancing income across several years to minimize overall tax burden over time rather than in any single year.
          </p>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Link to="/tax-planning/roth-analysis/compare" className="text-primary flex items-center hover:underline">
            <span>Try our comparison tools to analyze your scenarios</span>
            <ArrowLeft className="h-4 w-4 ml-2 transform rotate-180" />
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AvoidingTaxTrapsPage;
