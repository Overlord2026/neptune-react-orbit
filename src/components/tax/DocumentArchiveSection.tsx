
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { FileText, Archive, RefreshCw, AlertTriangle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  archiveDocument, 
  restoreDocument, 
  archiveMultipleDocuments, 
  restoreMultipleDocuments,
  archiveDocumentsByYear,
  restoreDocumentsByYear
} from '@/utils/documentArchiveUtils';
import { useDocumentContext } from './DocumentContext';

interface DocumentArchiveSectionProps {
  selectedYear: string;
  onArchiveStatusChange: () => void;
}

const DocumentArchiveSection: React.FC<DocumentArchiveSectionProps> = ({ 
  selectedYear,
  onArchiveStatusChange 
}) => {
  const { toast } = useToast();
  const { documents } = useDocumentContext();
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [archiveAll, setArchiveAll] = useState(false);
  const [restoreAll, setRestoreAll] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter documents by archive status and selected year
  const documentsList = documents[selectedYear] || [];
  const archivedDocs = documentsList.filter(doc => doc.archived);
  const activeDocs = documentsList.filter(doc => !doc.archived);

  // Handle selecting a document
  const handleSelectDoc = (docId: string) => {
    setSelectedDocs(prev => 
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    );
  };

  // Handle archiving documents
  const handleArchive = async () => {
    setIsProcessing(true);
    try {
      let success = false;
      
      if (archiveAll) {
        success = await archiveDocumentsByYear(selectedYear);
      } else {
        success = await archiveMultipleDocuments(selectedDocs);
      }
      
      if (success) {
        toast({
          title: "Documents Archived",
          description: archiveAll 
            ? `All documents for ${selectedYear} have been archived.` 
            : `${selectedDocs.length} document(s) have been archived.`,
        });
        setSelectedDocs([]);
        onArchiveStatusChange();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to archive documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setShowArchiveDialog(false);
      setArchiveAll(false);
    }
  };

  // Handle restoring documents
  const handleRestore = async () => {
    setIsProcessing(true);
    try {
      let success = false;
      
      if (restoreAll) {
        success = await restoreDocumentsByYear(selectedYear);
      } else {
        success = await restoreMultipleDocuments(selectedDocs);
      }
      
      if (success) {
        toast({
          title: "Documents Restored",
          description: restoreAll 
            ? `All archived documents for ${selectedYear} have been restored.` 
            : `${selectedDocs.length} document(s) have been restored.`,
        });
        setSelectedDocs([]);
        onArchiveStatusChange();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to restore documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setShowRestoreDialog(false);
      setRestoreAll(false);
    }
  };

  const openArchiveDialog = (archiveAllDocs = false) => {
    setArchiveAll(archiveAllDocs);
    setShowArchiveDialog(true);
  };

  const openRestoreDialog = (restoreAllDocs = false) => {
    setRestoreAll(restoreAllDocs);
    setShowRestoreDialog(true);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Active Documents Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-primary">Active Documents ({activeDocs.length})</CardTitle>
            <div className="flex gap-2">
              {selectedDocs.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => openArchiveDialog()}
                  disabled={!selectedDocs.some(id => activeDocs.find(d => d.id === id))}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Archive Selected
                </Button>
              )}
              {activeDocs.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => openArchiveDialog(true)}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Archive All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {activeDocs.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date Added</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeDocs.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedDocs.includes(doc.id)}
                          onCheckedChange={() => handleSelectDoc(doc.id)}
                        />
                      </TableCell>
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedDocs([doc.id]);
                            openArchiveDialog();
                          }}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No active documents found for {selectedYear}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Archived Documents Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-primary">Archived Documents ({archivedDocs.length})</CardTitle>
            <div className="flex gap-2">
              {selectedDocs.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => openRestoreDialog()}
                  disabled={!selectedDocs.some(id => archivedDocs.find(d => d.id === id))}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Restore Selected
                </Button>
              )}
              {archivedDocs.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => openRestoreDialog(true)}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Restore All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {archivedDocs.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date Added</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {archivedDocs.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedDocs.includes(doc.id)}
                          onCheckedChange={() => handleSelectDoc(doc.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          {doc.name}
                        </div>
                      </TableCell>
                      <TableCell>{doc.source}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.type}</Badge>
                      </TableCell>
                      <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedDocs([doc.id]);
                            openRestoreDialog();
                          }}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No archived documents found for {selectedYear}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Archive Dialog */}
      <Dialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive Documents</DialogTitle>
            <DialogDescription>
              {archiveAll 
                ? `Are you sure you want to archive all documents for ${selectedYear}?` 
                : `Are you sure you want to archive ${selectedDocs.length} selected document(s)?`}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 bg-muted p-3 rounded-md">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <p className="text-sm">
              Archived documents can be restored later if needed.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowArchiveDialog(false)}>Cancel</Button>
            <Button onClick={handleArchive} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Archive Documents"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Dialog */}
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore Documents</DialogTitle>
            <DialogDescription>
              {restoreAll 
                ? `Are you sure you want to restore all archived documents for ${selectedYear}?` 
                : `Are you sure you want to restore ${selectedDocs.length} selected document(s)?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRestoreDialog(false)}>Cancel</Button>
            <Button onClick={handleRestore} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Restore Documents"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentArchiveSection;
