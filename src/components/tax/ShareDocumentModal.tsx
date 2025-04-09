
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";
import { Share2, Calendar } from "lucide-react";

// Mock data - in a real app, this would come from your database
const mockServicePros = [
  { id: '1', name: 'John Smith', profession_type: 'CPA', email: 'john.smith@cpa.com' },
  { id: '2', name: 'Jane Doe', profession_type: 'Tax Attorney', email: 'jane.doe@taxlaw.com' },
  { id: '3', name: 'Bob Johnson', profession_type: 'Financial Advisor', email: 'bob.johnson@finance.com' },
];

interface DocumentToShare {
  id: string;
  name: string;
  type: string;
  year?: string;
}

interface ShareDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: DocumentToShare;
  allDocumentsForYear?: string;
}

const ShareDocumentModal = ({ isOpen, onClose, document, allDocumentsForYear }: ShareDocumentModalProps) => {
  const [selectedPro, setSelectedPro] = useState<string>("");
  const [accessLevel, setAccessLevel] = useState<string>("view");
  const [expirationDays, setExpirationDays] = useState<string>("14");
  const [message, setMessage] = useState<string>("");
  const { toast } = useToast();

  // What we're sharing - either a specific document or all documents for a year
  const sharingTarget = document ? 
    `${document.name} (${document.type})` : 
    `All ${allDocumentsForYear} tax documents`;

  const handleShare = () => {
    if (!selectedPro) {
      toast({
        title: "Error",
        description: "Please select a professional to share with",
        variant: "destructive",
      });
      return;
    }

    const selectedProfessional = mockServicePros.find(pro => pro.id === selectedPro);
    
    // In a real application, this would call an API to store the sharing permission
    // and possibly send a notification to the professional
    console.log("Sharing document:", {
      documentId: document?.id,
      allDocumentsForYear,
      professionalId: selectedPro,
      accessLevel,
      expirationDays,
      message
    });

    // Show confirmation
    toast({
      title: "Document shared successfully",
      description: `You have granted ${selectedProfessional?.name}, ${selectedProfessional?.profession_type}, access to ${sharingTarget} for ${expirationDays} days.`,
    });

    // Reset form and close modal
    setSelectedPro("");
    setAccessLevel("view");
    setExpirationDays("14");
    setMessage("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share {document ? "Document" : "Documents"}
          </DialogTitle>
          <DialogDescription>
            {document ? 
              `Share "${document.name}" with a tax professional.` : 
              `Share all tax documents from ${allDocumentsForYear} with a tax professional.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="professional">Select a Professional</Label>
            <Select value={selectedPro} onValueChange={setSelectedPro}>
              <SelectTrigger id="professional">
                <SelectValue placeholder="Choose a tax professional" />
              </SelectTrigger>
              <SelectContent>
                {mockServicePros.map(pro => (
                  <SelectItem key={pro.id} value={pro.id}>
                    {pro.name} ({pro.profession_type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Access Level</Label>
            <RadioGroup value={accessLevel} onValueChange={setAccessLevel} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="view" id="view" />
                <Label htmlFor="view" className="cursor-pointer">View only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="download" id="download" />
                <Label htmlFor="download" className="cursor-pointer">Download access</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiration">Temporary access (expires in)</Label>
            <div className="flex items-center space-x-2">
              <Input 
                id="expiration" 
                type="number" 
                value={expirationDays} 
                onChange={(e) => setExpirationDays(e.target.value)} 
                className="w-20" 
              />
              <span>days</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message or Instructions (optional)</Label>
            <Textarea 
              id="message" 
              placeholder="Please review these documents before our meeting..."
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleShare}>Confirm Share</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDocumentModal;
