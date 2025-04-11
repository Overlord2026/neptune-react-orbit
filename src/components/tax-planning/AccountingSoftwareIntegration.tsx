
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check, RefreshCw, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
      authUrl: "https://appcenter.intuit.com/connect/oauth2?client_id=ABCxyz123&redirect_uri=https://your-app.com/api/quickbooks/callback&response_type=code&scope=com.intuit.quickbooks.accounting",
      connectionStatus: 'disconnected',
    },
    {
      name: "Xero",
      description: "Sync your Xero accounting data to simplify tax filing and ensure accuracy in your deductions.",
      isPopular: false,
      authUrl: "https://login.xero.com/identity/connect/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=https://your-app.com/api/xero/callback&response_type=code&scope=accounting.transactions",
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
    // This would typically be an API call to your backend to check connection status
    checkExistingConnections();
  }, []);

  const checkExistingConnections = () => {
    // In a real implementation, this would be an API call to check which services are connected
    // For demo purposes, we'll check localStorage
    const quickbooksConnected = localStorage.getItem('quickbooks_connected') === 'true';
    const xeroConnected = localStorage.getItem('xero_connected') === 'true';
    
    // Check for connection timestamps
    const quickbooksLastSynced = localStorage.getItem('quickbooks_last_synced');
    const xeroLastSynced = localStorage.getItem('xero_last_synced');
    
    if (quickbooksConnected) {
      updateConnectionStatus("QuickBooks", 'connected', quickbooksLastSynced || getCurrentTimestamp());
    }
    
    if (xeroConnected) {
      updateConnectionStatus("Xero", 'connected', xeroLastSynced || getCurrentTimestamp());
    }
  };

  const getCurrentTimestamp = () => {
    return new Date().toISOString();
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const updateConnectionStatus = (
    softwareName: string, 
    status: 'connected' | 'disconnected', 
    lastSynced?: string
  ) => {
    setSoftwareOptions(prevOptions => 
      prevOptions.map(option => 
        option.name === softwareName 
          ? { 
              ...option, 
              connectionStatus: status,
              lastSynced: status === 'connected' ? (lastSynced || getCurrentTimestamp()) : undefined
            } 
          : option
      )
    );
  };

  const handleConnect = (software: SoftwareOption) => {
    if (software.connectionStatus === 'connected') {
      // Handle disconnection
      if (software.name === "QuickBooks") {
        // In production, this would call your API to revoke tokens
        localStorage.removeItem('quickbooks_connected');
        localStorage.removeItem('quickbooks_last_synced');
        updateConnectionStatus(software.name, 'disconnected');
        toast({
          title: "Disconnected",
          description: `Successfully disconnected from ${software.name}`,
        });
      } else if (software.name === "Xero") {
        // In production, this would call your API to revoke tokens
        localStorage.removeItem('xero_connected');
        localStorage.removeItem('xero_last_synced');
        updateConnectionStatus(software.name, 'disconnected');
        toast({
          title: "Disconnected",
          description: `Successfully disconnected from ${software.name}`,
        });
      }
    } else {
      // Handle connection
      if ((software.name === "QuickBooks" || software.name === "Xero") && software.authUrl) {
        // Open OAuth window
        const authWindow = window.open(software.authUrl, "_blank", "width=600,height=700");
        
        // In a real implementation, the OAuth callback would set the connection status
        // For this demo, we'll simulate a successful connection after 3 seconds
        setTimeout(() => {
          if (authWindow) {
            // The window would normally close itself after OAuth completion
            authWindow.close();
          }
          
          // Simulate successful OAuth completion
          const currentTime = getCurrentTimestamp();
          
          if (software.name === "QuickBooks") {
            localStorage.setItem('quickbooks_connected', 'true');
            localStorage.setItem('quickbooks_last_synced', currentTime);
          } else if (software.name === "Xero") {
            localStorage.setItem('xero_connected', 'true');
            localStorage.setItem('xero_last_synced', currentTime);
          }
          
          updateConnectionStatus(software.name, 'connected', currentTime);
          toast({
            title: "Connected",
            description: `Successfully connected to ${software.name}`,
          });
        }, 3000);
      } else {
        // For other services without implementation yet
        toast({
          title: "Integration Coming Soon",
          description: `${software.name} integration is not yet available.`,
        });
      }
    }
  };

  const handleSync = (software: SoftwareOption) => {
    // In a real implementation, this would call your API to sync data from the accounting software
    const currentTime = getCurrentTimestamp();
    
    if (software.name === "QuickBooks") {
      localStorage.setItem('quickbooks_last_synced', currentTime);
    } else if (software.name === "Xero") {
      localStorage.setItem('xero_last_synced', currentTime);
    }
    
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
                  <span>Last synced: {formatTimestamp(software.lastSynced)}</span>
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
                            <RefreshCw className="h-4 w-4" />
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AccountingSoftwareIntegration;
