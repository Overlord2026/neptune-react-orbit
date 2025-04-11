
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchTaxCodeUpdates } from "@/utils/fetchTaxCodeUpdates";
import { getDataFeedLogs, getDataFeeds, DataFeed, DataFeedLog } from "@/utils/dataFeed";
import { Calendar, RefreshCw, Settings, AlertTriangle, Check, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { toast } from "sonner";
import { recordManualOverride, getCurrentUserId, hasAdminPermission } from "@/utils/auditLogUtils";

const DataFeedsAndUpdatesPage: React.FC = () => {
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState("feeds");
  const dataFeeds = getDataFeeds();
  const dataFeedLogs = getDataFeedLogs();
  const currentUserId = getCurrentUserId();
  const isAdmin = hasAdminPermission(currentUserId);
  
  const handleManualUpdate = async (feedId: string) => {
    setIsUpdating(prev => ({ ...prev, [feedId]: true }));
    try {
      const success = await fetchTaxCodeUpdates(feedId, true);
      if (success) {
        toast.success(`Successfully updated data from ${feedId}`);
      } else {
        toast.error(`Failed to update data from ${feedId}`);
      }
    } catch (error) {
      console.error("Error updating data feed:", error);
      toast.error(`Error updating data: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsUpdating(prev => ({ ...prev, [feedId]: false }));
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>;
      case "error":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Error</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">{status}</Badge>;
    }
  };
  
  const getLogStatusIcon = (success: boolean) => {
    return success ? (
      <Check className="h-4 w-4 text-green-500" />
    ) : (
      <AlertTriangle className="h-4 w-4 text-red-500" />
    );
  };
  
  const formatLastUpdate = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (e) {
      return "Unknown";
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tax Data Feeds & Updates</h1>
      </div>
      
      <Tabs defaultValue="feeds" className="w-full" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="feeds">Data Feeds</TabsTrigger>
          <TabsTrigger value="updates">Update History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="feeds">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dataFeeds.map((feed: DataFeed) => (
              <Card key={feed.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{feed.name}</CardTitle>
                    {getStatusBadge(feed.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{feed.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Refresh:</span> {feed.refresh_frequency}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last update:</span> {feed.last_update ? formatLastUpdate(feed.last_update) : "Never"}
                      </div>
                    </div>
                    
                    {feed.error_message && (
                      <div className="text-sm mt-2 text-red-500 bg-red-50 p-2 rounded border border-red-200">
                        <span className="font-medium">Error: </span>{feed.error_message}
                      </div>
                    )}
                    
                    {isAdmin && (
                      <div className="mt-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="w-full flex items-center justify-center"
                          onClick={() => handleManualUpdate(feed.id)}
                          disabled={isUpdating[feed.id]}
                        >
                          <RefreshCw className={`h-4 w-4 mr-2 ${isUpdating[feed.id] ? 'animate-spin' : ''}`} />
                          {isUpdating[feed.id] ? "Updating..." : "Manual Update"}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="updates">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Recent Tax Data Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dataFeedLogs.length === 0 ? (
                <p className="text-center text-muted-foreground py-6">No update logs found.</p>
              ) : (
                <div className="space-y-4">
                  {dataFeedLogs.map((log: DataFeedLog) => (
                    <div key={log.id} className="border rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getLogStatusIcon(log.success)}
                          <span className="font-medium">{log.feed_id}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatLastUpdate(log.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-sm mt-1">{log.message}</p>
                      
                      {log.changes_count > 0 && (
                        <div className="mt-2 text-sm">
                          <span className="text-green-600 font-medium">{log.changes_count} changes</span> applied
                          {log.version_info && ` (Version: ${log.version_info})`}
                        </div>
                      )}
                      
                      {log.error_message && (
                        <div className="mt-2 text-sm text-red-500">
                          Error: {log.error_message}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Data Feed Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <Info className="h-4 w-4 mr-2 text-blue-500" />
                  <p>
                    Configure how tax data feeds are processed and update schedules.
                    These settings are only available to administrators.
                  </p>
                </div>
                
                {!isAdmin && (
                  <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md">
                    You need administrator permissions to modify data feed settings.
                  </div>
                )}
                
                {isAdmin && (
                  <div className="space-y-4 pt-2">
                    <p className="text-sm text-muted-foreground">
                      Data feed settings controls will be available here in a future update.
                    </p>
                    <Button variant="outline" disabled>Save Settings</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataFeedsAndUpdatesPage;
