
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDocumentContext } from './DocumentContext';

const DocumentSearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useDocumentContext();

  return (
    <div className="w-full max-w-sm">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search documents..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

export default DocumentSearchBar;
