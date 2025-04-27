
import React from 'react';
import { Button } from '@/components/ui/button';
import { Send, Sparkles } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isProcessing: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  onKeyDown,
  isProcessing
}) => {
  return (
    <div className="p-4 border-t border-border">
      <div className="flex gap-2">
        <textarea
          className="flex-1 p-3 border border-input rounded-md bg-background resize-none"
          placeholder="Ask about your tax documents..."
          rows={2}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={isProcessing}
        />
        <Button 
          className="self-end"
          onClick={onSend}
          disabled={!value.trim() || isProcessing}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
        <Sparkles className="h-3 w-3" />
        <span>Powered by AI - Responses may not be 100% accurate</span>
      </div>
    </div>
  );
};

export default ChatInput;
