
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface SoftwareOption {
  name: string;
  description: string;
  isPopular: boolean;
  authUrl?: string;
  connectionStatus?: 'connected' | 'disconnected';
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
    
    if (quickbooksConnected) {
      updateConnectionStatus("QuickBooks", 'connected');
    }
    
    if (xeroConnected) {
      updateConnectionStatus("Xero", 'connected');
    }
  };

  const updateConnectionStatus = (softwareName: string, status: 'connected' | 'disconnected') => {
    setSoftwareOptions(prevOptions => 
      prevOptions.map(option => 
        option.name === softwareName ? { ...option, connectionStatus: status } : option
      )
    );
  };

  const handleConnect = (software: SoftwareOption) => {
    if (software.connectionStatus === 'connected') {
      // Handle disconnection
      if (software.name === "QuickBooks") {
        // In production, this would call your API to revoke tokens
        localStorage.removeItem('quickbooks_connected');
        updateConnectionStatus(software.name, 'disconnected');
        toast({
          title: "Disconnected",
          description: `Successfully disconnected from ${software.name}`,
        });
      } else if (software.name === "Xero") {
        // In production, this would call your API to revoke tokens
        localStorage.removeItem('xero_connected');
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
          if (software.name === "QuickBooks") {
            localStorage.setItem('quickbooks_connected', 'true');
          } else if (software.name === "Xero") {
            localStorage.setItem('xero_connected', 'true');
          }
          
          updateConnectionStatus(software.name, 'connected');
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
                    <Badge className="bg-[#00C47C] text-white hover:bg-[#00a067]">Connected</Badge>
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
              <Button 
                variant={software.connectionStatus === 'connected' ? "outline" : "outline"}
                className={`w-full ${
                  software.connectionStatus === 'connected'
                    ? "text-[#00C47C] border-[#353e52] hover:bg-[#242A38] hover:border-[#00C47C] group"
                    : "text-[#007BFF] border-[#353e52] hover:bg-[#242A38] hover:border-[#007BFF] group"
                }`}
                onClick={() => handleConnect(software)}
              >
                {software.connectionStatus === 'connected' ? (
                  <>
                    Disconnect
                    <RefreshCw className="ml-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
                  </>
                ) : (
                  <>
                    Connect
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AccountingSoftwareIntegration;
