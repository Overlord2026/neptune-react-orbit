
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Server, Users, AlertTriangle, ArrowLeft, Clock, HardDrive, Activity, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";

const SystemHealthDashboardPage = () => {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight neptune-gold">
            System Health Dashboard
          </h1>
          <p className="text-muted-foreground">
            Comprehensive overview of system performance and status
          </p>
        </div>
        <Link to="/tax-planning" className="border border-primary hover:bg-primary/10 px-4 py-2 rounded-md text-primary transition-colors w-full sm:w-auto text-center sm:text-left flex items-center gap-2 justify-center sm:justify-start">
          <ArrowLeft className="h-4 w-4" />
          Back to Tax Planning
        </Link>
      </div>

      {/* Server Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-card border-primary/20">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 neptune-gold" />
              <CardTitle className="text-lg neptune-gold">Server Status</CardTitle>
            </div>
            <CardDescription>Overall system performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Uptime</span>
              <span className="font-medium neptune-gold">99.98%</span>
            </div>
            <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
              <div className="h-full bg-primary" style={{ width: "99.98%" }}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Response Time</span>
              <span className="font-medium neptune-gold">124ms</span>
            </div>
            <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
              <div className="h-full bg-primary" style={{ width: "85%" }}></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-primary/20">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 neptune-gold" />
              <CardTitle className="text-lg neptune-gold">User Activity</CardTitle>
            </div>
            <CardDescription>Current user statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Active Users</span>
              <span className="font-medium neptune-gold">1,257</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Sessions Today</span>
              <span className="font-medium neptune-gold">3,842</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Average Session</span>
              <span className="font-medium neptune-gold">14m 22s</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-primary/20">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 neptune-gold" />
              <CardTitle className="text-lg neptune-gold">System Warnings</CardTitle>
            </div>
            <CardDescription>Active alerts and warnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="text-3xl font-bold neptune-gold">0</div>
              <p className="text-sm text-muted-foreground mt-2">No active warnings</p>
              <p className="text-xs text-muted-foreground mt-1">All systems operating normally</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-primary/20">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 neptune-gold" />
              <CardTitle className="text-lg neptune-gold">Storage</CardTitle>
            </div>
            <CardDescription>Database and file storage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Usage</span>
              <span className="font-medium neptune-gold">456.2 GB</span>
            </div>
            <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
              <div className="h-full bg-primary" style={{ width: "45%" }}></div>
            </div>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>45% used</span>
              <span>1 TB total</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-primary/20">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 neptune-gold" />
              <CardTitle className="text-lg neptune-gold">Recent Downtime</CardTitle>
            </div>
            <CardDescription>System interruptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="text-md font-bold neptune-gold">No downtime in last 30 days</div>
              <p className="text-xs text-muted-foreground mt-2">Last maintenance: 2025-03-28</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-primary/20">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 neptune-gold" />
              <CardTitle className="text-lg neptune-gold">API Performance</CardTitle>
            </div>
            <CardDescription>API calls and response times</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Requests/min</span>
              <span className="font-medium neptune-gold">2,541</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Avg Response</span>
              <span className="font-medium neptune-gold">87ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Error Rate</span>
              <span className="font-medium neptune-gold">0.02%</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center mt-8">
        <Link to="/tax-planning">
          <Button className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Return to Tax Planning
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SystemHealthDashboardPage;
