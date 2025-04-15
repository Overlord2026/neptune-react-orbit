
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, X, MessageSquareText, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TaxToolsGuidanceProps {
  onHideForever: () => void;
}

const TaxToolsGuidance: React.FC<TaxToolsGuidanceProps> = ({ onHideForever }) => {
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [chatPrompt, setChatPrompt] = useState<string>('');
  const [showChatBox, setShowChatBox] = useState<boolean>(false);
  const { toast } = useToast();
  
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple keyword matching for demonstration
    const lowercasePrompt = chatPrompt.toLowerCase();
    let redirectTool = '';
    
    if (lowercasePrompt.includes('roth') || lowercasePrompt.includes('conversion') || lowercasePrompt.includes('ira')) {
      redirectTool = 'Roth Conversion';
    } else if (lowercasePrompt.includes('estate') || lowercasePrompt.includes('gifting') || lowercasePrompt.includes('inheritance')) {
      redirectTool = 'Estate & Gifting';
    } else if (lowercasePrompt.includes('charit') || lowercasePrompt.includes('donation') || lowercasePrompt.includes('giving')) {
      redirectTool = 'Charitable Planning';
    } else if (lowercasePrompt.includes('business') || lowercasePrompt.includes('self-employ') || lowercasePrompt.includes('side hustle')) {
      redirectTool = 'Small Business';
    } else if (lowercasePrompt.includes('stock') || lowercasePrompt.includes('option') || lowercasePrompt.includes('defer')) {
      redirectTool = 'Deferred Comp';
    } else if (lowercasePrompt.includes('document') || lowercasePrompt.includes('vault') || lowercasePrompt.includes('store')) {
      redirectTool = 'Tax Vault';
    }
    
    if (redirectTool) {
      toast({
        title: `It sounds like you need the ${redirectTool} tool`,
        description: `We recommend starting with the ${redirectTool} tool based on your needs.`,
        duration: 5000,
      });
      // Scroll to the tool card
      const element = document.getElementById(redirectTool.toLowerCase().replace(/[^a-z0-9]/g, '-'));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          element.classList.add('highlight-pulse');
          setTimeout(() => element.classList.remove('highlight-pulse'), 2000);
        }, 500);
      }
    } else {
      toast({
        title: "Not sure which tool you need?",
        description: "Try watching our overview video or try with more specific terms like 'Roth conversion' or 'estate planning'.",
        duration: 5000,
      });
    }
    
    setChatPrompt('');
  };
  
  return (
    <Card className="bg-[#1A1F2C] border-[#353e52] mb-6 relative overflow-hidden">
      <div className="absolute top-2 right-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-muted-foreground hover:text-white"
          onClick={onHideForever}
          title="Don't show again"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="md:w-2/3 space-y-4">
            <h3 className="text-xl font-medium text-[#FFD700]">
              New to Tax Planning Tools?
            </h3>
            <p className="text-sm text-[#B0B0B0]">
              Not sure which tool is right for your needs? We can help you find the right starting point.
            </p>
            
            <div className="flex flex-wrap gap-3 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowVideo(!showVideo)} 
                className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10"
              >
                <Play className="mr-2 h-4 w-4" />
                Watch 2-minute overview
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setShowChatBox(!showChatBox)}
                className="border-primary text-primary hover:bg-primary/10"
              >
                <MessageSquareText className="mr-2 h-4 w-4" />
                Which tool do I need?
              </Button>
            </div>
            
            {showChatBox && (
              <form onSubmit={handleChatSubmit} className="mt-4 flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={chatPrompt}
                    onChange={(e) => setChatPrompt(e.target.value)}
                    placeholder="Ex: I want to plan charitable giving..."
                    className="w-full p-2 pr-10 rounded-md bg-[#242A38] border-[#353e52] text-white placeholder:text-gray-400 focus:border-[#00C47C] focus:ring-1 focus:ring-[#00C47C] focus:outline-none"
                  />
                  <HelpCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <Button type="submit">Find Tool</Button>
              </form>
            )}
          </div>
          
          {showVideo && (
            <div className="md:w-1/3 relative aspect-video min-h-[200px] w-full bg-black/50 rounded-md flex items-center justify-center">
              {/* In a real implementation, this would be replaced with an actual video embed */}
              <div className="text-center p-4">
                <Play className="mx-auto h-12 w-12 text-[#FFD700] opacity-75" />
                <p className="mt-2 text-sm text-gray-300">
                  Video placeholder - In production, an actual video would be embedded here
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxToolsGuidance;
