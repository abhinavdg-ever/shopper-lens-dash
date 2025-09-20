import React, { useEffect } from "react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  { staff: "Electronics", interactions: 23, responseTime: 1.0, satisfaction: 4.7 },
  { staff: "Apparel", interactions: 34, responseTime: 1.4, satisfaction: 4.1 }
];

const queueAnalysisData = [
  { time: "9AM", queueLength: 3, waitTime: 2.1, satisfaction: 84 },
  { time: "11AM", queueLength: 8, waitTime: 4.5, satisfaction: 76 },
  { time: "1PM", queueLength: 12, waitTime: 6.2, satisfaction: 70 },
  { time: "3PM", queueLength: 7, waitTime: 3.8, satisfaction: 80 },
  { time: "5PM", queueLength: 15, waitTime: 8.1, satisfaction: 64 },
  { time: "7PM", queueLength: 18, waitTime: 9.5, satisfaction: 58 },
  { time: "9PM", queueLength: 5, waitTime: 2.8, satisfaction: 82 }
];

const zonePerformanceData = [
  { zone: "Electronics", footfall: 145, conversion: 28, revenue: 12500, avgBasket: 85 },
  { zone: "Apparel", footfall: 98, conversion: 22, revenue: 8900, avgBasket: 95 },
  { zone: "Groceries", footfall: 203, conversion: 15, revenue: 3200, avgBasket: 25 },
  { zone: "Accessories", footfall: 67, conversion: 18, revenue: 2100, avgBasket: 45 }
];

// Customer Demographics Data
const genderData = [
  { name: "Female", value: 55, fill: "#ff6b6b" },
  { name: "Male", value: 40, fill: "#4ecdc4" },
  { name: "Unknown", value: 5, fill: "#95a5a6" }
];

