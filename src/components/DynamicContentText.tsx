
import React, { useState, useEffect } from 'react';
import { processDynamicContent, DynamicContentOptions } from '@/utils/dynamicContentUtils';

interface DynamicContentTextProps {
  children: string;
  options?: DynamicContentOptions;
  as?: React.ElementType;
  className?: string;
}

const DynamicContentText: React.FC<DynamicContentTextProps> = ({ 
  children, 
  options,
  as: Component = 'span',
  className = "" 
}) => {
  const [processedContent, setProcessedContent] = useState<string>(children);

  useEffect(() => {
    try {
      // Make sure we're working with a string
      const contentToProcess = typeof children === 'string' ? children : String(children);
      setProcessedContent(processDynamicContent(contentToProcess, options));
    } catch (error) {
      console.error("Error processing dynamic content:", error);
      setProcessedContent(String(children || ''));
    }
  }, [children, options]);

  return (
    <Component 
      className={className} 
      dangerouslySetInnerHTML={{ __html: processedContent }} 
    />
  );
};

export default DynamicContentText;
