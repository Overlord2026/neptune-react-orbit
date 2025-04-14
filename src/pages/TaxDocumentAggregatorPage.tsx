
import React, { useState } from 'react';
import { Document, DocumentProvider } from "@/components/tax/DocumentContext";
import DocumentHeader from "@/components/tax/DocumentHeader";
import DocumentOverviewCard from "@/components/tax/DocumentOverviewCard";
import DocumentActionSidebar from "@/components/tax/DocumentActionSidebar";
import DocumentYearSelector from "@/components/tax/DocumentYearSelector";
import DocumentMainContent from "@/components/tax/DocumentMainContent";
import DocumentDialogs from "@/components/tax/DocumentDialogs";
import ShareDocumentModal from "@/components/tax/ShareDocumentModal";
import FloatingAssistantButton from "@/components/tax/FloatingAssistantButton";
import AIDocumentAssistant from "@/components/tax/AIDocumentAssistant";

const TaxDocumentAggregatorPage = () => {
  const [activeTab, setActiveTab] = useState<string>("documents");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showScanSheet, setShowScanSheet] = useState(false);
  const [showMissingDocsDialog, setShowMissingDocsDialog] = useState(false);
  const [enableAIClassification, setEnableAIClassification] = useState(true);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [documentToShare, setDocumentToShare] = useState<Document | null>(null);
  const [sharingAllForYear, setSharingAllForYear] = useState<string | null>(null);
  
  const handleRequestUpload = (docType: string) => {
    setShowMissingDocsDialog(false);
    setShowUploadDialog(true);
  };

  const handleShareDocument = (doc: Document) => {
    setDocumentToShare(doc);
    setSharingAllForYear(null);
    setShowShareModal(true);
  };

  const handleShareAllForYear = (year: string) => {
    setDocumentToShare(null);
    setSharingAllForYear(year);
    setShowShareModal(true);
  };

  return (
    <DocumentProvider>
      <div className="space-y-6">
        <DocumentHeader />
        
        <DocumentOverviewCard 
          enableAIClassification={enableAIClassification} 
          onEnableAIClassificationChange={setEnableAIClassification} 
        />
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/4 flex flex-col gap-4">
            <DocumentActionSidebar 
              onShowUploadDialog={() => setShowUploadDialog(true)}
              onShowScanSheet={() => setShowScanSheet(true)}
              onSetActiveTab={setActiveTab}
              onShowMissingDocsDialog={() => setShowMissingDocsDialog(true)}
              onShowAIAssistant={() => setShowAIAssistant(true)}
            />
            
            <DocumentYearSelector onShareAllForYear={handleShareAllForYear} />
          </div>
          
          <div className="w-full md:w-3/4">
            <DocumentMainContent 
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onShareDocument={handleShareDocument}
            />
          </div>
        </div>

        {/* Modals and dialogs */}
        <DocumentDialogs 
          showUploadDialog={showUploadDialog}
          setShowUploadDialog={setShowUploadDialog}
          showScanSheet={showScanSheet}
          setShowScanSheet={setShowScanSheet}
          showMissingDocsDialog={showMissingDocsDialog}
          setShowMissingDocsDialog={setShowMissingDocsDialog}
          enableAIClassification={enableAIClassification}
          handleRequestUpload={handleRequestUpload}
        />

        {/* Share Document Modal */}
        <ShareDocumentModal 
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          document={documentToShare}
          allDocumentsForYear={sharingAllForYear || undefined}
        />

        {/* Floating AI Assistant Button */}
        <FloatingAssistantButton onClick={() => setShowAIAssistant(true)} />
        
        {/* AI Document Assistant */}
        <AIDocumentAssistant 
          isOpen={showAIAssistant} 
          onClose={() => setShowAIAssistant(false)} 
        />
      </div>
    </DocumentProvider>
  );
};

export default TaxDocumentAggregatorPage;
