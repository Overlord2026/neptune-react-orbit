
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ShareFeature from "@/components/tax-planning/ShareFeature";

const RothConversionPage = () => {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row items-center justify-between pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight neptune-gold">
            Roth IRA Conversion
          </h1>
          <p className="text-muted-foreground">
            Learn about converting your Traditional IRA funds to a Roth IRA to potentially save on taxes in retirement.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ShareFeature 
            title="Roth IRA Conversion" 
            description="Learn about Roth IRA conversion strategies and tax implications."
            variant="button"
          />
          <Link to="/tax-planning" className="border border-primary hover:bg-primary/10 px-4 py-2 rounded-md text-primary transition-colors flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Tax Planning Hub
          </Link>
        </div>
      </div>
      
      <Card className="bg-card border-primary/20 relative">
        <ShareFeature title="Roth Conversion Basics" position="top-right" />
        <CardHeader>
          <CardTitle className="text-xl neptune-gold">
            Roth Conversion Basics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            A Roth IRA conversion involves transferring retirement funds from a Traditional IRA, 401(k), or similar tax-deferred account to a Roth IRA. 
            While you'll pay taxes on the converted amount in the current year, all future qualified withdrawals will be tax-free.
          </p>
          <p className="text-muted-foreground">
            This strategy can be particularly beneficial if:
          </p>
          <ul className="list-disc pl-5 text-muted-foreground space-y-2">
            <li>You expect to be in a higher tax bracket in retirement</li>
            <li>You want tax-free income during retirement</li>
            <li>You want to leave tax-free assets to your heirs</li>
            <li>You're currently in a temporarily lower tax bracket</li>
          </ul>
        </CardContent>
      </Card>
      
      <Card className="bg-card border-primary/20 relative">
        <ShareFeature title="Tax Implications" position="top-right" />
        <CardHeader>
          <CardTitle className="text-xl neptune-gold">
            Tax Implications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            When you convert funds from a Traditional IRA to a Roth IRA, you'll need to pay income tax on the converted amount.
            However, once the money is in the Roth IRA, it grows tax-free and qualified withdrawals are tax-free.
          </p>
          <div className="p-4 rounded-md bg-primary/10 border border-primary/20">
            <h3 className="font-semibold neptune-gold mb-2">Important Considerations</h3>
            <ul className="list-disc pl-5 text-muted-foreground space-y-2">
              <li>Converted amounts are added to your taxable income for the year</li>
              <li>This may push you into a higher tax bracket</li>
              <li>Consider converting smaller amounts over several years</li>
              <li>Consult with a tax professional before making large conversions</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center mt-6">
        <Button variant="outline" className="mr-2">
          <Link to="/tax-planning/roth-conversion">Use Roth Conversion Analyzer</Link>
        </Button>
        <Button className="bg-[#9b87f5] hover:bg-[#8a76e4]">
          <Link to="/tax-planning/roth-analysis">Compare Conversion Scenarios</Link>
        </Button>
      </div>
    </div>
  );
};

export default RothConversionPage;
