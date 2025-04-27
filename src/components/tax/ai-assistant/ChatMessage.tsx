
import React from 'react';
import { BrainCircuit } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => {
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[80%] p-3 rounded-lg ${
          role === 'user' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted'
        }`}
      >
        {role === 'assistant' && (
          <div className="flex items-center gap-2 mb-1">
            <BrainCircuit className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium">Tax Assistant</span>
          </div>
        )}
        <p>{content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
