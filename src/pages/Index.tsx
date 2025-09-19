import React, { useEffect } from "react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  ScatterChart,
  Scatter,
  ComposedChart
} from "recharts";

// Video Feed Derived Data
const customerDwellTimeData = [
  { zone: "Electronics", avgTime: 8.5, maxTime: 15.2, visitors: 145 },
  { zone: "Apparel", avgTime: 12.3, maxTime: 22.1, visitors: 98 },
  { zone: "Groceries", avgTime: 6.2, maxTime: 11.8, visitors: 203 },
  { zone: "Accessories", avgTime: 4.8, maxTime: 9.5, visitors: 67 },
  { zone: "Checkout", avgTime: 3.1, maxTime: 7.2, visitors: 312 }
];

const heatMapData = [
  { x: 10, y: 15, intensity: 85, zone: "Electronics" },
  { x: 25, y: 20, intensity: 92, zone: "Apparel" },
  { x: 40, y: 30, intensity: 78, zone: "Groceries" },
  { x: 15, y: 45, intensity: 45, zone: "Accessories" },
  { x: 5, y: 50, intensity: 95, zone: "Checkout" }
];

const hourlyFootfallData = [
  { hour: "9AM", visitors: 120, dwellTime: 4.2, conversion: 12 },
  { hour: "11AM", visitors: 280, dwellTime: 6.8, conversion: 18 },
  { hour: "1PM", visitors: 450, dwellTime: 8.1, conversion: 22 },
  { hour: "3PM", visitors: 380, dwellTime: 7.3, conversion: 19 },
  { hour: "5PM", visitors: 620, dwellTime: 9.2, conversion: 28 },
  { hour: "7PM", visitors: 750, dwellTime: 10.5, conversion: 32 },
  { hour: "9PM", visitors: 340, dwellTime: 5.8, conversion: 15 }
];

const customerJourneyData = [
  { stage: "Store Entry", count: 4520, percentage: 100 },
  { stage: "Zone Browse", count: 3800, percentage: 84 },
  { stage: "Product Touch", count: 1850, percentage: 41 },
  { stage: "Trial Room", count: 586, percentage: 13 },
  { stage: "Checkout Queue", count: 950, percentage: 21 },
  { stage: "Purchase", count: 720, percentage: 16 }
];

const staffEfficiencyData = [
  { staff: "Cashier 1", transactions: 45, avgTime: 2.1, satisfaction: 4.2 },
  { staff: "Cashier 2", transactions: 38, avgTime: 2.8, satisfaction: 3.8 },
  { staff: "Floor Staff", interactions: 67, responseTime: 1.2, satisfaction: 4.5 },
  { staff: "Electronics", interactions: 23, responseTime: 0.8, satisfaction: 4.7 },
  { staff: "Apparel", interactions: 34, responseTime: 1.5, satisfaction: 4.1 }
];

const queueAnalysisData = [
  { time: "9AM", queueLength: 3, waitTime: 2.1, satisfaction: 4.2 },
  { time: "11AM", queueLength: 8, waitTime: 4.5, satisfaction: 3.8 },
  { time: "1PM", queueLength: 12, waitTime: 6.2, satisfaction: 3.5 },
  { time: "3PM", queueLength: 7, waitTime: 3.8, satisfaction: 4.0 },
  { time: "5PM", queueLength: 15, waitTime: 8.1, satisfaction: 3.2 },
  { time: "7PM", queueLength: 18, waitTime: 9.5, satisfaction: 2.9 },
  { time: "9PM", queueLength: 5, waitTime: 2.8, satisfaction: 4.1 }
];

const zonePerformanceData = [
  { zone: "Electronics", footfall: 145, conversion: 28, revenue: 12500, avgBasket: 85 },
  { zone: "Apparel", footfall: 98, conversion: 22, revenue: 8900, avgBasket: 95 },
  { zone: "Groceries", footfall: 203, conversion: 15, revenue: 3200, avgBasket: 25 },
  { zone: "Accessories", footfall: 67, conversion: 18, revenue: 2100, avgBasket: 45 }
];

// Customer Demographics Data
const genderData = [
  { name: "Female", value: 58, fill: "#ff6b6b" },
  { name: "Male", value: 42, fill: "#4ecdc4" }
];

