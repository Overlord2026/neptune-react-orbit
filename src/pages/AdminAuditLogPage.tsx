
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Calendar, 
  RotateCcw, 
  Shield, 
  Filter, 
  File, 
  FileCog, 
  ArrowLeft, 
  ArrowRight 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogClose 
} from '@/components/ui/dialog';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AuditLogEntry } from '@/utils/audit/types';
import { getAuditLogs, performRollback, getCurrentUserId, hasAdminPermission } from '@/utils/audit';
import { getDataFeeds } from '@/utils/dataFeedUtils';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 10;

const AdminAuditLogPage: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([]);
  const [dataFeeds, setDataFeeds] = useState<{id: string, name: string}[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [rollbackReason, setRollbackReason] = useState('');
  const [selectedLogForDetail, setSelectedLogForDetail] = useState<AuditLogEntry | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    dataFeedId: '',
    action: '',
    searchTerm: ''
  });

  useEffect(() => {
    // Check if user has admin permissions
    const userId = getCurrentUserId();
    setIsAdmin(hasAdminPermission(userId));
    
    // Get data feeds for filter dropdown
    const feeds = getDataFeeds().map(feed => ({
      id: feed.id,
      name: feed.name
    }));
    setDataFeeds(feeds);
    
    // Load initial audit logs
    loadAuditLogs();
  }, []);
  
  useEffect(() => {
    // Apply filters whenever they change
    applyFilters();
  }, [filters, auditLogs]);
  
  useEffect(() => {
    // Update total pages when filtered logs change
    setTotalPages(Math.ceil(filteredLogs.length / ITEMS_PER_PAGE));
  }, [filteredLogs]);
  
  const loadAuditLogs = () => {
    const logs = getAuditLogs();
    setAuditLogs(logs);
    setFilteredLogs(logs);
    setTotalPages(Math.ceil(logs.length / ITEMS_PER_PAGE));
  };
  
  const applyFilters = () => {
    let filtered = [...auditLogs];
    
    if (filters.startDate) {
      filtered = filtered.filter(log => 
        new Date(log.timestamp) >= new Date(filters.startDate)
      );
    }
    
    if (filters.endDate) {
      // Set time to end of day for end date
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(log => 
        new Date(log.timestamp) <= endDate
      );
    }
    
    if (filters.dataFeedId) {
      filtered = filtered.filter(log => 
        log.data_feed_id === filters.dataFeedId
      );
    }
    
    if (filters.action) {
      filtered = filtered.filter(log => 
        log.action === filters.action
      );
    }
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(log => 
        log.id.toLowerCase().includes(term) ||
        (log.user_id && log.user_id.toLowerCase().includes(term)) ||
        (log.reason && log.reason.toLowerCase().includes(term)) ||
        JSON.stringify(log.changes_made).toLowerCase().includes(term)
      );
    }
    
    setFilteredLogs(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const resetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      dataFeedId: '',
      action: '',
      searchTerm: ''
    });
  };
  
  const handleRollback = async (logId: string) => {
    if (!rollbackReason.trim()) {
      toast.error("Please provide a reason for the rollback");
      return;
    }
    
    const userId = getCurrentUserId();
    const success = await performRollback(logId, userId, rollbackReason);
    
    if (success) {
      // Reload logs to include the new rollback entry
      loadAuditLogs();
      setRollbackReason('');
    }
  };
  
  const getPaginatedLogs = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredLogs.slice(startIndex, endIndex);
  };
  
  const getActionBadge = (action: string) => {
    switch (action) {
      case 'auto_update':
        return { color: 'bg-blue-100 text-blue-800', icon: <FileCog className="h-3 w-3 mr-1" /> };
      case 'manual_update':
        return { color: 'bg-purple-100 text-purple-800', icon: <File className="h-3 w-3 mr-1" /> };
      case 'manual_override':
        return { color: 'bg-amber-100 text-amber-800', icon: <Shield className="h-3 w-3 mr-1" /> };
      case 'rollback':
        return { color: 'bg-red-100 text-red-800', icon: <RotateCcw className="h-3 w-3 mr-1" /> };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: null };
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy h:mm a');
  };
  
  const formatActionName = (action: string) => {
    switch (action) {
      case 'auto_update': return 'Auto Update';
      case 'manual_update': return 'Manual Update';
      case 'manual_override': return 'Manual Override';
      case 'rollback': return 'Rollback';
      default: return action;
    }
  };

  // If user doesn't have admin permissions, show access denied
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Card className="w-[600px]">
          <CardHeader>
            <CardTitle className="text-red-500 flex items-center">
              <Shield className="mr-2" />
              Access Denied
            </CardTitle>
            <CardDescription>
              You do not have permission to access the Admin Audit Log.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>This page is restricted to administrators only. Please contact your system administrator if you believe you should have access.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Audit Log</h1>
          <p className="text-muted-foreground mt-2">
            View and manage audit logs for all tax data changes.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Narrow down audit logs by date, data feed, or action type.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input 
                id="start-date" 
                type="date" 
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input 
                id="end-date" 
                type="date" 
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="data-feed">Data Feed</Label>
              <Select 
                value={filters.dataFeedId} 
                onValueChange={(value) => handleFilterChange('dataFeedId', value)}
              >
                <SelectTrigger id="data-feed">
                  <SelectValue placeholder="All data feeds" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All data feeds</SelectItem>
                  {dataFeeds.map(feed => (
                    <SelectItem key={feed.id} value={feed.id}>
                      {feed.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="action-type">Action Type</Label>
              <Select 
                value={filters.action} 
                onValueChange={(value) => handleFilterChange('action', value)}
              >
                <SelectTrigger id="action-type">
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All actions</SelectItem>
                  <SelectItem value="auto_update">Auto Update</SelectItem>
                  <SelectItem value="manual_update">Manual Update</SelectItem>
                  <SelectItem value="manual_override">Manual Override</SelectItem>
                  <SelectItem value="rollback">Rollback</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="flex gap-2">
                <Input 
                  id="search" 
                  placeholder="Search by ID, user, reason..." 
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={resetFilters}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audit Log Entries</CardTitle>
          <CardDescription>
            Showing {filteredLogs.length} entries. Page {currentPage} of {totalPages}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead className="w-[130px]">Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Data Feed</TableHead>
                <TableHead className="text-center">Changes</TableHead>
                <TableHead className="text-right w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getPaginatedLogs().map(log => {
                const actionBadge = getActionBadge(log.action);
                const dataFeed = dataFeeds.find(df => df.id === log.data_feed_id);
                return (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{formatDate(log.timestamp)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`flex items-center ${actionBadge.color}`}>
                        {actionBadge.icon}
                        {formatActionName(log.action)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {log.user_id || 'System'}
                    </TableCell>
                    <TableCell>
                      {dataFeed?.name || log.data_feed_id}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedLogForDetail(log)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      {log.action !== 'rollback' && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-500 border-red-200 hover:bg-red-50"
                            >
                              <RotateCcw className="h-3 w-3 mr-1" />
                              Rollback
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Rollback</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to rollback changes from this audit log? This action will revert all changes made in this update.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <Label htmlFor="rollback-reason">Reason for Rollback</Label>
                              <Textarea 
                                id="rollback-reason" 
                                value={rollbackReason}
                                onChange={(e) => setRollbackReason(e.target.value)}
                                placeholder="Please provide a reason for this rollback"
                              />
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button 
                                  variant="destructive"
                                  onClick={() => handleRollback(log.id)}
                                >
                                  Confirm Rollback
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              
              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No audit logs match the current filters. Try adjusting your search criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {Math.min(filteredLogs.length, ITEMS_PER_PAGE)} of {filteredLogs.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      {selectedLogForDetail && (
        <Dialog open={!!selectedLogForDetail} onOpenChange={() => setSelectedLogForDetail(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Audit Log Details</DialogTitle>
              <DialogDescription>
                {formatDate(selectedLogForDetail.timestamp)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground">ID</Label>
                  <div className="font-mono text-sm">{selectedLogForDetail.id}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Action</Label>
                  <div>{formatActionName(selectedLogForDetail.action)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">User</Label>
                  <div>{selectedLogForDetail.user_id || 'System'}</div>
                </div>
              </div>
              
              <div>
                <Label className="text-muted-foreground">Data Feed</Label>
                <div>
                  {dataFeeds.find(df => df.id === selectedLogForDetail.data_feed_id)?.name || 
                    selectedLogForDetail.data_feed_id}
                </div>
              </div>
              
              {selectedLogForDetail.reason && (
                <div>
                  <Label className="text-muted-foreground">Reason</Label>
                  <div>{selectedLogForDetail.reason}</div>
                </div>
              )}
              
              {selectedLogForDetail.version_id && (
                <div>
                  <Label className="text-muted-foreground">Version ID</Label>
                  <div className="font-mono text-sm">{selectedLogForDetail.version_id}</div>
                </div>
              )}
              
              <div>
                <Label className="text-muted-foreground">Affected Years</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedLogForDetail.affected_years?.map(year => (
                    <Badge key={year} variant="outline">{year}</Badge>
                  )) || 'None specified'}
                </div>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="changes">
                  <AccordionTrigger>Changes Made</AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 bg-muted/50 rounded-md font-mono text-sm whitespace-pre-wrap">
                      {JSON.stringify(selectedLogForDetail.changes_made, null, 2)}
                    </div>
                    
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Added</Label>
                        <div>{selectedLogForDetail.changes_made.added || 0}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Modified</Label>
                        <div>{selectedLogForDetail.changes_made.modified || 0}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Removed</Label>
                        <div>{selectedLogForDetail.changes_made.removed || 0}</div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminAuditLogPage;
