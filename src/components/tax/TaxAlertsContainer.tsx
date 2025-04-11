
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"; 
import { Calendar, BellOff } from "lucide-react";
import TaxAlertBanner from './TaxAlertBanner';
import { useTaxDataUpdate } from '@/hooks/useTaxDataUpdate';
import { Link } from 'react-router-dom';

interface TaxAlertsContainerProps {
  userId: string;
  maxAlerts?: number;
  showViewAllLink?: boolean;
}

const TaxAlertsContainer: React.FC<TaxAlertsContainerProps> = ({
  userId,
  maxAlerts = 3,
  showViewAllLink = true
}) => {
  const { alerts } = useTaxDataUpdate(userId);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  
  // Filter out already dismissed alerts
  const filteredAlerts = alerts
    .filter(alert => !alert.dismissed && !dismissedAlerts.includes(alert.id))
    .sort((a, b) => {
      // Sort by severity first (major > minor > info)
      const severityOrder = { major: 3, minor: 2, info: 1 };
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[b.severity] - severityOrder[a.severity];
      }
      
      // Then by date (newest first)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    })
    .slice(0, maxAlerts);
  
  const handleDismiss = (alertId: string) => {
    setDismissedAlerts(prev => [...prev, alertId]);
  };
  
  if (filteredAlerts.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      {filteredAlerts.map(alert => (
        <TaxAlertBanner 
          key={alert.id} 
          alert={alert} 
          userId={userId}
          onDismiss={() => handleDismiss(alert.id)} 
        />
      ))}
      
      {showViewAllLink && alerts.length > maxAlerts && (
        <div className="flex justify-between items-center">
          <Button variant="link" asChild>
            <Link to="/tax-updates-history">
              <Calendar className="h-4 w-4 mr-1" />
              View all tax updates ({alerts.length})
            </Link>
          </Button>
          
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <BellOff className="h-4 w-4 mr-1" />
            Hide all alerts
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaxAlertsContainer;
