
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SidebarGroupProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const SidebarGroup = ({ title, icon, children, defaultOpen = false }: SidebarGroupProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-2">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-[#E5E5E5] hover:bg-[#242A38]"
          >
            {icon}
            <span className="flex-1 text-left truncate">{title}</span>
            {isOpen ? (
              <ChevronDown className="h-4 w-4 shrink-0 text-[#9AA0AC]" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0 text-[#9AA0AC]" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-4 mt-1">
          {children}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default SidebarGroup;
