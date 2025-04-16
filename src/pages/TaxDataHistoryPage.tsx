import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, AlertTriangle } from 'lucide-react';
import { 
  getAllTaxDataVersions, 
  getTaxDataVersionsForYear,
  hasMidYearUpdates
} from '@/utils/taxDataVersioning';
import { TaxDataVersion } from '@/utils/dataFeed/types';

const TaxDataHistoryPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [selectedTab, setSelectedTab] = useState<string>('versions');
  
  // Get all tax data versions
  const allVersions = getAllTaxDataVersions();
  
  // Get unique years from all versions
  const years = [...new Set(allVersions.map(version => version.year))];
  
  // Get versions for the selected year
  const versionsForYear = getTaxDataVersionsForYear(selectedYear);
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Tax Data History</h1>
          <p className="text-muted-foreground">
            Browse historical tax data and track version changes over time
          </p>
        </div>
        
        <div className="flex items-center mt-4 md:mt-0">
          <span className="mr-2 text-sm text-muted-foreground">Select Year:</span>
          <Select 
            value={selectedYear.toString()} 
            onValueChange={(value) => setSelectedYear(parseInt(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.sort((a, b) => b - a).map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {hasMidYearUpdates(selectedYear) && (
        <Card className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30">
          <CardContent className="flex items-center pt-6">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
            <p className="text-sm text-yellow-800 dark:text-yellow-400">
              This tax year has multiple versions due to mid-year legislative changes. Make sure to use the correct version for your specific scenario date.
            </p>
          </CardContent>
        </Card>
      )}
      
      <Tabs 
        defaultValue="versions" 
        value={selectedTab} 
        onValueChange={setSelectedTab} 
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="versions">Version History</TabsTrigger>
          <TabsTrigger value="changes">Data Changes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="versions">
          <Card>
            <CardHeader>
              <CardTitle>Version History for {selectedYear}</CardTitle>
              <CardDescription>
                All tax data versions for the selected year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>Effective Date</TableHead>
                    <TableHead>Published Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {versionsForYear.length > 0 ? (
                    versionsForYear
                      .sort((a, b) => new Date(b.effective_date).getTime() - new Date(a.effective_date).getTime())
                      .map((version) => (
                        <TableRow key={version.id}>
                          <TableCell className="font-medium">{version.version}</TableCell>
                          <TableCell>{new Date(version.effective_date).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(version.published_date).toLocaleDateString()}</TableCell>
                          <TableCell>{version.description || 'No description'}</TableCell>
                          <TableCell>
                            {version.is_projected ? (
                              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Projected</Badge>
                            ) : version.is_correction ? (
                              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Correction</Badge>
                            ) : (
                              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Official</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No versions found for this year
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="changes">
          <Card>
            <CardHeader>
              <CardTitle>Data Changes for {selectedYear}</CardTitle>
              <CardDescription>
                Detailed changes between tax data versions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {versionsForYear.length > 1 ? (
                  versionsForYear
                    .sort((a, b) => new Date(b.effective_date).getTime() - new Date(a.effective_date).getTime())
                    .slice(0, -1) // Skip the oldest version since there's nothing to compare it to
                    .map((version, index) => {
                      // Get the previous version to compare with
                      const prevVersion = versionsForYear.sort((a, b) => 
                        new Date(b.effective_date).getTime() - new Date(a.effective_date).getTime()
                      )[index + 1];
                      
                      return (
                        <div key={version.id} className="border rounded-lg p-4">
                          <h3 className="text-lg font-semibold mb-2">
                            Version {version.version} (effective {new Date(version.effective_date).toLocaleDateString()})
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Changes from version {prevVersion.version} (effective {new Date(prevVersion.effective_date).toLocaleDateString()})
                          </p>
                          
                          <div className="mt-4">
                            <p className="text-sm text-muted-foreground italic">
                              In a real application, this would show detailed changes between versions, such as:
                            </p>
                            <ul className="list-disc list-inside mt-2 text-sm space-y-1 text-muted-foreground">
                              <li>Standard deduction for single filers increased from $12,950 to $13,850</li>
                              <li>The 22% tax bracket threshold raised from $89,075 to $95,375 for single filers</li>
                              <li>New capital gains thresholds established</li>
                            </ul>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="flex flex-col items-center py-8">
                    <Info className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-center text-muted-foreground">
                      {versionsForYear.length === 0 
                        ? "No versions found for this year" 
                        : "Only one version exists for this year, so there are no changes to compare"}
                    </p>
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

export default TaxDataHistoryPage;
