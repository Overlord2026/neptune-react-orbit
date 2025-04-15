
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import GlossaryTerm from '@/components/GlossaryTerm';

const guideContent = {
  'understanding-tax-brackets': {
    title: 'Understanding Tax Brackets',
    content: (
      <>
        <p className="mb-4">
          The U.S. tax system uses a progressive structure with different tax rates applied to different portions 
          of your income. This guide explains how tax brackets work and how to optimize your tax strategy around them.
        </p>
        
        <h3 className="text-xl font-semibold mb-2">How Tax Brackets Work</h3>
        <p className="mb-4">
          Rather than taxing all your income at one rate, the IRS divides your income into "brackets" 
          with progressively higher tax rates. For example, in 2025, a single filer might pay:
        </p>
        
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>10% on the first $11,000 of income</li>
          <li>12% on income from $11,001 to $44,725</li>
          <li>22% on income from $44,726 to $95,375</li>
          <li>And so on for higher brackets</li>
        </ul>
        
        <h3 className="text-xl font-semibold mb-2">Marginal vs. Effective Tax Rate</h3>
        <p className="mb-4">
          Your <GlossaryTerm termId="marginal_tax_rate">marginal tax rate</GlossaryTerm> is the rate applied to your last dollar of income. 
          Your <GlossaryTerm termId="effective_tax_rate">effective tax rate</GlossaryTerm> is your total tax divided by your total income, 
          which is always lower than your marginal rate in a progressive tax system.
        </p>
        
        <h3 className="text-xl font-semibold mb-2">Tax Bracket Management Strategies</h3>
        <p className="mb-4">Key strategies for optimizing your tax brackets include:</p>
        
        <Card className="mb-4 bg-[#1A1F2C]">
          <CardContent className="pt-4">
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Income Timing</strong>: Shift income between tax years to avoid jumping into higher brackets</li>
              <li><strong>Retirement Contributions</strong>: Use pre-tax retirement accounts to reduce taxable income</li>
              <li><strong>Roth Conversions</strong>: Fill up lower tax brackets with strategic <GlossaryTerm termId="roth_conversion">Roth conversions</GlossaryTerm></li>
              <li><strong>Charitable Giving</strong>: Use charitable donations to reduce taxable income</li>
              <li><strong>Tax-Loss Harvesting</strong>: Offset capital gains with capital losses</li>
            </ul>
          </CardContent>
        </Card>
        
        <h3 className="text-xl font-semibold mb-2">Example: Filling Up Lower Brackets</h3>
        <p className="mb-4">
          If you're in the 12% bracket with room before hitting the 22% bracket, you might consider 
          Roth conversions up to the top of the 12% bracket. This allows you to pay taxes at a lower rate 
          now rather than potentially higher rates later.
        </p>
        
        <div className="bg-[#1A1F2C] p-4 rounded-md mb-4">
          <h4 className="font-semibold mb-2">Example Calculation</h4>
          <p>For a single filer in 2025 with $35,000 of taxable income:</p>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Currently in the 12% bracket</li>
            <li>22% bracket begins at $44,725</li>
            <li>Potential for $9,725 Roth conversion while staying in 12% bracket</li>
          </ul>
        </div>
        
        <h3 className="text-xl font-semibold mb-2">Bracket Changes and Tax Planning</h3>
        <p className="mb-4">
          Tax brackets are periodically adjusted for inflation and may change with new tax legislation. 
          The current brackets from the Tax Cuts and Jobs Act are scheduled to sunset after 2025, 
          making bracket-aware planning especially important now.
        </p>
        
        <div className="bg-amber-100 dark:bg-amber-900/30 p-4 rounded-md text-amber-800 dark:text-amber-200 text-sm mb-6">
          <p><strong>Note:</strong> This guide provides general education, not personalized tax advice. 
          Tax laws change frequently and strategies may not be applicable to your specific situation. 
          Consult a tax professional before implementing these strategies.</p>
        </div>
      </>
    )
  },
  'retirement-tax-strategies': {
    title: 'Retirement Tax Strategies',
    content: (
      <>
        <p className="mb-4">
          Planning for taxes in retirement requires understanding how different income sources are taxed 
          and how to manage withdrawals strategically. This guide covers key retirement tax planning strategies.
        </p>
        
        <h3 className="text-xl font-semibold mb-2">How Retirement Income is Taxed</h3>
        <p className="mb-4">
          Different retirement income sources have different tax treatments:
        </p>
        
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li><strong>Traditional IRA/401(k)</strong>: Taxed as ordinary income</li>
          <li><strong>Roth IRA/401(k)</strong>: Tax-free withdrawals (if qualified)</li>
          <li><strong>Social Security</strong>: Partially taxable based on total income</li>
          <li><strong>Pensions</strong>: Generally fully taxable as ordinary income</li>
          <li><strong>Capital Gains</strong>: Taxed at preferential rates (0%, 15%, or 20%)</li>
        </ul>
        
        <h3 className="text-xl font-semibold mb-2">Strategic Withdrawal Planning</h3>
        <Card className="mb-4 bg-[#1A1F2C]">
          <CardContent className="pt-4">
            <p className="mb-2">The sequence of withdrawals can significantly impact your tax situation:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li><strong>Taxable accounts first</strong>: Begin with non-retirement accounts to benefit from lower capital gains rates</li>
              <li><strong>Traditional IRA/401(k)</strong>: Draw from these accounts next, especially up to lower tax brackets</li>
              <li><strong>Roth accounts last</strong>: Preserve tax-free growth as long as possible</li>
            </ol>
          </CardContent>
        </Card>
        
        <h3 className="text-xl font-semibold mb-2">Roth Conversion Ladders</h3>
        <p className="mb-4">
          A <GlossaryTerm termId="roth_conversion_ladder">Roth conversion ladder</GlossaryTerm> involves converting portions of traditional retirement 
          accounts to Roth accounts over multiple years, paying taxes at potentially lower rates 
          and setting up tax-free withdrawals later.
        </p>
        
        <div className="bg-[#1A1F2C] p-4 rounded-md mb-4">
          <h4 className="font-semibold mb-2">Example Strategy</h4>
          <p>For someone retiring at 60 with significant traditional IRA assets:</p>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Convert amounts up to the top of the 12% or 22% bracket each year</li>
            <li>Live on taxable accounts during this period</li>
            <li>Begin tax-free withdrawals from converted Roth funds at age 65+</li>
            <li>Minimize future RMDs and potentially reduce Medicare premiums</li>
          </ul>
        </div>
        
        <h3 className="text-xl font-semibold mb-2">Required Minimum Distributions (RMDs)</h3>
        <p className="mb-4">
          <GlossaryTerm termId="rmd">RMDs</GlossaryTerm> begin at age 73 (as of 2023 law) for traditional retirement accounts. 
          Planning for these mandatory withdrawals is crucial to avoid excess taxation in later years.
        </p>
        
        <h3 className="text-xl font-semibold mb-2">Qualified Charitable Distributions (QCDs)</h3>
        <p className="mb-4">
          <GlossaryTerm termId="qcd">QCDs</GlossaryTerm> allow direct transfers from IRAs to charities, satisfying RMDs without 
          increasing taxable income. This can be powerful for philanthropically-minded retirees.
        </p>
        
        <div className="bg-amber-100 dark:bg-amber-900/30 p-4 rounded-md text-amber-800 dark:text-amber-200 text-sm mb-6">
          <p><strong>Note:</strong> This guide provides general education, not personalized tax advice. 
          Tax laws change frequently, and strategies should be evaluated based on your specific situation. 
          Consult a financial advisor before implementing these strategies.</p>
        </div>
      </>
    )
  }
};

