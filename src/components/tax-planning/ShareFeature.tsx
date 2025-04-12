
import React from 'react';
import { Share2, Mail, Twitter, Linkedin, Facebook } from 'lucide-react';
import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ShareFeatureProps {
  title: string;
  description?: string;
  url?: string;
  position?: 'top-right' | 'inline';
  variant?: 'icon' | 'button';
}

const ShareFeature: React.FC<ShareFeatureProps> = ({ 
  title, 
  description = "Check out this awesome Tax Planning tool!", 
  url = window.location.href,
  position = 'inline',
  variant = 'icon'
}) => {
  const encodedText = encodeURIComponent(`${title}: ${description}`);
  const encodedUrl = encodeURIComponent(url);
  
  const shareLinks = [
    {
      name: 'Email',
      icon: <Mail className="h-4 w-4" />,
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodedText}%0A%0A${encodedUrl}`,
      color: 'text-[#EA4335] hover:text-[#EA4335]/80'
    },
    {
      name: 'Twitter',
      icon: <Twitter className="h-4 w-4" />,
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      color: 'text-[#1DA1F2] hover:text-[#1DA1F2]/80'
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="h-4 w-4" />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'text-[#0A66C2] hover:text-[#0A66C2]/80'
    },
    {
      name: 'Facebook',
      icon: <Facebook className="h-4 w-4" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'text-[#1877F2] hover:text-[#1877F2]/80'
    }
  ];

  return (
    <div className={`${position === 'top-right' ? 'absolute top-2 right-2' : 'inline-flex'}`}>
      <Popover>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                {variant === 'icon' ? (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-sm text-[#8E9196] hover:text-[#C8C8C9] transition-colors h-8 w-8"
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Share {title}</span>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs text-[#9b87f5] border-[#9b87f5]/30 hover:bg-[#9b87f5]/10"
                  >
                    <Share2 className="h-3 w-3 mr-1" />
                    Share
                  </Button>
                )}
              </PopoverTrigger>
              <TooltipContent side="bottom" className="bg-[#1A1F2C] border-[#242A38]">
                Share this {title}
              </TooltipContent>
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>
        <PopoverContent 
          className="w-56 p-3 bg-[#1A1F2C] border border-[#242A38] shadow-xl"
          align="end"
        >
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-[#9b87f5]">Share {title}</h3>
            <p className="text-xs text-[#8E9196]">Choose how you'd like to share:</p>
            <div className="flex flex-col gap-2 pt-2">
              {shareLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 text-sm p-2 rounded-md hover:bg-[#242A38] transition-colors ${link.color}`}
                >
                  {link.icon}
                  <span>Share via {link.name}</span>
                </a>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ShareFeature;
