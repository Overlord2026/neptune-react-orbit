
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AccountingSoftwareIntegration = () => {
  const softwareOptions = [
    {
      name: "QuickBooks",
      description: "Connect your QuickBooks account to automatically import income and expense data for tax projections.",
      isPopular: true,
    },
    {
      name: "Xero",
      description: "Sync your Xero accounting data to simplify tax filing and ensure accuracy in your deductions.",
      isPopular: false,
    },
    {
      name: "Wave",
      description: "Link your Wave account for seamless integration of your financial data with our tax planning tools.",
      isPopular: false,
    },
    {
      name: "FreshBooks",
      description: "Import your FreshBooks data to streamline tax preparation and maximize potential deductions.",
      isPopular: true,
    },
  ];

  return (
    <div className="my-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h2 className="text-2xl font-semibold text-white mb-2 md:mb-0">Accounting Software Integration</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {softwareOptions.map((software, index) => (
          <Card key={index} className="overflow-hidden bg-[#1A1F2C] border border-[#242A38] hover:border-[#007BFF] transition-colors">
            <CardHeader className="bg-[#242A38] pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-[#E5E5E5] text-xl">
                  {software.name}
                </CardTitle>
                {software.isPopular && (
                  <Badge className="bg-[#007BFF] text-white hover:bg-[#0069d9]">Popular</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-[#B0B0B0] mb-4">
                {software.description}
              </p>
              <Button 
                variant="outline" 
                className="w-full text-[#007BFF] border-[#353e52] hover:bg-[#242A38] hover:border-[#007BFF] group"
              >
                Connect
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AccountingSoftwareIntegration;
