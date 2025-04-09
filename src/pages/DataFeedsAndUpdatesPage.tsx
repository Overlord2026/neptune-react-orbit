
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, AlertTriangle, Check, Clock } from "lucide-react";
import TaxDisclaimerWithCheckbox from '@/components/tax/TaxDisclaimerWithCheckbox';

// Mock data for demonstration purposes
const initialDataFeeds = [
  {
    id: "irs-updates",
    name: "IRS Tax Code Updates",
    api_endpoint: "https://api.irs.gov/tax-code/v1/updates",
    refresh_frequency: "weekly",
    last_update: "2025-04-05T10:30:00Z",
    status: "active",
    description: "Official updates to tax brackets, rates, and new form releases"
  },
  {
    id: "state-tax-rates",
    name: "State-Specific Tax Rates",
    api_endpoint: "https://api.taxdata.org/states/v2/rates",
    refresh_frequency: "monthly",
    last_update: "2025-03-15T14:22:00Z",
    status: "active",
    description: "State income tax rates, sales tax, and local tax information"
  },
  {
    id: "retirement-limits",
    name: "Retirement Account Limits",
    api_endpoint: "https://api.irs.gov/retirement/v1/limits",
    refresh_frequency: "monthly",
    last_update: "2025-02-28T09:15:00Z",
    status: "active",
    description: "IRA, 401(k), and other retirement account contribution limits"
  },
  {
    id: "inflation-data",
    name: "Inflation Updates",
    api_endpoint: "https://api.treasury.gov/inflation/v1/current",
    refresh_frequency: "daily",
    last_update: "2025-04-08T23:00:00Z",
    status: "warning",
    description: "Current inflation rates affecting tax brackets and deductions"
  },
  {
    id: "aca-subsidies",
    name: "ACA Subsidy Changes",
    api_endpoint: "https://api.healthcare.gov/subsidies/v2",
    refresh_frequency: "monthly",
    last_update: "2025-03-01T12:00:00Z",
    status: "error",
    description: "Updates to Affordable Care Act premium tax credit calculations"
  },
  {
    id: "social-security",
    name: "Social Security Thresholds",
    api_endpoint: "https://api.ssa.gov/thresholds/v1",
    refresh_frequency: "monthly",
    last_update: "2025-03-10T16:45:00Z",
    status: "active",
    description: "Social Security wage base limits and benefit threshold updates"
  }
];

const DataFeedsAndUpdatesPage = () => {
  const [dataFeeds, setDataFeeds] = useState(initialDataFeeds);
  const [disclaimerAcknowledged, setDisclaimerAcknowledged] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  
  const handleRefresh = (id: string) => {
    // In a real app, this would trigger an API call to refresh the data
    setDataFeeds(feeds => 
      feeds.map(feed => 
        feed.id === id 
          ? { ...feed, last_update: new Date().toISOString(), status: "active" } 
          : feed
      )
    );
  };

  const handleFrequencyChange = (id: string, value: string) => {
    setDataFeeds(feeds => 
      feeds.map(feed => 
        feed.id === id 
          ? { ...feed, refresh_frequency: value } 
          : feed
      )
    );
  };

  const handleEndpointChange = (id: string, value: string) => {
    setDataFeeds(feeds => 
      feeds.map(feed => 
        feed.id === id 
          ? { ...feed, api_endpoint: value } 
          : feed
      )
    );
  };

  const filteredDataFeeds = activeTab === "all" 
    ? dataFeeds 
    : dataFeeds.filter(feed => feed.status === activeTab);

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: '2-digit',
      hour: '2-digit', 
      minute: '2-digit'
    }).format(date);
  };

  // Get status badge color and icon
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { color: 'bg-green-100 text-green-800', icon: <Check className="h-4 w-4 mr-1" /> };
      case 'warning':
        return { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-4 w-4 mr-1" /> };
      case 'error':
        return { color: 'bg-red-100 text-red-800', icon: <AlertTriangle className="h-4 w-4 mr-1" /> };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: null };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Data Feeds & Live Updates</h1>
        <div className="flex flex-wrap gap-3">
          <Button 
            className="bg-[#FFD700] text-black hover:bg-[#E5C100]"
            onClick={() => console.log("Admin action: Check all data feeds")}
          >
            Verify All Connections
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration Settings</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p>
            These settings determine how frequently new tax data is fetched and integrated into the system.
            Updates ensure that all calculations and recommendations reflect the most current tax laws and rates.
          </p>
          <p className="mt-2">
            <strong>Note:</strong> Changing the refresh frequency or data source may impact system performance.
            It is recommended to keep refresh frequencies at reasonable intervals to avoid unnecessary API calls.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Data Feeds</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="warning">Warning</TabsTrigger>
          <TabsTrigger value="error">Error</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Data Feed</TableHead>
                  <TableHead>Data Source</TableHead>
                  <TableHead className="w-[150px]">Frequency</TableHead>
                  <TableHead className="w-[180px]">Last Updated</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[100px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDataFeeds.map((feed) => {
                  const statusBadge = getStatusBadge(feed.status);
                  return (
                    <TableRow key={feed.id}>
                      <TableCell className="font-medium">
                        <div>{feed.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{feed.description}</div>
                      </TableCell>
                      <TableCell>
                        <Input 
                          value={feed.api_endpoint} 
                          onChange={(e) => handleEndpointChange(feed.id, e.target.value)}
                          className="w-full text-xs"
                        />
                      </TableCell>
                      <TableCell>
                        <Select 
                          defaultValue={feed.refresh_frequency}
                          onValueChange={(value) => handleFrequencyChange(feed.id, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{formatDate(feed.last_update)}</TableCell>
                      <TableCell>
                        <Badge className={`flex items-center ${statusBadge.color}`}>
                          {statusBadge.icon}
                          {feed.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          onClick={() => handleRefresh(feed.id)}
                          className="w-full flex items-center gap-1"
                        >
                          <RefreshCw className="h-3 w-3" />
                          Refresh
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <TaxDisclaimerWithCheckbox
        acknowledged={disclaimerAcknowledged}
        onAcknowledgeChange={setDisclaimerAcknowledged}
        className="mt-8"
      />

      <div className="flex justify-end mt-6">
        <Button 
          disabled={!disclaimerAcknowledged}
          onClick={() => console.log("Admin action: Save all data feed settings")}
        >
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default DataFeedsAndUpdatesPage;
