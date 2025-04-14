
import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { missingDocuments } from './DocumentContext';

interface MissingDocumentSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestUpload: (docType: string) => void;
}

const MissingDocumentSheet: React.FC<MissingDocumentSheetProps> = ({ 
  isOpen, 
  onOpenChange,
  onRequestUpload
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
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
  );
};

export default MissingDocumentSheet;
