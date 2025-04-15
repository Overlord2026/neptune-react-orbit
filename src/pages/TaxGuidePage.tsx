
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  BookOpen, 
  ArrowRight, 
  Share2,
  BookMarked
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Sample guide content data - in a real app, this would come from an API or database
const guides = {
  'understanding-tax-brackets': {
    title: 'Understanding Tax Brackets',
    category: 'Basic Education',
    author: 'Tax Planning Team',
    publishDate: '2025-03-15',
    estimatedReadTime: '6 min read',
    content: `
      <h2>Understanding Tax Brackets</h2>
      <p>Tax brackets are the income ranges that determine your tax rate. The U.S. employs a progressive tax system, meaning different portions of your income are taxed at different rates.</p>
      <h3>How Tax Brackets Work</h3>
      <p>Your income doesn't all get taxed at one rate. Instead, it's divided into chunks, with each chunk taxed at its corresponding rate. This is why they're called "marginal" tax rates—they apply only to the income within that specific margin or bracket.</p>
      <p>For 2025, there are seven federal income tax brackets: 10%, 12%, 22%, 24%, 32%, 35%, and 37%. Which brackets you fall into depends on your taxable income and filing status.</p>
      <h3>Example of Marginal Tax Rates</h3>
      <p>If you're single with a taxable income of $50,000 in 2025:</p>
      <ul>
        <li>The first $11,000 is taxed at 10% = $1,100</li>
        <li>Income from $11,001 to $44,725 is taxed at 12% = $4,047</li>
        <li>Income from $44,726 to $50,000 is taxed at 22% = $1,160</li>
        <li>Total federal income tax: $6,307</li>
      </ul>
      <p>Your highest bracket (22%) is your "marginal tax rate," but your "effective tax rate" is lower—about 12.6% ($6,307 ÷ $50,000).</p>
      <h3>Strategies for Tax Bracket Management</h3>
      <p>Understanding your tax brackets allows for strategic planning:</p>
      <ul>
        <li>Timing income recognition across tax years</li>
        <li>Using retirement account contributions to lower taxable income</li>
        <li>Harvesting investment losses to offset gains</li>
        <li>Considering Roth conversions when in lower tax brackets</li>
      </ul>
      <h3>Tax Bracket Changes</h3>
      <p>Under current law, some tax provisions from the Tax Cuts and Jobs Act will expire after 2025, potentially pushing some taxpayers into higher brackets in 2026. This makes tax planning in 2025 especially important.</p>
    `
  },
  'roth-vs-traditional': {
    title: 'Roth vs. Traditional Retirement Accounts',
    category: 'Retirement Planning',
    author: 'Retirement Planning Team',
    publishDate: '2025-02-28',
    estimatedReadTime: '8 min read',
    content: `
      <h2>Roth vs. Traditional Retirement Accounts: Which Is Right For You?</h2>
      <p>One of the most common questions in retirement planning is whether to choose Roth or Traditional retirement accounts. Both offer tax advantages, but they work differently and may be better suited for different situations.</p>
      <h3>Traditional IRAs and 401(k)s</h3>
      <p>With Traditional accounts, contributions are typically tax-deductible in the year they're made, reducing your current taxable income. The investments grow tax-deferred, and you pay ordinary income tax on withdrawals in retirement.</p>
      <h3>Roth IRAs and Roth 401(k)s</h3>
      <p>With Roth accounts, contributions are made with after-tax dollars, so there's no immediate tax deduction. However, the investments grow tax-free, and qualified withdrawals in retirement are completely tax-free.</p>
      <h3>Key Factors in Choosing Between Them</h3>
      <ul>
        <li><strong>Current vs. Future Tax Rates</strong>: If you expect to be in a higher tax bracket in retirement than you are now, Roth accounts tend to be more advantageous.</li>
        <li><strong>Time Horizon</strong>: Younger investors often benefit more from Roth accounts due to decades of tax-free growth.</li>
        <li><strong>Tax Diversification</strong>: Having both types of accounts provides flexibility in retirement to manage your tax liability.</li>
        <li><strong>Required Minimum Distributions</strong>: Traditional accounts require RMDs starting at age 73 (in 2025), while Roth IRAs do not.</li>
      </ul>
      <h3>Strategic Considerations</h3>
      <p>Consider converting Traditional IRA funds to a Roth IRA in years when your income is lower, as you'll pay less tax on the conversion. This strategy, known as a Roth conversion ladder, can be particularly effective for early retirees.</p>
      <p>Remember that Roth contributions can be withdrawn at any time without penalty, making them more flexible for emergency needs before retirement.</p>
    `
  },
  'tax-loss-harvesting': {
    title: 'Tax-Loss Harvesting Strategies',
    category: 'Investment Planning',
    author: 'Investment Team',
    publishDate: '2025-01-10',
    estimatedReadTime: '7 min read',
    content: `
      <h2>Tax-Loss Harvesting Strategies</h2>
      <p>Tax-loss harvesting is a strategy that can help lower your tax bill while maintaining your investment position. It involves selling investments that have lost value to offset capital gains from other investments.</p>
      <h3>How Tax-Loss Harvesting Works</h3>
      <p>When you sell an investment for less than you paid for it, you realize a capital loss. These losses can offset capital gains from other investments, potentially reducing your tax liability. If your losses exceed your gains, you can use up to $3,000 of the excess to reduce your ordinary income, with any remaining losses carried forward to future tax years.</p>
      <h3>Strategic Implementation</h3>
      <ul>
        <li><strong>Timing Matters</strong>: Consider harvesting losses near year-end when you have a clearer picture of your overall tax situation.</li>
        <li><strong>Watch for Wash Sale Rules</strong>: Avoid buying a "substantially identical" investment within 30 days before or after selling at a loss, or the IRS will disallow the loss.</li>
        <li><strong>Maintain Asset Allocation</strong>: Replace sold investments with similar (but not identical) investments to maintain your desired asset allocation.</li>
        <li><strong>Consider Tax Lots</strong>: Sell specific lots with the highest cost basis to maximize losses while minimizing the impact on your portfolio.</li>
      </ul>
      <h3>Advanced Strategies</h3>
      <p>Tax-loss harvesting isn't just for bear markets. Even in rising markets, portions of your portfolio may underperform, providing tax-loss harvesting opportunities.</p>
      <p>Consider "tax-gain harvesting" if you're in the 0% capital gains bracket—selling winners to reset your cost basis higher without triggering tax liability.</p>
      <p>Remember that tax-loss harvesting is most valuable in taxable brokerage accounts—it doesn't apply to IRAs, 401(k)s, or other tax-advantaged accounts where gains and losses aren't taxed annually.</p>
    `
  }
};