const TaxGuidePage: React.FC = () => {
  const { guideId } = useParams<{ guideId: string }>();
  
  const guide = guideId && guideContent[guideId as keyof typeof guideContent];
  
  if (!guide) {
    return (
      <div className="container content-padding section-margin">
        <div className="mb-6">
          <Button variant="outline" className="mb-4" asChild>
            <Link to="/tax-planning/recommended-reading">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Resources
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight neptune-gold">Guide Not Found</h2>
          <p className="text-muted-foreground">
            The requested guide could not be found. Please return to the resources page.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container content-padding section-margin">
      <div className="mb-6">
        <Button variant="outline" className="mb-4 border-[#9b87f5] text-[#9b87f5]" asChild>
          <Link to="/tax-planning/recommended-reading">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Resources
          </Link>
        </Button>
        
        <h2 className="text-3xl font-bold tracking-tight neptune-gold flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-[#9b87f5]" />
          {guide.title}
        </h2>
        <p className="text-muted-foreground">
          Tax education guide from our recommended resources
        </p>
      </div>
      
      <Card className="mb-6 border border-[#8E9196]">
        <CardHeader className="bg-[#1A1F2C] border-b border-[#333]">
          <CardTitle>Guide Overview</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {guide.content}
        </CardContent>
      </Card>
      
      <Separator className="my-6" />
      
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">
          For more in-depth analysis and personalized guidance, consider our advanced tax planning tools.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" className="border-[#9b87f5] text-[#9b87f5]" asChild>
            <Link to="/tax-planning/recommended-reading">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Resources
            </Link>
          </Button>
          <Button className="bg-[#9b87f5] hover:bg-[#8a76e4]" asChild>
            <Link to="/tax-planning">
              Explore Tax Planning Tools
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaxGuidePage;
