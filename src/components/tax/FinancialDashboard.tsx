
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BarChart3, ArrowUp, ArrowDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
  return (
    <div className="space-y-6 mt-6">
      <div className="rounded-lg border border-primary/20 bg-card p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-md bg-primary/10">
            <BarChart3 className="h-6 w-6 neptune-gold" />
          </div>
          <div>
            <h2 className="text-xl font-bold neptune-gold">Administration</h2>
            <p className="text-sm text-muted-foreground">Administrative actions and system settings</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 mt-6">
          <button className="flex items-center justify-between w-full p-4 rounded-md border border-primary/20 hover:bg-primary/10 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-md bg-primary/10">
                <BarChart3 className="h-4 w-4 neptune-gold" />
              </div>
              <span className="font-medium">System Health Dashboard</span>
            </div>
            <ArrowRight className="h-5 w-5" />
          </button>
          
          <button className="flex items-center justify-between w-full p-4 rounded-md border border-primary/20 hover:bg-primary/10 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-md bg-primary/10">
                <BarChart3 className="h-4 w-4 neptune-gold" />
              </div>
              <span className="font-medium">Full System Diagnostics</span>
            </div>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Income"
          value="$9,650"
          comparison={{ value: "4.5%", isPositive: true, text: "vs last month" }}
          targetText="Monthly Goal"
          targetValue="$12,500"
          targetValueColor="text-emerald-500"
          trend="up"
        />
        
        <StatCard
          title="Expenses"
          value="$6,473"
          comparison={{ value: "2.9%", isPositive: false, text: "vs last month" }}
          targetText="Monthly Budget"
          targetValue="$8,500"
          targetValueColor="text-amber-500"
          trend="down"
        />
        
        <StatCard
          title="Cash Flow"
          value="$3,177"
          comparison={{ value: "5.8%", isPositive: true, text: "vs last quarter" }}
          targetText="Quarterly Avg"
          targetValue="$3,075"
          targetValueColor="text-blue-500" 
          trend="up"
        />
        
        <StatCard
          title="Savings Rate"
          value="18.5%"
          comparison={{ value: "1.2%", isPositive: false, text: "vs last month" }}
          targetText="Target"
          targetValue="20%"
          targetValueColor="text-purple-500"
          trend="down"
        />
      </div>
      
      <div className="rounded-lg border border-primary/20 bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-md bg-primary/10">
            <FileText className="h-6 w-6 neptune-gold" />
          </div>
          <div>
            <h2 className="text-xl font-bold neptune-gold">Financial Reports</h2>
            <p className="text-sm text-muted-foreground">Generate comprehensive reports of your family's financial assets, liabilities and cash flows</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button className="flex-1 p-2.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors">
            Generate Reports
          </button>
          <button className="flex-1 p-2.5 bg-muted text-muted-foreground font-medium rounded-md hover:bg-muted/90 transition-colors">
            Report History
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;
