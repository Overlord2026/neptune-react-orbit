
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
  as: Component = 'p',
  className = "" 
}) => {
  const [processedContent, setProcessedContent] = useState<string>(children);

  useEffect(() => {
    // Process the content with the placeholders
    // Remove double curly braces if present
    const cleanedContent = children.replace(/{{|}}/g, '');
    setProcessedContent(processDynamicContent(cleanedContent, options));
  }, [children, options]);

  return (
    <Component 
      className={className} 
      dangerouslySetInnerHTML={{ __html: processedContent }} 
    />
  );
};

export default DynamicContentText;
