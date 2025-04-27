import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BrainCircuit } from 'lucide-react';
import { useDocumentContext } from '../DocumentContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import SuggestedQuestions from './SuggestedQuestions';
import DocumentContext from './DocumentContext';

interface AIDocumentAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIDocumentAssistant: React.FC<AIDocumentAssistantProps> = ({
  isOpen,
  onClose
}) => {
  const { filteredDocuments, selectedYear } = useDocumentContext();
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { 
      role: 'assistant', 
      content: `Hi there! I'm your Tax Document Assistant. I can help you with your ${selectedYear} tax documents. How can I assist you today?` 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = { role: 'user' as const, content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    setTimeout(() => {
      let response = '';
      
      if (inputValue.toLowerCase().includes('missing')) {
        response = `Based on your ${selectedYear} tax documents, you might be missing some common forms like 1099-INT or property tax statements. Would you like me to help you identify what's missing?`;
      } else if (inputValue.toLowerCase().includes('deduction') || inputValue.toLowerCase().includes('write off')) {
        response = `I can help identify potential deductions from your documents. I see you have some records that might qualify for deductions. Would you like me to analyze them in more detail?`;
      } else if (inputValue.toLowerCase().includes('deadline') || inputValue.toLowerCase().includes('due date')) {
        response = `For the ${selectedYear} tax year, individual tax returns are typically due on April 15, ${Number(selectedYear) + 1}. If you need more time, you can file for an extension until October 15.`;
      } else {
        response = `I've analyzed your ${filteredDocuments.length} documents for tax year ${selectedYear}. Is there something specific about these documents you'd like to know?`;
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary" />
            AI Tax Document Assistant
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <ChatMessage key={index} {...message} />
          ))}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-lg bg-muted">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-primary" />
                  <div className="flex gap-1">
                    <span className="animate-bounce">•</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>•</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>•</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {messages.length <= 2 && (
          <SuggestedQuestions onSelectSuggestion={handleSuggestionSelect} />
        )}
        
        <DocumentContext 
          documentCount={filteredDocuments.length}
          selectedYear={selectedYear}
        />
        
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSendMessage}
          onKeyDown={handleKeyDown}
          isProcessing={isProcessing}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AIDocumentAssistant;
