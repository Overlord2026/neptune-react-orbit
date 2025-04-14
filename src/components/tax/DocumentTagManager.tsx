
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tag as TagIcon, Check } from "lucide-react";
import { DocumentTag, DocumentWithTags, getAvailableTags } from '@/utils/documentTaggingUtils';
import { useToast } from "@/hooks/use-toast";
import TagSelector from './TagSelector';

interface DocumentTagManagerProps {
  document: DocumentWithTags;
  onUpdateTags: (docId: string, tags: DocumentTag[]) => void;
}

const DocumentTagManager: React.FC<DocumentTagManagerProps> = ({ document, onUpdateTags }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<DocumentTag[]>(document.tags || []);
  const { toast } = useToast();
  
  const handleSave = () => {
    onUpdateTags(document.id, selectedTags);
    setIsOpen(false);
    toast({
      title: "Tags updated",
      description: "Document tags have been updated successfully."
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="flex items-center gap-2"
        >
          <TagIcon className="h-4 w-4" />
          <span className="sr-only">Manage Tags</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Tags</DialogTitle>
          <DialogDescription>
            Add or remove tags for document: <strong>{document.name}</strong>
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <TagSelector 
            selectedTags={selectedTags}
            onChange={setSelectedTags}
          />
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Check className="mr-2 h-4 w-4" />
            Save Tags
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentTagManager;
