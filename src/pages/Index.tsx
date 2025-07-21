import React from 'react';
import { Circle, Clock, FileText, Target, Users } from 'lucide-react';
import ProjectCard from '@/components/dashboard/ProjectCard';
import StatsCard from '@/components/dashboard/StatsCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import SupabaseConnectionTest from '@/components/SupabaseConnectionTest';

// Import at the top
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  // Mock data for projects
  const projects = [
    {
      id: '1',
      title: 'Orbital Station',
      description: 'Design and implement the core functionality for the orbital station monitoring system.',
      progress: 75,
      dueDate: 'Apr 15, 2025',
      team: [
        { name: 'Alex Johnson', avatarUrl: '' },
        { name: 'Maria Garcia', avatarUrl: '' },
        { name: 'David Kim', avatarUrl: '' }
      ]
    },
    {
      id: '2',
      title: 'Lunar Explorer',
      description: 'Develop the navigation system for the lunar exploration module.',
      progress: 45,
      dueDate: 'May 1, 2025',
      team: [
        { name: 'Sarah Wilson', avatarUrl: '' },
        { name: 'James Brown', avatarUrl: '' }
      ]
    },
    {
      id: '3',
      title: 'StarLink Connection',
      description: 'Establish reliable communication protocols between space stations.',
      progress: 30,
      dueDate: 'May 20, 2025',
      team: [
        { name: 'Emily Davis', avatarUrl: '' },
        { name: 'Michael Lee', avatarUrl: '' },
        { name: 'Jessica Wang', avatarUrl: '' }
      ]
    },
    {
      id: '4',
      title: 'Deep Space Analysis',
      description: 'Research and implement algorithms for deep space signal analysis.',
      progress: 60,
      dueDate: 'Apr 30, 2025',
      team: [
        { name: 'Robert Smith', avatarUrl: '' },
        { name: 'Lisa Chen', avatarUrl: '' }
      ]
    }
  ];

  // Mock data for activities
  const activities = [
    {
      id: '1',
      type: 'comment' as const,
      user: { name: 'Alex Johnson', avatarUrl: '' },
      project: 'Orbital Station',
      timestamp: '2 min ago',
      content: 'Added comments to the navigation module documentation.'
    },
    {
      id: '2',
      type: 'update' as const,
      user: { name: 'Maria Garcia', avatarUrl: '' },
      project: 'Lunar Explorer',
      timestamp: '1 hour ago',
      content: 'Updated the project timeline with new milestones.'
    },
    {
      id: '3',
      type: 'create' as const,
      user: { name: 'David Kim', avatarUrl: '' },
      project: 'StarLink Connection',
      timestamp: 'Yesterday',
      content: 'Created a new task for implementing secure protocols.'
    },
    {
      id: '4',
      type: 'complete' as const,
      user: { name: 'Sarah Wilson', avatarUrl: '' },
      project: 'Deep Space Analysis',
      timestamp: 'Yesterday',
      content: 'Completed the initial data processing algorithm.'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Your mission control center for all projects.</p>
      </div>
      
      <div className="mb-6">
        <SupabaseConnectionTest />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Projects" 
          value="12" 
          icon={<FileText className="h-4 w-4" />} 
          description="+2 added this month"
        />
        <StatsCard 
          title="Team Members" 
          value="24" 
          icon={<Users className="h-4 w-4" />} 
          description="Across 5 departments"
        />
        <StatsCard 
          title="Upcoming Deadlines" 
          value="7" 
          icon={<Clock className="h-4 w-4" />} 
          description="Next: April 15, 2025"
        />
        <StatsCard 
          title="Completion Rate" 
          value="92%" 
          icon={<Target className="h-4 w-4" />} 
          description="Above target by 5%"
        />
      </div>
      
      <h2 className="text-2xl font-semibold tracking-tight pt-6">Active Projects</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {projects.map(project => (
          <ProjectCard 
            key={project.id}
            title={project.title}
            description={project.description}
            progress={project.progress}
            dueDate={project.dueDate}
            team={project.team}
          />
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-3 pt-6">
        <div className="md:col-span-2">
          <RecentActivity activities={activities} />
        </div>
        <div>
          <Card className="cosmic-card cosmic-shadow">
            <CardHeader>
              <CardTitle className="text-neptune-800 dark:text-neptune-300">Project Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Completed</span>
                </div>
                <span>8</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span>In Progress</span>
                </div>
                <span>12</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                  <span>At Risk</span>
                </div>
                <span>3</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-gray-300 mr-2"></div>
                  <span>Not Started</span>
                </div>
                <span>5</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
