
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import TaxAlertsContainer from './TaxAlertsContainer';
import { createTaxAlert } from '@/utils/taxUpdateUtils';

interface TaxUpdateDemoProps {
  userId: string;
}

const TaxUpdateDemo: React.FC<TaxUpdateDemoProps> = ({ userId }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertCreated, setAlertCreated] = useState(false);
  
  const handleCreateDemoAlert = () => {
    // Create a demo tax alert
    createTaxAlert(
      userId,
      "Important Tax Update: Standard Deduction Increase",
      "The standard deduction for single filers has increased by 10% for tax year 2026. This may affect your tax calculations and planning strategies.",
      {
        severity: 'major',
        update_type: 'standard_deduction',
        year: 2026,
        link_to_learn_more: '/tax-education?year=2026'
      }
    );
    
    setAlertCreated(true);
    setShowAlert(true);
    
    toast.success("Demo tax alert created successfully!");
  };
  
  return (
    <div className="space-y-4">
      {showAlert && (
        <TaxAlertsContainer
          userId={userId}
          maxAlerts={3} 
          showViewAllLink={true}
        />
      )}
      
      {!alertCreated && (
        <Card className="p-4">
          <div className="flex flex-col items-center justify-center text-center p-4">
            <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Demo the Tax Update Alerts</h3>
            <p className="mb-4 text-muted-foreground">
              Create a demo tax alert to see how the notification system works 
              when major tax changes are detected.
            </p>
            <Button onClick={handleCreateDemoAlert}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Create Demo Alert
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TaxUpdateDemo;
