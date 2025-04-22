
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Upload, 
  Scan, 
  Archive, 
  Calendar, 
  File, 
  AlertTriangle, 
  Bot 
} from "lucide-react";

interface DocumentActionSidebarProps {
  onShowUploadDialog: () => void;
  onShowScanSheet: () => void;
  onSetActiveTab: (tab: string) => void;
  onShowMissingDocsDialog: () => void;
  onShowAIAssistant: () => void;
}

const DocumentActionSidebar: React.FC<DocumentActionSidebarProps> = ({
  onShowUploadDialog,
  onShowScanSheet,
  onSetActiveTab,
  onShowMissingDocsDialog,
  onShowAIAssistant
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-primary">Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Button 
          className="w-full justify-start"
          onClick={onShowUploadDialog}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Documents
        </Button>
        <Button 
          className="w-full justify-start"
          onClick={onShowScanSheet}
        >
          <Scan className="mr-2 h-4 w-4" />
          Scan Documents
        </Button>
        <Button 
          className="w-full justify-start" 
          variant="outline"
          onClick={() => onSetActiveTab("archive")}
        >
          <Archive className="mr-2 h-4 w-4" />
          Document Archive
        </Button>
        <Button 
          className="w-full justify-start" 
          variant="outline"
        >
          <Calendar className="mr-2 h-4 w-4" />
          View Documents by Year
        </Button>
        <Button 
          className="w-full justify-start bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
          onClick={onShowMissingDocsDialog}
        >
          <File className="mr-2 h-4 w-4" />
          <span className="truncate">Generate Missing Document Report</span>
        </Button>
        <Button 
          className="w-full justify-start" 
          variant="outline"
          onClick={onShowMissingDocsDialog}
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          Missing Document Report
        </Button>
        <Button 
          className="w-full justify-start" 
          variant="outline"
          onClick={onShowAIAssistant}
        >
          <Bot className="mr-2 h-4 w-4" />
          AI Assistant
        </Button>
      </CardContent>
    </Card>
  );
};

export default DocumentActionSidebar;
