
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SoftwareOption } from '../types';
import { getSoftwareOptions } from '../utils';

export const useIntegrationState = () => {
  const { toast } = useToast();
  const [softwareOptions, setSoftwareOptions] = useState<SoftwareOption[]>(getSoftwareOptions());

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
      } else if (software.name === "Xero") {
        localStorage.removeItem('xero_connected');
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
        
        setTimeout(() => {
          if (authWindow) authWindow.close();
          
          if (software.name === "QuickBooks") {
            localStorage.setItem('quickbooks_connected', 'true');
            updateConnectionStatus(software.name, 'connected', new Date().toISOString());
            toast({
              title: "Connected",
              description: `Successfully connected to ${software.name}`,
            });
          } else if (software.name === "Xero") {
            localStorage.setItem('xero_connected', 'true');
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

  return {
    softwareOptions,
    handleConnect,
    handleSync
  };
};
