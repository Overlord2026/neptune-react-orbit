
import React from "react";
import { EquityCompWizard } from "@/components/deferred-comp/EquityCompWizard";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoIcon } from "lucide-react";

const DeferredCompPage = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">
          Deferred Comp & Stock Option Analysis
        </h1>
        <p className="text-lg text-muted-foreground">
          Plan how exercising stock options or deferring bonuses affects your taxable income and optimize your tax strategy.
        </p>
      </div>
      
      <div className="p-4 bg-blue-900/20 border border-blue-800/30 rounded-md">
        <div className="flex items-start space-x-3">
          <InfoIcon className="h-5 w-5 flex-shrink-0 mt-1 text-blue-400" />
          <div>
            <h4 className="text-sm font-medium text-blue-400">Tax Planning Tool</h4>
            <p className="text-sm text-blue-200/80 mt-1">
              This tool helps you understand the tax implications of stock option exercises and bonus deferrals. It calculates 
              potential tax impacts including ordinary income, alternative minimum tax (AMT) for ISOs, and tax bracket changes.
              For personalized advice, please consult with a tax professional.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="wizard" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="wizard">Tax Analysis Wizard</TabsTrigger>
          <TabsTrigger value="info">About Equity Compensation</TabsTrigger>
        </TabsList>
        <TabsContent value="wizard" className="pt-6">
          <Card className="border-[#2A2F3C] bg-[#1A1F2C] p-6">
            <EquityCompWizard />
          </Card>
        </TabsContent>
        <TabsContent value="info" className="pt-6">
          <Card className="border-[#2A2F3C] bg-[#1A1F2C] p-6">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Understanding Equity Compensation Options</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-lg font-medium text-white">Nonqualified Stock Options (NSOs)</h4>
                  <p className="text-sm text-muted-foreground">
                    When exercised, NSOs create ordinary income equal to the "spread" (difference between fair market value 
                    and strike price). This income is subject to ordinary income tax rates and appears on your W-2.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-lg font-medium text-white">Incentive Stock Options (ISOs)</h4>
                  <p className="text-sm text-muted-foreground">
                    ISOs offer potential tax benefits if held for qualifying periods (1+ year after exercise and 2+ years after grant).
                    However, they may trigger Alternative Minimum Tax (AMT) in the exercise year. If sold before the qualifying periods
                    (disqualifying disposition), they're treated like NSOs for tax purposes.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-lg font-medium text-white">Deferred Compensation</h4>
                  <p className="text-sm text-muted-foreground">
                    Deferring bonuses can shift income recognition to future tax years. This may help avoid entering a higher tax bracket
                    or triggering Medicare IRMAA surcharges in the current year. The potential benefit depends on your expected future
                    income and tax rates.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-lg font-medium text-white">Tax Considerations</h4>
                  <p className="text-sm text-muted-foreground">
                    Equity compensation decisions can have significant tax implications. Consider how exercises or deferrals may:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Push you into a higher tax bracket</li>
                    <li>Trigger Medicare IRMAA surcharges (for those 65+)</li>
                    <li>Create AMT liability (for ISOs)</li>
                    <li>Affect your ability to make retirement account contributions</li>
                    <li>Impact eligibility for certain tax credits or deductions</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeferredCompPage;
