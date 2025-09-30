import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, GraduationCap, Users, TrendingUp, AlertTriangle, BookOpen, UserCheck, CalendarIcon, Crown, Info } from 'lucide-react';
import { format } from "date-fns";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

// Student attendance data by period
const attendanceByPeriod = [
  { period: 'Period 1', present: 28, absent: 2, total: 30, teacher: 'Yes', engagement: 85, isOngoing: false },
  { period: 'Period 2', present: 28, absent: 2, total: 30, teacher: 'Yes', engagement: 82, isOngoing: false },
  { period: 'Period 3', present: 29, absent: 1, total: 30, teacher: 'Yes', engagement: 88, isOngoing: false },
  { period: 'Lunch', present: null, absent: null, total: null, teacher: null, engagement: null, isBreak: true, isOngoing: false },
  { period: 'Period 4', present: 27, absent: 3, total: 30, teacher: 'No', engagement: null, isOngoing: false },
  { period: 'Period 5', present: 26, absent: 4, total: 30, teacher: 'Yes', engagement: 84, isOngoing: false },
  { period: 'Period 6', present: 27, absent: 3, total: 30, teacher: 'Yes', engagement: 81, isOngoing: true }
];

// Incidents data
const incidentsData = [
  { id: 1, type: 'Fight', time: '10:45 AM', location: 'Playground', class: 'Class 9-B', severity: 'High', details: 'Physical altercation between 2 students', hasVideo: true },
  { id: 2, type: 'Mobile Phone Usage', time: '11:30 AM', location: 'Class 10-A', class: 'Class 10-A', severity: 'Low', details: 'Student using phone during lecture', hasVideo: true },
  { id: 3, type: 'Mobile Phone Usage', time: '02:15 PM', location: 'Class 10-A', class: 'Class 10-A', severity: 'Low', details: 'Student texting during exam', hasVideo: false },
  { id: 4, type: 'Unauthorized Entry', time: '03:20 PM', location: 'Staff Room', class: 'N/A', severity: 'Medium', details: 'Student entered without permission', hasVideo: true },
  { id: 5, type: 'Fight', time: '01:15 PM', location: 'Cafeteria', class: 'Class 8-C', severity: 'High', details: 'Dispute between students during lunch', hasVideo: true }
];

// Daily attendance trends
const dailyAttendanceTrends = [
  { date: 'Sep 24', studentAttendance: 93, teacherAttendance: 100 },
  { date: 'Sep 25', studentAttendance: 90, teacherAttendance: 100 },
  { date: 'Sep 26', studentAttendance: 95, teacherAttendance: 83 },
  { date: 'Sep 27', studentAttendance: 92, teacherAttendance: 100 },
  { date: 'Sep 28', studentAttendance: 88, teacherAttendance: 100 },
  { date: 'Sep 29', studentAttendance: 94, teacherAttendance: 83 },
  { date: 'Sep 30', studentAttendance: 97, teacherAttendance: 83 }
];

// Engagement score by subject
const engagementBySubject = [
  { subject: 'Mathematics', score: 85, teacher: 'Mr. Rajesh Kumar' },
  { subject: 'Science', score: 92, teacher: 'Ms. Priya Sharma' },
  { subject: 'English', score: 78, teacher: 'Mrs. Anjali Patel' },
  { subject: 'History', score: 88, teacher: 'Mr. Vikram Singh' },
  { subject: 'Physics', score: 81, teacher: 'Dr. Suresh Reddy' },
  { subject: 'Chemistry', score: 87, teacher: 'Ms. Divya Iyer' }
];

