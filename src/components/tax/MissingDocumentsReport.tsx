
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, UploadCloud } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useDocumentContext, missingDocuments } from './DocumentContext';

interface MissingDocumentsReportProps {
  onRequestUpload: (docType: string) => void;
}

const MissingDocumentsReport: React.FC<MissingDocumentsReportProps> = ({ 
  onRequestUpload 
}) => {
  const { selectedYear } = useDocumentContext();

  // Filter missing documents by the selected year if provided
  const filteredMissingDocs = selectedYear
    ? missingDocuments.filter(doc => doc.year === selectedYear)
    : missingDocuments;

  return (
    <div className="space-y-6">
      <Card className="bg-[#273549] border-[#334155]">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-white">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Missing Document Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p className="text-gray-300">
            Based on your tax profile and history, we've identified potential missing tax documents
            that might be relevant for your tax preparation or planning.
          </p>
        </CardContent>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-white">Tax Year</TableHead>
            <TableHead className="text-white">Document Type</TableHead>
            <TableHead className="text-white">Importance</TableHead>
            <TableHead className="text-white">Description</TableHead>
            <TableHead className="text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMissingDocs.map((doc, idx) => (
            <TableRow key={idx} className="hover:bg-[#334155]/50">
              <TableCell className="text-gray-300">{doc.year}</TableCell>
              <TableCell className="text-gray-300">{doc.documentType}</TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={
                    doc.documentType.includes("W-2") || doc.documentType.includes("1099") 
                      ? "border-red-500 text-red-500 bg-red-500/20" 
                      : "border-yellow-500 text-yellow-500 bg-yellow-500/20"
                  }
                >
                  {doc.documentType.includes("W-2") || doc.documentType.includes("1099") 
                    ? "Required" 
                    : "Recommended"}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-300">{doc.description}</TableCell>
              <TableCell>
                <Button 
                  size="sm" 
                  onClick={() => onRequestUpload(doc.documentType)}
                  className="flex items-center gap-1 bg-[#0284c7] hover:bg-[#0369a1] text-white"
                >
                  <UploadCloud className="h-3 w-3" />
                  Upload
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Card className="bg-yellow-500/10 border-yellow-500/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <h3 className="font-medium mb-1 text-white">Why are these documents important?</h3>
              <p className="text-sm text-gray-300">
                Missing tax documents can lead to incomplete tax filings, missed deductions,
                or potential issues with tax authorities. Upload these documents to ensure
                your tax preparation is comprehensive.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MissingDocumentsReport;
