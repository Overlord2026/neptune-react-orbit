
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  progress: number;
  dueDate: string;
  team: Array<{
    name: string;
    avatarUrl?: string;
  }>;
}

const ProjectCard = ({ title, description, progress, dueDate, team }: ProjectCardProps) => {
  return (
    <Card className="cosmic-card cosmic-shadow hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-neptune-800 dark:text-neptune-300">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          <span>Due {dueDate}</span>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-between w-full">
          <div className="flex -space-x-2">
            {team.map((member, i) => (
              <Avatar key={i} className="border-2 border-background h-7 w-7">
                <AvatarImage src={member.avatarUrl} alt={member.name} />
                <AvatarFallback className="text-xs">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 inline mr-1" />
            <span>Added Apr 5</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
