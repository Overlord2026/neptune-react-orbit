
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type ActivityType = 'comment' | 'update' | 'create' | 'complete';

interface ActivityItem {
  id: string;
  type: ActivityType;
  user: {
    name: string;
    avatarUrl?: string;
  };
  project: string;
  timestamp: string;
  content: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const RecentActivity = ({ activities }: RecentActivityProps) => {
  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'comment':
        return <div className="h-2 w-2 rounded-full bg-blue-500"></div>;
      case 'update':
        return <div className="h-2 w-2 rounded-full bg-yellow-500"></div>;
      case 'create':
        return <div className="h-2 w-2 rounded-full bg-green-500"></div>;
      case 'complete':
        return <div className="h-2 w-2 rounded-full bg-purple-500"></div>;
      default:
        return <div className="h-2 w-2 rounded-full bg-gray-500"></div>;
    }
  };

  return (
    <Card className="cosmic-card cosmic-shadow">
      <CardHeader>
        <CardTitle className="text-neptune-800 dark:text-neptune-300">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.user.avatarUrl} alt={activity.user.name} />
                <AvatarFallback className="text-xs">
                  {activity.user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 h-full w-0.5 bg-border mt-2"></div>
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center">
                <span className="font-medium">{activity.user.name}</span>
                <span className="mx-2 text-muted-foreground">·</span>
                <span className="text-sm text-muted-foreground">{activity.timestamp}</span>
                <span className="ml-auto">{getActivityIcon(activity.type)}</span>
              </div>
              <p className="text-sm">{activity.content}</p>
              <p className="text-xs text-muted-foreground">Project: {activity.project}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
