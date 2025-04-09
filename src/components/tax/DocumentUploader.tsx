
import React, { useState, useRef } from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, FileText, AlertTriangle, X, Image, CheckCircle } from "lucide-react";

// Document types and years for dropdowns
const DOCUMENT_TYPES = ["W-2", "1099", "K-1", "Tax Return", "Other"];
const TAX_YEARS = ["2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018"];

// Form validation schema
const formSchema = z.object({
  documentType: z.string().min(1, { message: "Document type is required" }),
  taxYear: z.string().min(1, { message: "Tax year is required" }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Define the file with additional properties for UI display
interface UploadFile extends File {
  id: string;
  preview?: string;
  progress: number;
  uploadStatus: 'uploading' | 'complete' | 'error';
}

const DocumentUploader = () => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Setup form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentType: "",
      taxYear: new Date().getFullYear().toString(),
      description: "",
    },
  });

  // Handle file drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Handle file selection
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  // Process the files
  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList).map(file => {
      // Generate a unique ID for the file
      const fileId = Math.random().toString(36).substring(2, 9);
      
      // Parse filename for potential document type and year
      const { documentType, taxYear } = parseFileName(file.name);
      
      if (documentType) {
        form.setValue('documentType', documentType);
      }
      
      if (taxYear) {
        form.setValue('taxYear', taxYear);
      }
      
      // Create preview URL for images
      let preview = undefined;
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file);
      }
      
      return {
        ...file,
        id: fileId,
        preview,
        progress: 0,
        uploadStatus: 'uploading' as const,
      };
    });
    
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
    
    // Start simulated upload
    newFiles.forEach(simulateFileUpload);
    
    // Show success toast
    toast({
      title: "Files added",
      description: `${newFiles.length} file${newFiles.length > 1 ? 's' : ''} ready for processing`,
    });
  };

  // Parse filename to extract potential document type and year
  const parseFileName = (fileName: string): { documentType: string | null, taxYear: string | null } => {
    let documentType = null;
    let taxYear = null;
    
    // Check for document types in filename
    DOCUMENT_TYPES.forEach(type => {
      if (fileName.toLowerCase().includes(type.toLowerCase())) {
        documentType = type;
      }
    });
    
    // Look for 4-digit year patterns
    const yearMatch = fileName.match(/20\d{2}/);
    if (yearMatch && TAX_YEARS.includes(yearMatch[0])) {
      taxYear = yearMatch[0];
    }
    
    return { documentType, taxYear };
  };

  // Simulate file upload with progress
  const simulateFileUpload = (file: UploadFile) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setFiles(currentFiles => 
        currentFiles.map(f => 
          f.id === file.id 
            ? { ...f, progress: Math.min(progress, 100) } 
            : f
        )
      );
      
      if (progress >= 100) {
        clearInterval(interval);
        setFiles(currentFiles => 
          currentFiles.map(f => 
            f.id === file.id 
              ? { ...f, uploadStatus: 'complete' } 
              : f
          )
        );
      }
    }, 300);
  };

  // Remove a file
  const removeFile = (fileId: string) => {
    setFiles(files => {
      const updatedFiles = files.filter(f => f.id !== fileId);
      const removedFile = files.find(f => f.id === fileId);
      
      // Clean up preview URL if it exists
      if (removedFile?.preview) {
        URL.revokeObjectURL(removedFile.preview);
      }
      
      return updatedFiles;
    });
  };

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload at least one document to continue",
        variant: "destructive",
      });
      return;
    }

    // Here we would normally send the files and form data to a server
    // For now, we'll just simulate a successful operation
    console.log("Form data:", data);
    console.log("Files to process:", files);
    
    toast({
      title: "Documents saved",
      description: `Successfully processed ${files.length} document${files.length > 1 ? 's' : ''}`,
    });
    
    // Reset form and files
    form.reset();
    setFiles([]);
  };

  // Get file type icon
  const getFileIcon = (file: UploadFile) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-8 w-8 text-primary" />;
    }
    return <FileText className="h-8 w-8 text-primary" />;
  };

  return (
    <div className="space-y-6">
      {/* Drop area */}
      <Card className={`border-2 border-dashed ${isDragging ? 'border-primary bg-primary/5' : 'border-border'} transition-colors`}>
        <div 
          className="p-8 flex flex-col items-center justify-center cursor-pointer"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Drag and drop files or click to upload</h3>
          <p className="text-sm text-muted-foreground mb-2 text-center">
            Upload your tax documents for classification and storage
          </p>
          <p className="text-xs text-muted-foreground text-center">
            Supports PDF, JPG, PNG, and other common document formats
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInput}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.csv"
            className="hidden"
          />
        </div>
      </Card>

      {/* File list */}
      {files.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Uploaded Files</CardTitle>
            <CardDescription>
              {files.length} file{files.length > 1 ? 's' : ''} ready to be processed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map(file => (
                <div key={file.id} className="flex items-start space-x-4 p-3 bg-secondary/20 rounded-md">
                  <div className="flex-shrink-0">
                    {file.preview ? (
                      <div className="h-16 w-16 rounded overflow-hidden">
                        <img src={file.preview} alt={file.name} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      getFileIcon(file)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0" 
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-2 space-y-1">
                      <Progress value={file.progress} className="h-2" />
                      <div className="flex justify-between items-center text-xs">
                        <span>
                          {file.uploadStatus === 'complete' ? (
                            <span className="text-green-500 flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1" /> Upload complete
                            </span>
                          ) : file.uploadStatus === 'error' ? (
                            <span className="text-destructive flex items-center">
                              <AlertTriangle className="h-3 w-3 mr-1" /> Upload failed
                            </span>
                          ) : (
                            <span>Uploading: {file.progress}%</span>
                          )}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {file.type.split('/')[1]?.toUpperCase() || 'DOCUMENT'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Classification form */}
      <Card>
        <CardHeader>
          <CardTitle>Document Classification</CardTitle>
          <CardDescription>
            Provide additional details about your tax documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="documentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DOCUMENT_TYPES.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="taxYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Year</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tax year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TAX_YEARS.map(year => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add notes or details about this document"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional: Add any additional context about these documents
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <Button type="submit" className="w-full">
                  Save and Process Documents
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-start border-t pt-4">
          <div className="flex items-start gap-3 text-sm">
            <AlertTriangle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium mb-1">Security & Privacy</p>
              <p className="text-muted-foreground">
                All uploads are encrypted and stored securely. Your tax documents are only 
                accessible to you and those you explicitly grant permission to view.
              </p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DocumentUploader;
