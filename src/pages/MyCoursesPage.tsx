
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, Play, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

// This would come from your database once connected to Supabase
const mockEnrollments = [
  {
    id: '1',
    course_id: 'advanced_tax_strategies',
    purchase_date: '2025-03-15T12:00:00Z',
    payment_amount: 299.00,
    payment_status: 'completed',
    progress: 65, // Percentage completed
    status: 'in_progress',
    last_accessed: '2025-04-10T14:30:00Z'
  },
  {
    id: '2',
    course_id: 'tax_masters_advanced',
    purchase_date: '2025-02-20T09:15:00Z',
    payment_amount: 349.00,
    payment_status: 'completed',
    progress: 100, // Percentage completed
    status: 'completed',
    last_accessed: '2025-03-28T11:20:00Z',
    external_platform: 'Tax Masters Academy'
  },
  {
    id: '3',
    course_id: 'basic_tax_education',
    purchase_date: '2025-01-05T10:30:00Z',
    payment_amount: 99.00,
    payment_status: 'completed',
    progress: 0, // Percentage completed
    status: 'not_started',
    last_accessed: null
  }
];

// This would also come from your database 
const coursesData = {
  'advanced_tax_strategies': {
    title: 'Advanced Tax Strategies & Planning Course',
    description: 'Master sophisticated tax planning techniques including multi-year Roth planning, advanced estate strategies, and business tax concepts.',
    url: '/tax-planning/advanced-tax-education',
    image: '/placeholder.svg',
    resources_url: '/tax-planning/advanced-tax-education#resources'
  },
  'tax_masters_advanced': {
    title: 'Tax Masters Advanced Planning',
    description: 'Comprehensive advanced tax planning course with emphasis on business structures and strategic entity selection.',
    url: 'https://taxmastersacademy.com/courses/advanced-tax-planning/my-progress',
    image: '/placeholder.svg',
    resources_url: 'https://taxmastersacademy.com/courses/advanced-tax-planning/resources',
    external: true
  },
  'basic_tax_education': {
    title: 'Basic Tax Education',
    description: 'A foundational course covering tax fundamentals, filing statuses, deductions vs credits, and tax planning basics.',
    url: '/tax-planning/basic-education',
    image: '/placeholder.svg',
    resources_url: '/tax-planning/basic-education#resources'
  }
};

// Helper to get the status badge
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-600 text-white"><CheckCircle className="h-3 w-3 mr-1" /> Completed</Badge>;
    case 'in_progress':
      return <Badge className="bg-amber-500 text-black"><Clock className="h-3 w-3 mr-1" /> In Progress</Badge>;
    case 'not_started':
      return <Badge className="bg-slate-600 text-white"><AlertCircle className="h-3 w-3 mr-1" /> Not Started</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const MyCoursesPage = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  
  // In a real implementation, this would fetch from your database
  const enrollments = mockEnrollments;
  const hasEnrollments = enrollments.length > 0;
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="container content-padding section-margin">
      <div className="flex flex-col items-start justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <div className="space-y-0.5">
          <h2 className="text-3xl font-bold tracking-tight neptune-gold flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-[#9b87f5]" />
            My Courses
          </h2>
          <p className="text-muted-foreground">
            View and manage your enrolled tax education courses
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={viewMode === 'cards' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setViewMode('cards')}
            className={viewMode === 'cards' ? 'bg-[#9b87f5] hover:bg-[#8a76e4]' : ''}
          >
            Card View
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'bg-[#9b87f5] hover:bg-[#8a76e4]' : ''}
          >
            List View
          </Button>
        </div>
      </div>
      
      <Separator className="my-6" />
      
      {!hasEnrollments ? (
        <div className="flex flex-col items-center justify-center py-12 bg-[#1A1F2C] rounded-lg border border-[#8E9196] text-center">
          <BookOpen className="h-16 w-16 text-[#8E9196] mb-4" />
          <h3 className="text-xl font-semibold mb-2">You haven't enrolled in any courses yet</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            Expand your tax knowledge by exploring our tax education courses and enrolling in one today.
          </p>
          <Button asChild className="bg-[#9b87f5] hover:bg-[#8a76e4]">
            <Link to="/tax-planning">Browse Courses</Link>
          </Button>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((enrollment) => {
            const course = coursesData[enrollment.course_id as keyof typeof coursesData];
            
            return (
              <Card key={enrollment.id} className="overflow-hidden border-t-4" style={{ borderTopColor: '#9b87f5' }}>
                <div className="h-36 bg-[#14171F] flex items-center justify-center">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="max-h-full w-auto object-contain" 
                  />
                </div>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-white">{course.title}</CardTitle>
                    <StatusBadge status={enrollment.status} />
                  </div>
                </CardHeader>
                <CardContent className="pb-0">
                  <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                  
                  {enrollment.progress > 0 && enrollment.progress < 100 && (
                    <div className="w-full h-2 bg-[#222] rounded-full mb-4 overflow-hidden">
                      <div 
                        className="h-full bg-[#9b87f5]" 
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                  )}
                  
                  <div className="text-xs text-[#8E9196] flex flex-col gap-1 mb-3">
                    <div className="flex justify-between">
                      <span>Enrolled:</span>
                      <span>{formatDate(enrollment.purchase_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last accessed:</span>
                      <span>{enrollment.last_accessed ? formatDate(enrollment.last_accessed) : 'Never'}</span>
                    </div>
                    {enrollment.external_platform && (
                      <div className="flex justify-between">
                        <span>Platform:</span>
                        <span>{enrollment.external_platform}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2 pt-3">
                  <Button asChild className="flex-1 bg-[#9b87f5] hover:bg-[#8a76e4]">
                    <a href={course.url} target={course.external ? "_blank" : undefined} rel={course.external ? "noopener noreferrer" : undefined}>
                      <Play className="h-4 w-4 mr-1" />
                      Continue
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <a href={course.resources_url} target={course.external ? "_blank" : undefined} rel={course.external ? "noopener noreferrer" : undefined}>
                      <FileText className="h-4 w-4 mr-1" />
                      Resources
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[300px]">Course</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Enrolled On</TableHead>
              <TableHead>Last Accessed</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrollments.map((enrollment) => {
              const course = coursesData[enrollment.course_id as keyof typeof coursesData];
              
              return (
                <TableRow key={enrollment.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{course.title}</span>
                      {enrollment.external_platform && (
                        <span className="text-xs text-[#8E9196]">
                          via {enrollment.external_platform}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={enrollment.status} />
                    {enrollment.progress > 0 && enrollment.progress < 100 && (
                      <div className="w-24 h-1 bg-[#222] rounded-full mt-2">
                        <div 
                          className="h-full bg-[#9b87f5]"
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(enrollment.purchase_date)}</TableCell>
                  <TableCell>{enrollment.last_accessed ? formatDate(enrollment.last_accessed) : 'Never'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button asChild size="sm" className="bg-[#9b87f5] hover:bg-[#8a76e4]">
                      <a href={course.url} target={course.external ? "_blank" : undefined} rel={course.external ? "noopener noreferrer" : undefined}>
                        <Play className="h-3 w-3 mr-1" />
                        Continue
                      </a>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <a href={course.resources_url} target={course.external ? "_blank" : undefined} rel={course.external ? "noopener noreferrer" : undefined}>
                        <FileText className="h-3 w-3 mr-1" />
                        Resources
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default MyCoursesPage;
