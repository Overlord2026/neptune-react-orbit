import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, AlertTriangle, Check, Clock, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  DataFeed,
  getAllDataFeeds,
  setAllDataFeeds,
  getDataFeedLogs
} from '@/utils/dataFeedUtils';
import { fetchTaxCodeUpdates, scheduleUpdateChecks } from '@/utils/fetchTaxCodeUpdates';
import TaxDisclaimerWithCheckbox from '@/components/tax/TaxDisclaimerWithCheckbox';
import PlaceholdersReferenceSection from '@/components/admin/PlaceholdersReferenceSection';

const DataFeedsAndUpdatesPage = () => {
  const [dataFeeds, setDataFeeds] = useState<DataFeed[]>([]);
  const [disclaimerAcknowledged, setDisclaimerAcknowledged] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

  useEffect(() => {
    setDataFeeds(getAllDataFeeds());
    
    scheduleUpdateChecks();
    
    // This effect should run only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleRefresh = async (id: string) => {
    setIsRefreshing(prev => ({ ...prev, [id]: true }));
    
    try {
      const success = await fetchTaxCodeUpdates(id, true);
      
      if (success) {
        toast({
          title: "Data feed refreshed",
          description: "The data feed was successfully refreshed.",
          variant: "default",
        });
      } else {
        toast({
          title: "Error refreshing data feed",
          description: "There was an error refreshing the data feed.",
          variant: "destructive",
        });
      }
      
      setDataFeeds(getAllDataFeeds());
    } catch (error) {
      console.error("Error refreshing data feed:", error);
      toast({
        title: "Error refreshing data feed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleFrequencyChange = (id: string, value: string) => {
    setDataFeeds(feeds => {
      const updatedFeeds = feeds.map(feed => 
        feed.id === id 
          ? { ...feed, refresh_frequency: value as "daily" | "weekly" | "monthly" } 
          : feed
      );
      
      setAllDataFeeds(updatedFeeds);
      
      return updatedFeeds;
    });
  };

  const handleEndpointChange = (id: string, value: string) => {
    setDataFeeds(feeds => {
      const updatedFeeds = feeds.map(feed => 
        feed.id === id 
          ? { ...feed, api_endpoint: value } 
          : feed
      );
      
      setAllDataFeeds(updatedFeeds);
      
      return updatedFeeds;
    });
  };

  const filteredDataFeeds = activeTab === "all" 
    ? dataFeeds 
    : dataFeeds.filter(feed => feed.status === activeTab);

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

  const handleVerifyAllConnections = async () => {
    toast({
      title: "Verifying all connections",
      description: "This may take a few moments...",
    });
    
    const refreshingState = dataFeeds.reduce((acc, feed) => {
      acc[feed.id] = true;
      return acc;
    }, {} as {[key: string]: boolean});
    
    setIsRefreshing(refreshingState);
    
    try {
      const results = await Promise.all(
        dataFeeds.map(feed => fetchTaxCodeUpdates(feed.id, true))
      );
      
      const successCount = results.filter(Boolean).length;
      
      if (successCount === dataFeeds.length) {
        toast({
          title: "All connections verified",
          description: `${successCount} of ${dataFeeds.length} connections are working correctly.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Some connections failed",
          description: `${successCount} of ${dataFeeds.length} connections are working correctly.`,
          variant: "destructive",
        });
      }
      
      setDataFeeds(getAllDataFeeds());
    } catch (error) {
      console.error("Error verifying connections:", error);
      toast({
        title: "Error verifying connections",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing({});
    }
  };

  const handleSaveAllSettings = () => {
    if (!disclaimerAcknowledged) {
      toast({
        title: "Please acknowledge the disclaimer",
        description: "You must acknowledge the disclaimer before saving settings.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Settings saved",
      description: "All data feed settings have been saved successfully.",
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Data Feeds & Live Updates</h1>
        <div className="flex flex-wrap gap-3">
          <Button 
            className="bg-[#FFD700] text-black hover:bg-[#E5C100]"
            onClick={handleVerifyAllConnections}
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
                        {feed.error_message && (
                          <div className="text-xs text-red-500 mt-1 flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {feed.error_message}
                          </div>
                        )}
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
                          disabled={isRefreshing[feed.id]}
                        >
                          {isRefreshing[feed.id] ? (
                            <RefreshCw className="h-3 w-3 animate-spin" />
                          ) : (
                            <RefreshCw className="h-3 w-3" />
                          )}
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

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Info className="mr-2 h-5 w-5 text-blue-500" />
            About Data Feed Processing
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-3">
          <p>
            When data is fetched from external sources, our system processes it through the following steps:
          </p>
          <ol className="list-decimal list-inside space-y-2 pl-2">
            <li>Fetch data from the configured API endpoint</li>
            <li>Parse responses to extract tax brackets, deductions, and other relevant information</li>
            <li>Compare with existing data to identify changes</li>
            <li>Update internal databases with new information</li>
            <li>Store detailed logs of all changes for audit purposes</li>
          </ol>
          <p>
            The system will automatically retry failed connections up to 3 times with increasing delays.
            Administrators will receive notifications about significant changes or persistent failures.
          </p>
        </CardContent>
      </Card>

      <TaxDisclaimerWithCheckbox
        acknowledged={disclaimerAcknowledged}
        onAcknowledgeChange={setDisclaimerAcknowledged}
        className="mt-8"
        content={
          <>
            <p>
              The data feed system connects to external APIs to retrieve the latest tax information. 
              While we strive to maintain accurate and up-to-date information, we cannot guarantee the 
              accuracy of data from third-party sources.
            </p>
            <p>
              Administrators are responsible for verifying the correctness of imported data before it is
              used for tax calculations or client recommendations.
            </p>
            <p>
              Always consult official IRS publications and notices for the most authoritative information
              on tax rates, brackets, and regulations.
            </p>
          </>
        }
        checkboxLabel="I understand my responsibility to verify imported tax data before using it for calculations or recommendations."
      />

      <PlaceholdersReferenceSection />

      <div className="flex justify-end mt-6">
        <Button 
          disabled={!disclaimerAcknowledged}
          onClick={handleSaveAllSettings}
        >
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default DataFeedsAndUpdatesPage;
