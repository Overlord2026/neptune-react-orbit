import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Check, 
  Calendar, 
  Clock, 
  ArrowRight, 
  CreditCard, 
  Info 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { toast } from "sonner";
import ShareFeature from '@/components/tax-planning/ShareFeature';

const TaxPlanningPricingPage = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  
  const handleStartFreeTrial = () => {
    // Simulating trial activation
    localStorage.setItem('trial_start_date', new Date().toISOString());
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 90);
    localStorage.setItem('trial_end_date', trialEndDate.toISOString());
    localStorage.setItem('is_in_trial', 'true');
    
    toast.success("Your 90-day free trial has started!", {
      description: "You now have full access to all premium features.",
      duration: 5000,
    });
    
    // Redirect to main dashboard
    navigate('/tax-planning');
  };
  
  return (
    <div className="space-y-6 py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tax Planning Pricing</h1>
          <p className="text-muted-foreground mt-2">Start optimizing your tax strategy today.</p>
        </div>
        <ShareFeature 
          title="Tax Planning Pricing" 
          description="Check out these amazing pricing options for tax planning!"
          variant="button"
        />
      </div>
      
      <div className="flex items-center justify-center gap-4 py-8">
        <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-muted-foreground'}`}>
          Monthly
        </span>
        <Switch
          checked={billingCycle === 'annual'}
          onCheckedChange={(checked) => setBillingCycle(checked ? 'annual' : 'monthly')}
        />
        <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-white' : 'text-muted-foreground'}`}>
          Annual
          <span className="ml-1 text-sm font-normal text-[#9b87f5]">(Save 20%)</span>
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free Tier */}
        <Card className="border border-[#2A2F3C] bg-[#1A1F2C]">
          <CardHeader>
            <CardTitle>Basic</CardTitle>
            <CardDescription>Essential tax tools for individuals</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">$0</span>
              <span className="text-muted-foreground ml-1">/forever</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start">
                <Check className="h-4 w-4 mr-2 text-[#00C47C] mt-1" />
                <span>Basic tax education resources</span>
              </div>
              <div className="flex items-start">
                <Check className="h-4 w-4 mr-2 text-[#00C47C] mt-1" />
                <span>Tax glossary access</span>
              </div>
              <div className="flex items-start">
                <Check className="h-4 w-4 mr-2 text-[#00C47C] mt-1" />
                <span>Standard tax filing options</span>
              </div>
              <div className="flex items-start">
                <Check className="h-4 w-4 mr-2 text-[#00C47C] mt-1" />
                <span>Limited tax updates</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/tax-planning">Get Started</Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Premium Tier with 90-Day Trial */}
        <Card className="border-2 border-[#9b87f5] bg-[#1A1F2C] relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#9b87f5] text-white px-4 py-1 rounded-full text-sm font-medium">
            MOST POPULAR
          </div>
          <CardHeader>
            <CardTitle>Premium</CardTitle>
            <CardDescription>Advanced planning for individuals & families</CardDescription>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-3xl font-bold">
                ${billingCycle === 'annual' ? '19' : '24'}
              </span>
              <span className="text-muted-foreground">/{billingCycle === 'annual' ? 'month, billed annually' : 'month'}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-[#9b87f5]/10 border border-[#9b87f5]/30 rounded-md p-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#9b87f5]" />
                <span className="font-medium text-[#9b87f5]">FREE 90-DAY TRIAL</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Full access to all premium features for 90 days, no credit card required
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-start">
                <Check className="h-4 w-4 mr-2 text-[#9b87f5] mt-1" />
                <span>Everything in Basic</span>
              </div>
              <div className="flex items-start">
                <Check className="h-4 w-4 mr-2 text-[#9b87f5] mt-1" />
                <span>Roth conversion analyzer</span>
              </div>
              <div className="flex items-start">
                <Check className="h-4 w-4 mr-2 text-[#9b87f5] mt-1" />
                <span>Advanced tax strategies</span>
              </div>
              <div className="flex items-start">
                <Check className="h-4 w-4 mr-2 text-[#9b87f5] mt-1" />
                <span>QuickBooks & Xero integration</span>
              </div>
              <div className="flex items-start">
                <Check className="h-4 w-4 mr-2 text-[#9b87f5] mt-1" />
                <span>Social Security calculator</span>
              </div>
              <div className="flex items-start">
                <Check className="h-4 w-4 mr-2 text-[#9b87f5] mt-1" />
                <span>Priority tax updates</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button 
              className="w-full bg-[#FFFFFF] text-[#1A1F2C] hover:bg-[#f0f0f0] text-lg py-6 font-semibold" 
              onClick={handleStartFreeTrial}
            >
              Start 90-Day Free Trial <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        {/* Enterprise Tier */}
        <Card className="border border-[#2A2F3C] bg-[#1A1F2C]">
          <CardHeader>
            <CardTitle>Enterprise</CardTitle>
            <CardDescription>Custom solutions for businesses</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">Contact</span>
              <span className="text-muted-foreground ml-1">for pricing</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start">
                <Check className="h-4 w-4 mr-2 text-[#FFD700] mt-1" />
                <span>Everything in Premium</span>
              </div>
              <div className="flex items-start">
                <Check className="h-4 w-4 mr-2 text-[#FFD700] mt-1" />
                <span>Multi-user access</span>
              </div>
              <div className="flex items-start">
                <Check className="h-4 w-4 mr-2 text-[#FFD700] mt-1" />
                <span>Custom API integrations</span>
              </div>
              <div className="flex items-start">
                <Check className="h-4 w-4 mr-2 text-[#FFD700] mt-1" />
                <span>Dedicated support manager</span>
              </div>
              <div className="flex items-start">
                <Check className="h-4 w-4 mr-2 text-[#FFD700] mt-1" />
                <span>Advanced reporting</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10">
              Contact Sales
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="border border-[#2A2F3C] bg-[#1A1F2C] rounded-lg p-4">
            <h3 className="font-medium mb-2">What happens after my 90-day trial ends?</h3>
            <p className="text-sm text-muted-foreground">
              After your trial period ends, you'll be prompted to select a paid subscription plan to continue accessing premium features. 
              No automatic charges - we'll notify you before your trial expires.
            </p>
          </div>
          <div className="border border-[#2A2F3C] bg-[#1A1F2C] rounded-lg p-4">
            <h3 className="font-medium mb-2">Can I cancel my trial at any time?</h3>
            <p className="text-sm text-muted-foreground">
              Yes, you can cancel your trial at any time with no obligations. Your account will remain active until the end of the 90-day trial period.
            </p>
          </div>
          <div className="border border-[#2A2F3C] bg-[#1A1F2C] rounded-lg p-4">
            <h3 className="font-medium mb-2">Do I need a credit card to start my trial?</h3>
            <p className="text-sm text-muted-foreground">
              No, our trial is completely free and doesn't require a credit card to get started. You'll only need to provide payment information when you decide to continue with a paid subscription.
            </p>
          </div>
        </div>
      </div>
      
      <div className="border-t border-[#2A2F3C] pt-6 mt-8">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Info className="h-4 w-4" />
          <p>
            All subscriptions include our <Link to="/security" className="underline">security promise</Link> and expert support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaxPlanningPricingPage;
