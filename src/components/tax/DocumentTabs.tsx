
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DocumentTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DocumentTabs: React.FC<DocumentTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList>
        <TabsTrigger value="documents">Active Documents</TabsTrigger>
        <TabsTrigger value="archive">Archive Management</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default DocumentTabs;
