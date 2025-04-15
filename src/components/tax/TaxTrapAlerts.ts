import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, Info, LucideIcon, XCircle } from "lucide-react";
import { TrapAlert, TrapAvoidance } from '@/types/tax/rothConversionTypes';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AlertProps {
  alert: TrapAlert;
}

interface AvoidanceProps {
  avoidance: TrapAvoidance;
}

const severityColors = {
  low: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-red-100 text-red-800 border-red-200",
};

const severityIcons: { [key: string]: LucideIcon } = {
  low: Info,
  medium: AlertTriangle,
  high: XCircle,
};

export const generateAlertMessage = (alert: TrapAlert): string => {
  if (!alert) return '';
  
  // Use alert.description or alert.name if message is not available
  const message = alert.message || alert.description;
  const type = alert.type || 'threshold';
  
  switch (type) {
    case 'threshold':
      return `${message}. Your amount is $${alert.amount.toLocaleString()} which exceeds the threshold of $${alert.threshold.toLocaleString()}.`;
    case 'amount':
      return `${message}. The amount is $${alert.amount.toLocaleString()}.`;
    case 'general':
    default:
      return message;
  }
}

export const TaxTrapAlert: React.FC<AlertProps> = ({ alert }) => {
  const SeverityIcon = severityIcons[alert.severity] || Info;
  const severityColor = severityColors[alert.severity] || severityColors.low;
  const alertMessage = generateAlertMessage(alert);

  return (
    <Card className={`border ${severityColor}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <SeverityIcon className="h-4 w-4" />
          {alert.name}
        </CardTitle>
        <Badge variant="outline" className={severityColor}>
          {alert.severity}
        </Badge>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-xs text-gray-500">
          {alertMessage}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export const TaxTrapAvoidanceTip: React.FC<AvoidanceProps> = ({ avoidance }) => {
  return (
    <Card className="bg-green-50 border-green-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          {avoidance.name}
        </CardTitle>
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
          Tip
        </Badge>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-xs text-gray-500">
          {avoidance.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

interface TaxTrapContainerProps {
  alerts: TrapAlert[];
  avoidances: TrapAvoidance[];
}

export const TaxTrapContainer: React.FC<TaxTrapContainerProps> = ({ alerts, avoidances }) => {
  return (
    <div className="grid gap-4">
      {alerts.length > 0 && (
        <>
          <h3 className="font-semibold text-lg">Potential Tax Traps</h3>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <div className="grid gap-4">
              {alerts.map((alert) => (
                <TaxTrapAlert key={alert.id} alert={alert} />
              ))}
            </div>
          </ScrollArea>
        </>
      )}

      {avoidances.length > 0 && (
        <>
          <h3 className="font-semibold text-lg">Avoidance Tips</h3>
          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            <div className="grid gap-4">
              {avoidances.map((avoidance) => (
                <TaxTrapAvoidanceTip key={avoidance.id} avoidance={avoidance} />
              ))}
            </div>
          </ScrollArea>
        </>
      )}

      {alerts.length === 0 && avoidances.length === 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-500" />
              No Traps Detected
            </CardTitle>
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
              Safe
            </Badge>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-xs text-gray-500">
              No potential tax traps were detected based on the provided information.
            </CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
