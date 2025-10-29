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
import { Input } from "@/components/ui/input";
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
  const [selectedClass, setSelectedClass] = useState('class-1');
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
  
  // Video feed states
  const [videoSources, setVideoSources] = useState([
    { id: 1, name: "Class 1-A", status: "live", quality: "1080p" },
    { id: 2, name: "Class 2-B", status: "live", quality: "720p" },
    { id: 3, name: "Class 3-B", status: "live", quality: "720p" },
    { id: 4, name: "Main Ground", status: "offline", quality: "720p" }
  ]);
  const [isAddSourceModalOpen, setIsAddSourceModalOpen] = useState(false);
  const [showDeleteSourceConfirm, setShowDeleteSourceConfirm] = useState(false);
  const [sourceToDelete, setSourceToDelete] = useState<string | null>(null);
  const [isProcessedVideoMain, setIsProcessedVideoMain] = useState(true);
  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date();
    now.setHours(14, 30, 0, 0); // Set to 14:30 (2:30 PM)
    return now;
  });
  const [sourceType, setSourceType] = useState('classroom');
  const [selectedClassroomId, setSelectedClassroomId] = useState('');
  const [isTrackingPaused, setIsTrackingPaused] = useState(false);
  const [showDateTimeModal, setShowDateTimeModal] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | undefined>(new Date());
  const [selectedVideoSource, setSelectedVideoSource] = useState('class-1a');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [isLoadingTrackingData, setIsLoadingTrackingData] = useState(false);
  const [videoFPS, setVideoFPS] = useState<number>(14.79);
  const [showIncidentWarning, setShowIncidentWarning] = useState(false);
  const [incidentTimestamp, setIncidentTimestamp] = useState<string>('');
  const [safetyStatus, setSafetyStatus] = useState<'Safe' | 'Warning'>('Safe');
  const [detectedIncidents, setDetectedIncidents] = useState<Array<{type: string, time: string, class: string}>>([]);
  const [showIncidentDetailsModal, setShowIncidentDetailsModal] = useState(false);
  
  // Update clock every second starting from 14:30 (pause when tracking is paused)
  React.useEffect(() => {
    if (isTrackingPaused) return; // Don't update clock when tracking is paused

    const timer = setInterval(() => {
      setCurrentTime(prevTime => {
        const newTime = new Date(prevTime);
        newTime.setSeconds(newTime.getSeconds() + 1);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTrackingPaused]);

  // Update FPS when video source changes
  React.useEffect(() => {
    if (selectedVideoSource === 'class-1a') {
      setVideoFPS(14.79);
    } else if (selectedVideoSource === 'class-2b') {
      setVideoFPS(20);
    } else if (selectedVideoSource === 'class-3b') {
      setVideoFPS(30);
    }
  }, [selectedVideoSource]);
  
  // Tracking options for video feed
  const [trackingOptions, setTrackingOptions] = useState({
    viewClassZones: false,
    students: true,
    teachers: true,
    askingQuestion: false,
    unseatedMovement: false,
    lackOfAttention: true,
    mobilePhoneUsage: true
  });

  // Load tracking data based on selected video source
  React.useEffect(() => {
    const loadTrackingData = async () => {
      setIsLoadingTrackingData(true);
      try {
        let jsonFile = '';
        if (selectedVideoSource === 'class-1a') {
          jsonFile = '/Education/Tracking File - Education 1.json';
        } else if (selectedVideoSource === 'class-2b') {
          jsonFile = '/Education/Tracking File - Education 2.json';
        } else if (selectedVideoSource === 'class-3b') {
          jsonFile = '/Education/Tracking File - Education 3.json';
        } else {
          // Skip loading for other sources
          setIsLoadingTrackingData(false);
          return;
        }
        
        const response = await fetch(jsonFile);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTrackingData(data);
        console.log('Education tracking data loaded:', data);
      } catch (error) {
        console.error('Error loading education tracking data:', error);
      } finally {
        setIsLoadingTrackingData(false);
      }
    };

    loadTrackingData();
  }, [selectedVideoSource]);

  // Draw tracking overlays on canvas
  React.useEffect(() => {
    if (!trackingData || !trackingData.frames) return;

    const drawTrackingOverlay = () => {
      const canvas = document.getElementById('education-tracking-canvas') as HTMLCanvasElement;
      const video = document.getElementById('education-video') as HTMLVideoElement;
      
      if (!canvas || !video) return;

      // Set canvas size to match video
      canvas.width = video.offsetWidth;
      canvas.height = video.offsetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Only show overlays if in Processed Video mode
      if (!isProcessedVideoMain) return;

      // Get current frame data based on video time
      const videoTime = video.currentTime;
      const fps = videoFPS;
      const currentFrameNumber = Math.floor(videoTime * fps) + 1;

      // Find frame data for current frame
      const frameData = trackingData.frames.find((frame: any) => frame.frame_number === currentFrameNumber);
      
      if (!frameData) return;

      const videoWidth = trackingData.dimension?.width || 1500;
      const videoHeight = trackingData.dimension?.height || 800;

      // Draw class zone if enabled
      if (trackingOptions.viewClassZones) {
        // Define classroom zone (covering most of the classroom area)
        const zoneX1 = 50;
        const zoneY1 = 50;
        const zoneX2 = videoWidth - 50;
        const zoneY2 = videoHeight - 50;

        const scaleX = canvas.width / videoWidth;
        const scaleY = canvas.height / videoHeight;

        const scaledX1 = zoneX1 * scaleX;
        const scaledY1 = zoneY1 * scaleY;
        const scaledWidth = (zoneX2 - zoneX1) * scaleX;
        const scaledHeight = (zoneY2 - zoneY1) * scaleY;

        // Draw zone fill (light red like Retail)
        ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
        ctx.fillRect(scaledX1, scaledY1, scaledWidth, scaledHeight);

        // Draw zone border
        ctx.strokeStyle = 'rgba(156, 163, 175, 0.8)';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 4]);
        ctx.strokeRect(scaledX1, scaledY1, scaledWidth, scaledHeight);
        ctx.setLineDash([]);

        // Draw zone label
        ctx.fillStyle = 'rgba(156, 163, 175, 0.9)';
        ctx.fillRect(scaledX1 + 10, scaledY1 + 10, 120, 30);
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Classroom Zone', scaledX1 + 20, scaledY1 + 30);
      }

      // Helper function to draw a person (student or teacher)
      const drawPerson = (person: any, isTeacher: boolean) => {
        if (!person.bbox) return;
        
        // Skip if tracking is disabled for this person type
        if (isTeacher && !trackingOptions.teachers) return;
        if (!isTeacher && !trackingOptions.students) return;

        const { x1, y1, x2, y2 } = person.bbox;
        const scaleX = canvas.width / videoWidth;
        const scaleY = canvas.height / videoHeight;

        const scaledX1 = x1 * scaleX;
        const scaledY1 = y1 * scaleY;
        const scaledWidth = (x2 - x1) * scaleX;
        const scaledHeight = (y2 - y1) * scaleY;

        // Determine box color
        let boxColor, boxWidth, labelBgColor;
        
        if (isTeacher) {
          // Teachers get light grey box
          boxColor = '#9ca3af';
          boxWidth = 2;
          labelBgColor = 'rgba(156, 163, 175, 0.9)';
        } else {
          // Students: check if should be highlighted in red based on ENABLED checkboxes only
          let shouldHighlight = false;
          
          if (trackingOptions.askingQuestion && person.hand_raised) {
            shouldHighlight = true;
          }
          if (trackingOptions.unseatedMovement && person.standing) {
            shouldHighlight = true;
          }
          if (trackingOptions.lackOfAttention && (!person.face_up || !person.attentive || person.talking || person.looking_around)) {
            shouldHighlight = true;
          }
          if (trackingOptions.mobilePhoneUsage && person.using_phone) {
            shouldHighlight = true;
          }
          
          boxColor = shouldHighlight ? '#ef4444' : '#00ff00';
          boxWidth = shouldHighlight ? 3 : 2;
          labelBgColor = shouldHighlight ? 'rgba(239, 68, 68, 0.9)' : 'rgba(0, 0, 0, 0.7)';
        }

        // Draw bounding box
        ctx.strokeStyle = boxColor;
        ctx.lineWidth = boxWidth;
        ctx.strokeRect(scaledX1, scaledY1, scaledWidth, scaledHeight);

        // Draw label - only show type and ID
        const labelText = isTeacher ? 'Teacher' : `Student ${person.id}`;
        
        ctx.fillStyle = labelBgColor;
        const labelWidth = isTeacher ? 80 : 100;
        ctx.fillRect(scaledX1, scaledY1 - 25, labelWidth, 25);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(labelText, scaledX1 + 5, scaledY1 - 8);
      };

      // Draw students
      if (frameData.students) {
        frameData.students.forEach((student: any) => {
          const isTeacher = student.type === 'teacher';
          drawPerson(student, isTeacher);
        });
      }

      // Draw teachers from separate teachers array
      if (frameData.teachers && frameData.teachers.length > 0) {
        frameData.teachers.forEach((teacher: any) => {
          drawPerson(teacher, true);
        });
      }

      // Check for potential incidents in the current frame
      let hasIncident = false;
      if (frameData.students) {
        frameData.students.forEach((student: any) => {
          if (student.potential_incident === true) {
            hasIncident = true;
          }
        });
      }
      // Also check teachers array for potential incidents
      if (frameData.teachers) {
        frameData.teachers.forEach((teacher: any) => {
          if (teacher.potential_incident === true) {
            hasIncident = true;
          }
        });
      }

      // If incident detected, show warning
      if (hasIncident && !showIncidentWarning) {
        // Format time as HH:MM (24-hour format)
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const timeString = `${hours}:${minutes.toString().padStart(2, '0')}`;
        
        // Get class name based on selected video source
        let className = 'Main Ground';
        if (selectedVideoSource === 'class-1a') {
          className = 'Class 1-A';
        } else if (selectedVideoSource === 'class-2b') {
          className = 'Class 2-B';
        } else if (selectedVideoSource === 'class-3b') {
          className = 'Class 3-B';
        }
        
        // Determine incident type based on video source
        const incidentType = selectedVideoSource === 'class-3b' ? 'Fight' : 'Disciplinary Action';
        
        // Check if an incident already exists for this class and minute to prevent duplicates
        setDetectedIncidents(prev => {
          const alreadyExists = prev.some(
            incident => incident.class === className && incident.time === timeString
          );
          
          // Only add if it doesn't already exist for this class and minute
          if (!alreadyExists) {
            setIncidentTimestamp(timeString);
            setSafetyStatus('Warning');
            setShowIncidentWarning(true);
            
            // Hide warning after 5 seconds
            setTimeout(() => {
              setShowIncidentWarning(false);
            }, 5000);
            
            return [...prev, { 
              type: incidentType, 
              time: timeString, 
              class: className 
            }];
          }
          
          // Still show warning if duplicate but don't add to list
          setIncidentTimestamp(timeString);
          setSafetyStatus('Warning');
          setShowIncidentWarning(true);
          setTimeout(() => {
            setShowIncidentWarning(false);
          }, 5000);
          
          return prev;
        });
      }
    };

    // Update overlay every frame (only when not paused)
    const video = document.getElementById('education-video') as HTMLVideoElement;
    if (video && !isTrackingPaused) {
      video.addEventListener('timeupdate', drawTrackingOverlay);
      video.addEventListener('seeked', drawTrackingOverlay);
      video.addEventListener('loadedmetadata', drawTrackingOverlay);
      
      return () => {
        video.removeEventListener('timeupdate', drawTrackingOverlay);
        video.removeEventListener('seeked', drawTrackingOverlay);
        video.removeEventListener('loadedmetadata', drawTrackingOverlay);
      };
    } else if (isTrackingPaused) {
      // When paused, draw one final frame and keep it
      drawTrackingOverlay();
    }
  }, [trackingData, trackingOptions, videoFPS, isProcessedVideoMain, isTrackingPaused, showIncidentWarning, currentTime, selectedVideoSource]);

  // Campus options
  const campusOptions = [
    { value: 'main-campus', label: 'Main Campus' },
    { value: 'north-campus', label: 'North Campus' },
    { value: 'south-campus', label: 'South Campus' }
  ];

  // Class options
  const classOptions = [
    { value: 'class-1', label: 'Class 1' },
    { value: 'class-2', label: 'Class 2' },
    { value: 'class-3', label: 'Class 3' },
    { value: 'class-4', label: 'Class 4' },
    { value: 'class-5', label: 'Class 5' }
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

  // Calculate live insights from tracking data
  const [liveStudentCount, setLiveStudentCount] = React.useState(27);
  const [liveEngagement, setLiveEngagement] = React.useState(82);

  React.useEffect(() => {
    if (!trackingData || !trackingData.frames) return;

    const calculateLiveMetrics = () => {
      const video = document.getElementById('education-video') as HTMLVideoElement;
      if (!video) return;

      const videoTime = video.currentTime;
      const fps = videoFPS;
      const currentFrameNumber = Math.floor(videoTime * fps) + 1;

      const frameData = trackingData.frames.find((frame: any) => frame.frame_number === currentFrameNumber);
      
      if (frameData && frameData.students) {
        // Count students in current frame
        setLiveStudentCount(frameData.students.length);

        // Calculate engagement score based on attentive students
        const attentiveCount = frameData.students.filter((s: any) => 
          s.attentive && s.face_up && !s.talking && !s.looking_around && !s.using_phone
        ).length;
        
        const engagementScore = frameData.students.length > 0
          ? Math.round((attentiveCount / frameData.students.length) * 100)
          : 0;
        
        setLiveEngagement(engagementScore);
      }
    };

    const interval = setInterval(calculateLiveMetrics, 1000);
    return () => clearInterval(interval);
  }, [trackingData, videoFPS]);

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
          <TabsContent value="video-feed" className="space-y-8">
            <SectionHeader 
              title="Interactive Video Dashboard" 
              description="Real-time classroom monitoring with AI-powered student and teacher tracking"
              className="mb-6"
            />
            
            {/* Premium Notice */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-6 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">★</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-orange-800">Premium Feature</h3>
                  <p className="text-orange-700 text-sm">Video Feed Analysis is available only with Premium subscription. Upgrade to access real-time classroom monitoring and AI-powered analytics.</p>
                </div>
              </div>
              <div className="mt-4">
                <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
                  Talk to our Sales Team to upgrade
                </Button>
              </div>
            </div>

            {/* Main Video Interface */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Video Selection Sidebar */}
              <div className="xl:col-span-1 space-y-6">
                <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Video Sources</h3>
                    <button className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded">
                      + Add Source
                    </button>
                  </div>
                  <div className="space-y-2">
                    {videoSources.map((source) => {
                      let sourceId = 'main-ground';
                      if (source.name === 'Class 1-A') {
                        sourceId = 'class-1a';
                      } else if (source.name === 'Class 2-B') {
                        sourceId = 'class-2b';
                      } else if (source.name === 'Class 3-B') {
                        sourceId = 'class-3b';
                      }
                      const isActive = selectedVideoSource === sourceId;
                      
                      return (
                        <div 
                          key={source.id} 
                          className={`p-3 border rounded-lg cursor-pointer transition-all group ${
                            isActive 
                              ? 'bg-primary/20 border-primary/40 ring-2 ring-primary/50'
                              : source.status === 'live'
                              ? 'bg-primary/10 border-primary/20 hover:bg-primary/15'
                              : source.status === 'pending'
                              ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
                              : 'bg-muted/30 border-border/30 hover:bg-muted/50'
                          }`}
                          onClick={() => {
                            if (source.status === 'live') {
                              setSelectedVideoSource(sourceId);
                            }
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{source.name}</span>
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${
                                source.status === 'live'
                                  ? 'bg-green-500 animate-pulse'
                                  : source.status === 'pending'
                                  ? 'bg-yellow-500'
                                  : 'bg-gray-400'
                              }`}></div>
                              <button
                                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-xs px-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSourceToDelete(source.name);
                                  setShowDeleteSourceConfirm(true);
                                }}
                              >
                                ×
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {source.status === 'live' 
                              ? 'Live' 
                              : source.status === 'pending'
                              ? 'Yet to be configured*'
                              : 'Offline'
                            } • {source.quality}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tracking Controls */}
                <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Tracking Menu</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">View Options</label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-primary" 
                            checked={trackingOptions.viewClassZones}
                            onChange={(e) => setTrackingOptions(prev => ({ ...prev, viewClassZones: e.target.checked }))}
                          />
                          <span className="text-sm font-medium">View Class Zones</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Person Type</label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-primary" 
                            checked={trackingOptions.students}
                            onChange={(e) => setTrackingOptions(prev => ({ ...prev, students: e.target.checked }))}
                          />
                          <span className="text-sm font-medium">Student</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-primary" 
                            checked={trackingOptions.teachers}
                            onChange={(e) => setTrackingOptions(prev => ({ ...prev, teachers: e.target.checked }))}
                          />
                          <span className="text-sm font-medium">Teacher</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Student Behavior <span className="italic text-muted-foreground">(Highlighted in Red)</span>
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-primary" 
                            checked={trackingOptions.askingQuestion}
                            onChange={(e) => setTrackingOptions(prev => ({ ...prev, askingQuestion: e.target.checked }))}
                          />
                          <span className="text-sm font-medium">Asking a Question/Doubt</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-primary" 
                            checked={trackingOptions.unseatedMovement}
                            onChange={(e) => setTrackingOptions(prev => ({ ...prev, unseatedMovement: e.target.checked }))}
                          />
                          <span className="text-sm font-medium">Unseated/Movement in Class</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-primary" 
                            checked={trackingOptions.lackOfAttention}
                            onChange={(e) => setTrackingOptions(prev => ({ ...prev, lackOfAttention: e.target.checked }))}
                          />
                          <span className="text-sm font-medium">Lack of Attention</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-primary" 
                            checked={trackingOptions.mobilePhoneUsage}
                            onChange={(e) => setTrackingOptions(prev => ({ ...prev, mobilePhoneUsage: e.target.checked }))}
                          />
                          <span className="text-sm font-medium">Mobile Phone Usage</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Video Display */}
              <div className="xl:col-span-3">
                <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-lg font-semibold">
                        {selectedVideoSource === 'class-1a' ? 'Class 1-A' : 
                         selectedVideoSource === 'class-2b' ? 'Class 2-B' :
                         selectedVideoSource === 'class-3b' ? 'Class 3-B' : 'Main Ground'}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{currentTime.toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{currentTime.toLocaleTimeString()}</span>
                        <span>•</span>
                        <span>1 Camera</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${isTrackingPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`}></div>
                      <span className={`text-sm font-medium ${isTrackingPaused ? 'text-yellow-700' : 'text-green-700'}`}>
                        {isTrackingPaused ? 'Tracking Paused' : 'Live Tracking'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Video Player */}
                  <div className="relative aspect-video bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden border border-border/30">
                    {/* Incident Warning Flash */}
                    {showIncidentWarning && (
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 animate-pulse">
                        <div className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-2xl border-2 border-red-400 flex items-center space-x-3">
                          <AlertTriangle className="w-6 h-6" />
                          <div>
                            <div className="font-bold text-lg">⚠️ Potential Incident Detected</div>
                            <div className="text-base font-semibold">
                              {selectedVideoSource === 'class-3b' ? 'Fight' : 'Disciplinary Action'} ({selectedVideoSource === 'class-1a' ? 'Class 1-A' : selectedVideoSource === 'class-2b' ? 'Class 2-B' : selectedVideoSource === 'class-3b' ? 'Class 3-B' : 'Main Ground'} {incidentTimestamp})
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <video
                      id="education-video"
                      key={selectedVideoSource}
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      onLoadStart={() => {
                        console.log('Video loading:', selectedVideoSource);
                        let videoSrc = '/Education/Original Video - Education 2.mp4';
                        if (selectedVideoSource === 'class-1a') {
                          videoSrc = '/Education/Original Video - Education 1.mp4';
                        } else if (selectedVideoSource === 'class-2b') {
                          videoSrc = '/Education/Original Video - Education 2.mp4';
                        } else if (selectedVideoSource === 'class-3b') {
                          videoSrc = '/Education/Original Video - Education 3.mp4';
                        }
                        console.log('Video src:', videoSrc);
                        console.log('Full URL:', window.location.origin + videoSrc);
                      }}
                      onLoadedData={() => {
                        console.log('Video loaded successfully:', selectedVideoSource);
                        const video = document.getElementById('education-video') as HTMLVideoElement;
                        if (video) {
                          console.log('Video duration:', video.duration);
                          console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
                        }
                      }}
                      onError={(e) => {
                        console.error('Video error:', e);
                        const video = e.target as HTMLVideoElement;
                        console.error('Video src:', video.src);
                        console.error('Current src:', video.currentSrc);
                        if (video.error) {
                          console.error('Error code:', video.error.code);
                          console.error('Error message:', video.error.message);
                        }
                      }}
                      onCanPlay={() => {
                        console.log('Video can play:', selectedVideoSource);
                      }}
                      onEnded={() => {
                        const video = document.getElementById('education-video') as HTMLVideoElement;
                        if (video) {
                          video.currentTime = 0;
                          video.play().catch(console.log);
                        }
                      }}
                    >
                      <source 
                        src={
                          selectedVideoSource === 'class-1a' 
                            ? '/Education/Original Video - Education 1.mp4'
                            : selectedVideoSource === 'class-2b'
                            ? '/Education/Original Video - Education 2.mp4'
                            : selectedVideoSource === 'class-3b'
                            ? '/Education/Original Video - Education 3.mp4'
                            : '/Education/Original Video - Education 2.mp4'
                        } 
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                    
                    {/* Tracking Overlay Canvas */}
                    <canvas
                      id="education-tracking-canvas"
                      className="absolute top-0 left-0 w-full h-full pointer-events-none"
                      style={{ zIndex: 10 }}
                    />
                    
                    {/* Video Type Indicator */}
                    <div className="absolute top-4 left-4 bg-black/70 text-white text-sm px-3 py-1 rounded-lg font-semibold">
                      {isProcessedVideoMain ? "Processed Video" : "Original Video"}
                    </div>

                    {/* Toggle Button */}
                    <button 
                      className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-2 rounded-lg flex items-center shadow-lg transition-colors"
                      onClick={() => setIsProcessedVideoMain(!isProcessedVideoMain)}
                    >
                      {isProcessedVideoMain ? "Switch to Original" : "Switch to Processed"}
                    </button>
                  </div>

                  {/* Video Control Buttons */}
                  <div className="mt-4 flex justify-center space-x-3">
                    <button 
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
                      onClick={() => {
                        const video = document.getElementById('education-video') as HTMLVideoElement;
                        const canvas = document.getElementById('education-tracking-canvas') as HTMLCanvasElement;
                        
                        if (video) {
                          // Create canvas with video dimensions
                          const snapshotCanvas = document.createElement('canvas');
                          snapshotCanvas.width = video.videoWidth || 1920;
                          snapshotCanvas.height = video.videoHeight || 1080;
                          const ctx = snapshotCanvas.getContext('2d');
                          
                          if (ctx) {
                            // Draw the video frame
                            ctx.drawImage(video, 0, 0, snapshotCanvas.width, snapshotCanvas.height);
                            
                            // Draw tracking overlays if in processed mode
                            if (canvas && isProcessedVideoMain) {
                              ctx.drawImage(canvas, 0, 0, snapshotCanvas.width, snapshotCanvas.height);
                            }
                            
                            // Add timestamp
                            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                            ctx.fillRect(10, snapshotCanvas.height - 80, 300, 70);
                            ctx.fillStyle = '#ffffff';
                            ctx.font = '16px Arial';
                            let className = 'Main Ground';
                            if (selectedVideoSource === 'class-1a') {
                              className = 'Class 1-A';
                            } else if (selectedVideoSource === 'class-2b') {
                              className = 'Class 2-B';
                            } else if (selectedVideoSource === 'class-3b') {
                              className = 'Class 3-B';
                            }
                            ctx.fillText(`Class: ${className}`, 20, snapshotCanvas.height - 55);
                            ctx.fillText(`Captured: ${new Date().toLocaleString()}`, 20, snapshotCanvas.height - 35);
                            ctx.fillText(`Mode: ${isProcessedVideoMain ? 'Processed' : 'Original'}`, 20, snapshotCanvas.height - 15);
                            
                            // Download the image
                            const link = document.createElement('a');
                            link.download = `classroom-snapshot-${Date.now()}.png`;
                            link.href = snapshotCanvas.toDataURL();
                            link.click();
                          }
                        }
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Save Snapshot</span>
                    </button>
                    
                    <button 
                      className={`${isTrackingPaused ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2`}
                      onClick={() => {
                        const video = document.getElementById('education-video') as HTMLVideoElement;
                        if (video) {
                          if (isTrackingPaused) {
                            video.play().catch(console.log);
                          } else {
                            video.pause();
                          }
                        }
                        setIsTrackingPaused(!isTrackingPaused);
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isTrackingPaused ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        )}
                      </svg>
                      <span>{isTrackingPaused ? 'Go Live' : 'Pause Tracking'}</span>
                    </button>
                    
                    <button 
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
                      onClick={() => setShowDateTimeModal(true)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Go to Particular Date/Time</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Insights */}
            <section>
              <SectionHeader 
                title="Live Insights" 
                description="Real-time analytics and monitoring"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Students Present</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">{liveStudentCount}</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Out of {selectedVideoSource === 'class-2b' ? '15' : selectedVideoSource === 'class-3b' ? '25' : '30'} total
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Class Engagement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">{liveEngagement}%</div>
                    <p className="text-sm text-muted-foreground mt-1">Students attentive</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Teacher Present</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedVideoSource === 'class-1a' || selectedVideoSource === 'class-3b' ? (
                      <>
                        <div className="text-3xl font-bold text-green-600">Present</div>
                        <p className="text-sm text-muted-foreground mt-1">Active in class</p>
                      </>
                    ) : (
                      <>
                        <div className="text-2xl font-bold text-gray-500">Unknown</div>
                        <p className="text-sm text-muted-foreground mt-1">Not tracked yet</p>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Safety Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {safetyStatus === 'Warning' ? (
                      <>
                        <div className="text-3xl font-bold text-red-600 flex items-center space-x-2">
                          <AlertTriangle className="w-8 h-8" />
                          <span>Warning</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {detectedIncidents.length} incident{detectedIncidents.length > 1 ? 's' : ''} detected{' '}
                          <button 
                            onClick={() => setShowIncidentDetailsModal(true)}
                            className="text-xs text-blue-600 hover:text-blue-800 underline cursor-pointer"
                          >
                            (view details)
                          </button>
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="text-3xl font-bold text-green-600">Normal</div>
                        <p className="text-sm text-muted-foreground mt-1">No incidents detected</p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </section>
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
      <Dialog open={showIncidentDetailsModal} onOpenChange={setShowIncidentDetailsModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detected Incidents</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {detectedIncidents.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No incidents detected</p>
            ) : (
              detectedIncidents.map((incident, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg bg-red-50 dark:bg-red-950/20">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <div>
                      <div className="font-semibold text-sm">{incident.type}</div>
                      <div className="text-xs text-muted-foreground">{incident.class} {incident.time}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setShowIncidentDetailsModal(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Date/Time Picker Modal for Video Feed */}
      <Dialog open={showDateTimeModal} onOpenChange={setShowDateTimeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Go to Particular Date/Time</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Date and Time</label>
              <Input
                type="datetime-local"
                className="w-full"
                value={selectedDateTime ? format(selectedDateTime, "yyyy-MM-dd'T'HH:mm") : ''}
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedDateTime(new Date(e.target.value));
                  }
                }}
              />
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>• Cannot go more than 2 days back from today</p>
              <p>• Up to 48 hours of data is stored</p>
              <p>• Contact Admin for longer timeframe</p>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDateTimeModal(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-teal-500 hover:bg-teal-600"
              onClick={() => {
                // Jump to specific time logic here
                console.log('Jumping to:', selectedDateTime);
                setShowDateTimeModal(false);
              }}
            >
              Go to Time
            </Button>
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