const TaxGuidePage: React.FC = () => {
  const { guideId } = useParams<{ guideId: string }>();
  const guide = guides[guideId as keyof typeof guides];
  
  if (!guide) {
    return (
      <div className="container mx-auto py-6 space-y-4">
        <div className="flex items-center justify-between">
          <Link to="/tax-planning/recommended-reading">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Reading List
            </Button>
          </Link>
        </div>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-white">Guide Not Found</h1>
          <p className="text-muted-foreground mt-2">
            The requested tax guide could not be found.
          </p>
          <Link to="/tax-planning/recommended-reading" className="mt-6 inline-block">
            <Button>View All Tax Guides</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/tax-planning/recommended-reading">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Reading List
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <BookMarked className="h-4 w-4" /> Save
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" /> Share
          </Button>
        </div>
      </div>
      
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-white neptune-gold">{guide.title}</h1>
        <div className="flex flex-wrap items-center text-sm text-muted-foreground mt-2 gap-x-4 gap-y-1">
          <span className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" /> {guide.category}
          </span>
          <span>{guide.author}</span>
          <span>Published {guide.publishDate}</span>
          <span>{guide.estimatedReadTime}</span>
        </div>
      </div>
      
      <div className="prose prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: guide.content }} />
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t">
        <Link to="/tax-planning/recommended-reading">
          <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
            <ArrowLeft className="h-4 w-4" /> Back to Reading List
          </Button>
        </Link>
        
        <Button className="flex items-center gap-2 w-full sm:w-auto bg-primary">
          Next Article <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      <Card className="bg-card border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/20 p-3 rounded-full">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-lg text-white">Related Tax Guides</h3>
              <div className="grid gap-2 mt-2">
                <Link to="/tax-planning/guides/roth-vs-traditional" className="text-primary hover:underline">
                  Roth vs. Traditional Retirement Accounts
                </Link>
                <Link to="/tax-planning/guides/tax-loss-harvesting" className="text-primary hover:underline">
                  Tax-Loss Harvesting Strategies
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxGuidePage;
