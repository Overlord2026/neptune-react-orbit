
import React from 'react';
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

interface FloatingAssistantButtonProps {
  onClick: () => void;
}

const FloatingAssistantButton = ({ onClick }: FloatingAssistantButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-all duration-200 flex items-center justify-center"
    >
      <Bot className="h-6 w-6" />
      <span className="sr-only">Open AI Assistant</span>
    </Button>
  );
};

export default FloatingAssistantButton;
