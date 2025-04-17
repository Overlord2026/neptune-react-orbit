
import React, { useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadSectionProps {
  onFilesUploaded: (newDocs: Document[]) => void;
}

interface Document {
  id: string;
  name: string;
  uploadDate: Date;
  type: string;
  size: string;
  taxYear?: string;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onFilesUploaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newDocs: Document[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      uploadDate: new Date(),
      type: file.type.split('/')[1].toUpperCase(),
      size: formatFileSize(file.size),
      taxYear: file.name.split('_')[1]?.split('.')[0] || "Unknown"
    }));

    onFilesUploaded(newDocs);
    
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    toast({
      title: "Files uploaded successfully",
      description: `${files.length} document${files.length > 1 ? 's' : ''} added to your vault`,
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <Card className="bg-[#1f2937] border-[#3b82f6]/20 hover:border-[#3b82f6]/40 transition-colors mx-4 sm:mx-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Upload className="h-5 w-5 text-[#3b82f6]" />
          Upload Documents
        </CardTitle>
        <CardDescription className="text-gray-300">
          Add tax forms, receipts, or other important documents to your vault.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border-2 border-dashed border-[#374151] rounded-lg p-6 flex flex-col items-center justify-center gap-4">
          <Upload className="h-10 w-10 text-[#3b82f6]" />
          <div className="text-center">
            <p className="text-sm text-gray-300 mb-2">
              Drag and drop your files here, or click to browse
            </p>
            <p className="text-xs text-gray-400">
              Supports PDFs, images, and common document formats
            </p>
          </div>
          <div>
            <Label htmlFor="file-upload" className="sr-only">Upload documents</Label>
            <Input 
              ref={fileInputRef}
              id="file-upload" 
              type="file" 
              className="cursor-pointer bg-[#1A1F2C] text-white border-[#374151]" 
              multiple 
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" 
              onChange={handleFileUpload}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadSection;
