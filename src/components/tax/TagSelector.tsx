
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
import { DocumentTag, getAvailableTags } from "@/utils/documentTaggingUtils";

interface TagSelectorProps {
  selectedTags: DocumentTag[];
  onChange: (tags: DocumentTag[]) => void;
  className?: string;
  limit?: number;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  onChange,
  className = '',
  limit
}) => {
  const availableTags = getAvailableTags();
  
  const handleTagToggle = (tag: DocumentTag) => {
    if (selectedTags.includes(tag)) {
      // Remove tag
      onChange(selectedTags.filter(t => t !== tag));
    } else {
      // Add tag if under limit
      if (limit && selectedTags.length >= limit) {
        return;
      }
      onChange([...selectedTags, tag]);
    }
  };
  
  const getTagColor = (tag: DocumentTag): string => {
    switch (tag) {
      case 'Roth':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'Estate':
        return 'bg-purple-600 hover:bg-purple-700';
      case 'Charitable':
        return 'bg-green-600 hover:bg-green-700';
      case 'Business':
        return 'bg-amber-600 hover:bg-amber-700';
      case 'Deferred Comp':
        return 'bg-cyan-600 hover:bg-cyan-700';
      case 'Tax Return':
        return 'bg-red-600 hover:bg-red-700';
      case 'W-2':
        return 'bg-emerald-600 hover:bg-emerald-700';
      case 'K-1':
        return 'bg-pink-600 hover:bg-pink-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };
  
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {availableTags.map((tag) => (
        <Badge 
          key={tag}
          variant={selectedTags.includes(tag) ? "default" : "outline"}
          className={`cursor-pointer ${selectedTags.includes(tag) ? getTagColor(tag) : 'hover:bg-secondary/20'}`}
          onClick={() => handleTagToggle(tag)}
        >
          <Tag className="h-3 w-3 mr-1" />
          {tag}
        </Badge>
      ))}
    </div>
  );
};

export default TagSelector;
