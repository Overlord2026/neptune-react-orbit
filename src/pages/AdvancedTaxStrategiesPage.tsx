
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ExternalLink } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ShareFeature from '@/components/tax-planning/ShareFeature';

interface TaxStrategy {
  id: string;
  title: string;
  description: string;
  learnMoreUrl: string;
}

const AdvancedTaxStrategiesPage = () => {
  const strategies: TaxStrategy[] = [
    {
      id: "amt",
      title: "AMT Minimization",
      description: "The Alternative Minimum Tax (AMT) runs parallel to the regular tax system but disallows certain deductions. Strategic timing of income recognition and deductions across tax years can help minimize AMT exposure, especially for high-income earners with significant deductions.",
      learnMoreUrl: "#/amt-resources"
    },
    {
      id: "charitable",
      title: "Charitable Giving / Donor-Advised Funds",
      description: "Donor-Advised Funds allow you to make charitable contributions, receive an immediate tax deduction, and then recommend grants over time. This strategy can be particularly effective for 'bunching' multiple years of charitable giving into a single tax year to exceed the standard deduction threshold.",
      learnMoreUrl: "#/charitable-resources"
    },
    {
      id: "estate",
      title: "Estate & Gift Strategies",
      description: "Effective estate planning can involve annual gift tax exclusions, lifetime exemption planning, and trust structures that minimize estate and gift taxes while ensuring wealth transfers to heirs efficiently. Current estate tax exemptions are historically high but subject to sunset provisions.",
      learnMoreUrl: "#/estate-resources"
    },
    {
      id: "qbi",
      title: "QBI Deductions for Business Owners",
      description: "The Qualified Business Income (QBI) deduction allows eligible business owners to deduct up to 20% of their qualified business income. Understanding the complex phase-out thresholds, specified service businesses limitations, and wage/capital limitations is critical to maximizing this deduction.",
      learnMoreUrl: "#/qbi-resources"
    },
    {
      id: "roth",
      title: "Backdoor Roth IRA Strategies",
      description: "For high-income earners who exceed Roth IRA contribution limits, the 'backdoor' strategy involves making non-deductible traditional IRA contributions followed by Roth conversions. Careful execution and timing are necessary to avoid pro-rata rule complications.",
      learnMoreUrl: "#/roth-resources"
    },
    {
      id: "loss",
      title: "Tax Loss Harvesting",
      description: "Strategically selling investments at a loss to offset capital gains can reduce tax liability. Proper execution includes avoiding wash sale rules while maintaining desired investment exposures through similar but not 'substantially identical' securities.",
      learnMoreUrl: "#/tax-loss-resources"
    }
  ];

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight neptune-gold">Advanced Tax Strategies</h1>
          <p className="text-muted-foreground">Sophisticated approaches to minimize your tax burden and maximize wealth retention.</p>
        </div>
        <div className="flex items-center gap-2">
          <ShareFeature 
            title="Advanced Tax Strategies" 
            description="Discover sophisticated approaches to minimize your tax burden."
            variant="button"
          />
          <Link to="/tax-planning" className="border border-primary hover:bg-primary/10 px-4 py-2 rounded-md text-primary transition-colors w-full sm:w-auto text-center sm:text-left flex items-center justify-center sm:justify-start gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Tax Planning Hub
          </Link>
        </div>
      </div>

      <Card className="bg-card border-primary/20">
        <div className="p-6">
          <p className="text-muted-foreground mb-6">
            These advanced strategies require careful consideration of your specific financial situation and tax profile.
            We recommend consulting with a qualified tax professional before implementation.
          </p>
          
          <Accordion type="single" collapsible className="w-full">
            {strategies.map((strategy) => (
              <AccordionItem key={strategy.id} value={strategy.id} className="border-b border-primary/20">
                <div className="flex items-center justify-between">
                  <AccordionTrigger className="text-lg font-medium neptune-gold hover:no-underline hover:text-primary/90 py-4">
                    {strategy.title}
                  </AccordionTrigger>
                  <ShareFeature 
                    title={strategy.title} 
                    description={`Learn about ${strategy.title} - an advanced tax planning strategy.`}
                  />
                </div>
                <AccordionContent className="pb-4 text-white">
                  <p className="mb-4">{strategy.description}</p>
                  <a 
                    href={strategy.learnMoreUrl} 
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/90 transition-colors"
                  >
                    Learn More <ExternalLink className="h-4 w-4" />
                  </a>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-6 bg-primary/10 border border-primary/20 rounded-md p-4">
            <h3 className="text-lg font-medium neptune-gold mb-2">Need Customized Strategies?</h3>
            <p className="text-muted-foreground mb-4">
              Our tax planning experts can develop personalized strategies aligned with your financial goals and situation.
            </p>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
              Request Consultation
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdvancedTaxStrategiesPage;
