
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, X, Send, Sparkles, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getTaxYears } from '@/utils/taxYearUtils';

// Interface for chat message structure
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

// Interface for document summary
interface DocumentSummary {
  id: string;
  documentType: string;
  source?: string;
  taxYear: string;
  summary: string;
  archived?: boolean;
}

// Mock document summaries - in production would come from a database
const mockDocumentSummaries: DocumentSummary[] = [
  {
    id: "1",
    documentType: "W-2",
    source: "Employer Inc.",
    taxYear: "2023",
    summary: "W-2 from Employer Inc., total wages $85,000, federal taxes withheld $15,000, for tax year 2023."
  },
  {
    id: "2",
    documentType: "1099-INT",
    source: "Bank of America",
    taxYear: "2023",
    summary: "1099-INT from Bank of America, interest income $350, for tax year 2023."
  },
  {
    id: "3",
    documentType: "1099-DIV",
    source: "Vanguard",
    taxYear: "2023",
    summary: "1099-DIV from Vanguard, total dividends $1,200, qualified dividends $900, for tax year 2023."
  },
  {
    id: "4",
    documentType: "W-2",
    source: "Employer Inc.",
    taxYear: "2022",
    summary: "W-2 from Employer Inc., total wages $80,000, federal taxes withheld $14,000, for tax year 2022."
  },
  {
    id: "5",
    documentType: "1099-INT",
    source: "Chase Bank",
    taxYear: "2022",
    summary: "1099-INT from Chase Bank, interest income $275, for tax year 2022.",
    archived: true
  },
  {
    id: "6",
    documentType: "W-2",
    source: "Employer Inc.",
    taxYear: "2024",
    summary: "W-2 from Employer Inc., total wages $88,000, federal taxes withheld $16,000, for tax year 2024."
  },
  {
    id: "7",
    documentType: "1099-DIV",
    source: "Vanguard",
    taxYear: "2024",
    summary: "1099-DIV from Vanguard, total dividends $1,300, qualified dividends $950, for tax year 2024."
  },
  {
    id: "8",
    documentType: "W-2",
    source: "Employer Inc.",
    taxYear: "2025",
    summary: "W-2 from Employer Inc., total wages $92,000, federal taxes withheld $17,000, for tax year 2025 (Projected)."
  }
];

// Simple NLP model simulation
const processUserQuery = (query: string): Promise<string> => {
  const lowerQuery = query.toLowerCase();
  const years = getTaxYears().map(year => year.toString());
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Show documents from a specific year
      if (lowerQuery.includes("show") && lowerQuery.includes("document") && /\b20\d{2}\b/.test(lowerQuery)) {
        const yearMatch = lowerQuery.match(/\b(20\d{2})\b/);
        const year = yearMatch ? yearMatch[0] : null;
        
        if (year) {
          const docsForYear = mockDocumentSummaries.filter(doc => doc.taxYear === year);
          
          if (docsForYear.length > 0) {
            let response = `Here are your documents for ${year}:\n\n`;
            docsForYear.forEach(doc => {
              const archiveStatus = doc.archived ? " (Archived)" : "";
              response += `- ${doc.documentType} from ${doc.source || 'Unknown source'}${archiveStatus}\n`;
            });
            resolve(response);
            return;
          } else {
            resolve(`I couldn't find any documents for ${year}. Would you like to upload some?`);
            return;
          }
        }
      }
      
      // Check for a specific document type
      if (lowerQuery.includes("do i have") || lowerQuery.includes("find")) {
        // Check for document type
        let docType = "";
        if (lowerQuery.includes("w-2") || lowerQuery.includes("w2")) docType = "W-2";
        else if (lowerQuery.includes("1099-div")) docType = "1099-DIV";
        else if (lowerQuery.includes("1099-int")) docType = "1099-INT";
        else if (lowerQuery.includes("1099-r")) docType = "1099-R";
        
        // Check for year
        const yearMatch = lowerQuery.match(/\b(20\d{2})\b/);
        const year = yearMatch ? yearMatch[0] : null;
        
        if (docType && year) {
          const doc = mockDocumentSummaries.find(
            d => d.documentType === docType && d.taxYear === year
          );
          
          if (doc) {
            const archiveStatus = doc.archived ? " Note: This document is currently archived." : "";
            resolve(`Yes, I found a ${docType} for ${year} from ${doc.source || 'Unknown source'}.${archiveStatus}`);
            return;
          } else {
            resolve(`No, I couldn't find a ${docType} for ${year}. Would you like to upload one?`);
            return;
          }
        }
      }
      
      // Summarize a document
      if (lowerQuery.includes("summarize") || lowerQuery.includes("summary")) {
        let docType = "";
        if (lowerQuery.includes("w-2") || lowerQuery.includes("w2")) docType = "W-2";
        else if (lowerQuery.includes("1099-div")) docType = "1099-DIV";
        else if (lowerQuery.includes("1099-int")) docType = "1099-INT";
        
        // Check for year
        const yearMatch = lowerQuery.match(/\b(20\d{2})\b/);
        const year = yearMatch ? yearMatch[0] : null;
        
        // Check for source
        let source: string | undefined;
        mockDocumentSummaries.forEach(doc => {
          if (doc.source && lowerQuery.toLowerCase().includes(doc.source.toLowerCase())) {
            source = doc.source;
          }
        });
        
        if (docType && year) {
          const docs = mockDocumentSummaries.filter(
            d => d.documentType === docType && 
                d.taxYear === year &&
                (!source || d.source === source)
          );
          
          if (docs.length > 0) {
            let response = docs.length === 1 
              ? `Here's the summary for your ${docType} from ${year}:\n\n${docs[0].summary}`
              : `I found ${docs.length} ${docType} documents for ${year}. Here are the summaries:\n\n`;
            
            if (docs.length > 1) {
              docs.forEach((doc, index) => {
                const archiveStatus = doc.archived ? " (Archived)" : "";
                response += `${index + 1}. ${doc.summary}${archiveStatus}\n`;
              });
            }
            
            resolve(response);
            return;
          } else {
            resolve(`I couldn't find a ${docType} for ${year}${source ? ` from ${source}` : ''}. Would you like to upload one?`);
            return;
          }
        }
      }
      
      // List missing documents
      if (lowerQuery.includes("missing") && lowerQuery.includes("document")) {
        const yearMatch = lowerQuery.match(/\b(20\d{2})\b/);
        const year = yearMatch ? yearMatch[0] : years[0]; // Default to most recent year if not specified
        
        resolve(`Based on my analysis, you might be missing the following documents for ${year}:\n\n` +
                (year === "2024" ? 
                  `- 1099-INT for your Bank of America account\n` +
                  `- 1098 for mortgage interest\n\n` :
                 year === "2025" ? 
                  `- 1099-INT for your Bank of America account\n` +
                  `- 1099-DIV for your Vanguard account\n\n` :
                  `- 1099-R for your IRA distribution\n` +
                  `- 1098 for mortgage interest\n\n`) +
                `Would you like me to generate a full missing documents report?`);
        return;
      }
      
      // Share documents
      if (lowerQuery.includes("share") && lowerQuery.includes("document")) {
        const yearMatch = lowerQuery.match(/\b(20\d{2})\b/);
        const year = yearMatch ? yearMatch[0] : null;
        
        if (year) {
          resolve(`To share your ${year} documents with a tax professional, I can help you create a secure sharing link that expires after 7 days. Would you like me to create this link for you?`);
          return;
        }
      }

      // Archive documents
      if ((lowerQuery.includes("archive") || lowerQuery.includes("store")) && lowerQuery.includes("document")) {
        const yearMatch = lowerQuery.match(/\b(20\d{2})\b/);
        const year = yearMatch ? yearMatch[0] : null;
        
        if (year) {
          resolve(`I can help you archive your ${year} documents. This will move them to the archive section but keep them available for reference. Would you like me to archive all documents for ${year}?`);
          return;
        }
        
        resolve("Which tax year's documents would you like to archive? Archiving older documents helps keep your current documents organized while still allowing access to historical records when needed.");
        return;
      }
      
      // Show archived documents
      if (lowerQuery.includes("archived") || (lowerQuery.includes("show") && lowerQuery.includes("archive"))) {
        const archivedDocs = mockDocumentSummaries.filter(doc => doc.archived);
        
        if (archivedDocs.length > 0) {
          let response = "Here are your archived documents:\n\n";
          archivedDocs.forEach(doc => {
            response += `- ${doc.documentType} from ${doc.source || 'Unknown source'} (${doc.taxYear})\n`;
          });
          resolve(response);
        } else {
          resolve("You don't have any archived documents at this time. You can archive older tax documents to keep your current documents organized.");
        }
        return;
      }
      
      // Restore archived documents
      if (lowerQuery.includes("restore") || lowerQuery.includes("unarchive")) {
        const yearMatch = lowerQuery.match(/\b(20\d{2})\b/);
        const year = yearMatch ? yearMatch[0] : null;
        
        if (year) {
          const archivedForYear = mockDocumentSummaries.filter(doc => doc.taxYear === year && doc.archived);
          
          if (archivedForYear.length > 0) {
            resolve(`I found ${archivedForYear.length} archived document(s) from ${year}. Would you like me to restore them to your active documents?`);
          } else {
            resolve(`I couldn't find any archived documents from ${year}.`);
          }
          return;
        }
        
        resolve("Which tax year's archived documents would you like to restore? I can help you move them back to your active documents.");
        return;
      }
      
      // Default response for queries that don't match any patterns
      resolve("I'm your AI Tax Document Assistant. I can help you find, summarize, archive, and manage your tax documents for years 2021 through 2025. Try asking me things like:\n\n" +
              "- Show me all documents from 2024\n" +
              "- Do I have my 1099-DIV for 2025?\n" +
              "- Summarize my 2024 W-2 from Employer ABC\n" +
              "- Archive my 2021 tax documents\n" +
              "- Show me my archived documents\n" +
              "- Restore my 2022 archived documents\n" +
              "- List any documents missing for my 2025 return");
    }, 1000); // Simulate processing delay
  });
};

interface AIDocumentAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIDocumentAssistant = ({ isOpen, onClose }: AIDocumentAssistantProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "system-welcome",
      role: "assistant",
      content: "Hi there! I'm your AI Tax Document Assistant. How can I help you with your tax documents today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    
    // Focus input when chat opens
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;
    
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsProcessing(true);
    
    try {
      const response = await processUserQuery(userMessage.content);
      
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Sorry, I couldn't process your request right now. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-6 z-50 w-full max-w-sm">
      <Card className="shadow-lg border-primary/20">
        <CardHeader className="bg-secondary/20 pb-3 pt-4 px-4 flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Tax Document Assistant
          </CardTitle>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={onClose} 
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Alert className="rounded-none border-x-0 text-xs bg-muted/50">
            <AlertDescription className="text-xs">
              AI responses are for informational purposes only. 
              Please verify document details with a tax professional.
            </AlertDescription>
          </Alert>
          <ScrollArea className="h-[300px] p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div 
                    className={`rounded-lg px-4 py-2 max-w-[85%] ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                        <Badge variant="outline" className="text-xs py-0">AI Assistant</Badge>
                      </div>
                    )}
                    <div className="whitespace-pre-line text-sm">
                      {message.content}
                    </div>
                    <div className="text-xs opacity-70 mt-1 text-right">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t p-3">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex w-full items-center space-x-2"
          >
            <Input
              ref={inputRef}
              placeholder="Ask about your tax documents..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isProcessing}
              className="flex-1"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!inputValue.trim() || isProcessing}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AIDocumentAssistant;
