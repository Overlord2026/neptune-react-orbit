import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileCheck, CreditCard } from "lucide-react";
import EducationResources from '@/components/tax-planning/EducationResources';
import TaxTools from '@/components/tax-planning/TaxTools';
import TaxUpdateDemo from '@/components/tax/TaxUpdateDemo';
import AccountingSoftwareIntegration from '@/components/tax-planning/AccountingSoftwareIntegration';
import OnboardingModal from '@/components/tax-planning/OnboardingModal';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ShareFeature from '@/components/tax-planning/ShareFeature';
import SubscriptionBanner from '@/components/tax-planning/SubscriptionBanner';

const TaxPlanningLandingPage = () => {
  const [isEducationOpen, setIsEducationOpen] = useState<boolean>(true);
  const [isInTrial, setIsInTrial] = useState<boolean>(false);
  const { showOnboarding, completeOnboarding } = useOnboarding();
  
  useEffect(() => {
    const trialStatus = localStorage.getItem('is_in_trial') === 'true';
    setIsInTrial(trialStatus);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <div className="space-y-0.5">
          <h2 className="text-3xl font-semibold tracking-tight text-white flex items-center gap-2">
            <FileCheck className="w-8 h-8 text-[#00C47C]" />
            Tax Planning Hub
          </h2>
          <p className="text-[#B0B0B0]">
            Optimize your tax strategy with our suite of advanced tools.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isInTrial && (
            <Button 
              variant="outline" 
              size="sm" 
              className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/10"
              asChild
            >
              <Link to="/pricing">
                <CreditCard className="h-4 w-4 mr-2" />
                Start Free Trial
              </Link>
            </Button>
          )}
          <ShareFeature 
            title="Tax Planning Hub" 
            description="Optimize your tax strategy with our advanced planning tools."
            variant="button"
          />
        </div>
      </div>
      
      <SubscriptionBanner />
      
      <div className="py-4 space-y-8">
        <Card className="border border-[#2A2F3C] bg-[#1A1F2C] relative">
          <ShareFeature title="Education Resources" position="top-right" />
          <CardHeader>
            <CardTitle className="text-[#E5E5E5]">Education Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <EducationResources 
              isOpen={isEducationOpen}
              onOpenChange={setIsEducationOpen}
            />
          </CardContent>
        </Card>
        
        <Card className="border border-[#2A2F3C] bg-[#1A1F2C] relative">
          <ShareFeature title="Tax Tools" position="top-right" />
          <CardHeader>
            <CardTitle className="text-[#E5E5E5]">Tax Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <TaxTools />
          </CardContent>
        </Card>
        
        <Card className="border border-[#2A2F3C] bg-[#1A1F2C] relative">
          <ShareFeature title="Software Integration" position="top-right" />
          <CardHeader>
            <CardTitle className="text-[#E5E5E5]">Software Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <AccountingSoftwareIntegration />
          </CardContent>
        </Card>
        
        <Card className="border border-[#2A2F3C] bg-[#1A1F2C] relative">
          <ShareFeature title="Tax Updates" position="top-right" />
          <CardHeader>
            <CardTitle className="text-[#E5E5E5]">Tax Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <TaxUpdateDemo userId="current-user" />
          </CardContent>
        </Card>
        
        <Card className="border border-[#2A2F3C] bg-[#1A1F2C] relative">
          <ShareFeature title="Software Integration" position="top-right" />
          <CardHeader>
            <CardTitle className="text-[#E5E5E5]">Software Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <AccountingSoftwareIntegration />
          </CardContent>
        </Card>
      </div>
      
      {!isInTrial && (
        <Card className="border-[#9b87f5]/30 bg-[#9b87f5]/5">
          <CardHeader>
            <CardTitle className="text-[#9b87f5]">Ready to unlock all premium features?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Start your free 90-day trial today and get full access to our premium tax planning tools.
              No credit card required.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="bg-[#9b87f5] hover:bg-[#8a76e4]">
              <Link to="/pricing">Start Free 90-Day Trial</Link>
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Onboarding Modal */}
      <OnboardingModal 
        isOpen={showOnboarding} 
        onClose={completeOnboarding} 
      />
    </div>
  );
};

export default TaxPlanningLandingPage;
