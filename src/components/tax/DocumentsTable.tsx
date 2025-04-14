
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Share2, Archive } from "lucide-react";
import { useDocumentContext, Document } from './DocumentContext';

interface DocumentsTableProps {
  onShareDocument: (doc: Document) => void;
  onArchiveDocument: (docId: string) => void;
}

const DocumentsTable: React.FC<DocumentsTableProps> = ({ 
  onShareDocument,
  onArchiveDocument
}) => {
  const { filteredDocuments } = useDocumentContext();

  return (
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
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onShareDocument(doc)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onArchiveDocument(doc.id)}
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
              No active documents found for this year
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default DocumentsTable;
