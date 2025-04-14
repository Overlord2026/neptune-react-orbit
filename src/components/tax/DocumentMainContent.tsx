
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import DocumentSearchBar from './DocumentSearchBar';
import DocumentsTable from './DocumentsTable';
import DocumentArchiveSection from './DocumentArchiveSection';
import DocumentTabs from './DocumentTabs';
import DocumentTableFooter from './DocumentTableFooter';
import { useDocumentContext, Document } from './DocumentContext';

interface DocumentMainContentProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onShareDocument: (doc: Document) => void;
}

const DocumentMainContent: React.FC<DocumentMainContentProps> = ({
  activeTab,
  onTabChange,
  onShareDocument
}) => {
  const { selectedYear, handleArchiveStatusChange } = useDocumentContext();

  const handleArchiveDocument = (docId: string) => {
    console.log(`Archive document ${docId}`);
    handleArchiveStatusChange();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <CardTitle className="text-lg text-primary">
            Documents for {selectedYear}
          </CardTitle>
          
          <DocumentTabs activeTab={activeTab} onTabChange={onTabChange} />
        </div>
        
        <DocumentSearchBar />
      </CardHeader>
      <CardContent>
        <TabsContent value="documents" className="mt-0">
          <DocumentsTable 
            onShareDocument={onShareDocument}
            onArchiveDocument={handleArchiveDocument}
          />
        </TabsContent>
        
        <TabsContent value="archive" className="mt-0">
          <DocumentArchiveSection 
            selectedYear={selectedYear}
            onArchiveStatusChange={handleArchiveStatusChange}
          />
        </TabsContent>
      </CardContent>
      <DocumentTableFooter />
    </Card>
  );
};

export default DocumentMainContent;
