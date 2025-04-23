
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check, RefreshCw, Calendar, Info, Shield, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

interface SoftwareOption {
  name: string;
  description: string;
  isPopular: boolean;
  authUrl?: string;
  connectionStatus?: 'connected' | 'disconnected';
  lastSynced?: string;
}

const AccountingSoftwareIntegration = () => {
  const { toast } = useToast();
  const [softwareOptions, setSoftwareOptions] = useState<SoftwareOption[]>([
    {
      name: "QuickBooks",
      description: "Connect your QuickBooks account to automatically import income and expense data for tax projections.",
      isPopular: true,
      authUrl: "https://appcenter.intuit.com/connect/oauth2",
      connectionStatus: 'disconnected',
    },
    {
      name: "Xero",
      description: "Sync your Xero accounting data to simplify tax filing and ensure accuracy in your deductions.",
      isPopular: false,
      authUrl: "https://login.xero.com/identity/connect/authorize",
      connectionStatus: 'disconnected',
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
  ]);

  // Check for existing connections on component mount
  useEffect(() => {
    checkExistingConnections();
  }, []);

  const checkExistingConnections = () => {
    // This would typically be an API call to check which services are connected
    const quickbooksConnected = localStorage.getItem('quickbooks_connected') === 'true';
    const xeroConnected = localStorage.getItem('xero_connected') === 'true';
    
    if (quickbooksConnected) {
      updateConnectionStatus("QuickBooks", 'connected', new Date().toISOString());
    }
    if (xeroConnected) {
      updateConnectionStatus("Xero", 'connected', new Date().toISOString());
    }
  };

  const updateConnectionStatus = (
    softwareName: string, 
    status: 'connected' | 'disconnected',
    lastSynced?: string
  ) => {
    setSoftwareOptions(prev => 
      prev.map(option => 
        option.name === softwareName 
          ? { ...option, connectionStatus: status, lastSynced } 
          : option
      )
    );
  };

  const handleConnect = (software: SoftwareOption) => {
    if (software.connectionStatus === 'connected') {
      // Handle disconnection
      if (software.name === "QuickBooks") {
        localStorage.removeItem('quickbooks_connected');
        updateConnectionStatus(software.name, 'disconnected');
        toast({
          title: "Disconnected",
          description: `Successfully disconnected from ${software.name}`,
        });
      }
    } else {
      // Handle connection
      if (software.authUrl) {
        const authWindow = window.open(software.authUrl, "_blank", "width=600,height=700");
        
        // Simulate successful OAuth completion after 3 seconds
        setTimeout(() => {
          if (authWindow) authWindow.close();
          
          if (software.name === "QuickBooks") {
            localStorage.setItem('quickbooks_connected', 'true');
            updateConnectionStatus(software.name, 'connected', new Date().toISOString());
            toast({
              title: "Connected",
              description: `Successfully connected to ${software.name}`,
            });
          }
        }, 3000);
      } else {
        toast({
          title: "Coming Soon",
          description: `${software.name} integration is not yet available.`,
        });
      }
    }
  };

  const handleSync = (software: SoftwareOption) => {
    const currentTime = new Date().toISOString();
    updateConnectionStatus(software.name, 'connected', currentTime);
    
    toast({
      title: "Sync Complete",
      description: `Successfully synced data from ${software.name}`,
    });
  };

  return (
    <div className="my-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h2 className="text-2xl font-semibold text-white mb-2 md:mb-0">Accounting Software Integration</h2>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-[#00C47C]" />
              Data Policy
              <ExternalLink className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-[#1A1F2C] border border-[#242A38] text-[#E5E5E5]">
            <div className="space-y-2">
              <h4 className="font-medium">How We Handle Your Data</h4>
              <p className="text-xs text-[#B0B0B0]">
                We use industry-standard encryption and OAuth protocols to ensure your financial data remains secure.
                Your accounting data is only used for tax projections and planning purposes.
              </p>
              <p className="text-xs text-[#B0B0B0]">
                We never store your accounting software passwords. All connections are made using secure OAuth tokens that you can revoke at any time.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {softwareOptions.map((software, index) => (
          <Card key={index} className="overflow-hidden bg-[#1A1F2C] border border-[#242A38] hover:border-[#007BFF] transition-colors">
            <CardHeader className="bg-[#242A38] pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-[#E5E5E5] text-xl">
                  {software.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {software.connectionStatus === 'connected' && (
                    <Badge className="bg-[#00C47C] text-white hover:bg-[#00a067] flex items-center gap-1">
                      Connected <Check className="h-3 w-3" />
                    </Badge>
                  )}
                  {software.isPopular && !software.connectionStatus && (
                    <Badge className="bg-[#007BFF] text-white hover:bg-[#0069d9]">Popular</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-[#B0B0B0] mb-4">
                {software.description}
              </p>
              
              {software.connectionStatus === 'connected' && software.lastSynced && (
                <div className="flex items-center text-xs text-[#B0B0B0] mb-3">
                  <Calendar className="mr-1 h-3 w-3" /> 
                  <span>Last synced: {new Date(software.lastSynced).toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex gap-2">
                {software.connectionStatus === 'connected' ? (
                  <>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline"
                            className="text-[#007BFF] border-[#353e52] hover:bg-[#242A38] hover:border-[#007BFF] flex-1"
                            onClick={() => handleSync(software)}
                          >
                            Sync Now
                            <RefreshCw className="h-4 w-4 ml-2" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Fetch the latest data from {software.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <Button 
                      variant="outline"
                      className="text-[#00C47C] border-[#353e52] hover:bg-[#242A38] hover:border-[#00C47C]"
                      onClick={() => handleConnect(software)}
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="outline"
                    className="text-[#007BFF] border-[#353e52] hover:bg-[#242A38] hover:border-[#007BFF] group w-full"
                    onClick={() => handleConnect(software)}
                  >
                    Connect
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}
              </div>

              {!software.connectionStatus && (
                <div className="flex items-start mt-2 space-x-1.5">
                  <Info className="h-3.5 w-3.5 text-[#808080] mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-[#808080]">
                    By connecting, you grant us permission to access your financial data for tax projections. 
                    Your credentials are protected by OAuth; we never store your password.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AccountingSoftwareIntegration;
