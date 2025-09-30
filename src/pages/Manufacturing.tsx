import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Factory, TrendingUp, AlertTriangle, CheckCircle, Clock, Users, Zap, Crown, CalendarIcon } from 'lucide-react';
import { format } from "date-fns";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

// Manufacturing-specific data
const productionData = [
  { hour: '06:00', units: 45, efficiency: 92 },
  { hour: '07:00', units: 52, efficiency: 95 },
  { hour: '08:00', units: 48, efficiency: 89 },
  { hour: '09:00', units: 61, efficiency: 97 },
  { hour: '10:00', units: 58, efficiency: 94 },
  { hour: '11:00', units: 55, efficiency: 91 },
  { hour: '12:00', units: 42, efficiency: 88 },
  { hour: '13:00', units: 38, efficiency: 85 },
  { hour: '14:00', units: 49, efficiency: 92 },
  { hour: '15:00', units: 56, efficiency: 96 },
  { hour: '16:00', units: 53, efficiency: 93 },
  { hour: '17:00', units: 47, efficiency: 90 }
];

const qualityData = [
  { name: 'Pass', value: 78, color: '#10b981' },
  { name: 'Needs Check', value: 18, color: '#f59e0b' },
  { name: 'Damaged', value: 4, color: '#ef4444' }
];

// Calculate quality score to match pie chart
const qualityScore = Math.round((qualityData[0].value + qualityData[1].value * 0.5 + qualityData[2].value * 0.1));

const safetyData = [
  { zone: 'Assembly Line A', incidents: 0, status: 'Safe' },
  { zone: 'Assembly Line B', incidents: 1, status: 'Warning' },
  { zone: 'Packaging', incidents: 0, status: 'Safe' },
  { zone: 'Quality Control', incidents: 0, status: 'Safe' },
  { zone: 'Warehouse', incidents: 2, status: 'Alert' }
];

