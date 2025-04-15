
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import TaxTools from '@/components/tax-planning/TaxTools';
import ImportFromTaxReturn from '@/components/tax-planning/ImportFromTaxReturn';
import OnboardingModal from '@/components/tax-planning/OnboardingModal';
import TaxToolsGuidance from '@/components/tax-planning/TaxToolsGuidance';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useToast } from '@/hooks/use-toast';

const TaxToolsPage: React.FC = () => {
  const { toast } = useToast();
  const { showOnboarding, completeOnboarding, resetOnboarding } = useOnboarding();
  const [showGuidance, setShowGuidance] = useState<boolean>(true);
  
  // Check local storage for user preference on guidance visibility
  useEffect(() => {
    const hasHiddenGuidance = localStorage.getItem('hideTaxToolsGuidance') === 'true';
    if (hasHiddenGuidance) {
      setShowGuidance(false);
    }
  }, []);
  
  const handleHideGuidanceForever = () => {
    localStorage.setItem('hideTaxToolsGuidance', 'true');
    setShowGuidance(false);
  };
  
  const handleDataImported = (data: any) => {
    console.log("Tax return data imported:", data);
    toast({
      title: "Data imported",
      description: "You can now use this data in your tax planning scenarios.",
    });
    // In a real implementation, this data would be used to initialize
    // scenarios or stored in a context for use across the application
  };

  const handleReplayOnboarding = () => {
    resetOnboarding();
  };
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Tax Tools</h1>
          <p className="text-lg text-muted-foreground">
            Access powerful scenarios for Roth conversions, multi-year planning, tax trap checks, and more.
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 text-primary hover:text-primary/80"
          onClick={handleReplayOnboarding}
        >
          <RefreshCw className="h-4 w-4" /> Replay Intro
        </Button>
      </div>
      
      {/* Guidance Component */}
      {showGuidance && (
        <TaxToolsGuidance onHideForever={handleHideGuidanceForever} />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <TaxTools />
        </div>
        
        <div className="space-y-4">
          <Card className="bg-[#1A1F2C] border-[#353e52]">
            <CardHeader>
              <CardTitle className="text-lg text-primary">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ImportFromTaxReturn onDataImported={handleDataImported} />
            </CardContent>
          </Card>
          
          <Card className="bg-[#1A1F2C] border-[#353e52]">
            <CardHeader>
              <CardTitle className="text-lg text-primary">Recent Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                Your recently accessed documents from the Tax Vault will appear here.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Onboarding Modal */}
      <OnboardingModal 
        isOpen={showOnboarding} 
        onClose={completeOnboarding} 
      />
    </div>
  );
};

export default TaxToolsPage;
