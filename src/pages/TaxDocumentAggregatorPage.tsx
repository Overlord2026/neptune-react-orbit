
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeft, FileText, Upload, Scan, Calendar, Search, Bot, AlertTriangle } from "lucide-react";

// Sample document data
const documentsByYear = {
  "2023": [
    { id: "1", name: "W-2", source: "Employer Inc.", uploadDate: "2024-01-15", type: "Income" },
    { id: "2", name: "1099-INT", source: "Bank of America", uploadDate: "2024-01-20", type: "Interest" },
    { id: "3", name: "Mortgage Interest Statement", source: "Wells Fargo", uploadDate: "2024-02-01", type: "Deduction" }
  ],
  "2022": [
    { id: "4", name: "W-2", source: "Employer Inc.", uploadDate: "2023-01-18", type: "Income" },
    { id: "5", name: "1098-T", source: "State University", uploadDate: "2023-02-05", type: "Education" }
  ],
  "2021": [
    { id: "6", name: "W-2", source: "Previous Employer", uploadDate: "2022-01-20", type: "Income" },
    { id: "7", name: "1099-MISC", source: "Freelance Client", uploadDate: "2022-01-25", type: "Income" }
  ]
};

// Missing documents suggestion
const missingDocuments = [
  { year: "2023", documentType: "1098-E", description: "Student Loan Interest" },
  { year: "2022", documentType: "1099-DIV", description: "Dividends and Distributions" },
  { year: "2023", documentType: "Property Tax Statement", description: "Real Estate Taxes" }
];

const TaxDocumentAggregatorPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("2023");
  const years = Object.keys(documentsByYear).sort().reverse();
  
  // Filter documents based on search query
  const filteredDocuments = selectedYear
    ? documentsByYear[selectedYear].filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.source.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Tax Document Aggregator</h1>
          <p className="text-muted-foreground">Scan, Upload, and Organize Your Tax Documents by Year</p>
        </div>
        <Link to="/tax-planning" className="border border-primary hover:bg-primary/10 px-4 py-2 rounded-md text-primary transition-colors flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Tax Planning Hub
        </Link>
      </div>
      
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg text-primary">Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Easily store, categorize, and share your tax documents in one place.
            Upload statements from employers, banks, and other institutions to keep them organized for tax preparation.
          </p>
        </CardContent>
      </Card>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/4 flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-primary">Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button className="w-full justify-start">
                <Upload className="mr-2 h-4 w-4" />
                Upload Documents
              </Button>
              <Button className="w-full justify-start">
                <Scan className="mr-2 h-4 w-4" />
                Scan Documents
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                View Documents by Year
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button className="w-full justify-start" variant="outline">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Missing Document Report
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Missing Document Report</SheetTitle>
                    <SheetDescription>
                      Based on your tax history, you might be missing these documents:
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tax Year</TableHead>
                          <TableHead>Document</TableHead>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {missingDocuments.map((doc, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{doc.year}</TableCell>
                            <TableCell>{doc.documentType}</TableCell>
                            <TableCell>{doc.description}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </SheetContent>
              </Sheet>
              <Button className="w-full justify-start" variant="outline">
                <Bot className="mr-2 h-4 w-4" />
                AI Assistant
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-primary">Tax Years</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {years.map(year => (
                <Button 
                  key={year} 
                  variant={year === selectedYear ? "default" : "ghost"} 
                  className="justify-start"
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                  <Badge variant="outline" className="ml-2">
                    {documentsByYear[year].length}
                  </Badge>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full md:w-3/4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-primary">
                Documents for {selectedYear}
              </CardTitle>
              <div className="w-full max-w-sm">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date Added</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-primary" />
                            {doc.name}
                          </div>
                        </TableCell>
                        <TableCell>{doc.source}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{doc.type}</Badge>
                        </TableCell>
                        <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="ghost" size="sm">Download</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {searchQuery 
                          ? "No documents match your search criteria" 
                          : "No documents found for this year"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between border-t py-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredDocuments.length} documents
              </div>
              <Button variant="outline" size="sm">
                Export List
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaxDocumentAggregatorPage;
