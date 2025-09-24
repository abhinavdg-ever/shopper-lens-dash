import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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

  // Video switching state - show processed by default
  const [isProcessedVideo, setIsProcessedVideo] = useState(true);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

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

  // Effect to sync video time and state
  useEffect(() => {
    const video = document.getElementById('main-video') as HTMLVideoElement;
    if (!video) return;

    const handleTimeUpdate = () => {
      setVideoCurrentTime(video.currentTime);
    };

    const handlePlay = () => {
      setIsVideoPlaying(true);
    };

    const handlePause = () => {
      setIsVideoPlaying(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [isProcessedVideo]);


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
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 rounded-xl p-6 shadow-sm opacity-60">
                  <h3 className="text-lg font-semibold mb-4 text-gray-500">Tracking Menu (Coming Soon)</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="flex items-center space-x-3 cursor-not-allowed">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-primary" 
                          disabled
                        />
                        <span className="text-sm font-medium text-gray-400">View Facility Zones</span>
                      </label>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-400 mb-2 block">Object Type</label>
                      <div className="space-y-2 ml-4">
                        <label className="flex items-center space-x-3 cursor-not-allowed">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-primary" 
                            disabled
                          />
                          <span className="text-sm font-medium text-gray-400">Factory Workers</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-not-allowed">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-primary" 
                            disabled
                          />
                          <span className="text-sm font-medium text-gray-400">Custom Object 1</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-not-allowed">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-primary" 
                            disabled
                          />
                          <span className="text-sm font-medium text-gray-400">Custom Object 2</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center space-x-3 cursor-not-allowed">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-primary" 
                          disabled
                        />
                        <span className="text-sm font-medium text-gray-400">Quality Tags</span>
                      </label>
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
                  
                  {/* Main Video Display with Switch Functionality */}
                  <div className="relative aspect-video bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden border border-border/30">
                    {/* Main Video - Always shows Original Video */}
                    <video
                      id="main-video"
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                      src={isProcessedVideo ? "/Processed Video - Manufacturing.mp4" : "/Original Video - Manufacturing.mp4"}
                      onLoadStart={() => {
                        console.log('Video load started:', isProcessedVideo ? 'Processed' : 'Original');
                        console.log('Video src:', isProcessedVideo ? "/Processed Video - Manufacturing.mp4" : "/Original Video - Manufacturing.mp4");
                      }}
                      onLoadedData={() => {
                        console.log('Video data loaded:', isProcessedVideo ? 'Processed' : 'Original');
                        const video = document.getElementById('main-video') as HTMLVideoElement;
                        if (video) {
                          video.currentTime = videoCurrentTime;
                          if (isVideoPlaying) {
                            video.play().catch(console.log);
                          }
                        }
                      }}
                      onError={(e) => {
                        console.error('Video error:', e);
                        console.error('Video src:', isProcessedVideo ? "/Processed Video - Manufacturing.mp4" : "/Original Video - Manufacturing.mp4");
                        console.error('Video error details:', e.currentTarget.error);
                      }}
                      onEnded={() => {
                        const video = document.getElementById('main-video') as HTMLVideoElement;
                        if (video) {
                          video.currentTime = 0;
                          video.play().catch(console.log);
                        }
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                    
                    
                    {/* Video Type Indicator */}
                    <div className="absolute top-4 left-4 bg-black/70 text-white text-sm px-3 py-1 rounded-lg font-semibold">
                      {isProcessedVideo ? "Processed Video" : "Original Video"}
                    </div>

                    {/* Switch Video Button */}
                    <button 
                      className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-2 rounded-lg flex items-center shadow-lg transition-colors"
                      onClick={() => {
                        const video = document.getElementById('main-video') as HTMLVideoElement;
                        const currentTime = video ? video.currentTime : 0;
                        const wasPlaying = video ? !video.paused : false;
                        
                        setIsProcessedVideo(!isProcessedVideo);
                        
                        // Force video reload after state change
                        setTimeout(() => {
                          const newVideo = document.getElementById('main-video') as HTMLVideoElement;
                          if (newVideo) {
                            newVideo.load(); // Force reload
                            newVideo.currentTime = currentTime;
                            if (wasPlaying) {
                              newVideo.play().catch(console.log);
                            }
                          }
                        }, 100);
                      }}
                      title={`Switch to ${isProcessedVideo ? 'Original' : 'Processed'} Video`}
                    >
                      Switch to {isProcessedVideo ? 'Original' : 'Processed'}
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
                          
                          // Add timestamp and video type
                          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                          ctx.fillRect(10, canvas.height - 60, 200, 50);
                          ctx.fillStyle = '#ffffff';
                          ctx.font = '14px Arial';
                          ctx.fillText(`Captured: ${new Date().toLocaleString()}`, 20, canvas.height - 35);
                          ctx.fillText(`Mode: ${isProcessedVideo ? 'Processed' : 'Original'}`, 20, canvas.height - 15);
                          
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
                    className={`${isVideoPlaying ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2`}
                    onClick={() => {
                      const mainVideo = document.getElementById('main-video') as HTMLVideoElement;
                      if (mainVideo) {
                        if (isVideoPlaying) {
                          mainVideo.pause();
                        } else {
                          mainVideo.play().catch(console.log);
                        }
                      }
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {isVideoPlaying ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                    </svg>
                    <span>{isVideoPlaying ? 'Pause Tracking' : 'Resume Tracking'}</span>
                  </button>
                  
                  <button 
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
                    onClick={() => {
                      const mainVideo = document.getElementById('main-video') as HTMLVideoElement;
                      if (mainVideo) {
                        mainVideo.currentTime = 0;
                        mainVideo.play();
                      }
                    }}
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
    </div>
  );
};

export default Manufacturing;