const Manufacturing = () => {
  const navigate = useNavigate();
  
  // State for location selection and date range
  const [selectedLocation, setSelectedLocation] = React.useState('factory-1');
  const [isTodayMode, setIsTodayMode] = React.useState(true);
  const [manufacturingDateRange, setManufacturingDateRange] = React.useState<{ from: Date; to: Date } | undefined>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    to: new Date(Date.now() - 24 * 60 * 60 * 1000) // yesterday
  });

  // Video feed state
  const [isProcessedVideoMain, setIsProcessedVideoMain] = React.useState(true);
  const mainVideoRef = React.useRef<HTMLVideoElement>(null);
  const overlayCanvasRef = React.useRef<HTMLCanvasElement>(null);

  // Last synced time state for dynamic counter
  const [lastSyncedTime, setLastSyncedTime] = useState('18:45:00');

  // Tracking data state
  const [trackingData, setTrackingData] = React.useState<any>(null);
  const [isLoadingTrackingData, setIsLoadingTrackingData] = React.useState(false);
  const [currentFrame, setCurrentFrame] = React.useState(0);
  const [videoFPS, setVideoFPS] = React.useState<number>(30); // Default FPS for manufacturing video
  
  // Tracking options
  const [trackingOptions, setTrackingOptions] = React.useState({
    viewFacilityZones: false,
    workers: false,
    boxes: true  // Default to checked for boxes
  });

  // Custom object modal state
  const [showAddCustomObjectModal, setShowAddCustomObjectModal] = React.useState(false);
  const [customObjectName, setCustomObjectName] = React.useState('');
  const [customObjectImages, setCustomObjectImages] = React.useState<File[]>([]);
  const [showCustomObjectSuccessMessage, setShowCustomObjectSuccessMessage] = React.useState(false);
  const [submittedCustomObjects, setSubmittedCustomObjects] = React.useState<string[]>([]);
  
  // Date/Time picker state
  const [showDateTimeModal, setShowDateTimeModal] = React.useState(false);
  const [selectedDateTime, setSelectedDateTime] = React.useState<Date | undefined>(new Date());

  // Effect to update last synced time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setLastSyncedTime(prevTime => {
        const [hours, minutes, seconds] = prevTime.split(':').map(Number);
        
        // Increment seconds
        let newSeconds = seconds + 1;
        let newMinutes = minutes;
        let newHours = hours;
        
        // Handle minute rollover
        if (newSeconds >= 60) {
          newSeconds = 0;
          newMinutes += 1;
        }
        
        // Handle hour rollover (reset to 18:45 when reaching 19:00)
        if (newMinutes >= 60) {
          newMinutes = 45; // Reset to 45 minutes
          newHours = 18;   // Reset to 18 hours
        }
        
        // Format back to string
        return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Load tracking data on component mount
  useEffect(() => {
    const loadTrackingData = async () => {
      setIsLoadingTrackingData(true);
      try {
        const response = await fetch('/Manufacturing/Tracking File - Manufacturing.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTrackingData(data);
        console.log('Manufacturing tracking data loaded:', data);
      } catch (error) {
        console.error('Error loading manufacturing tracking data:', error);
      } finally {
        setIsLoadingTrackingData(false);
      }
    };

    loadTrackingData();
  }, []);

  // Draw tracking overlays on canvas
  useEffect(() => {
    if (!trackingData || !trackingData.frame_data) {
      console.log('No tracking data available:', trackingData);
      return;
    }

    const drawTrackingOverlay = () => {
      const canvas = document.getElementById('tracking-canvas') as HTMLCanvasElement;
      const video = document.getElementById('main-video') as HTMLVideoElement;
      
      if (!canvas || !video) {
        console.log('Canvas or video not found');
        return;
      }

      // Set canvas size to match video
      canvas.width = video.offsetWidth;
      canvas.height = video.offsetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Only show overlays if in Processed Video mode
      if (!isProcessedVideoMain) {
        console.log('Overlays hidden - original video mode');
        return;
      }

      // Get current frame data based on video time
      const videoTime = video.currentTime;
      const fps = videoFPS;
      const currentFrame = Math.floor(videoTime * fps);

      console.log('Drawing overlays - Frame:', currentFrame, 'Time:', videoTime, 'FPS:', fps);

      // Find frame data for current frame
      const frameData = trackingData.frame_data.find((frame: any) => frame.frame === currentFrame);
      
      if (frameData) {
        console.log('Frame data found:', frameData);
      }

      // Draw ROI (Region of Interest) if enabled
      if (trackingOptions.viewFacilityZones && trackingData.ROI) {
        const roi = trackingData.ROI;
        if (roi && roi.length === 2) {
          const [topLeft, bottomRight] = roi;
          const [x1, y1] = topLeft;
          const [x2, y2] = bottomRight;
          
          const scaleX = canvas.width / (video.videoWidth || 640);
          const scaleY = canvas.height / (video.videoHeight || 480);
          
          const scaledX1 = x1 * scaleX;
          const scaledY1 = y1 * scaleY;
          const scaledX2 = x2 * scaleX;
          const scaledY2 = y2 * scaleY;
          
          // Draw ROI rectangle
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
          ctx.lineWidth = 3;
          ctx.setLineDash([8, 4]);
          ctx.strokeRect(scaledX1, scaledY1, scaledX2 - scaledX1, scaledY2 - scaledY1);
          
          // Draw ROI fill
          ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
          ctx.fillRect(scaledX1, scaledY1, scaledX2 - scaledX1, scaledY2 - scaledY1);
          
          // Draw label
          ctx.fillStyle = 'rgba(156, 163, 175, 0.9)';
          ctx.fillRect(scaledX1 + 10, scaledY1 + 10, 120, 24);
          ctx.fillStyle = '#ffffff';
          ctx.font = '12px Arial';
          ctx.textAlign = 'left';
          ctx.fillText('Detection Zone', scaledX1 + 20, scaledY1 + 27);
          
          ctx.setLineDash([]);
        }
      }

      // Draw tracking boxes for boxes (Custom Object 1) if enabled
      if (trackingOptions.boxes && frameData && frameData.detections) {
        frameData.detections.forEach((detection: any) => {
          if (!detection.bbox || !Array.isArray(detection.bbox) || detection.bbox.length < 4) return;

          const [x1, y1, x2, y2] = detection.bbox;
          const width = x2 - x1;
          const height = y2 - y1;

          const scaleX = canvas.width / (video.videoWidth || 640);
          const scaleY = canvas.height / (video.videoHeight || 480);

          const scaledX1 = x1 * scaleX;
          const scaledY1 = y1 * scaleY;
          const scaledWidth = width * scaleX;
          const scaledHeight = height * scaleY;

          // Draw bounding box
          ctx.strokeStyle = '#00ff00';
          ctx.lineWidth = 2;
          ctx.strokeRect(scaledX1, scaledY1, scaledWidth, scaledHeight);

          // Draw label background
          const labelText = `Box ID: ${detection.id}`;
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          ctx.fillRect(scaledX1, scaledY1 - 25, 100, 25);
          
          ctx.fillStyle = '#ffffff';
          ctx.font = '12px Arial';
          ctx.textAlign = 'left';
          ctx.fillText(labelText, scaledX1 + 5, scaledY1 - 8);
          
          // Draw count indicator if available
          if (detection.count) {
            ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
            ctx.fillRect(scaledX1 + scaledWidth - 40, scaledY1, 40, 20);
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`#${detection.count}`, scaledX1 + scaledWidth - 20, scaledY1 + 15);
          }
        });
      }
    };

    // Update overlay every frame
    const video = document.getElementById('main-video') as HTMLVideoElement;
    if (video) {
      video.addEventListener('timeupdate', drawTrackingOverlay);
      video.addEventListener('seeked', drawTrackingOverlay);
      video.addEventListener('loadedmetadata', drawTrackingOverlay);
      
      return () => {
        video.removeEventListener('timeupdate', drawTrackingOverlay);
        video.removeEventListener('seeked', drawTrackingOverlay);
        video.removeEventListener('loadedmetadata', drawTrackingOverlay);
      };
    }
  }, [trackingData, trackingOptions, videoFPS, isProcessedVideoMain]);


  // Location options
  const locationOptions = [
    { value: 'factory-1', label: 'Factory A - Main Production' },
    { value: 'factory-2', label: 'Factory B - Assembly Line' },
    { value: 'warehouse-1', label: 'Warehouse 1 - Storage' },
    { value: 'warehouse-2', label: 'Warehouse 2 - Distribution' },
    { value: 'assembly-1', label: 'Assembly Line 1 - Electronics' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Algosights
                </h1>
                <p className="text-muted-foreground mt-1">
                  AI-Powered Video Feed Analysis Platform
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Manufacturing - Operational Efficiency Header */}
        <div className="mb-6 bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-500 p-4 rounded-r-lg">
          <h1 className="text-2xl font-semibold text-slate-700">Manufacturing - Operational Efficiency</h1>
        </div>

        <Tabs defaultValue="production" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="production">Production & Operations Analysis</TabsTrigger>
            <TabsTrigger value="video" className="flex items-center space-x-2">
              <span>Video Feed</span>
              <Crown className="w-4 h-4 text-yellow-500" />
            </TabsTrigger>
          </TabsList>

          {/* Production & Operations Analysis Tab */}
          <TabsContent value="production" className="space-y-8">
            {/* Location Selection */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-foreground">Location:</label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationOptions.map((location) => (
                      <SelectItem key={location.value} value={location.value}>
                        {location.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Today's Metrics Toggle */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant={isTodayMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsTodayMode(true)}
                >
                  Today's Metrics
                </Button>
                <Button
                  variant={!isTodayMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsTodayMode(false)}
                >
                  Select Custom Date
                </Button>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">CCTV Online</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Last synced: {lastSyncedTime}
                </div>
              </div>
            </div>

            {/* Date Selection (when not in today mode) */}
            {!isTodayMode && (
              <div className="flex items-center space-x-2 mb-6">
                <label className="text-sm font-medium text-foreground">Select Custom Date:</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {manufacturingDateRange ? (
                        `${format(manufacturingDateRange.from, "MMM dd")} - ${format(manufacturingDateRange.to, "MMM dd, yyyy")}`
                      ) : (
                        "Choose date"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      defaultMonth={manufacturingDateRange?.from}
                      selected={manufacturingDateRange}
                      onSelect={(range) => setManufacturingDateRange(range as { from: Date; to: Date } | undefined)}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Production Rate</CardTitle>
              <Factory className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,547 units/hr</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+5.2%</span> from last hour
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.2%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+2.1%</span> from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{qualityScore}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+1.3%</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Safety Score</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.5%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+0.5%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Production Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Production Output & Efficiency</CardTitle>
              <CardDescription>Real-time production metrics and efficiency trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={productionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="units" fill="#3b82f6" name="Units Produced" />
                  <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={2} name="Efficiency %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quality Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quality Distribution</CardTitle>
              <CardDescription className="text-sm">Product quality assessment breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={qualityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {qualityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend 
                    wrapperStyle={{ fontSize: '11px', marginTop: '20px' }} 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Safety Monitoring */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Safety Zone Monitoring</span>
            </CardTitle>
            <CardDescription>Real-time safety status across production zones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {safetyData.map((zone, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{zone.zone}</h4>
                    <Badge 
                      variant={zone.status === 'Safe' ? 'default' : zone.status === 'Warning' ? 'secondary' : 'destructive'}
                    >
                      {zone.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Incidents: {zone.incidents}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

          </TabsContent>

          {/* Video Feed Tab */}
          <TabsContent value="video" className="space-y-8">
            <SectionHeader 
              title="Interactive Video Dashboard" 
              description="Real-time video monitoring with AI-powered people tracking and analytics"
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
                  <p className="text-orange-700 text-sm">Video Feed Analysis is available only with Premium subscription. Upgrade to access real-time video monitoring and AI-powered analytics.</p>
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
                  
                  <div className="space-y-3">
                    {[
                      { id: 1, name: "Factory A - Production Line 1", status: "live", quality: "1080p" },
                      { id: 2, name: "Factory B - Assembly Line", status: "pending", quality: "720p" },
                      { id: 3, name: "Warehouse 1 - Quality Control", status: "offline", quality: "720p" }
                    ].map((source) => (
                      <div key={source.id} className={`p-3 border rounded-lg cursor-pointer transition-all group ${
                        source.status === 'live'
                          ? 'bg-primary/10 border-primary/20 hover:bg-primary/15'
                          : source.status === 'pending'
                          ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
                          : 'bg-muted/30 border-border/30 hover:bg-muted/50'
                      }`}>
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
                                // Handle delete
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
                    ))}
                  </div>
                </div>

                {/* Multi-Select Tracking Controls */}
                <div className="bg-gradient-to-br from-white to-gray-50 border border-border rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Tracking Menu</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-primary" 
                          checked={trackingOptions.viewFacilityZones}
                          onChange={(e) => setTrackingOptions(prev => ({ ...prev, viewFacilityZones: e.target.checked }))}
                        />
                        <span className="text-sm font-medium">View Facility Zones</span>
                      </label>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Object Type</label>
                      <div className="space-y-2 ml-4">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-primary" 
                            checked={trackingOptions.workers}
                            onChange={(e) => setTrackingOptions(prev => ({ ...prev, workers: e.target.checked }))}
                          />
                          <span className="text-sm font-medium">Factory Worker</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-primary" 
                            checked={trackingOptions.boxes}
                            onChange={(e) => setTrackingOptions(prev => ({ ...prev, boxes: e.target.checked }))}
                          />
                          <span className="text-sm font-medium">Box (Custom Object 1)</span>
                        </label>
                        
                        {/* Display submitted custom objects */}
                        {submittedCustomObjects.map((objectName, index) => (
                          <div key={index} className="flex items-center space-x-3 opacity-60 cursor-not-allowed">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 text-primary" 
                              disabled
                            />
                            <span className="text-sm font-medium text-gray-400">{objectName} (Custom Object {index + 2})</span>
                          </div>
                        ))}
                        
                        <button 
                          className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 font-medium ml-6"
                          onClick={() => setShowAddCustomObjectModal(true)}
                        >
                          <span>+ Add Custom Object</span>
                        </button>
                      </div>
                    </div>

                    <div className="opacity-60">
                      <label className="text-sm font-medium text-gray-400 mb-2 block">Special Tags (Coming Soon)</label>
                      <div className="space-y-2 ml-4">
                        <label className="flex items-center space-x-3 cursor-not-allowed">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-primary" 
                            disabled
                          />
                          <span className="text-sm font-medium text-gray-400">Quality</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Video Display - Split Screen */}
              <div className="xl:col-span-3">
                <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-lg font-semibold">Factory A - Production Line 1</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{new Date().toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{new Date().toLocaleTimeString()}</span>
                        <span>•</span>
                        <span>1 Camera</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-green-700">Live Tracking</span>
                    </div>
                  </div>
                  
                  {/* Main Video Display with Tracking Overlay */}
                  <div className="relative aspect-video bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden border border-border/30">
                    {/* Main Video */}
                    <video
                      id="main-video"
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                      onEnded={() => {
                        const video = document.getElementById('main-video') as HTMLVideoElement;
                        if (video) {
                          video.currentTime = 0;
                          video.play().catch(console.log);
                        }
                      }}
                    >
                      <source src="/Manufacturing/Original Video - Manufacturing.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    
                    {/* Tracking Overlay Canvas */}
                    <canvas
                      id="tracking-canvas"
                      className="absolute top-0 left-0 w-full h-full pointer-events-none"
                      style={{ zIndex: 10 }}
                    />
                    
                    {/* Video Type Indicator */}
                    <div className="absolute top-4 left-4 bg-black/70 text-white text-sm px-3 py-1 rounded-lg font-semibold">
                      {isProcessedVideoMain ? "Processed Video" : "Original Video"}
                    </div>

                    {/* Toggle Overlay Button */}
                    <button 
                      className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-2 rounded-lg flex items-center shadow-lg transition-colors"
                      onClick={() => setIsProcessedVideoMain(!isProcessedVideoMain)}
                      title={`Switch to ${isProcessedVideoMain ? 'Original' : 'Processed'} View`}
                    >
                      {isProcessedVideoMain ? "Switch to Original" : "Switch to Processed"}
                    </button>
                  </div>
                </div>
                
                {/* Video Control Buttons */}
                <div className="mt-4 flex justify-center space-x-3">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
                    onClick={() => {
                      const mainVideo = document.getElementById('main-video') as HTMLVideoElement;
                      const trackingCanvas = document.getElementById('tracking-canvas') as HTMLCanvasElement;
                      
                      if (mainVideo) {
                        // Create canvas with video dimensions
                        const canvas = document.createElement('canvas');
                        canvas.width = mainVideo.videoWidth || 800;
                        canvas.height = mainVideo.videoHeight || 600;
                        const ctx = canvas.getContext('2d');
                        
                        if (ctx) {
                          // Draw the main video frame to canvas
                          ctx.drawImage(mainVideo, 0, 0, canvas.width, canvas.height);
                          
                          // Draw tracking overlays if in processed mode
                          if (trackingCanvas) {
                            const trackingCtx = trackingCanvas.getContext('2d');
                            if (trackingCtx) {
                              ctx.drawImage(trackingCanvas, 0, 0, canvas.width, canvas.height);
                            }
                          }
                          
                          // Add timestamp
                          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                          ctx.fillRect(10, canvas.height - 60, 200, 50);
                          ctx.fillStyle = '#ffffff';
                          ctx.font = '14px Arial';
                          ctx.fillText(`Captured: ${new Date().toLocaleString()}`, 20, canvas.height - 35);
                          ctx.fillText(`Mode: ${isProcessedVideoMain ? 'Processed' : 'Original'}`, 20, canvas.height - 15);
                          
                          // Download the image
                          const link = document.createElement('a');
                          link.download = `screenshot-${Date.now()}.png`;
                          link.href = canvas.toDataURL();
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
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
                    onClick={() => {
                      const mainVideo = document.getElementById('main-video') as HTMLVideoElement;
                      if (mainVideo) {
                        if (mainVideo.paused) {
                          mainVideo.play().catch(console.log);
                        } else {
                          mainVideo.pause();
                        }
                      }
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Pause Tracking</span>
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

            {/* Live Insights Section */}
            <section>
              <SectionHeader 
                title="Live Insights" 
                description="Real-time analytics and monitoring (based on last 1 hour of data)"
                className="mb-6"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Production Rate</h3>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      Live
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">
                    {Math.floor(Math.random() * 100) + 1500} units/hr
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Current production output
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    +{Math.floor(Math.random() * 10) + 1}.{Math.floor(Math.random() * 10)}% from last hour
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Quality Score</h3>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      Live
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">
                    {(() => {
                      const pass = Math.floor(Math.random() * 10) + 75; // 75-84%
                      const needsCheck = Math.floor(Math.random() * 8) + 15; // 15-22%
                      const damaged = Math.floor(Math.random() * 5) + 2; // 2-6%
                      const qualityScore = Math.round((pass * 1 + needsCheck * 0.5 + damaged * 0));
                      return `${qualityScore}%`;
                    })()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Pass: {Math.floor(Math.random() * 10) + 75}% • Needs Check: {Math.floor(Math.random() * 8) + 15}% • Damaged: {Math.floor(Math.random() * 5) + 2}%
                  </div>
                </div>

                <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Safety Status</h3>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      Live
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    Green
                  </div>
                  <div className="text-sm text-muted-foreground">
                    0 incidents Detected
                  </div>
                </div>
              </div>
            </section>
          </TabsContent>

        </Tabs>
      </main>

      {/* Date/Time Picker Modal */}
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
                const video = document.getElementById('main-video') as HTMLVideoElement;
                if (video && selectedDateTime) {
                  // For demo purposes, just restart the video
                  video.currentTime = 0;
                  video.play();
                }
                setShowDateTimeModal(false);
              }}
            >
              Go to Time
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Custom Object Modal */}
      <Dialog open={showAddCustomObjectModal} onOpenChange={setShowAddCustomObjectModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Custom Object for Training</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Object Name</label>
              <Input
                placeholder="e.g., Safety Helmet, Tool Box, etc."
                value={customObjectName}
                onChange={(e) => setCustomObjectName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Upload Images (3-10 required)</label>
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length + customObjectImages.length >= 3 && files.length + customObjectImages.length <= 10) {
                    setCustomObjectImages([...customObjectImages, ...files]);
                  } else if (files.length + customObjectImages.length > 10) {
                    alert('Maximum 10 images allowed');
                  } else {
                    setCustomObjectImages([...customObjectImages, ...files]);
                  }
                  // Reset file input
                  e.target.value = '';
                }}
              />
              <p className="text-xs text-muted-foreground">
                {customObjectImages.length > 0 
                  ? `${customObjectImages.length} image(s) selected (${Math.max(0, 3 - customObjectImages.length)} more required)` 
                  : 'Please select 3-10 images of the object from different angles'}
              </p>
              
              {/* Display uploaded files with delete option */}
              {customObjectImages.length > 0 && (
                <div className="mt-3 space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                  {customObjectImages.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-white border rounded px-3 py-2 text-sm">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="truncate">{file.name}</span>
                        <span className="text-xs text-gray-500 flex-shrink-0">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newFiles = customObjectImages.filter((_, i) => i !== index);
                          setCustomObjectImages(newFiles);
                        }}
                        className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Upload clear images of the object from multiple angles for better detection accuracy.
              </p>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAddCustomObjectModal(false);
                setCustomObjectName('');
                setCustomObjectImages([]);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (customObjectName && customObjectImages.length >= 3 && customObjectImages.length <= 10) {
                  // Submit logic here (API call)
                  setSubmittedCustomObjects([...submittedCustomObjects, customObjectName]);
                  setShowAddCustomObjectModal(false);
                  setShowCustomObjectSuccessMessage(true);
                  setCustomObjectName('');
                  setCustomObjectImages([]);
                  
                  // Hide success message after 5 seconds
                  setTimeout(() => {
                    setShowCustomObjectSuccessMessage(false);
                  }, 5000);
                } else {
                  alert('Please provide object name and 3-10 images');
                }
              }}
              disabled={!customObjectName || customObjectImages.length < 3 || customObjectImages.length > 10}
            >
              Submit for Training
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Message for Custom Object Submission */}
      {showCustomObjectSuccessMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg max-w-md z-50">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">Request Submitted Successfully!</h4>
              <p className="text-sm">
                Thanks for submitting a request for Custom Object. Team will train the model and enable it within 3-5 working days.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Manufacturing;
