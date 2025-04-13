
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Save, FileText, Share2 } from "lucide-react";

interface ActionButtonsProps {
  onSave: () => void;
  onDownloadPDF?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onSave, onDownloadPDF }) => {
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  const handleDownloadPDF = () => {
    setShowPdfPreview(true);
    // In a real app, this would generate a PDF document
    setTimeout(() => {
      setShowPdfPreview(false);
    }, 1500);
    
    if (onDownloadPDF) {
      onDownloadPDF();
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-8">
        <Button onClick={onSave} className="flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Scenario
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleDownloadPDF}
        >
          <FileText className="w-4 h-4" /> Download PDF Report
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Share2 className="w-4 h-4" /> Share Results
        </Button>
      </div>
      
      {/* PDF Preview Toast */}
      {showPdfPreview && (
        <div className="fixed bottom-4 right-4 bg-[#1A1F2C] border border-[#353e52] p-4 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-[#FFD700]" />
            <div>
              <h4 className="font-medium text-white">Preparing PDF Report</h4>
              <p className="text-sm text-[#B0B0B0]">Your Estate & Gifting analysis report is being generated...</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActionButtons;
