
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TagSelector from './TagSelector';
import { DocumentTag } from '@/utils/documentTaggingUtils';

interface DocumentTagFilterProps {
  selectedTags: DocumentTag[];
  onTagChange: (tags: DocumentTag[]) => void;
}

const DocumentTagFilter: React.FC<DocumentTagFilterProps> = ({ selectedTags, onTagChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-primary">Filter by Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <TagSelector 
          selectedTags={selectedTags}
          onChange={onTagChange}
          className="pb-2"
        />
        
        {selectedTags.length > 0 && (
          <div className="text-xs text-muted-foreground mt-2">
            Showing documents with {selectedTags.length > 1 ? 'any of the selected' : 'the selected'} tag{selectedTags.length > 1 ? 's' : ''}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentTagFilter;