const ageGroupData = [
  { name: "18-25", value: 25, fill: "#ff9ff3" },
  { name: "26-35", value: 35, fill: "#54a0ff" },
  { name: "36-50", value: 28, fill: "#5f27cd" },
  { name: "50+", value: 12, fill: "#00d2d3" }
];

const customerMoodData = [
  { name: "Happy", value: 45, fill: "#2ed573" },
  { name: "Neutral", value: 35, fill: "#ffa502" },
  { name: "Frustrated", value: 15, fill: "#ff6348" },
  { name: "Excited", value: 5, fill: "#ff9ff3" }
];

const customerTypeData = [
  { name: "Individual", value: 65, fill: "#ff7675" },
  { name: "Couple", value: 25, fill: "#74b9ff" },
  { name: "Family", value: 10, fill: "#00b894" }
];

export default function Index() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = React.useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    to: new Date()
  });
  const [isAddSourceModalOpen, setIsAddSourceModalOpen] = React.useState(false);
  const [showOriginalVideo, setShowOriginalVideo] = React.useState(true);
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [isTrackingPaused, setIsTrackingPaused] = React.useState(false);
  const [lastSyncedTime, setLastSyncedTime] = React.useState(new Date());
  const [showDeleteSourceConfirm, setShowDeleteSourceConfirm] = React.useState(false);
  const [sourceToDelete, setSourceToDelete] = React.useState<string | null>(null);
  const [showDateTimeModal, setShowDateTimeModal] = React.useState(false);
  const [dateTimeInput, setDateTimeInput] = React.useState('');
  const [isProcessedVideoMain, setIsProcessedVideoMain] = React.useState(true);
  const [sourceType, setSourceType] = React.useState('store');
  const [selectedStoreId, setSelectedStoreId] = React.useState('');
  const [selectedWarehouseId, setSelectedWarehouseId] = React.useState('');
  const [storeIdSearch, setStoreIdSearch] = React.useState('');
  const [isCustomTime, setIsCustomTime] = React.useState(false);
  const [customTime, setCustomTime] = React.useState<Date | null>(null);
  const [videoSources, setVideoSources] = React.useState([
    { id: 1, name: "Store ID #3312 (New Jersey)", status: "live", quality: "1080p" },
    { id: 2, name: "Store ID #3323 (Seattle)", status: "offline", quality: "720p" },
    { id: 3, name: "Warehouse #6 (Atlanta)", status: "offline", quality: "720p" }
  ]);
  
  // Live metrics state for auto-refresh
  const [liveMetrics, setLiveMetrics] = React.useState({
    customerCount: 47,
    genderSplit: "65% F / 30% M / 5% U",
    conversionRate: 9,
    avgTimeInStore: 7.2
  });

  // Auto-refresh live metrics every 2 seconds (only when not paused)
  useEffect(() => {
    if (isTrackingPaused || isCustomTime) return; // Don't update metrics when paused or in custom time
    
    const interval = setInterval(() => {
      // Generate gender split that adds to 100%
      const female = Math.floor(Math.random() * 20) + 50; // 50-70%
      const male = Math.floor(Math.random() * 20) + 20; // 20-40%
      const unknown = 100 - female - male; // Remaining to make 100%
      
        setLiveMetrics(prev => ({
          customerCount: Math.max(35, Math.min(65, prev.customerCount + Math.floor(Math.random() * 4) - 2)), // 35-65 range, ±2 variation
          genderSplit: `${female}% F / ${male}% M / ${unknown}% U`,
          conversionRate: Math.floor(Math.random() * 3) + 8, // 8-10% range, whole numbers only
          avgTimeInStore: Math.max(5.0, Math.min(12.0, prev.avgTimeInStore + (Math.random() * 0.4 - 0.2))) // 5.0-12.0 min range, ±0.2 min variation
        }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isTrackingPaused, isCustomTime]);

  // Update current time every second (only when not paused and not in custom time)
  useEffect(() => {
    if (isTrackingPaused || isCustomTime) return;
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [isTrackingPaused, isCustomTime]);

  // Sync videos when they load and ensure continuous playback
  useEffect(() => {
    const syncVideos = () => {
      const mainVideo = document.getElementById('main-video') as HTMLVideoElement;
      const secondaryVideo = document.getElementById('secondary-video') as HTMLVideoElement;
      
      if (mainVideo && secondaryVideo) {
        // Ensure videos are set to loop continuously
        mainVideo.loop = true;
        secondaryVideo.loop = true;
        
        // Sync secondary video to main video
        const syncSecondary = () => {
          if (Math.abs(secondaryVideo.currentTime - mainVideo.currentTime) > 0.1) {
            secondaryVideo.currentTime = mainVideo.currentTime;
          }
        };
        
        // Sync main video to secondary video
        const syncMain = () => {
          if (Math.abs(mainVideo.currentTime - secondaryVideo.currentTime) > 0.1) {
            mainVideo.currentTime = secondaryVideo.currentTime;
          }
        };
        
        // Handle video end to ensure continuous playback
        const handleVideoEnd = () => {
          mainVideo.currentTime = 0;
          secondaryVideo.currentTime = 0;
          mainVideo.play();
          secondaryVideo.play();
        };
        
        mainVideo.addEventListener('timeupdate', syncSecondary);
        secondaryVideo.addEventListener('timeupdate', syncMain);
        mainVideo.addEventListener('ended', handleVideoEnd);
        secondaryVideo.addEventListener('ended', handleVideoEnd);
        
        // Start both videos at the same time
        const playVideos = async () => {
          try {
            await mainVideo.play();
            await secondaryVideo.play();
          } catch (error) {
            console.log('Video autoplay prevented, user interaction required');
          }
        };
        
        if (mainVideo.readyState >= 2 && secondaryVideo.readyState >= 2) {
          playVideos();
        } else {
          mainVideo.addEventListener('canplay', playVideos);
          secondaryVideo.addEventListener('canplay', playVideos);
        }
        
        // Ensure videos restart if they pause
        const ensureContinuousPlay = () => {
          if (mainVideo.paused) {
            mainVideo.play();
          }
          if (secondaryVideo.paused) {
            secondaryVideo.play();
          }
        };
        
        // Check every 5 seconds to ensure continuous playback
        const playCheckInterval = setInterval(ensureContinuousPlay, 5000);
        
        return () => {
          clearInterval(playCheckInterval);
        };
      }
    };
    
    // Run sync after a short delay to ensure videos are loaded
    const timer = setTimeout(syncVideos, 100);
    
    return () => clearTimeout(timer);
  }, [showOriginalVideo, isProcessedVideoMain]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
          <h1 className="text-3xl font-bold text-foreground">
                AlgoSights
          </h1>
          <p className="text-muted-foreground mt-1">
                Real-time insights and performance metrics from video feed analysis
          </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="video" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="video">Video Feed</TabsTrigger>
            <TabsTrigger value="customer">Customer Analytics</TabsTrigger>
            <TabsTrigger value="employee">Employee & Operations</TabsTrigger>
          </TabsList>

          {/* Video Feed Tab */}
          <TabsContent value="video" className="space-y-8">
              <SectionHeader 
              title="Interactive Video Dashboard" 
              description="Real-time video monitoring with AI-powered people tracking and analytics"
                className="mb-6"
              />
            
            {/* Main Video Interface */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Video Selection Sidebar */}
              <div className="xl:col-span-1 space-y-6">
                <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Video Sources</h3>
                    <Dialog open={isAddSourceModalOpen} onOpenChange={setIsAddSourceModalOpen}>
                      <DialogTrigger asChild>
                        <button className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded">
                          + Add Source
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Connect New Video Source</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <label className="text-sm font-medium text-foreground">Source Type</label>
                            <select 
                              className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
                              value={sourceType}
                              onChange={(e) => setSourceType(e.target.value)}
                            >
                              <option value="store">Store</option>
                              <option value="warehouse">Warehouse</option>
                            </select>
              </div>
                          
                          {sourceType === 'store' && (
                            <div>
                              <label className="text-sm font-medium text-foreground">Store ID</label>
                              <select 
                                className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
                                value={selectedStoreId}
                                onChange={(e) => setSelectedStoreId(e.target.value)}
                              >
                                <option value="">Select Store ID</option>
                                {Array.from({ length: 100 }, (_, i) => 3300 + i).map(id => (
                                  <option key={id} value={id}>Store ID #{id}</option>
                                ))}
                              </select>
                </div>
                          )}
                          
                          {sourceType === 'warehouse' && (
                            <div>
                              <label className="text-sm font-medium text-foreground">Warehouse ID</label>
                              <select 
                                className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
                                value={selectedWarehouseId}
                                onChange={(e) => setSelectedWarehouseId(e.target.value)}
                              >
                                <option value="">Select Warehouse ID</option>
                                {Array.from({ length: 10 }, (_, i) => i + 1).map(id => (
                                  <option key={id} value={id}>Warehouse #{id}</option>
                                ))}
                              </select>
                            </div>
                          )}
                          
                          <div>
                            <label className="text-sm font-medium text-foreground">Cloud Provider</label>
                            <select className="w-full mt-1 p-2 border border-border rounded-lg bg-background">
                              <option>AWS S3</option>
                              <option>Google Cloud Storage</option>
                              <option>Azure Blob Storage</option>
                            </select>
              </div>
                          <div>
                            <label className="text-sm font-medium text-foreground">Bucket Name</label>
                            <input type="text" placeholder="my-video-bucket" className="w-full mt-1 p-2 border border-border rounded-lg bg-background" />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-foreground">Save Location</label>
                            <input type="text" placeholder="/videos/processed" className="w-full mt-1 p-2 border border-border rounded-lg bg-background" />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsAddSourceModalOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={() => {
                              // Add new source to the list
                              const newId = Math.max(...videoSources.map(s => s.id)) + 1;
                              const newSource = {
                                id: newId,
                                name: sourceType === 'store' 
                                  ? `Store ID #${selectedStoreId}` 
                                  : `Warehouse #${selectedWarehouseId}`,
                                status: 'offline',
                                quality: '720p'
                              };
                              setVideoSources([...videoSources, newSource]);
                              setIsAddSourceModalOpen(false);
                              // Reset form
                              setSourceType('store');
                              setSelectedStoreId('');
                              setSelectedWarehouseId('');
                            }}>
                              Connect & Save
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="space-y-2">
                    {videoSources.map((source) => (
                      <div key={source.id} className={`p-3 border rounded-lg cursor-pointer transition-all group ${
                        source.status === 'live' 
                          ? 'bg-primary/10 border-primary/20 hover:bg-primary/15' 
                          : 'bg-muted/30 border-border/30 hover:bg-muted/50'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{source.name}</span>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              source.status === 'live' 
                                ? 'bg-green-500 animate-pulse' 
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
                          {source.status === 'live' ? 'Live' : 'Offline'} • {source.quality}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>


                {/* Multi-Select Tracking Controls */}
                <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Tracking Options</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Person Type</label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 text-primary" defaultChecked />
                          <span className="text-sm font-medium">Customer</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">Employee</span>
                        </label>
                      </div>
                </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Customer Properties</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Age</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-primary" defaultChecked />
                  <span className="text-sm font-medium">Gender</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Attire</span>
                </label>
              </div>
            </div>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Proximity Detector</label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">Cash Counter</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 text-primary" defaultChecked />
                          <span className="text-sm font-medium">Entry/Exit</span>
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
                      <h3 className="text-lg font-semibold">Store ID #3312</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{currentTime.toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{currentTime.toLocaleTimeString()}</span>
                        <span>•</span>
                        <span>1 Camera</span>
                </div>
              </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                isTrackingPaused ? 'bg-yellow-500' : 
                isCustomTime ? 'bg-blue-500' : 'bg-green-500 animate-pulse'
              }`}></div>
              <span className={`text-sm font-medium ${
                isTrackingPaused ? 'text-yellow-700' : 
                isCustomTime ? 'text-blue-700' : 'text-green-700'
              }`}>
                {isTrackingPaused ? 'Paused' : isCustomTime ? 'Custom' : 'Live'}
              </span>
              {isTrackingPaused && (
                <span className="text-xs text-muted-foreground">
                  Last Synced: {lastSyncedTime.toLocaleTimeString()}
                </span>
              )}
              {isCustomTime && customTime && (
                <span className="text-xs text-muted-foreground">
                  Viewing: {customTime.toLocaleString()}
                </span>
              )}
            </div>
                  </div>
                  
                  {/* Main Video Display with Switch Functionality */}
                  <div className="relative aspect-video bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden border border-border/30">
                    {/* Main Video - Switches between Processed and Original */}
                    <video
                      id="main-video"
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                      key={isProcessedVideoMain ? "processed" : "original"}
                    >
                      <source src={isProcessedVideoMain ? "/Processed Video.mp4" : "/Original Video.mp4"} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    
                    {/* Video Type Indicator */}
                    <div className="absolute top-4 left-4 bg-black/70 text-white text-sm px-3 py-1 rounded-lg font-semibold">
                      {isProcessedVideoMain ? "Processed Video" : "Original Video"}
              </div>

                    {/* Switch Video Button */}
                    <button 
                      className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white text-lg px-3 py-2 rounded-lg flex items-center shadow-lg transition-colors"
                      onClick={() => {
                        const mainVideo = document.getElementById('main-video') as HTMLVideoElement;
                        const currentTime = mainVideo ? mainVideo.currentTime : 0;
                        
                        setIsProcessedVideoMain(!isProcessedVideoMain);
                        
                        // Sync the new main video to the current time after switching
                        setTimeout(() => {
                          const newMainVideo = document.getElementById('main-video') as HTMLVideoElement;
                          const secondaryVideo = document.getElementById('secondary-video') as HTMLVideoElement;
                          if (newMainVideo) {
                            newMainVideo.currentTime = currentTime;
                          }
                          if (secondaryVideo) {
                            secondaryVideo.currentTime = currentTime;
                          }
                        }, 200);
                      }}
                      title={`Switch to ${isProcessedVideoMain ? 'Original' : 'Processed'} Video`}
                    >
                      ↔
                    </button>

                    {/* Embedded Secondary Video - Top Right Corner (when not minimized) */}
                    {showOriginalVideo && (
                      <div className="absolute top-16 right-4 w-48 h-32 rounded-lg border-2 border-blue-400 shadow-xl overflow-hidden bg-black">
                        <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 font-semibold">
                          {isProcessedVideoMain ? "Original Video" : "Processed Video"}
                        </div>
                        <video
                          id="secondary-video"
                          className="w-full h-full object-cover mt-4"
                          autoPlay
                          loop
                          muted
                          playsInline
                          key={isProcessedVideoMain ? "original-secondary" : "processed-secondary"}
                        >
                          <source src={isProcessedVideoMain ? "/Original Video.mp4" : "/Processed Video.mp4"} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        {/* Minimize button */}
                        <button 
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white text-xs rounded-full flex items-center justify-center shadow-lg"
                          onClick={() => setShowOriginalVideo(false)}
                          title="Minimize"
                        >
                          ×
                        </button>
                      </div>
                    )}

                    {/* Show Secondary Video Button - Only when minimized */}
                    {!showOriginalVideo && (
                      <button 
                        className="absolute top-16 right-4 bg-gray-600 hover:bg-gray-700 text-white text-xs px-3 py-2 rounded-lg flex items-center space-x-1"
                        onClick={() => setShowOriginalVideo(true)}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Show {isProcessedVideoMain ? 'Original' : 'Processed'}</span>
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Video Control Buttons */}
                <div className="mt-4 flex justify-center space-x-3">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
                    onClick={() => {
                      const mainVideo = document.getElementById('main-video') as HTMLVideoElement;
                      const secondaryVideo = document.getElementById('secondary-video') as HTMLVideoElement;
                      
                      if (mainVideo) {
                        // Create canvas with video dimensions
                        const canvas = document.createElement('canvas');
                        canvas.width = mainVideo.videoWidth || 800;
                        canvas.height = mainVideo.videoHeight || 600;
                        const ctx = canvas.getContext('2d');
                        
                        if (ctx) {
                          // Draw the main video frame to canvas
                          ctx.drawImage(mainVideo, 0, 0, canvas.width, canvas.height);
                          
                          // Add timestamp overlay
                          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                          ctx.fillRect(10, canvas.height - 40, 200, 30);
                          ctx.fillStyle = '#ffffff';
                          ctx.font = '14px Arial';
                          ctx.fillText(new Date().toLocaleString(), 15, canvas.height - 20);
                          
                          // Add video type indicator
                          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                          ctx.fillRect(10, 10, 150, 25);
                          ctx.fillStyle = '#ffffff';
                          ctx.font = '12px Arial';
                          ctx.fillText(isProcessedVideoMain ? 'Processed Video' : 'Original Video', 15, 25);
                          
                          // Download the image
                          const link = document.createElement('a');
                          link.download = `screenshot-${Date.now()}.png`;
                          link.href = canvas.toDataURL('image/png');
                          link.click();
                        }
                      } else {
                        // Fallback if video not available
                        const canvas = document.createElement('canvas');
                        canvas.width = 800;
                        canvas.height = 600;
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                          ctx.fillStyle = '#1e293b';
                          ctx.fillRect(0, 0, 800, 600);
                          ctx.fillStyle = '#ffffff';
                          ctx.font = '24px Arial';
                          ctx.textAlign = 'center';
                          ctx.fillText('Video not available', 400, 300);
                          ctx.fillText(new Date().toLocaleString(), 400, 340);
                        }
                        const link = document.createElement('a');
                        link.download = `screenshot-${Date.now()}.png`;
                        link.href = canvas.toDataURL();
                        link.click();
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
                    className={`${(isTrackingPaused || isCustomTime) ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2`}
                    onClick={() => {
                      const mainVideo = document.getElementById('main-video') as HTMLVideoElement;
                      const secondaryVideo = document.getElementById('secondary-video') as HTMLVideoElement;
                      
                      if (isTrackingPaused || isCustomTime) {
                        // Resuming - play videos and reset to Live status
                        if (mainVideo) mainVideo.play();
                        if (secondaryVideo) secondaryVideo.play();
                        setIsTrackingPaused(false);
                        setIsCustomTime(false);
                        setCustomTime(null);
                        setCurrentTime(new Date());
                      } else {
                        // Pausing - stop videos and record sync time
                        if (mainVideo) {
                          mainVideo.pause();
                          mainVideo.currentTime = mainVideo.currentTime; // Ensure pause is immediate
                        }
                        if (secondaryVideo) {
                          secondaryVideo.pause();
                          secondaryVideo.currentTime = secondaryVideo.currentTime; // Ensure pause is immediate
                        }
                        setIsTrackingPaused(true);
                        setLastSyncedTime(new Date());
                      }
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {(isTrackingPaused || isCustomTime) ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                    </svg>
                    <span>{(isTrackingPaused || isCustomTime) ? 'Go Live' : 'Pause Tracking'}</span>
                  </button>
                  
                  <button 
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
                    onClick={() => {
                      const now = new Date();
                      setDateTimeInput(now.toISOString().slice(0, 16));
                      setShowDateTimeModal(true);
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
                description="Real-time analytics updating automatically - Based on Last 1 hour"
                className="mb-6"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <MetricCard
                  title="Live Customer Count"
                  value={liveMetrics.customerCount.toString()}
                  subtitle="Currently in store"
                    trend="up"
                  trendValue="+8 from last hour"
                  badge={{ text: "Live", variant: "default" }}
                  />
                  <MetricCard
                  title="Gender Split"
                  value={liveMetrics.genderSplit}
                  subtitle="Current store visitors"
                  trend="neutral"
                  trendValue="Female majority"
                  badge={{ text: "Live", variant: "default" }}
                />
                  <MetricCard
                  title="Conversion Rate"
                  value={`${liveMetrics.conversionRate}%`}
                  subtitle="Video tracked purchases"
                    trend="up"
                  trendValue="+2.3% from avg"
                  badge={{ text: "Live", variant: "default" }}
                  />
                  <MetricCard
                  title="Average Time in Store"
                  value={`${liveMetrics.avgTimeInStore.toFixed(1)} min`}
                  subtitle="Per customer visit"
                    trend="up"
                  trendValue="+0.5 min improvement"
                  badge={{ text: "Live", variant: "default" }}
                  />
              </div>
            </section>

          </TabsContent>

          {/* Customer Analytics Tab */}
          <TabsContent value="customer" className="space-y-8">
            {/* Key Customer Metrics */}
            <section>
              <SectionHeader 
                title="Key Customer Metrics" 
                className="mb-6"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Customer Satisfaction"
                  value="86%"
                  subtitle="Happy/Neutral mood"
                  trend="up"
                  trendValue="Excellent rating"
                  badge={{ text: "AI Analyzed", variant: "secondary" }}
                />
                <MetricCard
                  title="Total Footfall"
                  value="4,520"
                  subtitle="Today's visitors"
                  trend="up"
                  trendValue="+12% from yesterday"
                  badge={{ text: "Live", variant: "default" }}
                />
                <MetricCard
                  title="Conversion Rate"
                  value="21%"
                  subtitle="Entry to purchase"
                  trend="up"
                  trendValue="+2.3% improvement"
                />
                <MetricCard
                  title="Average Dwell Time"
                  value="7.2 min"
                  subtitle="Per customer visit"
                  trend="up"
                  trendValue="+0.5 min increase"
                />
              </div>
            </section>

            {/* Hourly Patterns & Queue Analysis */}
            <section>
              <SectionHeader 
                title="Hourly Patterns & Queue Management" 
                className="mb-6"
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Hourly Footfall & Conversion" description="Customer flow and conversion rates by hour">
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={hourlyFootfallData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="visitors" fill="#3b82f6" name="Visitors" />
                      <Line yAxisId="right" type="monotone" dataKey="conversion" stroke="#ff6b6b" name="Conversion %" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Queue Length & Wait Time Analysis" description="Checkout queue performance over time">
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={queueAnalysisData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="queueLength" fill="#ffa726" name="Queue Length" />
                      <Line yAxisId="right" type="monotone" dataKey="waitTime" stroke="#ef5350" name="Wait Time (min)" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartCard>
                </div>
            </section>


            {/* Customer Demographics Analysis */}
            <section>
              <SectionHeader 
                title="Customer Demographics Analysis" 
                className="mb-6"
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Customer Gender Distribution" description="Gender breakdown of store visitors">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={genderData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {genderData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Age Group Distribution" description="Age demographics of customers">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={ageGroupData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {ageGroupData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
                </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <ChartCard title="Customer Mood Distribution" description="Emotional state of customers in the store">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={customerMoodData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {customerMoodData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Customer Type" description="Shopping group composition">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={customerTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {customerTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </section>
          </TabsContent>

          {/* Employee & Operations Tab */}
          <TabsContent value="employee" className="space-y-8">
            {/* Staff Performance Overview */}
            <section>
              <SectionHeader 
                title="Staff Performance & Operations" 
                description="Real-time staff efficiency and operational metrics from video analysis"
                className="mb-6"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Active Staff Count"
                  value="8"
                  subtitle="Currently on duty"
                  trend="up"
                  trendValue="All stations manned"
                  badge={{ text: "Live", variant: "default" }}
                />
                <MetricCard
                  title="Staff Response Time"
                  value="1.2 min"
                  subtitle="Avg customer assistance"
                  trend="up"
                  trendValue="Excellent performance"
                />
                <MetricCard
                  title="Queue Management"
                  value="6"
                  subtitle="Customers in checkout"
                  trend="down"
                  trendValue="Optimal flow"
                />
                <MetricCard
                  title="Staff Efficiency"
                  value="94%"
                  subtitle="Overall performance score"
                  trend="up"
                  trendValue="Above target"
                />
              </div>
            </section>

            {/* Staff Efficiency Analysis */}
            <section>
              <SectionHeader 
                title="Staff Efficiency & Performance Analysis" 
                className="mb-6"
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Staff Performance Metrics" description="Individual staff efficiency and customer satisfaction">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={staffEfficiencyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="staff" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="transactions" fill="#3b82f6" name="Transactions" />
                      <Bar yAxisId="left" dataKey="interactions" fill="#06b6d4" name="Interactions" />
                      <Line yAxisId="right" type="monotone" dataKey="satisfaction" stroke="#ff6b6b" name="Satisfaction" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Staff Response Time Analysis" description="Average response time by staff role">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={staffEfficiencyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="staff" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="avgTime" fill="#ffa726" name="Avg Time (min)" />
                      <Bar dataKey="responseTime" fill="#ef5350" name="Response Time (min)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </section>

            {/* Queue Management & Customer Flow */}
            <section>
              <SectionHeader 
                title="Queue Management & Customer Flow Optimization" 
                className="mb-6"
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Queue Length & Wait Time Trends" description="Checkout queue performance throughout the day">
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={queueAnalysisData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="queueLength" fill="#ffa726" name="Queue Length" />
                      <Line yAxisId="right" type="monotone" dataKey="waitTime" stroke="#ef5350" name="Wait Time (min)" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Customer Satisfaction vs Queue Performance" description="Satisfaction levels based on queue conditions">
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart data={queueAnalysisData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="waitTime" name="Wait Time (min)" />
                      <YAxis dataKey="satisfaction" name="Satisfaction Score" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter dataKey="queueLength" fill="#8884d8" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </section>



            {/* Operational Insights & Recommendations */}
            <section>
              <SectionHeader 
                title="Operational Insights & Recommendations" 
                className="mb-6"
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <MetricCard
                    title="Peak Hour Optimization"
                    value="+15%"
                    subtitle="Efficiency improvement potential"
                    trend="up"
                    trendValue="Staff reallocation needed"
                    badge={{ text: "Action Required", variant: "warning" }}
                  />
                  <MetricCard
                    title="Customer Wait Time"
                    value="2.1 min"
                    subtitle="Average checkout wait"
                    trend="down"
                    trendValue="Within target range"
                  />
                </div>
                <div className="space-y-4">
                  <MetricCard
                    title="Staff Utilization"
                    value="92%"
                    subtitle="Current efficiency rate"
                    trend="up"
                    trendValue="Excellent performance"
                  />
                  <MetricCard
                    title="Zone Balance"
                    value="Optimal"
                    subtitle="Staff distribution status"
                    trend="neutral"
                    trendValue="Well balanced"
                    badge={{ text: "Good", variant: "default" }}
                  />
                </div>
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </main>

      {/* Delete Source Confirmation Dialog */}
      <Dialog open={showDeleteSourceConfirm} onOpenChange={setShowDeleteSourceConfirm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Video Source</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to delete "{sourceToDelete}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDeleteSourceConfirm(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  if (sourceToDelete) {
                    setVideoSources(videoSources.filter(source => source.name !== sourceToDelete));
                    setShowDeleteSourceConfirm(false);
                    setSourceToDelete(null);
                  }
                }}
              >
                Delete Source
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Date/Time Selection Modal */}
      <Dialog open={showDateTimeModal} onOpenChange={setShowDateTimeModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Go to Particular Date/Time</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-foreground">Date and Time</label>
              <input
                type="datetime-local"
                className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
                value={dateTimeInput}
                onChange={(e) => setDateTimeInput(e.target.value)}
                min={new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                max={new Date().toISOString().slice(0, 16)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                ⚠️ Up to 48 hours of data is stored. Contact Admin for longer time frame.
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDateTimeModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (dateTimeInput) {
                    const selectedDate = new Date(dateTimeInput);
                    const now = new Date();
                    const twoDaysAgo = new Date(now.getTime() - (2 * 24 * 60 * 60 * 1000));
                    
                    if (selectedDate < twoDaysAgo) {
                      alert('Selected time is more than 48 hours ago. Please contact Admin for longer time frame.');
                      return;
                    }
                    
                    if (selectedDate > now) {
                      alert('Selected time is in the future. Please select a valid past time.');
                      return;
                    }
                    
                    // Set custom time and update status
                    setCustomTime(selectedDate);
                    setIsCustomTime(true);
                    setCurrentTime(selectedDate);
                    
                    // Restart videos from beginning when time is chosen
                    const mainVideo = document.getElementById('main-video') as HTMLVideoElement;
                    const secondaryVideo = document.getElementById('secondary-video') as HTMLVideoElement;
                    
                    if (mainVideo && secondaryVideo) {
                      // Reset videos to beginning and play
                      mainVideo.currentTime = 0;
                      secondaryVideo.currentTime = 0;
                      mainVideo.play();
                      secondaryVideo.play();
                    }
                    
                    setShowDateTimeModal(false);
                    console.log(`Navigating to: ${selectedDate.toLocaleString()}`);
                  }
                }}
              >
                Go to Time
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}