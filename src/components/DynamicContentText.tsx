
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
    setProcessedContent(processDynamicContent(children, options));
  }, [children, options]);

  return (
    <Component 
      className={className} 
      dangerouslySetInnerHTML={{ __html: processedContent }} 
    />
  );
};

export default DynamicContentText;