const Education = () => {
  const navigate = useNavigate();
  
  // State for campus/class/section selection
  const [selectedCampus, setSelectedCampus] = useState('main-campus');
  const [selectedClass, setSelectedClass] = useState('class-10');
  const [selectedSection, setSelectedSection] = useState('section-a');
  const [isTodayMode, setIsTodayMode] = useState(true);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date()
  });

  // Modal states
  const [showStudentInsights, setShowStudentInsights] = useState(false);
  const [showIncidentDetails, setShowIncidentDetails] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);

  // Campus options
  const campusOptions = [
    { value: 'main-campus', label: 'Main Campus' },
    { value: 'north-campus', label: 'North Campus' },
    { value: 'south-campus', label: 'South Campus' }
  ];

  // Class options
  const classOptions = [
    { value: 'class-8', label: 'Class 8' },
    { value: 'class-9', label: 'Class 9' },
    { value: 'class-10', label: 'Class 10' },
    { value: 'class-11', label: 'Class 11' },
    { value: 'class-12', label: 'Class 12' }
  ];

  // Section options
  const sectionOptions = [
    { value: 'section-a', label: 'Section A' },
    { value: 'section-b', label: 'Section B' },
    { value: 'section-c', label: 'Section C' }
  ];

  // Calculate today's metrics
  const totalStudents = 30;
  const maxPresentToday = Math.max(...attendanceByPeriod.filter(p => !p.isBreak && p.present !== null).map(p => p.present!));
  const minAbsentToday = Math.min(...attendanceByPeriod.filter(p => !p.isBreak && p.absent !== null).map(p => p.absent!));
  const attendanceRate = Math.round((maxPresentToday / totalStudents) * 100);
  const engagementScore = 85;

  // Generate dynamic attendance data based on selected date range
  const generateAttendanceTrends = () => {
    if (!dateRange?.from || !dateRange?.to) return dailyAttendanceTrends;
    
    const trends = [];
    const startDate = new Date(dateRange.from);
    const endDate = new Date(dateRange.to);
    const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i <= daysDiff; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      trends.push({
        date: format(currentDate, 'MMM dd'),
        studentAttendance: Math.floor(85 + Math.random() * 15), // 85-100%
        teacherAttendance: Math.random() > 0.3 ? 100 : 83 // Mostly 100%, sometimes 83%
      });
    }
    
    return trends;
  };

  const displayedAttendanceTrends = generateAttendanceTrends();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Algosights</h1>
                <p className="text-sm text-slate-600">AI-Powered Video Feed Analysis Platform</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-6 bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-500 rounded-r-lg p-4">
          <h1 className="text-2xl font-semibold text-slate-700">
            Education - Campus Analytics
          </h1>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="class-insights" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="class-insights" className="text-base">Class Level Analysis</TabsTrigger>
            <TabsTrigger value="video-feed" className="text-base">
              <Crown className="w-4 h-4 mr-2" />
              Video Feed
            </TabsTrigger>
          </TabsList>

          {/* Class Level Analysis Tab */}
          <TabsContent value="class-insights" className="space-y-6">
            {/* Section Header */}
            <SectionHeader 
              title="Class Level Analytics" 
              description="Comprehensive insights into student attendance, engagement, teacher performance, and campus safety"
            />

            {/* Campus/Class/Section Selection */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Campus</label>
                  <Select value={selectedCampus} onValueChange={setSelectedCampus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {campusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Class</label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {classOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Section</label>
                  <Select value={selectedSection} onValueChange={setSelectedSection}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sectionOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Today's Metrics Section */}
            <section>
              <SectionHeader 
                title="Today's Metrics" 
                description={`Metrics for ${format(new Date(), 'MMMM dd, yyyy')}`}
              />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Attendance Rate Card */}
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Attendance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{attendanceRate}%</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {maxPresentToday} / {totalStudents} students present (max)
                </p>
              </CardContent>
            </Card>

            {/* Engagement Score Card */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Engagement Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{engagementScore}</div>
                <p className="text-sm text-muted-foreground mt-1">Class average participation</p>
              </CardContent>
            </Card>

            {/* Teacher Presence Card */}
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Teacher Presence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">5/6</div>
                <p className="text-sm text-muted-foreground mt-1">Periods covered today</p>
              </CardContent>
            </Card>
          </div>

          {/* Attendance and Engagement Table */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Attendance and Engagement</CardTitle>
                  <CardDescription>Period-wise student attendance, engagement scores, and teacher presence</CardDescription>
                </div>
                <Button onClick={() => setShowStudentInsights(true)}>
                  <UserCheck className="w-4 h-4 mr-2" />
                  Student/Teacher Details
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <TooltipProvider>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Period</th>
                        <th className="text-left py-3 px-4 font-medium">Students Present</th>
                        <th className="text-left py-3 px-4 font-medium">Students Absent</th>
                        <th className="text-left py-3 px-4 font-medium">Attendance %</th>
                        <th className="text-left py-3 px-4 font-medium">Teacher Present</th>
                        <th className="text-left py-3 px-4 font-medium">
                          <div className="flex items-center space-x-1">
                            <span>Engagement Score</span>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-4 h-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">Calculated based on video feed analysis of student and teacher involvement - including hand gestures, attentiveness, participation, body language, and classroom interaction patterns</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceByPeriod.map((period, index) => (
                        period.isBreak ? (
                          <tr key={index} className="border-b bg-yellow-50">
                            <td colSpan={6} className="py-3 px-4">
                              <div className="flex items-center justify-center">
                                <span className="text-yellow-700 font-semibold text-lg">
                                  {period.period}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          <tr 
                            key={index} 
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="py-3 px-4 font-medium">
                              <div className="flex items-center space-x-2">
                                <span>{period.period}</span>
                                {period.isOngoing && (
                                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-green-600 font-semibold">
                              {period.present}
                            </td>
                            <td className="py-3 px-4 text-red-600 font-semibold">
                              {period.absent}
                            </td>
                            <td className="py-3 px-4 font-semibold">
                              {`${Math.round((period.present! / period.total) * 100)}%`}
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant={period.teacher === 'Yes' ? 'default' : 'destructive'}>
                                {period.teacher}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              {period.engagement !== null ? (
                                <div className="flex items-center space-x-2">
                                  <span className={`font-semibold ${
                                    period.engagement >= 80 ? 'text-green-600' :
                                    period.engagement >= 65 ? 'text-yellow-600' : 'text-red-600'
                                  }`}>
                                    {period.engagement}
                                  </span>
                                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full ${
                                        period.engagement >= 80 ? 'bg-green-500' :
                                        period.engagement >= 65 ? 'bg-yellow-500' : 'bg-red-500'
                                      }`}
                                      style={{ width: `${period.engagement}%` }}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm italic">Not Applicable</span>
                              )}
                            </td>
                          </tr>
                        )
                      ))}
                    </tbody>
                  </table>
                </div>
              </TooltipProvider>
            </CardContent>
          </Card>

        </section>

        {/* Patterns & Trends Section */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1">Patterns & Trends (Medium to Long Term)</h2>
              <p className="text-sm text-muted-foreground">Historical performance and engagement data</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">Choose Date:</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span className="text-sm">
                      {dateRange?.from && dateRange?.to 
                        ? `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd, yyyy")}`
                        : "Select dates"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    selected={{
                      from: dateRange?.from,
                      to: dateRange?.to
                    }}
                    onSelect={(range) => {
                      if (range?.from) {
                        setDateRange({
                          from: range.from,
                          to: range.to || range.from
                        });
                      }
                    }}
                    numberOfMonths={2}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Attendance Trends</CardTitle>
                <CardDescription>Daily student and teacher attendance for selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={displayedAttendanceTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="studentAttendance" stroke="#10b981" strokeWidth={2} name="Student Attendance %" />
                    <Line type="monotone" dataKey="teacherAttendance" stroke="#8b5cf6" strokeWidth={2} name="Teacher Attendance %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Engagement by Subject */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement Score by Subject</CardTitle>
                <CardDescription>Average engagement levels across subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={engagementBySubject}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <RechartsTooltip content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg">
                            <p className="font-semibold">{payload[0].payload.subject}</p>
                            <p className="text-sm text-muted-foreground">Teacher: {payload[0].payload.teacher}</p>
                            <p className="text-sm">Score: <span className="font-semibold">{payload[0].value}</span></p>
                          </div>
                        );
                      }
                      return null;
                    }} />
                    <Bar dataKey="score" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Campus-wide Incidents Section */}
        <section className="mt-8">
          <SectionHeader 
            title="Campus Incidents Today" 
            description="Security and behavioral incidents across all classes and locations"
          />
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>Potential Incidents Detected</span>
                    <Badge variant="destructive">{incidentsData.length}</Badge>
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {incidentsData.map((incident) => (
                  <div
                    key={incident.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedIncident(incident);
                      setShowIncidentDetails(true);
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        incident.severity === 'High' ? 'bg-red-100' :
                        incident.severity === 'Medium' ? 'bg-yellow-100' : 'bg-blue-100'
                      }`}>
                        <AlertTriangle className={`w-6 h-6 ${
                          incident.severity === 'High' ? 'text-red-600' :
                          incident.severity === 'Medium' ? 'text-yellow-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-semibold">{incident.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {incident.time} • {incident.location} • {incident.class}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={
                        incident.severity === 'High' ? 'destructive' :
                        incident.severity === 'Medium' ? 'secondary' : 'outline'
                      }>
                        {incident.severity}
                      </Badge>
                      <Button variant="ghost" size="sm">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
          </TabsContent>

          {/* Video Feed Tab */}
          <TabsContent value="video-feed" className="space-y-6">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-blue-900">Premium Feature</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-blue-800 mb-4">
                  Video feed analysis for education campuses is available as a premium feature. 
                  This includes classroom monitoring, attendance verification, and safety incident detection.
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Contact Sales for Access
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Student/Teacher Details Modal */}
      <Dialog open={showStudentInsights} onOpenChange={setShowStudentInsights}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Student & Teacher Level Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[600px] overflow-y-auto">
            {/* All Students Attendance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Student Attendance Summary</CardTitle>
                <CardDescription>Complete attendance record for all students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {[
                    { name: 'Aarav Sharma', attendance: 100 },
                    { name: 'Priya Patel', attendance: 99 },
                    { name: 'Arjun Reddy', attendance: 98 },
                    { name: 'Ananya Iyer', attendance: 97 },
                    { name: 'Rohan Gupta', attendance: 96 },
                    { name: 'Diya Kapoor', attendance: 95 },
                    { name: 'Kabir Singh', attendance: 94 },
                    { name: 'Ishita Verma', attendance: 93 },
                    { name: 'Advait Joshi', attendance: 92 },
                    { name: 'Saanvi Kumar', attendance: 91 },
                    { name: 'Vihaan Agarwal', attendance: 90 },
                    { name: 'Myra Chatterjee', attendance: 89 },
                    { name: 'Reyansh Bhatt', attendance: 88 },
                    { name: 'Aadhya Menon', attendance: 87 },
                    { name: 'Aditya Mehta', attendance: 68 },
                    { name: 'Sneha Desai', attendance: 65 },
                    { name: 'Vivaan Kumar', attendance: 62 },
                    { name: 'Riya Joshi', attendance: 59 },
                    { name: 'Aryan Malhotra', attendance: 56 },
                    { name: 'Kavya Nair', attendance: 53 },
                    { name: 'Siddharth Rao', attendance: 50 },
                    { name: 'Navya Singh', attendance: 48 },
                    { name: 'Dhruv Pandey', attendance: 45 },
                    { name: 'Isha Bansal', attendance: 42 },
                    { name: 'Arnav Shah', attendance: 40 },
                    { name: 'Tanvi Reddy', attendance: 38 },
                    { name: 'Karan Bose', attendance: 35 },
                    { name: 'Meera Kulkarni', attendance: 32 },
                    { name: 'Yash Srinivasan', attendance: 30 },
                    { name: 'Zara Khan', attendance: 28 }
                  ].map((student, idx) => (
                    <div 
                      key={idx} 
                      className={`flex items-center justify-between p-2 rounded ${
                        student.attendance >= 90 ? 'bg-green-50' :
                        student.attendance >= 75 ? 'bg-yellow-50' : 'bg-red-50'
                      }`}
                    >
                      <span className="font-medium">{student.name}</span>
                      <Badge variant={
                        student.attendance >= 90 ? 'default' :
                        student.attendance >= 75 ? 'secondary' : 'destructive'
                      }>
                        {student.attendance}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Teacher Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Teacher Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {engagementBySubject.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-semibold">{item.teacher}</p>
                        <p className="text-sm text-muted-foreground">{item.subject}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">{item.score}</p>
                        <p className="text-xs text-muted-foreground">Engagement Score</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setShowStudentInsights(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Incident Details Modal */}
      <Dialog open={showIncidentDetails} onOpenChange={setShowIncidentDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Incident Details</DialogTitle>
          </DialogHeader>
          {selectedIncident && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Type</label>
                <p className="text-lg font-semibold">{selectedIncident.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Time</label>
                <p className="text-lg font-semibold">{selectedIncident.time}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Location</label>
                <p className="text-lg font-semibold">{selectedIncident.location}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Severity</label>
                <Badge variant={
                  selectedIncident.severity === 'High' ? 'destructive' :
                  selectedIncident.severity === 'Medium' ? 'secondary' : 'outline'
                } className="mt-1">
                  {selectedIncident.severity}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Details</label>
                <p className="mt-1">{selectedIncident.details}</p>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowIncidentDetails(false)}>Close</Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch Video Clip
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Education;
