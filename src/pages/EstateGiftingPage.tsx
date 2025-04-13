
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Gift, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import EstateGiftingWizard from '@/components/estate-gifting/EstateGiftingWizard';

const EstateGiftingPage: React.FC = () => {
  const [showWizard, setShowWizard] = useState(false);
  
  if (showWizard) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Estate & Gifting Analysis Wizard</h1>
            <p className="text-muted-foreground">
              Compare lifetime gifting vs. inheritance scenarios
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => setShowWizard(false)}
          >
            <ArrowLeft className="h-4 w-4" /> Back to Options
          </Button>
        </div>

        <EstateGiftingWizard />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Estate & Gifting Scenarios</h1>
          <p className="text-muted-foreground">
            Analyze the impact of gifting during your lifetime vs. leaving assets at death
          </p>
        </div>
        <Link to="/tax-planning/tax-tools">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Tax Tools
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-[#2A2F3C] bg-[#1A1F2C]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-[#FFD700]" />
              Lifetime Gifting Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#B0B0B0] mb-4">
              Evaluate the tax implications of making gifts during your lifetime, including annual exclusion gifts 
              and lifetime exemption usage.
            </p>
            <Button 
              className="w-full mt-4 flex items-center justify-between"
              onClick={() => setShowWizard(true)}
            >
              Start Gifting Analysis <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="border-[#2A2F3C] bg-[#1A1F2C]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-[#FFD700]" />
              Estate Planning Wizard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#B0B0B0] mb-4">
              Project potential estate taxes and evaluate strategies for minimizing tax burden 
              on your beneficiaries through various planning techniques.
            </p>
            <Button 
              className="w-full mt-4 flex items-center justify-between"
              onClick={() => setShowWizard(true)}
            >
              Start Estate Planning <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#2A2F3C] bg-[#1A1F2C]">
        <CardHeader>
          <CardTitle>Comparison Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[#B0B0B0] mb-4">
            Compare the tax implications of different gifting and estate planning strategies side by side.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <h3 className="text-white font-medium">Lifetime Gifting Benefits:</h3>
              <ul className="list-disc pl-5 text-sm text-[#B0B0B0]">
                <li>Remove future appreciation from estate</li>
                <li>Annual exclusion gifts ($17,000 in 2023)</li>
                <li>Direct payment of medical/educational expenses</li>
                <li>Asset basis considerations</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-white font-medium">Estate Planning Benefits:</h3>
              <ul className="list-disc pl-5 text-sm text-[#B0B0B0]">
                <li>Step-up in basis at death</li>
                <li>Trust structures for control</li>
                <li>Charitable remainder trusts</li>
                <li>Life insurance trusts</li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button 
              size="lg"
              onClick={() => setShowWizard(true)}
            >
              Start Comparison Analysis
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[#2A2F3C] bg-[#1A1F2C]">
        <CardHeader>
          <CardTitle>Important Disclaimers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[#B0B0B0]">
            Estate tax laws are subject to change. The federal lifetime gift and estate tax exemption 
            is scheduled to sunset after 2025, potentially reducing from the current level. This tool provides 
            estimates only and should not be considered legal or tax advice. Please consult with qualified 
            estate planning professionals before implementing any strategies.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstateGiftingPage;
