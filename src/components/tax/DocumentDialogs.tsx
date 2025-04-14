
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scan, Sparkles, AlertTriangle } from "lucide-react";
import DocumentUploader from './DocumentUploader';
import MissingDocumentsReport from './MissingDocumentsReport';

interface DocumentDialogsProps {
  showUploadDialog: boolean;
  setShowUploadDialog: (show: boolean) => void;
  showScanSheet: boolean;
  setShowScanSheet: (show: boolean) => void;
  showMissingDocsDialog: boolean;
  setShowMissingDocsDialog: (show: boolean) => void;
  enableAIClassification: boolean;
  handleRequestUpload: (docType: string) => void;
}

const DocumentDialogs: React.FC<DocumentDialogsProps> = ({
  showUploadDialog,
  setShowUploadDialog,
  showScanSheet,
  setShowScanSheet,
  showMissingDocsDialog,
  setShowMissingDocsDialog,
  enableAIClassification,
  handleRequestUpload
}) => {
  return (
    <>
      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Upload Tax Documents</DialogTitle>
            <DialogDescription>
              Upload and classify your tax documents for secure storage and easy access
              {enableAIClassification && (
                <span className="flex items-center mt-2 text-primary">
                  <Sparkles className="h-4 w-4 mr-1" /> 
                  AI classification is enabled
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[calc(80vh-200px)] overflow-y-auto pr-1">
            <DocumentUploader />
          </div>
        </DialogContent>
      </Dialog>

      {/* Scan Documents Sheet */}
      <Sheet open={showScanSheet} onOpenChange={setShowScanSheet}>
        <SheetContent className="w-full md:w-[600px]">
          <SheetHeader>
            <SheetTitle>Scan Documents</SheetTitle>
            <SheetDescription>
              Use your device camera or connected scanner to digitize tax documents
              {enableAIClassification && (
                <span className="flex items-center mt-2 text-primary">
                  <Sparkles className="h-4 w-4 mr-1" /> 
                  AI classification is enabled - scanned documents will be automatically analyzed
                </span>
              )}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md">
                  <Scan className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2 text-center">Connect a Scanner or Use Camera</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Position your document in the scanner or in view of your camera
                  </p>
                  <Button>Start Scanning</Button>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start border-t pt-4">
                <div className="flex items-start gap-3 text-sm">
                  <AlertTriangle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-muted-foreground">
                      Once scanned, your document will be processed through the same classification system as uploaded files.
                    </p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </SheetContent>
      </Sheet>

      {/* Missing Documents Dialog */}
      <Dialog open={showMissingDocsDialog} onOpenChange={setShowMissingDocsDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Missing Documents Report</DialogTitle>
            <DialogDescription>
              Check for potential missing tax documents based on your financial profile
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[calc(80vh-200px)] overflow-y-auto pr-1">
            <MissingDocumentsReport 
              onRequestUpload={handleRequestUpload}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentDialogs;
