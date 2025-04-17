import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { InfoCircledIcon, CheckCircledIcon, CrossCircledIcon, UpdateIcon } from '@radix-ui/react-icons';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { recordManualOverride } from '@/utils/audit';

// Mock data for data feeds
const dataFeeds = [
  {
    id: 'feed-001',
    name: 'IRS Tax Brackets',
    lastUpdated: '2023-12-15',
    status: 'current',
    source: 'irs.gov',
    affectedYears: [2023, 2024],
    description: 'Federal income tax brackets and rates'
  },
  {
    id: 'feed-002',
    name: 'Standard Deduction Amounts',
    lastUpdated: '2023-12-10',
    status: 'current',
    source: 'irs.gov',
    affectedYears: [2023, 2024],
    description: 'Standard deduction amounts by filing status'
  },
  {
    id: 'feed-003',
    name: 'State Tax Rates',
    lastUpdated: '2023-11-30',
    status: 'outdated',
    source: 'taxfoundation.org',
    affectedYears: [2023],
    description: 'State income tax rates and brackets'
  },
  {
    id: 'feed-004',
    name: 'Retirement Contribution Limits',
    lastUpdated: '2023-12-01',
    status: 'current',
    source: 'irs.gov',
    affectedYears: [2023, 2024],
    description: '401(k), IRA and other retirement account contribution limits'
  }
];

// Mock data for update history
const updateHistory = [
  {
    id: 'update-001',
    feedId: 'feed-001',
    date: '2023-12-15',
    user: 'system',
    changes: 'Updated 2024 tax brackets with inflation adjustments',
    version: '2024.1.0'
  },
  {
    id: 'update-002',
    feedId: 'feed-002',
    date: '2023-12-10',
    user: 'system',
    changes: 'Updated standard deduction amounts for 2024',
    version: '2024.1.0'
  },
  {
    id: 'update-003',
    feedId: 'feed-003',
    date: '2023-11-30',
    user: 'admin@example.com',
    changes: 'Manual update to California state tax brackets',
    version: '2023.2.1'
  },
  {
    id: 'update-004',
    feedId: 'feed-004',
    date: '2023-12-01',
    user: 'system',
    changes: 'Updated retirement contribution limits for 2024',
    version: '2024.1.0'
  }
];

export default function DataFeedsAndUpdatesPage() {
  const [activeTab, setActiveTab] = useState('feeds');
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [manualUpdateOpen, setManualUpdateOpen] = useState(false);
  const [manualUpdateData, setManualUpdateData] = useState({
    feedId: '',
    changes: '',
    reason: ''
  });

  // Filter update history based on selected feed
  const filteredHistory = selectedFeed 
    ? updateHistory.filter(update => update.feedId === selectedFeed.id)
    : updateHistory;

  const handleManualUpdate = () => {
    // Record the manual override
    recordManualOverride(
      'admin@example.com',
      `Data Feed: ${selectedFeed?.name}`,
      manualUpdateData.changes,
      manualUpdateData.reason
    );
    
    // Close the dialog
    setManualUpdateOpen(false);
    
    // Reset form
    setManualUpdateData({
      feedId: '',
      changes: '',
      reason: ''
    });
    
    // In a real app, we would update the data feed here
    alert('Manual update recorded successfully');
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Data Feeds & Updates</h1>
          <Button onClick={() => alert('Checking for updates...')}>
            <UpdateIcon className="mr-2 h-4 w-4" />
            Check for Updates
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="feeds">Data Feeds</TabsTrigger>
            <TabsTrigger value="history">Update History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="feeds">
            <Card>
              <CardHeader>
                <CardTitle>Active Data Feeds</CardTitle>
                <CardDescription>
                  Tax data feeds that power calculations and analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Years</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataFeeds.map(feed => (
                      <TableRow key={feed.id}>
                        <TableCell className="font-medium">{feed.name}</TableCell>
                        <TableCell>{feed.lastUpdated}</TableCell>
                        <TableCell>
                          {feed.status === 'current' ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <CheckCircledIcon className="mr-1 h-3 w-3" />
                              Current
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              <InfoCircledIcon className="mr-1 h-3 w-3" />
                              Outdated
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{feed.source}</TableCell>
                        <TableCell>{feed.affectedYears.join(', ')}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedFeed(feed)}
                            >
                              Details
                            </Button>
                            <Dialog open={manualUpdateOpen && selectedFeed?.id === feed.id} onOpenChange={setManualUpdateOpen}>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedFeed(feed);
                                    setManualUpdateData({
                                      ...manualUpdateData,
                                      feedId: feed.id
                                    });
                                  }}
                                >
                                  Manual Update
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Manual Data Update</DialogTitle>
                                  <DialogDescription>
                                    Update {feed.name} data manually. This will be logged in the audit trail.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="changes" className="text-right">
                                      Changes
                                    </Label>
                                    <Input
                                      id="changes"
                                      value={manualUpdateData.changes}
                                      onChange={(e) => setManualUpdateData({
                                        ...manualUpdateData,
                                        changes: e.target.value
                                      })}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="reason" className="text-right">
                                      Reason
                                    </Label>
                                    <Input
                                      id="reason"
                                      value={manualUpdateData.reason}
                                      onChange={(e) => setManualUpdateData({
                                        ...manualUpdateData,
                                        reason: e.target.value
                                      })}
                                      className="col-span-3"
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setManualUpdateOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={handleManualUpdate}>
                                    Update Data
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            {selectedFeed && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>{selectedFeed.name} Details</CardTitle>
                  <CardDescription>{selectedFeed.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Source</h3>
                      <p>{selectedFeed.source}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h3>
                      <p>{selectedFeed.lastUpdated}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                      <p>{selectedFeed.status === 'current' ? 'Current' : 'Outdated'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Affected Years</h3>
                      <p>{selectedFeed.affectedYears.join(', ')}</p>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <h3 className="font-medium mb-2">Recent Updates</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Changes</TableHead>
                        <TableHead>Version</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {updateHistory
                        .filter(update => update.feedId === selectedFeed.id)
                        .map(update => (
                          <TableRow key={update.id}>
                            <TableCell>{update.date}</TableCell>
                            <TableCell>{update.user}</TableCell>
                            <TableCell>{update.changes}</TableCell>
                            <TableCell>{update.version}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={() => setSelectedFeed(null)}>
                    Close Details
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Update History</CardTitle>
                <CardDescription>
                  History of all data feed updates and changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Data Feed</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Changes</TableHead>
                      <TableHead>Version</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.map(update => {
                      const feed = dataFeeds.find(f => f.id === update.feedId);
                      return (
                        <TableRow key={update.id}>
                          <TableCell>{update.date}</TableCell>
                          <TableCell>{feed?.name || update.feedId}</TableCell>
                          <TableCell>{update.user}</TableCell>
                          <TableCell>{update.changes}</TableCell>
                          <TableCell>{update.version}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
