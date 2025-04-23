
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import IntegrationCard from './software-integration/IntegrationCard';
import IntegrationHeader from './software-integration/IntegrationHeader';
import { SoftwareOption } from './software-integration/types';
import { getSoftwareOptions } from './software-integration/utils';

const AccountingSoftwareIntegration = () => {
  const { toast } = useToast();
  const [softwareOptions, setSoftwareOptions] = useState<SoftwareOption[]>(getSoftwareOptions());

  // Check for existing connections on component mount
  useEffect(() => {
    checkExistingConnections();
  }, []);

  const checkExistingConnections = () => {
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
      <IntegrationHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {softwareOptions.map((software) => (
          <IntegrationCard
            key={software.name}
            software={software}
            onConnect={handleConnect}
            onSync={handleSync}
          />
        ))}
      </div>
    </div>
  );
};

export default AccountingSoftwareIntegration;
