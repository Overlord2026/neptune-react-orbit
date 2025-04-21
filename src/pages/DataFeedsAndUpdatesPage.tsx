
import React from 'react';
import { 
  RefreshCw, // Use RefreshCw instead of UpdateIcon which doesn't exist
  ChevronRight, 
  Calendar, 
  AlertTriangle, 
  Check, 
  Clock,
  Download,
  FileText 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { dataFeeds, dataFeedLogs, taxDataCache } from '@/utils/dataFeed';

// Add formatTimestamp function since it's missing from the imported module
const formatTimestamp = (timestamp: string | Date): string => {
  if (!timestamp) return 'N/A';
  
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

const DataFeedsAndUpdatesPage: React.FC = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Data Feeds & Updates</h1>

      <DataFeedCard>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tax Data Feeds</h2>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh All
          </Button>
        </div>
        <DataTable data={dataFeeds} />
      </DataFeedCard>

      <DataFeedCard>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Audit Logs</h2>
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            View Full Logs
          </Button>
        </div>
        <AuditLogTable data={dataFeedLogs} />
      </DataFeedCard>

      <DataFeedCard>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tax Data Cache</h2>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Cache
          </Button>
        </div>
        <TaxDataCacheDisplay data={taxDataCache} />
      </DataFeedCard>
    </div>
  );
};

// Fix the component that has the type error
const DataFeedCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="border p-4 rounded-md bg-white shadow-sm mb-4">
      {children}
    </div>
  );
};

const DataTable = ({ data }: { data: any[] }) => {
  return (
    <Table>
      <TableCaption>A list of your recent tax data feeds.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Status</TableHead>
          <TableHead>Data Source</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((feed) => (
          <TableRow key={feed.id}>
            <TableCell>
              {feed.status === 'active' ? (
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Active</Badge>
              ) : (
                <Badge variant="destructive">Inactive</Badge>
              )}
            </TableCell>
            <TableCell>{feed.source}</TableCell>
            <TableCell>{formatTimestamp(feed.lastUpdated)}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm">
                Details <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const AuditLogTable = ({ data }: { data: any[] }) => {
  return (
    <Accordion type="single" collapsible>
      {data.map((log) => (
        <AccordionItem value={log.id} key={log.id}>
          <AccordionTrigger className="flex items-center justify-between py-3">
            <div className="flex items-center">
              {log.type === 'SECURITY_EVENT' ? (
                <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
              ) : (
                <Check className="mr-2 h-4 w-4 text-green-500" />
              )}
              {log.action} - {log.user}
            </div>
            <Clock className="h-4 w-4 text-gray-500" />
          </AccordionTrigger>
          <AccordionContent>
            <div className="text-sm text-gray-500 space-y-2">
              <p>
                <strong>Timestamp:</strong> {formatTimestamp(log.timestamp)}
              </p>
              <p>
                <strong>Details:</strong> {JSON.stringify(log.details)}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

const TaxDataCacheDisplay = ({ data }: { data: any }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cache Details</CardTitle>
        <CardDescription>Information about the current tax data cache.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center space-x-4">
          <Calendar className="h-4 w-4 text-gray-500" />
          <p className="text-sm">
            Last Updated: <strong>{formatTimestamp(data.dataUpdatedAt)}</strong>
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Check className="h-4 w-4 text-gray-500" />
          <p className="text-sm">
            Is Current: <strong>{data.isCurrent ? 'Yes' : 'No'}</strong>
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Label htmlFor="session-id">Session ID</Label>
          <Input type="text" id="session-id" value={data.sessionId} readOnly />
        </div>
      </CardContent>
    </Card>
  );
};

export default DataFeedsAndUpdatesPage;
