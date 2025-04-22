
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
        <DialogContent className="max-w-4xl bg-[#1e293b] border-[#334155]">
          <DialogHeader>
            <DialogTitle className="text-white">Upload Tax Documents</DialogTitle>
            <DialogDescription className="text-gray-300">
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
        <SheetContent className="w-full md:w-[600px] bg-[#1e293b] border-[#334155]">
          <SheetHeader>
            <SheetTitle className="text-white">Scan Documents</SheetTitle>
            <SheetDescription className="text-gray-300">
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
            <Card className="bg-[#273549] border-[#334155]">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#334155] rounded-md">
                  <Scan className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2 text-white text-center">Connect a Scanner or Use Camera</h3>
                  <p className="text-sm text-gray-300 text-center mb-4">
                    Position your document in the scanner or in view of your camera
                  </p>
                  <Button className="bg-[#0284c7] hover:bg-[#0369a1]">Start Scanning</Button>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start border-t border-[#334155] pt-4">
                <div className="flex items-start gap-3 text-sm">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300">
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
        <DialogContent className="max-w-4xl bg-[#1e293b] border-[#334155]">
          <DialogHeader>
            <DialogTitle className="text-white">Missing Documents Report</DialogTitle>
            <DialogDescription className="text-gray-300">
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
