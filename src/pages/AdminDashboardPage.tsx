
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, Database, Clock, Activity, Shield, History, FileSpreadsheet, AlertTriangle } from "lucide-react";

const AdminDashboardPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Data Feeds</CardTitle>
            <CardDescription>Manage all data source connections</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Configure and monitor data feeds that pull tax rates, brackets, and other financial information.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/admin/data-feeds" className="w-full">
              <Button className="w-full" variant="default">
                <Database className="mr-2 h-4 w-4" />
                Manage Data Feeds
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tax Data History</CardTitle>
            <CardDescription>View historical tax data changes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Browse all tax rate changes, bracket adjustments, and other financial data updates by version.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/admin/tax-data-history" className="w-full">
              <Button className="w-full" variant="default">
                <Clock className="mr-2 h-4 w-4" />
                View Data History
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">System Health</CardTitle>
            <CardDescription>Monitor system performance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Check system status, diagnostics, and analytics to ensure optimal performance.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline">
              <Activity className="mr-2 h-4 w-4" />
              View Diagnostics
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Audit Logs</CardTitle>
            <CardDescription>Track all system changes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View complete audit logs of all tax data updates, manual overrides, and system changes with rollback options.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/admin/audit-log" className="w-full">
              <Button className="w-full" variant="default">
                <History className="mr-2 h-4 w-4" />
                View Audit Logs
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">User Management</CardTitle>
            <CardDescription>Manage system access</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Configure user roles, permissions, and access controls for the tax planning system.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline">
              <Shield className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">System Reports</CardTitle>
            <CardDescription>Generate system reports</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Generate detailed reports on system usage, data accuracy, and compliance.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Generate Reports
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center text-amber-800">
            <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
            Admin Access Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-amber-800">
          <p>
            Remember that all actions performed in the administrative interface are logged for security and
            compliance purposes. Always use appropriate caution when making changes to tax data, as these
            changes will affect calculations across the entire platform.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;
