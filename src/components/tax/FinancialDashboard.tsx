
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, ArrowUp, ArrowDown, ArrowRight, Server, Users, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface StatCardProps {
  title: string;
  value: string;
  comparison: {
    value: string;
    isPositive: boolean;
    text: string;
  };
  targetText: string;
  targetValue: string;
  targetValueColor?: string;
  trend: "up" | "down" | "neutral";
}

const StatCard = ({ title, value, comparison, targetText, targetValue, targetValueColor, trend }: StatCardProps) => {
  return (
    <Card className="bg-card border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold neptune-gold">{title}</CardTitle>
        {trend === "up" && <ArrowUp className="h-5 w-5 text-emerald-500" />}
        {trend === "down" && <ArrowDown className="h-5 w-5 text-amber-500" />}
        {trend === "neutral" && <ArrowRight className="h-5 w-5 text-blue-500" />}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold neptune-gold mb-2">{value}</div>
        <div className="flex items-center text-sm text-muted-foreground">
          <span className={cn(
            "mr-1",
            comparison.isPositive ? "text-emerald-500" : "text-amber-500"
          )}>
            {comparison.isPositive ? "↑" : "↓"} {comparison.value}
          </span>
          <span>{comparison.text}</span>
        </div>
        
        <div className="mt-4 h-1.5 w-full bg-muted overflow-hidden rounded-full">
          <div className="h-full bg-primary" style={{ width: "65%" }}></div>
        </div>
        
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-sm text-muted-foreground">{targetText}</span>
          <span className={cn("text-sm font-medium", targetValueColor || "neptune-gold")}>
            {targetValue}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const FinancialDashboard = () => {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  
  return (
    <div className="space-y-6 mt-6">
      <Collapsible
        open={isAdminOpen}
        onOpenChange={setIsAdminOpen}
        className="rounded-lg border border-primary/20 bg-card p-6"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-primary/10">
              <BarChart3 className="h-6 w-6 neptune-gold" />
            </div>
            <div>
              <h2 className="text-xl font-bold neptune-gold">Administration</h2>
              <p className="text-sm text-muted-foreground">Administrative actions and system settings</p>
            </div>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="neptune-gold">
              {isAdminOpen ? 
                <ArrowUp className="h-4 w-4" /> : 
                <ArrowDown className="h-4 w-4" />
              }
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            <Button 
              variant="outline" 
              className="flex items-center justify-between w-full p-4"
              onClick={() => setIsHealthModalOpen(true)}
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <Server className="h-4 w-4 neptune-gold" />
                </div>
                <span className="font-medium">System Health Dashboard</span>
              </div>
              <ArrowRight className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center justify-between w-full p-4"
              onClick={() => window.location.href = "/admin"}
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <BarChart3 className="h-4 w-4 neptune-gold" />
                </div>
                <span className="font-medium">Full System Diagnostics</span>
              </div>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      {/* System Health Dashboard Modal */}
      <Dialog open={isHealthModalOpen} onOpenChange={setIsHealthModalOpen}>
        <DialogContent className="bg-[#111111] border-[#FFD700]/20 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-[#FFD700] text-xl">System Health Dashboard</DialogTitle>
            <DialogDescription>
              Overview of system performance and status
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
            <Card className="bg-card border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-semibold neptune-gold flex items-center gap-2">
                  <Server className="h-4 w-4" /> Server Uptime
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold neptune-gold mb-2">99.98%</div>
                <p className="text-sm text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-semibold neptune-gold flex items-center gap-2">
                  <Users className="h-4 w-4" /> Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold neptune-gold mb-2">1,257</div>
                <p className="text-sm text-muted-foreground">Currently online</p>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-semibold neptune-gold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> System Warnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold neptune-gold mb-2">0</div>
                <p className="text-sm text-muted-foreground">All systems normal</p>
              </CardContent>
            </Card>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsHealthModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancialDashboard;
