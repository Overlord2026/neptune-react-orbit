
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { dynamicContentPlaceholders } from '@/utils/dynamicContentUtils';
import { Search } from 'lucide-react';

const PlaceholdersReferenceSection = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const filteredPlaceholders = dynamicContentPlaceholders.filter(
    placeholder => 
      placeholder.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      placeholder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      placeholder.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      placeholder.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const categoryColors: Record<string, string> = {
    'deduction': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'contribution': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'date': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'rate': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    'other': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dynamic Content Placeholders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-4">
            These placeholders can be used in educational content to dynamically insert the latest tax data values.
            Use the format <code>&#123;&#123;placeholder_id&#125;&#125;</code> in content.
          </p>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search placeholders..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Placeholder ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead className="w-[100px]">Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlaceholders.map((placeholder) => (
                <TableRow key={placeholder.id}>
                  <TableCell className="font-mono text-sm">
                    &#123;&#123;{placeholder.id}&#125;&#125;
                  </TableCell>
                  <TableCell>{placeholder.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{placeholder.description}</TableCell>
                  <TableCell>
                    <Badge className={categoryColors[placeholder.category] || ''}>
                      {placeholder.category}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPlaceholders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No placeholders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlaceholdersReferenceSection;
