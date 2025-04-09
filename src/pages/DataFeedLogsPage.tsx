
import React, { useState, useEffect } from 'react';
import { getDataFeedLogs, DataFeedLog, getDataFeedById } from '@/utils/dataFeedUtils';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, AlertTriangle } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const DataFeedLogsPage = () => {
  const [feedId, setFeedId] = useState<string>("irs-updates");
  const [logs, setLogs] = useState<DataFeedLog[]>([]);
  
  useEffect(() => {
    // Fetch logs for the selected feed
    setLogs(getDataFeedLogs(feedId));
  }, [feedId]);
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: '2-digit',
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Data Feed Logs</h1>
        <div>
          <Button asChild variant="outline">
            <Link to="/admin/data-feeds">Back to Data Feeds</Link>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>View Data Feed Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="text-sm font-medium block mb-2">Select Data Feed:</label>
            <Select value={feedId} onValueChange={setFeedId}>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Select data feed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="irs-updates">IRS Tax Code Updates</SelectItem>
                <SelectItem value="state-tax-rates">State-Specific Tax Rates</SelectItem>
                <SelectItem value="retirement-limits">Retirement Account Limits</SelectItem>
                <SelectItem value="inflation-data">Inflation Updates</SelectItem>
                <SelectItem value="aca-subsidies">ACA Subsidy Changes</SelectItem>
                <SelectItem value="social-security">Social Security Thresholds</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {logs.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Timestamp</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[100px]">Changes</TableHead>
                    <TableHead>Version Info</TableHead>
                    <TableHead>Error Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{formatDate(log.timestamp)}</TableCell>
                      <TableCell>
                        <Badge className={`flex items-center ${log.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {log.success ? (
                            <><Check className="h-4 w-4 mr-1" />Success</>
                          ) : (
                            <><AlertTriangle className="h-4 w-4 mr-1" />Failed</>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.changes_count}</TableCell>
                      <TableCell>{log.version_info || "N/A"}</TableCell>
                      <TableCell className="text-red-500">{log.error_message || "None"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No logs found for this data feed. Try refreshing the data feed first.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataFeedLogsPage;