const ageGroupData = [
  { name: "18-25", value: 22, fill: "#ff9ff3" },
  { name: "26-35", value: 32, fill: "#54a0ff" },
  { name: "36-50", value: 25, fill: "#5f27cd" },
  { name: "50+", value: 15, fill: "#00d2d3" },
  { name: "Unknown", value: 6, fill: "#95a5a6" }
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
  const [showConfigNotification, setShowConfigNotification] = React.useState(false);
  const [isGoingWellOpen, setIsGoingWellOpen] = React.useState(true);
  const [isNeedsImprovementOpen, setIsNeedsImprovementOpen] = React.useState(true);
  const [customerDateRange, setCustomerDateRange] = React.useState<{ from: Date; to: Date } | undefined>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    to: new Date(Date.now() - 24 * 60 * 60 * 1000) // yesterday
  });
  const [employeeDateRange, setEmployeeDateRange] = React.useState<{ from: Date; to: Date } | undefined>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    to: new Date(Date.now() - 24 * 60 * 60 * 1000) // yesterday
  });
  const [videoSources, setVideoSources] = React.useState([
    { id: 1, name: "Store ID #3312 (New Jersey)", status: "live", quality: "1080p" },
    { id: 2, name: "Store ID #3323 (Seattle)", status: "pending", quality: "720p" },
    { id: 3, name: "Warehouse #6 (Atlanta)", status: "offline", quality: "720p" }
  ]);

  // Tracking options state
  const [trackingOptions, setTrackingOptions] = React.useState({
    customer: true,
    employee: true,
    age: false,
    gender: true,
    attire: false,
    viewStoreZones: true
  });

  // Tracking metadata state
  const [trackingData, setTrackingData] = React.useState<any>(null);
  const [isLoadingTrackingData, setIsLoadingTrackingData] = React.useState(false);
  const [currentFrame, setCurrentFrame] = React.useState(0);
  
  // Live metrics state for auto-refresh
  const [liveMetrics, setLiveMetrics] = React.useState({
    customerCount: 35,
    genderSplit: "Loading...",
    conversionRate: 9,
    avgTimeInStore: 7.2,
    trendValue: "+8 from last hour"
  });

  // Function to generate static simulated data based on date range (only changes with date range)
  const generateStaticData = (dateRange: { from: Date; to: Date } | undefined, baseValue: number, variation: number = 0.2) => {
    if (!dateRange) return baseValue;
    
    const daysDiff = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
    // Use a deterministic seed based on date range for consistent values
    const seed = Math.floor((dateRange.from.getTime() + dateRange.to.getTime()) / (1000 * 60 * 60 * 24));
    const randomFactor = ((seed * 9301 + 49297) % 233280) / 233280 * variation + (1 - variation);
    const dayMultiplier = Math.min(daysDiff / 7, 2); // Scale up to 2x for longer periods
    
    return Math.round(baseValue * randomFactor * dayMultiplier);
  };

  // Generate customer metrics based on date range (static until date changes)
  const customerMetrics = {
    footfall: generateStaticData(customerDateRange, 450, 0.2), // Daily average
    satisfaction: generateStaticData(customerDateRange, 86, 0.15),
    conversion: generateStaticData(customerDateRange, 21, 0.2),
    checkoutTime: Math.round(generateStaticData(customerDateRange, 27, 0.1)) // 25-30 minute range
  };

  // Generate employee metrics based on date range (static until date changes)
  const employeeMetrics = {
    staffDeployed: generateStaticData(employeeDateRange, 8, 0.25), // Median staff deployed
    responseTime: generateStaticData(employeeDateRange, 1.2, 0.2).toFixed(1), // Around 1.2 minutes
    maxQueueLength: generateStaticData(employeeDateRange, 12, 0.4), // Highest count in queue
    efficiency: generateStaticData(employeeDateRange, 94, 0.1),
    individualPerformance: generateStaticData(employeeDateRange, 88, 0.15) // Individual performance score
  };

  // Calculate satisfaction index based on queue time and score
  const satisfactionIndex = Math.max(60, Math.min(100, customerMetrics.satisfaction - (customerMetrics.checkoutTime - 25) * 0.5));

  // Auto-refresh live metrics every 2 seconds (only when not paused)
  useEffect(() => {
    if (isTrackingPaused || isCustomTime) return; // Don't update metrics when paused or in custom time
    
    const interval = setInterval(() => {
        setLiveMetrics(prev => ({
          ...prev,
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

  // Update current time from custom time when in custom time mode
  useEffect(() => {
    if (!isCustomTime || !customTime || isTrackingPaused) return;
    
    const timer = setInterval(() => {
      setCurrentTime(prevTime => new Date(prevTime.getTime() + 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [isCustomTime, customTime, isTrackingPaused]);

  // Ensure video loops continuously
  useEffect(() => {
    const ensureVideoLoop = () => {
      const mainVideo = document.getElementById('main-video') as HTMLVideoElement;
      
      if (mainVideo) {
        // Ensure video is set to loop continuously
        mainVideo.loop = true;
        
        // Handle video end to ensure continuous playback
        const handleVideoEnd = () => {
          mainVideo.currentTime = 0;
          mainVideo.play().catch(console.log);
        };
        
        mainVideo.addEventListener('ended', handleVideoEnd);
        
        // Start video
        const playVideo = async () => {
          try {
            await mainVideo.play();
          } catch (error) {
            console.log('Video autoplay prevented, user interaction required');
          }
        };
        
        if (mainVideo.readyState >= 2) {
          playVideo();
        } else {
          mainVideo.addEventListener('canplay', playVideo);
        }
        
        // Ensure video restarts if it pauses (unless manually paused)
        const ensureContinuousPlay = () => {
          if (mainVideo.paused && !isTrackingPaused && !isCustomTime) {
            mainVideo.play().catch(console.log);
          }
        };
        
        // Check every 3 seconds to ensure continuous playback
        const playCheckInterval = setInterval(ensureContinuousPlay, 3000);
        
        return () => {
          clearInterval(playCheckInterval);
          mainVideo.removeEventListener('ended', handleVideoEnd);
        };
      }
    };
    
    // Run after a short delay to ensure video is loaded
    const timer = setTimeout(ensureVideoLoop, 100);
    
    return () => clearTimeout(timer);
  }, [isTrackingPaused, isCustomTime]);

  // Load tracking data on component mount
  useEffect(() => {
    const loadTrackingData = async () => {
      setIsLoadingTrackingData(true);
      try {
        const response = await fetch('/tracked_with_metadata_full.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTrackingData(data);
      } catch (error) {
        console.error('Error loading tracking data:', error);
      } finally {
        setIsLoadingTrackingData(false);
      }
    };

    loadTrackingData();
  }, []);

  // Calculate live metrics from tracking data
  useEffect(() => {
    if (!trackingData || !trackingData.person_data) return;

    const calculateLiveMetrics = () => {
      // Get current frame data based on video time if available, otherwise use simulated time
      const mainVideo = document.getElementById('main-video') as HTMLVideoElement;
      let currentFrame;
      
      if (mainVideo && !mainVideo.paused) {
        // Use actual video time for more accurate tracking
        const videoTime = mainVideo.currentTime;
        currentFrame = Math.floor(videoTime * 30); // 30 FPS
      } else {
        // Fallback to simulated time
        const currentTime = Date.now() / 1000;
        currentFrame = Math.floor(currentTime * 30) % 1000;
      }
      
      // Find people currently in the frame
      const currentPeople = trackingData.person_data.filter((person: any) => {
        return person.log.some((logEntry: any) => logEntry.frame === currentFrame);
      });
      
      // Count unique people in current frame
      const uniquePeople = new Set();
      const genderCount = { male: 0, female: 0, unknown: 0 };
      
      currentPeople.forEach((person: any) => {
        if (person.custom_id) {
          uniquePeople.add(person.custom_id);
          
          if (person.gender) {
            if (person.gender === 'male') genderCount.male++;
            else if (person.gender === 'female') genderCount.female++;
            else genderCount.unknown++;
          }
        }
      });

      const totalPeople = uniquePeople.size;
      const totalGender = genderCount.male + genderCount.female + genderCount.unknown;
      
      // Calculate gender percentages
      const femalePercent = totalGender > 0 ? Math.round((genderCount.female / totalGender) * 100) : 0;
      const malePercent = totalGender > 0 ? Math.round((genderCount.male / totalGender) * 100) : 0;
      const unknownPercent = totalGender > 0 ? Math.round((genderCount.unknown / totalGender) * 100) : 0;

      // Calculate trend based on base of 10
      const baseCount = 10;
      const trendChange = totalPeople - baseCount;
      const trendText = trendChange >= 0 ? `+${trendChange} from last hour` : `${trendChange} from last hour`;

      setLiveMetrics(prev => ({
        ...prev,
        customerCount: totalPeople,
        genderSplit: `${femalePercent}% F / ${malePercent}% M / ${unknownPercent}% U`,
        trendValue: trendText
      }));
    };

    calculateLiveMetrics();
    
    // Update every 2 seconds
    const interval = setInterval(calculateLiveMetrics, 2000);
    
    return () => clearInterval(interval);
  }, [trackingData]);

  // Draw tracking overlays on canvas
  useEffect(() => {
    if (!trackingData || !trackingData.person_data) return;

    const drawTrackingOverlay = (canvasId: string, videoId: string) => {
      const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
      const video = document.getElementById(videoId) as HTMLVideoElement;
      
      if (!canvas || !video) return;

      // Set canvas size to match video
      canvas.width = video.offsetWidth;
      canvas.height = video.offsetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Only show overlays if Customer is ticked AND we're in Processed Video mode
      if (!trackingOptions.customer || !isProcessedVideoMain) return;

      // Get current frame data based on video time
      const videoTime = video.currentTime;
      const fps = 30; // Assuming 30 FPS
      const currentFrame = Math.floor(videoTime * fps);

      // Find people currently in the frame
      const currentPeople = trackingData.person_data.filter((person: any) => {
        return person.log.some((logEntry: any) => logEntry.frame === currentFrame);
      });

      // Draw zone polygons first (static, not moving with customers)
      if (trackingOptions.viewStoreZones && trackingData.zones) {
        trackingData.zones.forEach((zone: any) => {
          if (zone.polygon && zone.polygon.length > 0) {
            // Draw zone fill with light grayish color
            ctx.fillStyle = 'rgba(156, 163, 175, 0.3)';
            ctx.beginPath();
            zone.polygon.forEach((point: any, index: number) => {
              const x = point[0] * (canvas.width / (video.videoWidth || 1920));
              const y = point[1] * (canvas.height / (video.videoHeight || 1080));
              
              if (index === 0) {
                ctx.moveTo(x, y);
              } else {
                ctx.lineTo(x, y);
              }
            });
            ctx.closePath();
            ctx.fill();
            
            // Draw zone border with light grayish color
            ctx.strokeStyle = 'rgba(156, 163, 175, 0.8)';
            ctx.lineWidth = 3;
            ctx.setLineDash([8, 4]);
            
            ctx.beginPath();
            zone.polygon.forEach((point: any, index: number) => {
              const x = point[0] * (canvas.width / (video.videoWidth || 1920));
              const y = point[1] * (canvas.height / (video.videoHeight || 1080));
              
              if (index === 0) {
                ctx.moveTo(x, y);
              } else {
                ctx.lineTo(x, y);
              }
            });
            ctx.closePath();
            ctx.stroke();
            
            // Draw zone name with darker background
            if (zone.polygon.length > 0) {
              const centerX = zone.polygon.reduce((sum: number, point: any) => sum + point[0], 0) / zone.polygon.length;
              const centerY = zone.polygon.reduce((sum: number, point: any) => sum + point[1], 0) / zone.polygon.length;
              const scaledCenterX = centerX * (canvas.width / (video.videoWidth || 1920));
              const scaledCenterY = centerY * (canvas.height / (video.videoHeight || 1080));
              
                  // Draw different background for zone name
                  ctx.fillStyle = 'rgba(156, 163, 175, 0.9)';
                  ctx.fillRect(scaledCenterX - 50, scaledCenterY - 18, 100, 24);
              
              ctx.fillStyle = '#ffffff';
              ctx.font = '12px Arial';
              ctx.textAlign = 'center';
              ctx.fillText(zone.zone_name, scaledCenterX, scaledCenterY);
            }
          }
        });
        ctx.setLineDash([]); // Reset line dash
      }

      // Draw tracking boxes and labels for each detected person
      currentPeople.forEach((person: any) => {
        // Find the log entry for current frame
        const currentLogEntry = person.log.find((logEntry: any) => logEntry.frame === currentFrame);
        if (!currentLogEntry || !currentLogEntry.bbox || !Array.isArray(currentLogEntry.bbox) || currentLogEntry.bbox.length < 4) return;

        const [x1, y1, x2, y2] = currentLogEntry.bbox;
        const width = x2 - x1;
        const height = y2 - y1;

        // Scale coordinates to canvas size
        const scaleX = canvas.width / (video.videoWidth || 1920);
        const scaleY = canvas.height / (video.videoHeight || 1080);

        const scaledX1 = x1 * scaleX;
        const scaledY1 = y1 * scaleY;
        const scaledWidth = width * scaleX;
        const scaledHeight = height * scaleY;

        // Draw bounding box (thinner)
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 1;
        ctx.strokeRect(scaledX1, scaledY1, scaledWidth, scaledHeight);

        // Draw label background - different info based on video mode
        const labelText = [];
        
        if (isProcessedVideoMain) {
          // Processed Video mode - show selected tracking info with cycling
          const selectedOptions = [];
          if (trackingOptions.gender && person.gender) {
            selectedOptions.push({ type: 'gender', value: person.gender });
          }
          if (trackingOptions.age && person.age) {
            selectedOptions.push({ type: 'age', value: person.age });
          }
          if (trackingOptions.attire && person.upper_wear && person.lower_wear) {
            selectedOptions.push({ type: 'attire', value: `${person.upper_wear}/${person.lower_wear}` });
          }
          
          // Cycle through selected options every 1 second for smoother display
          if (selectedOptions.length > 0) {
            const cycleIndex = Math.floor(Date.now() / 1000) % selectedOptions.length;
            const currentOption = selectedOptions[cycleIndex];
            labelText.push(`${currentOption.type}: ${currentOption.value}`);
          }
        } else {
          // Original Video mode - show minimal info
          if (person.custom_id) {
            labelText.push(`ID: ${person.custom_id}`);
          }
        }

        if (labelText.length > 0) {
          const text = labelText.join(' | ');
          const textMetrics = ctx.measureText(text);
          const labelHeight = 20;
          const labelWidth = textMetrics.width + 10;

          // Draw label background
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.fillRect(scaledX1, scaledY1 - labelHeight, labelWidth, labelHeight);

          // Draw label text
          ctx.fillStyle = '#ffffff';
          ctx.font = '12px Arial';
          ctx.textAlign = 'left';
          ctx.fillText(text, scaledX1 + 5, scaledY1 - 5);
        }
      });
    };

    // Draw overlay every frame
    const drawInterval = setInterval(() => {
      drawTrackingOverlay('tracking-canvas', 'main-video');
    }, 1000 / 30); // 30 FPS

    // Also start drawing immediately when video loads
    const mainVideo = document.getElementById('main-video') as HTMLVideoElement;
    
    const startDrawing = () => {
      drawTrackingOverlay('tracking-canvas', 'main-video');
    };
    
    if (mainVideo) {
      mainVideo.addEventListener('loadeddata', startDrawing);
      mainVideo.addEventListener('play', startDrawing);
    }
    
    return () => {
      clearInterval(drawInterval);
      if (mainVideo) {
        mainVideo.removeEventListener('loadeddata', startDrawing);
        mainVideo.removeEventListener('play', startDrawing);
      }
    };
  }, [trackingData, trackingOptions, isProcessedVideoMain]);

  // Force tracking to start immediately when video loads
  useEffect(() => {
    const video = document.getElementById('main-video') as HTMLVideoElement;
    if (video && trackingData) {
      const startTracking = () => {
        // Force a redraw of the tracking overlay
        const canvas = document.getElementById('tracking-canvas') as HTMLCanvasElement;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
        }
      };
      
      video.addEventListener('loadeddata', startTracking);
      video.addEventListener('canplay', startTracking);
      
      return () => {
        if (video) {
          video.removeEventListener('loadeddata', startTracking);
          video.removeEventListener('canplay', startTracking);
        }
      };
    }
  }, [trackingData]);

  // Force overlay redraw when video mode changes
  useEffect(() => {
    const mainCanvas = document.getElementById('tracking-canvas') as HTMLCanvasElement;
    const mainVideo = document.getElementById('main-video') as HTMLVideoElement;
    
    if (mainCanvas) {
      const ctx = mainCanvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
      }
    }
    
    // Force immediate redraw when switching to processed mode
    if (isProcessedVideoMain && mainVideo && trackingData) {
      setTimeout(() => {
        const drawTrackingOverlay = (canvasId: string, videoId: string) => {
          const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
          const video = document.getElementById(videoId) as HTMLVideoElement;
          
          if (!canvas || !video) return;

          // Set canvas size to match video
          canvas.width = video.offsetWidth;
          canvas.height = video.offsetHeight;

          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Only show overlays if Customer is ticked AND we're in Processed Video mode
          if (!trackingOptions.customer || !isProcessedVideoMain) return;

          // Get current frame data based on video time
          const videoTime = video.currentTime;
          const fps = 30; // Assuming 30 FPS
          const currentFrame = Math.floor(videoTime * fps);

          // Find people currently in the frame
          const currentPeople = trackingData.person_data.filter((person: any) => {
            return person.log.some((logEntry: any) => logEntry.frame === currentFrame);
          });

          // Draw zone polygons first (static, not moving with customers)
          if (trackingOptions.viewStoreZones && trackingData.zones) {
            trackingData.zones.forEach((zone: any) => {
              if (zone.polygon && zone.polygon.length > 0) {
                // Draw zone fill with darker color
                ctx.fillStyle = 'rgba(255, 107, 107, 0.3)';
                ctx.beginPath();
                zone.polygon.forEach((point: any, index: number) => {
                  const x = point[0] * (canvas.width / (video.videoWidth || 1920));
                  const y = point[1] * (canvas.height / (video.videoHeight || 1080));
                  
                  if (index === 0) {
                    ctx.moveTo(x, y);
                  } else {
                    ctx.lineTo(x, y);
                  }
                });
                ctx.closePath();
                ctx.fill();
                
                // Draw zone border with darker color
                ctx.strokeStyle = 'rgba(255, 107, 107, 0.8)';
                ctx.lineWidth = 3;
                ctx.setLineDash([8, 4]);
                
                ctx.beginPath();
                zone.polygon.forEach((point: any, index: number) => {
                  const x = point[0] * (canvas.width / (video.videoWidth || 1920));
                  const y = point[1] * (canvas.height / (video.videoHeight || 1080));
                  
                  if (index === 0) {
                    ctx.moveTo(x, y);
                  } else {
                    ctx.lineTo(x, y);
                  }
                });
                ctx.closePath();
                ctx.stroke();
                
                // Draw zone name with darker background
                if (zone.polygon.length > 0) {
                  const centerX = zone.polygon.reduce((sum: number, point: any) => sum + point[0], 0) / zone.polygon.length;
                  const centerY = zone.polygon.reduce((sum: number, point: any) => sum + point[1], 0) / zone.polygon.length;
                  const scaledCenterX = centerX * (canvas.width / (video.videoWidth || 1920));
                  const scaledCenterY = centerY * (canvas.height / (video.videoHeight || 1080));
                  
                  // Draw different background for zone name
                  ctx.fillStyle = 'rgba(156, 163, 175, 0.9)';
                  ctx.fillRect(scaledCenterX - 50, scaledCenterY - 18, 100, 24);
                  
                  ctx.fillStyle = '#ffffff';
                  ctx.font = 'bold 12px Arial';
                  ctx.textAlign = 'center';
                  ctx.fillText(zone.zone_name, scaledCenterX, scaledCenterY);
                }
              }
            });
            ctx.setLineDash([]); // Reset line dash
          }

          // Draw tracking boxes and labels for each detected person
          currentPeople.forEach((person: any) => {
            // Find the log entry for current frame
            const currentLogEntry = person.log.find((logEntry: any) => logEntry.frame === currentFrame);
            if (!currentLogEntry || !currentLogEntry.bbox || !Array.isArray(currentLogEntry.bbox) || currentLogEntry.bbox.length < 4) return;

            const [x1, y1, x2, y2] = currentLogEntry.bbox;
            const width = x2 - x1;
            const height = y2 - y1;

            // Scale coordinates to canvas size
            const scaleX = canvas.width / (video.videoWidth || 1920);
            const scaleY = canvas.height / (video.videoHeight || 1080);

            const scaledX1 = x1 * scaleX;
            const scaledY1 = y1 * scaleY;
            const scaledWidth = width * scaleX;
            const scaledHeight = height * scaleY;

            // Draw bounding box (thinner)
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 1;
            ctx.strokeRect(scaledX1, scaledY1, scaledWidth, scaledHeight);

            // Draw label background - different info based on video mode
            const labelText = [];
            
            if (isProcessedVideoMain) {
              // Processed Video mode - show selected tracking info with cycling
              const selectedOptions = [];
              if (trackingOptions.gender && person.gender) {
                selectedOptions.push({ type: 'gender', value: person.gender });
              }
              if (trackingOptions.age && person.age) {
                selectedOptions.push({ type: 'age', value: person.age });
              }
              if (trackingOptions.attire && person.upper_wear && person.lower_wear) {
                selectedOptions.push({ type: 'attire', value: `${person.upper_wear}/${person.lower_wear}` });
              }
              
              // Cycle through selected options every 1 second for smoother display
              if (selectedOptions.length > 0) {
                const cycleIndex = Math.floor(Date.now() / 1000) % selectedOptions.length;
                const currentOption = selectedOptions[cycleIndex];
                labelText.push(`${currentOption.type}: ${currentOption.value}`);
              }
            } else {
              // Original Video mode - show minimal info
              if (person.custom_id) {
                labelText.push(`ID: ${person.custom_id}`);
              }
            }

            if (labelText.length > 0) {
              const text = labelText.join(' | ');
              const textMetrics = ctx.measureText(text);
              const labelHeight = 20;
              const labelWidth = textMetrics.width + 10;

              // Draw label background
              ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
              ctx.fillRect(scaledX1, scaledY1 - labelHeight, labelWidth, labelHeight);

              // Draw label text
              ctx.fillStyle = '#ffffff';
              ctx.font = '12px Arial';
              ctx.textAlign = 'left';
              ctx.fillText(text, scaledX1 + 5, scaledY1 - 5);
            }
          });
        };
        
        drawTrackingOverlay('tracking-canvas', 'main-video');
      }, 100);
    }
  }, [isProcessedVideoMain, trackingData, trackingOptions]);

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
        {/* Configuration Notification */}
        {showConfigNotification && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center space-x-3">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Source Added Successfully!
              </p>
              <p className="text-xs text-yellow-700">
                Someone from the AlgoSights team will contact you to configure this source.
              </p>
            </div>
            <button
              onClick={() => setShowConfigNotification(false)}
              className="ml-auto text-yellow-600 hover:text-yellow-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <Tabs defaultValue="video" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="video">Video Feed</TabsTrigger>
            <TabsTrigger value="customer">Customer Analytics</TabsTrigger>
            <TabsTrigger value="employee">Employee & Operations Excellence</TabsTrigger>
            <TabsTrigger value="insights">Insights & Recommendations</TabsTrigger>
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
              status: 'pending',
              quality: '720p'
            };
            setVideoSources([...videoSources, newSource]);
            setIsAddSourceModalOpen(false);
            setShowConfigNotification(true);
            // Reset form
            setSourceType('store');
            setSelectedStoreId('');
            setSelectedWarehouseId('');
            setStoreIdSearch('');
            
            // Hide notification after 5 seconds
            setTimeout(() => setShowConfigNotification(false), 5000);
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
          ))}
        </div>
                </div>


                {/* Multi-Select Tracking Controls */}
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
                            checked={trackingOptions.viewStoreZones}
                            onChange={(e) => setTrackingOptions(prev => ({ ...prev, viewStoreZones: e.target.checked }))}
                          />
                          <span className="text-sm font-medium">View Store Zones</span>
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
                            checked={trackingOptions.customer}
                            onChange={(e) => setTrackingOptions(prev => ({ ...prev, customer: e.target.checked }))}
                          />
                          <span className="text-sm font-medium">Customer</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-primary" 
                            checked={trackingOptions.employee}
                            onChange={(e) => setTrackingOptions(prev => ({ ...prev, employee: e.target.checked }))}
                          />
                          <span className="text-sm font-medium">Employee</span>
                        </label>
              </div>
                </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Customer Properties</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-primary" 
                    checked={trackingOptions.age}
                    onChange={(e) => setTrackingOptions(prev => ({ ...prev, age: e.target.checked }))}
                  />
                  <span className="text-sm font-medium">Age</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-primary" 
                    checked={trackingOptions.gender}
                    onChange={(e) => setTrackingOptions(prev => ({ ...prev, gender: e.target.checked }))}
                  />
                  <span className="text-sm font-medium">Gender</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-primary" 
                    checked={trackingOptions.attire}
                    onChange={(e) => setTrackingOptions(prev => ({ ...prev, attire: e.target.checked }))}
                  />
                  <span className="text-sm font-medium">Attire</span>
                </label>
              </div>
                </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Proximity Detector <span className="text-xs text-muted-foreground">(Coming Soon)</span></label>
                      <div className="space-y-2 opacity-50">
                        <label className="flex items-center space-x-3 cursor-not-allowed">
                          <input type="checkbox" className="w-4 h-4 text-primary" disabled />
                          <span className="text-sm font-medium">Cash Counter</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-not-allowed">
                          <input type="checkbox" className="w-4 h-4 text-primary" disabled />
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
                  Viewing: {customTime.toLocaleString()} Onwards
                </span>
              )}
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
                      onEnded={() => {
                        const video = document.getElementById('main-video') as HTMLVideoElement;
                        if (video) {
                          video.currentTime = 0;
                          video.play().catch(console.log);
                        }
                      }}
                    >
                      <source src="/Original Video.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    
                    {/* Tracking Overlay Canvas - Always show overlays */}
                    <canvas
                      id="tracking-canvas"
                      className="absolute top-0 left-0 w-full h-full pointer-events-none"
                      style={{ zIndex: 10 }}
                    ></canvas>
                    
                    {/* Video Type Indicator */}
                    <div className="absolute top-4 left-4 bg-black/70 text-white text-sm px-3 py-1 rounded-lg font-semibold">
                      {isProcessedVideoMain ? "Processed Video" : "Original Video"}
              </div>

                    {/* Switch Video Button */}
                    <button 
                      className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-2 rounded-lg flex items-center shadow-lg transition-colors"
                      onClick={() => {
                        const mainVideo = document.getElementById('main-video') as HTMLVideoElement;
                        const currentTime = mainVideo ? mainVideo.currentTime : 0;
                        
                        setIsProcessedVideoMain(!isProcessedVideoMain);
                        
                        // Sync the new main video to the current time after switching
                        setTimeout(() => {
                          const newMainVideo = document.getElementById('main-video') as HTMLVideoElement;
                          if (newMainVideo) {
                            newMainVideo.currentTime = currentTime;
                          }
                        }, 200);
                      }}
                      title={`Switch to ${isProcessedVideoMain ? 'Original' : 'Processed'} Video`}
                    >
                      {isProcessedVideoMain ? 'Switch to Original' : 'Switch to Processed'}
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
                          if (isProcessedVideoMain && trackingCanvas) {
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
                    className={`${(isTrackingPaused || isCustomTime) ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2`}
                    onClick={() => {
                      const mainVideo = document.getElementById('main-video') as HTMLVideoElement;
                      
                      if (isTrackingPaused || isCustomTime) {
                        // Resuming - play videos and reset to Live status
                        if (mainVideo) mainVideo.play();
                        setIsTrackingPaused(false);
                        setIsCustomTime(false);
                        setCustomTime(null);
                      } else {
                        // Pausing - stop videos and set paused status
                        if (mainVideo) {
                          mainVideo.pause();
                          setLastSyncedTime(new Date());
                        }
                        setIsTrackingPaused(true);
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
                description="Based on Last 1 hour"
                className="mb-6"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Live Customer Count</h3>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      Live
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">
                    {liveMetrics.customerCount.toString()}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Currently in store
                  </div>
                  <div className={`text-sm font-medium ${
                    liveMetrics.trendValue?.startsWith('+') 
                      ? 'text-green-600' 
                      : liveMetrics.trendValue?.startsWith('-') 
                      ? 'text-red-600' 
                      : 'text-muted-foreground'
                  }`}>
                    {liveMetrics.trendValue || "+8 from last hour"}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Gender Split</h3>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      Live
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {liveMetrics.genderSplit}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Female / Male / Unknown
                  </div>
                </div>

                <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Conversion Rate</h3>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      Live
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {liveMetrics.conversionRate}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Entry to purchase
                  </div>
                </div>
              </div>
            </section>
          </TabsContent>

          {/* Customer Analytics Tab */}
          <TabsContent value="customer" className="space-y-8">
              <SectionHeader 
              title="Customer Analytics" 
              description="Comprehensive customer behavior analysis and insights"
                className="mb-6"
              />

            {/* Date Range Filter */}
            <div className="flex items-center space-x-4 mb-6">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {customerDateRange ? (
                      `${format(customerDateRange.from, "MMM dd")} - ${format(customerDateRange.to, "MMM dd, yyyy")}`
                    ) : (
                      "Select date range"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    defaultMonth={customerDateRange?.from}
                    selected={customerDateRange}
                    onSelect={(range) => setCustomerDateRange(range as { from: Date; to: Date } | undefined)}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              </div>

            {/* Key Customer Metrics */}
            <section>
              <SectionHeader 
                title="Key Customer Metrics" 
                description="Essential customer performance indicators"
                className="mb-6"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <MetricCard
                  title="Customer Satisfaction"
                  value={`${satisfactionIndex}%`}
                  subtitle="During peak hours Below target during rush"
                  trend="+2.3%"
                  trendDirection="up"
                  icon="😊"
                  />
                  <MetricCard
                  title="Total Footfall"
                  value={customerMetrics.footfall.toLocaleString()}
                  subtitle="Today's visitors"
                  trend="+12%"
                  trendDirection="up"
                  icon="👥"
                />
                  <MetricCard
                  title="Conversion Rate"
                  value={`${customerMetrics.conversion}%`}
                  subtitle="Entry to purchase"
                  trend="+2.3%"
                  trendDirection="up"
                  icon="💰"
                  />
                  <MetricCard
                  title="Time to Checkout"
                  value={`${customerMetrics.checkoutTime} min`}
                  subtitle="Per customer visit"
                  trend="+0.5 min"
                  trendDirection="up"
                  icon="⏱️"
                />
              </div>
            </section>

            {/* Hourly Patterns & Queue Management */}
            <section>
              <SectionHeader 
                title="Hourly Patterns & Queue Management" 
                description="Customer flow patterns and queue performance throughout the day"
                className="mb-6"
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard
                  title="Hourly Footfall & Conversion"
                  description="Customer traffic and conversion rates by hour"
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={hourlyFootfallData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="visitors" fill="#3b82f6" name="Visitors" />
                      <Line yAxisId="right" type="monotone" dataKey="conversion" stroke="#ef4444" strokeWidth={2} name="Conversion %" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                  title="Queue Analysis"
                  description="Queue length and wait times throughout the day"
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={queueAnalysisData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="queueLength" fill="#f59e0b" name="Queue Length" />
                      <Line yAxisId="right" type="monotone" dataKey="satisfaction" stroke="#10b981" strokeWidth={2} name="Satisfaction %" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </section>

            {/* Customer Demographics */}
            <section>
              <SectionHeader 
                title="Customer Demographics" 
                description="Customer composition and behavior patterns"
                className="mb-6"
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                <ChartCard
                  title="Gender Distribution"
                  description="Customer gender breakdown"
                >
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={genderData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {genderData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                  title="Age Group Distribution"
                  description="Customer age demographics"
                >
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={ageGroupData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {ageGroupData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                  title="Customer Mood Distribution"
                  description="Emotional state analysis"
                >
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={customerMoodData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {customerMoodData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                  title="Customer Type"
                  description="Shopping group composition"
                >
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={customerTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {customerTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
                </div>
            </section>
          </TabsContent>

          {/* Employee & Operations Excellence Tab */}
          <TabsContent value="employee" className="space-y-8">
            <SectionHeader 
              title="Employee & Operations Excellence" 
              description="Staff performance and operational efficiency metrics"
              className="mb-6"
            />

            {/* Date Range Filter */}
            <div className="flex items-center space-x-4 mb-6">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {employeeDateRange ? (
                      `${format(employeeDateRange.from, "MMM dd")} - ${format(employeeDateRange.to, "MMM dd, yyyy")}`
                    ) : (
                      "Select date range"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    defaultMonth={employeeDateRange?.from}
                    selected={employeeDateRange}
                    onSelect={(range) => setEmployeeDateRange(range as { from: Date; to: Date } | undefined)}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
                </div>

            {/* Key Employee Metrics */}
            <section>
              <SectionHeader 
                title="Key Employee Metrics" 
                description="Essential staff performance indicators"
                className="mb-6"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                  title="Staff Deployed"
                  value={employeeMetrics.staffDeployed.toString()}
                  subtitle="Active staff on duty"
                  trend="+2"
                  trendDirection="up"
                  icon="👥"
                />
                <MetricCard
                  title="Staff Response Time"
                  value={`${employeeMetrics.responseTime} min`}
                  subtitle="Average customer assistance"
                  trend="-0.2 min"
                  trendDirection="down"
                  icon="⚡"
                />
                <MetricCard
                  title="Highest Count in The Queue at any point"
                  value={employeeMetrics.maxQueueLength.toString()}
                  subtitle="Peak queue length"
                  trend="-3"
                  trendDirection="down"
                  icon="📊"
                />
                <MetricCard
                  title="Staff Efficiency Score"
                  value={`${employeeMetrics.efficiency}%`}
                  subtitle="Overall performance"
                  trend="+4%"
                  trendDirection="up"
                  icon="🎯"
                />
              </div>
            </section>

            {/* Staff Performance Analysis */}
            <section>
              <SectionHeader 
                title="Staff Performance Analysis" 
                description="Individual and team performance metrics"
                className="mb-6"
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard
                  title="Individual Performance Score"
                  description="Staff performance ratings and metrics"
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={staffEfficiencyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="staff" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="satisfaction" fill="#3b82f6" name="Satisfaction Score" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                  title="Staff Response Time Analysis"
                  description="Average response times by department"
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={staffEfficiencyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="staff" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="responseTime" fill="#10b981" name="Response Time (min)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </section>
          </TabsContent>

          {/* Insights & Recommendations Tab */}
          <TabsContent value="insights" className="space-y-8">
              <SectionHeader 
              title="Insights & Recommendations" 
              description="AI-powered insights and actionable recommendations"
                className="mb-6"
              />

            <div className="space-y-6">
              <Collapsible open={isGoingWellOpen} onOpenChange={setIsGoingWellOpen}>
                <CollapsibleTrigger className="flex w-full items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                  <h3 className="text-lg font-semibold text-green-800">What's Going Well</h3>
                  <svg 
                    className={`w-5 h-5 text-green-600 transition-transform ${isGoingWellOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 bg-green-50 border border-green-200 rounded-b-lg">
                <div className="space-y-4">
                    <div className="p-4 bg-white rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">High Customer Satisfaction</h4>
                      <p className="text-green-700 text-sm">Customer satisfaction scores are consistently above 85%, indicating excellent service quality and customer experience.</p>
                </div>
                    <div className="p-4 bg-white rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">Efficient Staff Response</h4>
                      <p className="text-green-700 text-sm">Staff response times average 1.2 minutes, well within target range, showing effective customer assistance.</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">Strong Conversion Rates</h4>
                      <p className="text-green-700 text-sm">Conversion rates are performing at 21%, exceeding industry benchmarks and showing effective sales processes.</p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible open={isNeedsImprovementOpen} onOpenChange={setIsNeedsImprovementOpen}>
                <CollapsibleTrigger className="flex w-full items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                  <h3 className="text-lg font-semibold text-red-800">What Needs Improvement</h3>
                  <svg 
                    className={`w-5 h-5 text-red-600 transition-transform ${isNeedsImprovementOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 bg-red-50 border border-red-200 rounded-b-lg">
                <div className="space-y-4">
                    <div className="p-4 bg-white rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-800 mb-2">Queue Management During Peak Hours</h4>
                      <p className="text-red-700 text-sm">Queue lengths can reach up to 18 customers during peak hours (7PM), causing potential customer dissatisfaction and longer wait times.</p>
                </div>
                    <div className="p-4 bg-white rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-800 mb-2">Checkout Time Optimization</h4>
                      <p className="text-red-700 text-sm">Average checkout time is 27 minutes, which is at the higher end of the acceptable range. Consider streamlining checkout processes.</p>
              </div>
                    <div className="p-4 bg-white rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-800 mb-2">Peak Hour Staffing</h4>
                      <p className="text-red-700 text-sm">Consider increasing staff deployment during peak hours (5PM-9PM) to better handle customer volume and reduce queue times.</p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Delete Source Confirmation Dialog */}
      <Dialog open={showDeleteSourceConfirm} onOpenChange={setShowDeleteSourceConfirm}>
        <DialogContent>
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
                    setVideoSources(prev => prev.filter(source => source.name !== sourceToDelete));
                    setShowDeleteSourceConfirm(false);
                    setSourceToDelete(null);
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Date/Time Selection Modal */}
      <Dialog open={showDateTimeModal} onOpenChange={setShowDateTimeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Go to Particular Date/Time</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Select Date and Time</label>
                <input
                  type="datetime-local"
                  value={dateTimeInput}
                  onChange={(e) => setDateTimeInput(e.target.value)}
                  className="w-full mt-1 p-2 border border-border rounded-lg bg-background"
                  max={new Date().toISOString().slice(0, 16)}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                <p>• Cannot go more than 2 days back from today</p>
                <p>• Up to 48 hours of data is stored</p>
                <p>• Contact Admin for longer timeframe</p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowDateTimeModal(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    if (dateTimeInput) {
                      const selectedDateTime = new Date(dateTimeInput);
                      const now = new Date();
                      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
                      
                      if (selectedDateTime < twoDaysAgo) {
                        alert('Cannot go more than 2 days back from today');
                        return;
                      }
                      
                      if (selectedDateTime > now) {
                        alert('Cannot select future date/time');
                        return;
                      }
                      
                      setCustomTime(selectedDateTime);
                      setCurrentTime(selectedDateTime);
                      setIsCustomTime(true);
                      setIsTrackingPaused(false);
                      
                      // Restart video from beginning when going to custom time
                      const mainVideo = document.getElementById('main-video') as HTMLVideoElement;
                      if (mainVideo) {
                        mainVideo.currentTime = 0;
                        mainVideo.play().catch(console.log);
                      }
                      
                      setShowDateTimeModal(false);
                    }
                  }}
                >
                  Go to Time
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
