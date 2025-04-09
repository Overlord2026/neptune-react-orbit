
import React, { useState, useEffect } from 'react';
import { processDynamicContent, DynamicContentOptions } from '@/utils/dynamicContentUtils';

interface DynamicContentProps {
  content: string;
  options?: DynamicContentOptions;
  className?: string;
}

const DynamicContent: React.FC<DynamicContentProps> = ({ 
  content, 
  options,
  className = "" 
}) => {
  const [processedContent, setProcessedContent] = useState<string>('');

  useEffect(() => {
    setProcessedContent(processDynamicContent(content, options));
  }, [content, options]);

  return (
    <span 
      className={className} 
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
};

export default DynamicContent;
