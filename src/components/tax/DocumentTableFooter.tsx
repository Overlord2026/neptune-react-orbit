
import React from 'react';
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { useDocumentContext } from './DocumentContext';

const DocumentTableFooter: React.FC = () => {
  const { filteredDocuments, selectedYear, archivedDocCounts } = useDocumentContext();

  return (
    <CardFooter className="flex justify-between border-t py-4">
      <div className="text-sm text-muted-foreground">
        Showing {filteredDocuments.length} active documents
        {archivedDocCounts[selectedYear] > 0 && (
          <> (plus {archivedDocCounts[selectedYear]} archived)</>
        )}
      </div>
      <Button variant="outline" size="sm">
        Export List
      </Button>
    </CardFooter>
  );
};

export default DocumentTableFooter;
