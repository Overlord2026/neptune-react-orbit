
import React from 'react';

interface SuggestedQuestionsProps {
  onSelectSuggestion: (suggestion: string) => void;
}

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ onSelectSuggestion }) => {
  const suggestions = [
    "What documents am I missing?",
    "Can you identify potential deductions?",
    "When is my tax filing deadline?",
    "Explain the difference between W-2 and 1099"
  ];

  return (
    <div className="p-4 border-t border-border">
      <p className="text-sm text-muted-foreground mb-2">Suggested questions:</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="text-sm bg-muted hover:bg-accent px-3 py-1 rounded-full text-muted-foreground hover:text-accent-foreground transition-colors"
            onClick={() => onSelectSuggestion(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;
