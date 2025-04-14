
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Share2, Users, History, Search, Plus, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for shared scenarios
const mockSharedScenarios = [
  {
    id: '1',
    name: 'Roth Conversion 2025-2035',
    type: 'roth',
    sharedWith: 'john.advisor@example.com',
    sharedDate: '2024-04-10',
    status: 'viewed'
  },
  {
    id: '2',
    name: 'Estate Planning Strategy',
    type: 'estate',
    sharedWith: 'estate.planner@example.com',
    sharedDate: '2024-04-08',
    status: 'pending'
  },
  {
    id: '3',
    name: 'Charitable Giving Plan',
    type: 'charitable',
    sharedWith: 'tax.advisor@example.com',
    sharedDate: '2024-04-05',
    status: 'viewed'
  },
  {
    id: '4',
    name: 'S-Corp Analysis for 2024',
    type: 'business',
    sharedWith: 'accountant@example.com',
    sharedDate: '2024-04-01',
    status: 'downloaded'
  }
];

// Mock data for advisors
const mockAdvisors = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.advisor@example.com',
    role: 'CPA',
    access: 'Full Access'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'estate.planner@example.com',
    role: 'Estate Planner',
    access: 'Limited Access'
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'tax.advisor@example.com',
    role: 'Tax Advisor',
    access: 'Full Access'
  }
];

const CollaborationCenterPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredScenarios = mockSharedScenarios.filter(scenario => 
    scenario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scenario.sharedWith.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredAdvisors = mockAdvisors.filter(advisor => 
    advisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    advisor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    advisor.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'viewed':
        return <Badge variant="outline" className="bg-blue-900/30 text-blue-400 border-blue-600/30">Viewed</Badge>;
      case 'downloaded':
        return <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-600/30">Downloaded</Badge>;
      case 'pending':
      default:
        return <Badge variant="outline" className="bg-yellow-900/30 text-yellow-400 border-yellow-600/30">Pending</Badge>;
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'roth':
        return <Badge className="bg-purple-900/30 text-purple-300 border-purple-600/30">Roth Conversion</Badge>;
      case 'estate':
        return <Badge className="bg-blue-900/30 text-blue-300 border-blue-600/30">Estate Planning</Badge>;
      case 'charitable':
        return <Badge className="bg-green-900/30 text-green-300 border-green-600/30">Charitable</Badge>;
      case 'business':
        return <Badge className="bg-amber-900/30 text-amber-300 border-amber-600/30">Business</Badge>;
      case 'deferred':
        return <Badge className="bg-indigo-900/30 text-indigo-300 border-indigo-600/30">Equity Comp</Badge>;
      default:
        return <Badge className="bg-gray-900/30 text-gray-300 border-gray-600/30">Other</Badge>;
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Collaboration Center</h1>
          <p className="text-muted-foreground">
            Manage your shared tax scenarios and advisor permissions
          </p>
        </div>
        <Link to="/tax-planning/tax-tools" className="border border-primary hover:bg-primary/10 px-4 py-2 rounded-md text-primary transition-colors flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Tax Tools
        </Link>
      </div>

      <Card className="border-[#353e52] bg-[#1A1F2C]">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-white">Manage Collaborations</CardTitle>
            <div className="relative w-64">
              <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#242A38] border-[#353e52]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="shared-scenarios" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="shared-scenarios" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Shared Scenarios
              </TabsTrigger>
              <TabsTrigger value="advisors" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Advisors & Access
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Sharing History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="shared-scenarios" className="mt-0">
              <div className="rounded-md bg-[#242A38] border border-[#353e52]">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#353e52] hover:bg-[#2A2F3C]">
                      <TableHead className="text-white">Scenario Name</TableHead>
                      <TableHead className="text-white">Type</TableHead>
                      <TableHead className="text-white">Shared With</TableHead>
                      <TableHead className="text-white">Date Shared</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredScenarios.map(scenario => (
                      <TableRow key={scenario.id} className="border-[#353e52] hover:bg-[#2A2F3C]">
                        <TableCell className="font-medium text-white">{scenario.name}</TableCell>
                        <TableCell>{getTypeIcon(scenario.type)}</TableCell>
                        <TableCell>{scenario.sharedWith}</TableCell>
                        <TableCell>{scenario.sharedDate}</TableCell>
                        <TableCell>{getStatusBadge(scenario.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" className="h-8">
                              <FileText className="h-3.5 w-3.5 mr-1" />
                              View
                            </Button>
                            <Button variant="destructive" size="sm" className="h-8">Revoke</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="advisors" className="mt-0">
              <div className="flex justify-end mb-4">
                <Button className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  Add New Advisor
                </Button>
              </div>
              <div className="rounded-md bg-[#242A38] border border-[#353e52]">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#353e52] hover:bg-[#2A2F3C]">
                      <TableHead className="text-white">Advisor Name</TableHead>
                      <TableHead className="text-white">Email</TableHead>
                      <TableHead className="text-white">Role</TableHead>
                      <TableHead className="text-white">Access Level</TableHead>
                      <TableHead className="text-white text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAdvisors.map(advisor => (
                      <TableRow key={advisor.id} className="border-[#353e52] hover:bg-[#2A2F3C]">
                        <TableCell className="font-medium text-white">{advisor.name}</TableCell>
                        <TableCell>{advisor.email}</TableCell>
                        <TableCell>{advisor.role}</TableCell>
                        <TableCell>{advisor.access}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" className="h-8">Edit</Button>
                            <Button variant="destructive" size="sm" className="h-8">Remove</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="mt-0">
              <Card className="border border-[#353e52] bg-[#242A38]">
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground py-12">
                    Detailed sharing history will be available in a future update.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollaborationCenterPage;
