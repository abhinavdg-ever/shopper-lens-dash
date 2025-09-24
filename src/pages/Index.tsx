import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, ArrowLeft, Crown } from "lucide-react";
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
  ComposedChart,
  Legend
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
  { hour: "9:00", visitors: 120, dwellTime: 4.2, conversion: 12, footfall: 120 },
  { hour: "9:15", visitors: 135, dwellTime: 4.5, conversion: 13, footfall: 135 },
  { hour: "9:30", visitors: 150, dwellTime: 4.8, conversion: 14, footfall: 150 },
  { hour: "9:45", visitors: 165, dwellTime: 5.1, conversion: 15, footfall: 165 },
  { hour: "10:00", visitors: 180, dwellTime: 5.4, conversion: 16, footfall: 180 },
  { hour: "10:15", visitors: 195, dwellTime: 5.7, conversion: 17, footfall: 195 },
  { hour: "10:30", visitors: 210, dwellTime: 6.0, conversion: 18, footfall: 210 },
  { hour: "10:45", visitors: 225, dwellTime: 6.3, conversion: 19, footfall: 225 },
  { hour: "11:00", visitors: 240, dwellTime: 6.6, conversion: 20, footfall: 240 },
  { hour: "11:15", visitors: 255, dwellTime: 6.9, conversion: 21, footfall: 255 },
  { hour: "11:30", visitors: 270, dwellTime: 7.2, conversion: 22, footfall: 270 },
  { hour: "11:45", visitors: 285, dwellTime: 7.5, conversion: 23, footfall: 285 },
  { hour: "12:00", visitors: 300, dwellTime: 7.8, conversion: 24, footfall: 300 },
  { hour: "12:15", visitors: 315, dwellTime: 8.1, conversion: 25, footfall: 315 },
  { hour: "12:30", visitors: 330, dwellTime: 8.4, conversion: 26, footfall: 330 },
  { hour: "12:45", visitors: 345, dwellTime: 8.7, conversion: 27, footfall: 345 },
  { hour: "13:00", visitors: 360, dwellTime: 9.0, conversion: 28, footfall: 360 },
  { hour: "13:15", visitors: 375, dwellTime: 9.3, conversion: 29, footfall: 375 },
  { hour: "13:30", visitors: 390, dwellTime: 9.6, conversion: 30, footfall: 390 },
  { hour: "13:45", visitors: 405, dwellTime: 9.9, conversion: 31, footfall: 405 },
  { hour: "14:00", visitors: 420, dwellTime: 10.2, conversion: 32, footfall: 420 },
  { hour: "14:15", visitors: 435, dwellTime: 10.5, conversion: 33, footfall: 435 },
  { hour: "14:30", visitors: 450, dwellTime: 10.8, conversion: 34, footfall: 450 },
  { hour: "14:45", visitors: 465, dwellTime: 11.1, conversion: 35, footfall: 465 },
  { hour: "15:00", visitors: 480, dwellTime: 11.4, conversion: 36, footfall: 480 },
  { hour: "15:15", visitors: 495, dwellTime: 11.7, conversion: 37, footfall: 495 },
  { hour: "15:30", visitors: 510, dwellTime: 12.0, conversion: 38, footfall: 510 },
  { hour: "15:45", visitors: 525, dwellTime: 12.3, conversion: 39, footfall: 525 },
  { hour: "16:00", visitors: 540, dwellTime: 12.6, conversion: 40, footfall: 540 },
  { hour: "16:15", visitors: 555, dwellTime: 12.9, conversion: 41, footfall: 555 },
  { hour: "16:30", visitors: 570, dwellTime: 13.2, conversion: 42, footfall: 570 },
  { hour: "16:45", visitors: 585, dwellTime: 13.5, conversion: 43, footfall: 585 },
  { hour: "17:00", visitors: 600, dwellTime: 13.8, conversion: 44, footfall: 600 },
  { hour: "17:15", visitors: 615, dwellTime: 14.1, conversion: 45, footfall: 615 },
  { hour: "17:30", visitors: 630, dwellTime: 14.4, conversion: 46, footfall: 630 },
  { hour: "17:45", visitors: 645, dwellTime: 14.7, conversion: 47, footfall: 645 },
  { hour: "18:00", visitors: 660, dwellTime: 15.0, conversion: 48, footfall: 660 },
  { hour: "18:15", visitors: 675, dwellTime: 15.3, conversion: 49, footfall: 675 },
  { hour: "18:30", visitors: 690, dwellTime: 15.6, conversion: 50, footfall: 690 },
  { hour: "18:45", visitors: 705, dwellTime: 15.9, conversion: 51, footfall: 705 },
  { hour: "19:00", visitors: 720, dwellTime: 16.2, conversion: 52, footfall: 720 },
  { hour: "19:15", visitors: 735, dwellTime: 16.5, conversion: 53, footfall: 735 },
  { hour: "19:30", visitors: 750, dwellTime: 16.8, conversion: 54, footfall: 750 },
  { hour: "19:45", visitors: 765, dwellTime: 17.1, conversion: 55, footfall: 765 },
  { hour: "20:00", visitors: 780, dwellTime: 17.4, conversion: 56, footfall: 780 },
  { hour: "20:15", visitors: 795, dwellTime: 17.7, conversion: 57, footfall: 795 },
  { hour: "20:30", visitors: 810, dwellTime: 18.0, conversion: 58, footfall: 810 },
  { hour: "20:45", visitors: 825, dwellTime: 18.3, conversion: 59, footfall: 825 },
  { hour: "21:00", visitors: 840, dwellTime: 18.6, conversion: 60, footfall: 840 }
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
  const navigate = useNavigate();
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
  const [videoFPS, setVideoFPS] = React.useState<number>(13.09); // Default fallback
  
  // Store Selection Mode Toggle
  const [isGroupMode, setIsGroupMode] = React.useState(false);
  
  // Hierarchical Multi-Select Filter States (for Group Stores mode)
  const [selectedStates, setSelectedStates] = React.useState<string[]>([]);
  const [selectedCities, setSelectedCities] = React.useState<string[]>([]);
  const [selectedStoreIds, setSelectedStoreIds] = React.useState<string[]>([]);
  
  // Simple Store Selection (for Individual Store mode)
  const [selectedIndividualStore, setSelectedIndividualStore] = React.useState('store-3301');
  
  
  // Simple store list for individual selection
  const individualStores = [
    { value: 'store-3301', label: 'Store #3301 - Downtown' },
    { value: 'store-3302', label: 'Store #3302 - Mall Location' },
    { value: 'store-3303', label: 'Store #3303 - Suburban' },
    { value: 'store-3304', label: 'Store #3304 - Airport' },
    { value: 'store-3305', label: 'Store #3305 - Outlet' },
    { value: 'store-3306', label: 'Store #3306 - University' },
    { value: 'store-3307', label: 'Store #3307 - Plaza' },
    { value: 'store-3401', label: 'Store #3401 - Hollywood' },
    { value: 'store-3402', label: 'Store #3402 - Beverly Hills' },
    { value: 'store-3403', label: 'Store #3403 - Santa Monica' },
    { value: 'store-3404', label: 'Store #3404 - Union Square' },
    { value: 'store-3405', label: 'Store #3405 - Fisherman\'s Wharf' },
    { value: 'store-3501', label: 'Store #3501 - Galleria' },
    { value: 'store-3502', label: 'Store #3502 - Downtown' },
    { value: 'store-3503', label: 'Store #3503 - Uptown' },
    { value: 'store-3504', label: 'Store #3504 - Plano' },
    { value: 'store-3601', label: 'Store #3601 - South Beach' },
    { value: 'store-3602', label: 'Store #3602 - Brickell' },
    { value: 'store-3603', label: 'Store #3603 - Disney Springs' },
    { value: 'store-3604', label: 'Store #3604 - Universal' }
  ];
  
  // Hierarchical data structure
  const locationData = {
    'New York': {
      'New York City': ['Store #3301 - Downtown', 'Store #3302 - Mall Location', 'Store #3303 - Suburban'],
      'Buffalo': ['Store #3304 - Airport', 'Store #3305 - Outlet'],
      'Rochester': ['Store #3306 - University', 'Store #3307 - Plaza']
    },
    'California': {
      'Los Angeles': ['Store #3401 - Hollywood', 'Store #3402 - Beverly Hills', 'Store #3403 - Santa Monica'],
      'San Francisco': ['Store #3404 - Union Square', 'Store #3405 - Fisherman\'s Wharf'],
      'San Diego': ['Store #3406 - Gaslamp', 'Store #3407 - La Jolla']
    },
    'Texas': {
      'Houston': ['Store #3501 - Galleria', 'Store #3502 - Downtown'],
      'Dallas': ['Store #3503 - Uptown', 'Store #3504 - Plano'],
      'Austin': ['Store #3505 - South Austin', 'Store #3506 - North Austin']
    },
    'Florida': {
      'Miami': ['Store #3601 - South Beach', 'Store #3602 - Brickell'],
      'Orlando': ['Store #3603 - Disney Springs', 'Store #3604 - Universal'],
      'Tampa': ['Store #3605 - Ybor City', 'Store #3606 - Westshore']
    }
  };
  
  // Helper functions for hierarchical selection
  const getAvailableCities = () => {
    if (selectedStates.length === 0) {
      return Object.keys(locationData).flatMap(state => Object.keys(locationData[state as keyof typeof locationData]));
    }
    return selectedStates.flatMap(state => Object.keys(locationData[state as keyof typeof locationData]));
  };
  
  const getAvailableStores = () => {
    if (selectedStates.length === 0 && selectedCities.length === 0) {
      return Object.values(locationData).flatMap(cities => Object.values(cities)).flat();
    }
    
    if (selectedCities.length === 0) {
      // If no cities selected but states are selected, get all stores from selected states
      return selectedStates.flatMap(state => {
        const stateData = locationData[state as keyof typeof locationData];
        return Object.values(stateData).flat();
      });
    }
    
    // If cities are selected, get stores from those cities
    return selectedCities.flatMap(city => {
      return selectedStates.flatMap(state => {
        const stateData = locationData[state as keyof typeof locationData];
        const cityData = stateData[city as keyof typeof stateData];
        return Array.isArray(cityData) ? cityData : [];
      });
    });
  };
  
  const handleStateChange = (state: string, checked: boolean) => {
    if (checked) {
      setSelectedStates([...selectedStates, state]);
    } else {
      const newStates = selectedStates.filter(s => s !== state);
      setSelectedStates(newStates);
      // Clear cities and stores that are no longer available
      const availableCities = newStates.flatMap(s => Object.keys(locationData[s as keyof typeof locationData]));
      setSelectedCities(selectedCities.filter(city => availableCities.includes(city)));
      setSelectedStoreIds([]);
    }
  };
  
  const handleCityChange = (city: string, checked: boolean) => {
    if (checked) {
      setSelectedCities([...selectedCities, city]);
    } else {
      const newCities = selectedCities.filter(c => c !== city);
      setSelectedCities(newCities);
      // Clear stores that are no longer available based on selected states and cities
      const availableStores = newCities.flatMap(city => {
        return selectedStates.flatMap(state => {
          const stateData = locationData[state as keyof typeof locationData];
          const cityData = stateData[city as keyof typeof stateData];
          return Array.isArray(cityData) ? cityData : [];
        });
      });
      setSelectedStoreIds(selectedStoreIds.filter(store => availableStores.includes(store)));
    }
  };
  
  const handleStoreChange = (store: string, checked: boolean) => {
    if (checked) {
      setSelectedStoreIds([...selectedStoreIds, store]);
    } else {
      setSelectedStoreIds(selectedStoreIds.filter(s => s !== store));
    }
  };
  
  // Function to detect video FPS automatically
  const detectVideoFPS = (video: HTMLVideoElement): Promise<number> => {
    return new Promise((resolve) => {
      if (video.duration && video.videoWidth && video.videoHeight) {
        // Method 1: Try to get FPS from video metadata
        const videoElement = video as any;
        if (videoElement.webkitVideoDecodedByteCount !== undefined) {
          // This is a rough estimation method
          const startTime = performance.now();
          video.currentTime = 0;
          video.play();
          
          const checkFrame = () => {
            if (video.currentTime > 0.1) { // After 100ms
              const endTime = performance.now();
              const timeDiff = (endTime - startTime) / 1000;
              const estimatedFPS = video.currentTime / timeDiff;
              video.pause();
              video.currentTime = 0;
              resolve(Math.round(estimatedFPS * 10) / 10); // Round to 1 decimal
            } else {
              requestAnimationFrame(checkFrame);
            }
          };
          checkFrame();
        } else {
          // Method 2: Use a more reliable approach with frame counting
          let frameCount = 0;
          const startTime = performance.now();
          video.currentTime = 0;
          video.play();
          
          const countFrames = () => {
            if (video.currentTime < 1) { // Count for 1 second
              frameCount++;
              requestAnimationFrame(countFrames);
            } else {
              const endTime = performance.now();
              const timeDiff = (endTime - startTime) / 1000;
              const detectedFPS = frameCount / timeDiff;
              video.pause();
              video.currentTime = 0;
              resolve(Math.round(detectedFPS * 10) / 10);
            }
          };
          countFrames();
        }
      } else {
        // Fallback to default
        resolve(13.09);
      }
    });
  };
  
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
        currentFrame = Math.floor(videoTime * videoFPS); // Use detected FPS
      } else {
        // Fallback to simulated time
        const currentTime = Date.now() / 1000;
        currentFrame = Math.floor(currentTime * videoFPS) % 1000; // Use detected FPS
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
    
    // Update every 1 second for more responsive live metrics
    const interval = setInterval(calculateLiveMetrics, 1000);
    
    return () => clearInterval(interval);
  }, [trackingData, videoFPS]);

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
      const fps = videoFPS; // Use detected FPS
      const currentFrame = Math.floor(videoTime * fps);

      // Find people currently in the frame
      const currentPeople = trackingData.person_data.filter((person: any) => {
        return person.log.some((logEntry: any) => logEntry.frame === currentFrame);
      });

      // Draw zone polygons first (static, not moving with customers)
      if (trackingOptions.viewStoreZones && trackingData.zones) {
        trackingData.zones.forEach((zone: any) => {
          if (zone.polygon && zone.polygon.length > 0) {
            // Draw zone fill with light red color
            ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
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
    }, 1000 / videoFPS); // Match detected video FPS

    // Also start drawing immediately when video loads
    const mainVideo = document.getElementById('main-video') as HTMLVideoElement;
    
    const startDrawing = () => {
      drawTrackingOverlay('tracking-canvas', 'main-video');
    };
    
    if (mainVideo) {
      mainVideo.addEventListener('loadeddata', startDrawing);
      mainVideo.addEventListener('play', startDrawing);
      
      // Detect video FPS when video loads
      const detectFPS = async () => {
        try {
          const detectedFPS = await detectVideoFPS(mainVideo);
          setVideoFPS(detectedFPS);
          console.log('Detected video FPS:', detectedFPS);
        } catch (error) {
          console.log('FPS detection failed, using default:', error);
          setVideoFPS(13.09);
        }
      };
      
      mainVideo.addEventListener('loadedmetadata', detectFPS);
    }
    
    return () => {
      clearInterval(drawInterval);
      if (mainVideo) {
        mainVideo.removeEventListener('loadeddata', startDrawing);
        mainVideo.removeEventListener('play', startDrawing);
      }
    };
  }, [trackingData, trackingOptions, isProcessedVideoMain, videoFPS]);

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
          const fps = videoFPS; // Use detected FPS
          const currentFrame = Math.floor(videoTime * fps);

          // Find people currently in the frame
          const currentPeople = trackingData.person_data.filter((person: any) => {
            return person.log.some((logEntry: any) => logEntry.frame === currentFrame);
          });

          // Draw zone polygons first (static, not moving with customers)
          if (trackingOptions.viewStoreZones && trackingData.zones) {
            trackingData.zones.forEach((zone: any) => {
              if (zone.polygon && zone.polygon.length > 0) {
                // Draw zone fill with light red color
                ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
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
  }, [isProcessedVideoMain, trackingData, trackingOptions, videoFPS]);

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

        {/* Retail - Store Level Insights Header */}
        <div className="mb-6 bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-500 p-4 rounded-r-lg">
          <h1 className="text-2xl font-semibold text-slate-700">Retail - Store Level Insights</h1>
        </div>

        <Tabs defaultValue="customer" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="customer">Customer Analytics</TabsTrigger>
            <TabsTrigger value="employee">Employee & Operational Analysis</TabsTrigger>
            <TabsTrigger value="video" className="flex items-center space-x-2">
              <span>Video Feed</span>
              <Crown className="w-4 h-4 text-yellow-500" />
            </TabsTrigger>
          </TabsList>

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
                description="Real-time analytics and monitoring"
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
                    Currently in Camera View
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

            {/* Store Selection */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-foreground">Store:</label>
                <select 
                  value={selectedIndividualStore}
                  onChange={(e) => setSelectedIndividualStore(e.target.value)}
                  className="px-3 py-2 border border-border rounded-lg bg-background text-sm w-[250px]"
                >
                  {individualStores.map((store) => (
                    <option key={store.value} value={store.value}>
                      {store.label}
                    </option>
                  ))}
                </select>
              </div>
                </div>

            {/* Today's Metrics */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Today's Metrics</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-muted-foreground">CCTV Online</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Last synced: {(() => {
                      const now = new Date();
                      const seconds = now.getSeconds();
                      
                      // Cycle from 18:45 to 18:59 and reset every 15 seconds
                      const cycleSeconds = seconds % 15;
                      const cycleMinutes = 45 + Math.floor(seconds / 15);
                      
                      return `18:${cycleMinutes.toString().padStart(2, '0')}:${cycleSeconds.toString().padStart(2, '0')}`;
                    })()}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Footfalls</CardTitle>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,247</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+12%</span> from yesterday
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">23.4%</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+2.1%</span> from yesterday
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Time To Checkout</CardTitle>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.2 min</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-red-600">+0.3 min</span> from yesterday
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Live Customer Count</CardTitle>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{liveMetrics.customerCount}</div>
                    <p className="text-xs text-muted-foreground">
                      As per last sync
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* 15-minute Footfalls Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Footfalls (Cumulative at 15-minute Intervals)</CardTitle>
                  <CardDescription className="text-sm">Real-time footfall data with auto-refresh</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={[
                      { hour: "09:00", footfall: 11 },
                      { hour: "09:15", footfall: 23 },
                      { hour: "09:30", footfall: 32 },
                      { hour: "09:45", footfall: 39 },
                      { hour: "10:00", footfall: 52 },
                      { hour: "10:15", footfall: 70 },
                      { hour: "10:30", footfall: 87 },
                      { hour: "10:45", footfall: 106 },
                      { hour: "11:00", footfall: 137 },
                      { hour: "11:15", footfall: 175 },
                      { hour: "11:30", footfall: 227 },
                      { hour: "11:45", footfall: 287 },
                      { hour: "12:00", footfall: 345 },
                      { hour: "12:15", footfall: 406 },
                      { hour: "12:30", footfall: 459 },
                      { hour: "12:45", footfall: 502 },
                      { hour: "13:00", footfall: 533 },
                      { hour: "13:15", footfall: 558 },
                      { hour: "13:30", footfall: 580 },
                      { hour: "13:45", footfall: 591 },
                      { hour: "14:00", footfall: 606 },
                      { hour: "14:15", footfall: 617 },
                      { hour: "14:30", footfall: 638 },
                      { hour: "14:45", footfall: 665 },
                      { hour: "15:00", footfall: 696 },
                      { hour: "15:15", footfall: 746 },
                      { hour: "15:30", footfall: 803 },
                      { hour: "15:45", footfall: 868 },
                      { hour: "16:00", footfall: 943 },
                      { hour: "16:15", footfall: 1015 },
                      { hour: "16:30", footfall: 1070 },
                      { hour: "16:45", footfall: 1116 },
                      { hour: "17:00", footfall: 1152 },
                      { hour: "17:15", footfall: 1179 },
                      { hour: "17:30", footfall: 1194 },
                      { hour: "17:45", footfall: 1207 },
                      { hour: "18:00", footfall: 1221 },
                      { hour: "18:15", footfall: 1230 },
                      { hour: "18:30", footfall: 1243 },
                      { hour: "18:45", footfall: 1247 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="footfall" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </section>

            {/* Customer Patterns & Trends */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Customer Patterns & Trends (Medium to Long Term)</h2>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-foreground">Choose Date:</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
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
                </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Hourly Footfall & Conversion</CardTitle>
                    <CardDescription className="text-sm">Customer traffic and conversion rates by hour over the specified period</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart data={[
                        { hour: "9AM", visitors: 120, conversion: 12 },
                        { hour: "10AM", visitors: 180, conversion: 16 },
                        { hour: "11AM", visitors: 280, conversion: 18 },
                        { hour: "12PM", visitors: 450, conversion: 22 },
                        { hour: "1PM", visitors: 380, conversion: 19 },
                        { hour: "2PM", visitors: 420, conversion: 25 },
                        { hour: "3PM", visitors: 480, conversion: 20 },
                        { hour: "4PM", visitors: 540, conversion: 24 },
                        { hour: "5PM", visitors: 620, conversion: 28 },
                        { hour: "6PM", visitors: 680, conversion: 30 },
                        { hour: "7PM", visitors: 780, conversion: 32 },
                        { hour: "8PM", visitors: 720, conversion: 28 },
                        { hour: "9PM", visitors: 340, conversion: 15 }
                      ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                        <Bar yAxisId="left" dataKey="visitors" fill="#3b82f6" name="Visitors" />
                        <Line yAxisId="right" type="monotone" dataKey="conversion" stroke="#ef4444" strokeWidth={2} name="Conversion %" />
                      </ComposedChart>
                  </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Conversion Funnel</CardTitle>
                    <CardDescription className="text-sm">Customer journey from footfall to conversion</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center space-y-2 py-4">
                      {/* Footfalls - Top (Widest) */}
                      <div className="w-full max-w-lg bg-gray-800 text-white px-6 py-4 rounded-lg">
                        <div className="text-center">
                          <div className="text-xs font-medium text-gray-300">100%</div>
                          <div className="text-sm font-semibold">Footfalls 1,247</div>
                        </div>
                </div>

                      {/* Intent */}
                      <div className="w-3/4 max-w-md bg-blue-600 text-white px-6 py-4 rounded-lg">
                        <div className="text-center">
                          <div className="text-xs font-medium text-blue-200">71%</div>
                          <div className="text-sm font-semibold">Intent 892</div>
                </div>
              </div>
                      
                      {/* Engaged */}
                      <div className="w-1/2 max-w-md bg-green-600 text-white px-6 py-4 rounded-lg">
                        <div className="text-center">
                          <div className="text-xs font-medium text-green-200">37%</div>
                          <div className="text-sm font-semibold">Engaged 456</div>
                        </div>
                      </div>
                      
                      {/* Converted - Bottom (Narrowest) */}
                      <div className="w-1/3 max-w-md bg-green-700 text-white px-6 py-4 rounded-lg">
                        <div className="text-center">
                          <div className="text-xs font-medium text-green-200">23%</div>
                          <div className="text-sm font-semibold">Converted 291</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Additional Metrics Cards */}
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Daily Footfalls</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,156</div>
                    <p className="text-xs text-muted-foreground">
                      Last 30 days average
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">87%</div>
                    <p className="text-xs text-muted-foreground">
                      Based on AI Emotion Detection
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Potential Fraud Incidents</CardTitle>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          ⚙️
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Configure Fraud Alerts</DialogTitle>
                        </DialogHeader>
                <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Email Address</label>
                            <input 
                              type="email" 
                              placeholder="manager@store.com" 
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                          <div>
                            <label className="text-sm font-medium">Phone Number</label>
                            <input 
                              type="tel" 
                              placeholder="+1 (555) 123-4567" 
                              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                          <div>
                            <label className="text-sm font-medium">Alert Threshold</label>
                            <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                              <option>1+ incidents per hour</option>
                              <option>2+ incidents per hour</option>
                              <option>3+ incidents per hour</option>
                              <option>5+ incidents per hour</option>
                            </select>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="email-alerts" defaultChecked />
                            <label htmlFor="email-alerts" className="text-sm">Email notifications</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="sms-alerts" defaultChecked />
                            <label htmlFor="sms-alerts" className="text-sm">SMS notifications</label>
                          </div>
                          <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="outline">Cancel</Button>
                            <Button>Save Configuration</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent 
                    className="cursor-pointer hover:bg-muted/50 transition-colors rounded-lg" 
                    onClick={() => {
                      alert("Fraud Incident Details:\n\n1. 14:23 - Suspicious behavior at checkout\n2. 16:45 - Multiple returns without receipt\n3. 18:12 - Unusual payment pattern detected");
                    }}
                  >
                    <div className="text-2xl font-bold text-red-600">3</div>
                    <p className="text-xs text-muted-foreground hover:text-blue-600">
                      Click for Details
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Peak Customer Count</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">89</div>
                    <p className="text-xs text-muted-foreground">
                      {(() => {
                        const selectedDate = dateRange?.from || new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
                        return selectedDate.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        }) + ' at 7:32 PM';
                      })()}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Demographics Deep-dive */}
            <section>
              <SectionHeader 
                title="Demographics Deep-dive" 
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
                      <Legend 
                        wrapperStyle={{ fontSize: '11px' }} 
                        layout="horizontal" 
                        verticalAlign="bottom" 
                        align="center"
                      />
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
                      <Legend 
                        wrapperStyle={{ fontSize: '11px' }} 
                        layout="horizontal" 
                        verticalAlign="bottom" 
                        align="center"
                      />
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
                      <Legend 
                        wrapperStyle={{ fontSize: '11px' }} 
                        layout="horizontal" 
                        verticalAlign="bottom" 
                        align="center"
                      />
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
                      <Legend 
                        wrapperStyle={{ fontSize: '11px' }} 
                        layout="horizontal" 
                        verticalAlign="bottom" 
                        align="center"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </section>
          </TabsContent>

          {/* Employee & Operations Excellence Tab */}
          <TabsContent value="employee" className="space-y-8">
              <SectionHeader 
              title="Employee & Operational Analysis" 
              description="Staff performance and operational efficiency metrics"
                className="mb-6"
              />

            {/* Store Selection */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-foreground">Store:</label>
                <Select value={selectedIndividualStore} onValueChange={setSelectedIndividualStore}>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Select store" />
                  </SelectTrigger>
                  <SelectContent>
                    {individualStores.map((store) => (
                      <SelectItem key={store.value} value={store.value}>
                        {store.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
                </div>

            {/* Today's Metrics */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Today's Metrics</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-muted-foreground">CCTV Online</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Last synced: {(() => {
                      const now = new Date();
                      const seconds = now.getSeconds();
                      
                      // Cycle from 18:45 to 18:59 and reset every 15 seconds
                      const cycleSeconds = seconds % 15;
                      const cycleMinutes = 45 + Math.floor(seconds / 15);
                      
                      return `18:${cycleMinutes.toString().padStart(2, '0')}:${cycleSeconds.toString().padStart(2, '0')}`;
                    })()}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Store Open Time</CardTitle>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">9:37</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+2 min</span> from yesterday
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Staff On Duty</CardTitle>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">13/15</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-red-600">-2</span> from yesterday
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Time Taken at Cash Counter</CardTitle>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2.5 min</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">-0.3 min</span> from yesterday
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Current Queue Length</CardTitle>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-red-600">+3</span> from yesterday
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Queue Length (15-minute intervals) */}
            <section>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Queue Length (15-minute intervals)</CardTitle>
                  <CardDescription className="text-sm">Real-time queue data with auto-refresh</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { time: "09:00", queueLength: 1 },
                        { time: "09:15", queueLength: 2 },
                        { time: "09:30", queueLength: 1 },
                        { time: "09:45", queueLength: 3 },
                        { time: "10:00", queueLength: 2 },
                        { time: "10:15", queueLength: 4 },
                        { time: "10:30", queueLength: 3 },
                        { time: "10:45", queueLength: 5 },
                        { time: "11:00", queueLength: 4 },
                        { time: "11:15", queueLength: 6 },
                        { time: "11:30", queueLength: 5 },
                        { time: "11:45", queueLength: 7 },
                        { time: "12:00", queueLength: 6 },
                        { time: "12:15", queueLength: 8 },
                        { time: "12:30", queueLength: 7 },
                        { time: "12:45", queueLength: 9 },
                        { time: "13:00", queueLength: 8 },
                        { time: "13:15", queueLength: 10 },
                        { time: "13:30", queueLength: 9 },
                        { time: "13:45", queueLength: 11 },
                        { time: "14:00", queueLength: 10 },
                        { time: "14:15", queueLength: 12 },
                        { time: "14:30", queueLength: 11 },
                        { time: "14:45", queueLength: 13 },
                        { time: "15:00", queueLength: 12 },
                        { time: "15:15", queueLength: 14 },
                        { time: "15:30", queueLength: 13 },
                        { time: "15:45", queueLength: 15 },
                        { time: "16:00", queueLength: 14 },
                        { time: "16:15", queueLength: 16 },
                        { time: "16:30", queueLength: 15 },
                        { time: "16:45", queueLength: 17 },
                        { time: "17:00", queueLength: 16 },
                        { time: "17:15", queueLength: 15 },
                        { time: "17:30", queueLength: 14 },
                        { time: "17:45", queueLength: 13 },
                        { time: "18:00", queueLength: 12 },
                        { time: "18:15", queueLength: 11 },
                        { time: "18:30", queueLength: 10 },
                        { time: "18:45", queueLength: 8 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis domain={[0, 18]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="queueLength" stroke="#ef4444" strokeWidth={2} name="Queue Length" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Operational Performance Trends (Medium to Long Term) */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Operational Performance Trends (Medium to Long Term)</h2>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-foreground">Choose Date:</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {employeeDateRange ? (
                          `${format(employeeDateRange.from, "MMM dd")} - ${format(employeeDateRange.to, "MMM dd, yyyy")}`
                        ) : (
                          "Choose date"
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
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Staff Response Time & Queue Length</CardTitle>
                    <CardDescription className="text-sm">Staff performance and queue management trends by hour over the specified period</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={[
                          { hour: "9:00", queueLength: 2, responseTime: 1.8 },
                          { hour: "10:00", queueLength: 4, responseTime: 2.0 },
                          { hour: "11:00", queueLength: 6, responseTime: 2.2 },
                          { hour: "12:00", queueLength: 8, responseTime: 2.4 },
                          { hour: "13:00", queueLength: 10, responseTime: 2.6 },
                          { hour: "14:00", queueLength: 12, responseTime: 2.8 },
                          { hour: "15:00", queueLength: 14, responseTime: 3.0 },
                          { hour: "16:00", queueLength: 16, responseTime: 3.2 },
                          { hour: "17:00", queueLength: 18, responseTime: 3.4 },
                          { hour: "18:00", queueLength: 15, responseTime: 3.0 },
                          { hour: "19:00", queueLength: 12, responseTime: 2.6 },
                          { hour: "20:00", queueLength: 8, responseTime: 2.2 },
                          { hour: "21:00", queueLength: 4, responseTime: 1.8 }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="hour" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Bar yAxisId="left" dataKey="queueLength" fill="#3b82f6" name="Queue Length" />
                          <Line yAxisId="right" type="monotone" dataKey="responseTime" stroke="#10b981" strokeWidth={2} name="Response Time (min)" />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Store Zones Heat Map</CardTitle>
                    <CardDescription className="text-sm">Customer interaction percentage by zone</CardDescription>
                  </CardHeader>
                  <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Top 5 Zones Column */}
                      <div>
                        <div className="text-sm font-medium text-foreground mb-3">Top 5 Zones</div>
                        <div className="space-y-3">
                          {[
                            { name: "Fruits", percentage: 24.5 },
                            { name: "Essentials", percentage: 18.2 },
                            { name: "Toys", percentage: 15.8 },
                            { name: "Electronics", percentage: 12.3 },
                            { name: "Clothing", percentage: 9.7 }
                          ].map((zone, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-sm">{zone.name}</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="h-2 rounded-full" 
                                    style={{ 
                                      width: `${(zone.percentage / 25) * 100}%`,
                                      backgroundColor: zone.percentage >= 20 ? '#10b981' : 
                                                     zone.percentage >= 15 ? '#3b82f6' : 
                                                     zone.percentage >= 10 ? '#f59e0b' : 
                                                     zone.percentage >= 5 ? '#ef4444' : '#6b7280'
                                    }}
                                  ></div>
                                </div>
                                <span className="text-lg font-bold text-foreground">{zone.percentage}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                </div>

                      {/* Bottom 5 Zones Column */}
                      <div>
                        <div className="text-sm font-medium text-foreground mb-3">Bottom 5 Zones</div>
                        <div className="space-y-3">
                          {[
                            { name: "Books", percentage: 2.1 },
                            { name: "Home Decor", percentage: 1.8 },
                            { name: "Sports", percentage: 1.5 },
                            { name: "Jewelry", percentage: 1.2 },
                            { name: "Automotive", percentage: 0.9 }
                          ].map((zone, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-sm">{zone.name}</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="h-2 rounded-full" 
                                    style={{ 
                                      width: `${(zone.percentage / 25) * 100}%`,
                                      // All-red palette; darker for lower values
                                      backgroundColor: zone.percentage >= 2 ? '#ef4444' : 
                                                     zone.percentage >= 1.5 ? '#dc2626' : 
                                                     zone.percentage >= 1 ? '#b91c1c' : '#7f1d1d'
                                    }}
                                  ></div>
                </div>
                                <span className="text-lg font-bold text-foreground">{zone.percentage}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Additional Metrics */}
            <section>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Time at Cash Counter</CardTitle>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2.3 min</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">-0.2 min</span> from last week
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Staff Response Time</CardTitle>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1.8 min</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">-0.1 min</span> from last week
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Incidence of Staff Absence</CardTitle>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3.2%</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-red-600">+0.5%</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Peak Queue Length</CardTitle>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">18</div>
                    <p className="text-xs text-muted-foreground">
                      {(() => {
                        const selectedDate = employeeDateRange?.from || new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
                        return selectedDate.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        }) + ' at 4:45 PM';
                      })()}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Store Open Close Adherence */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">Store Open Close Adherence</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Store Operating Hours</CardTitle>
                  <CardDescription className="text-sm">Actual vs scheduled open/close times for the selected period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 font-medium">Date</th>
                          <th className="text-left py-2 font-medium">Scheduled Open</th>
                          <th className="text-left py-2 font-medium">Actual Open</th>
                          <th className="text-left py-2 font-medium">Scheduled Close</th>
                          <th className="text-left py-2 font-medium">Actual Close</th>
                          <th className="text-left py-2 font-medium">Adherence</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          // Generate dates based on the selected date range
                          const startDate = employeeDateRange?.from || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                          const endDate = employeeDateRange?.to || new Date();
                          const dates = [];
                          
                          for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                            dates.push(new Date(d));
                          }
                          
                          return dates.map((date, index) => {
                            const dateStr = date.toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            });
                            
                            // Sample data for each date
                            const sampleData = [
                              { scheduledOpen: "9:00 AM", actualOpen: "9:37 AM", scheduledClose: "9:00 PM", actualClose: "9:15 PM", adherence: "85%" },
                              { scheduledOpen: "9:00 AM", actualOpen: "9:12 AM", scheduledClose: "9:00 PM", actualClose: "9:05 PM", adherence: "92%" },
                              { scheduledOpen: "9:00 AM", actualOpen: "9:25 AM", scheduledClose: "9:00 PM", actualClose: "8:55 PM", adherence: "78%" },
                              { scheduledOpen: "9:00 AM", actualOpen: "9:05 AM", scheduledClose: "9:00 PM", actualClose: "9:12 PM", adherence: "95%" },
                              { scheduledOpen: "9:00 AM", actualOpen: "9:18 AM", scheduledClose: "9:00 PM", actualClose: "9:08 PM", adherence: "88%" }
                            ];
                            
                            const data = sampleData[index % sampleData.length];
                            
                            // Calculate if times are within ±15 minutes for neutral color
                            const isOpenOnTime = data.actualOpen === "9:00 AM" || 
                              (data.actualOpen === "9:05 AM") || 
                              (data.actualOpen === "9:12 AM") || 
                              (data.actualOpen === "9:15 AM");
                            const isCloseOnTime = data.actualClose === "9:00 PM" || 
                              (data.actualClose === "9:05 PM") || 
                              (data.actualClose === "9:08 PM") || 
                              (data.actualClose === "9:12 PM") || 
                              (data.actualClose === "9:15 PM");
                            
                            return (
                              <tr key={index} className="border-b">
                                <td className="py-2 font-medium">{dateStr}</td>
                                <td className="py-2">{data.scheduledOpen}</td>
                                <td className="py-2">
                                  <span className={isOpenOnTime ? "text-green-600" : "text-muted-foreground"}>
                                    {data.actualOpen}
                                  </span>
                                </td>
                                <td className="py-2">{data.scheduledClose}</td>
                                <td className="py-2">
                                  <span className={isCloseOnTime ? "text-green-600" : "text-muted-foreground"}>
                                    {data.actualClose}
                                  </span>
                                </td>
                                <td className="py-2">
                                  <span className={`font-medium ${
                                    parseFloat(data.adherence) >= 90 ? "text-green-600" : 
                                    parseFloat(data.adherence) >= 80 ? "text-orange-500" : "text-red-500"
                                  }`}>
                                    {data.adherence}
                                  </span>
                                </td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Old Filters - Remove this section */}
            <div className="flex flex-wrap items-center gap-4 mb-6" style={{display: 'none'}}>
              {/* State Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-foreground">State:</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                      {selectedStates.length === 0 ? "All States" : `${selectedStates.length} selected`}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-2">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 border-b pb-2">
                        <Checkbox
                          id="select-all-states"
                          checked={selectedStates.length === Object.keys(locationData).length}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedStates(Object.keys(locationData));
                            } else {
                              setSelectedStates([]);
                              setSelectedCities([]);
                              setSelectedStoreIds([]);
                            }
                          }}
                        />
                        <label htmlFor="select-all-states" className="text-sm font-medium font-semibold">
                          Select All
                        </label>
                </div>
                      {Object.keys(locationData).map((state) => (
                        <div key={state} className="flex items-center space-x-2">
                          <Checkbox
                            id={`state-${state}`}
                            checked={selectedStates.includes(state)}
                            onCheckedChange={(checked) => handleStateChange(state, checked as boolean)}
                          />
                          <label htmlFor={`state-${state}`} className="text-sm font-medium">
                            {state}
                          </label>
                </div>
                      ))}
              </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* City Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-foreground">City:</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                      {selectedCities.length === 0 ? "All Cities" : `${selectedCities.length} selected`}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-2">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 border-b pb-2">
                        <Checkbox
                          id="select-all-cities"
                          checked={selectedCities.length === getAvailableCities().length && getAvailableCities().length > 0}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCities(getAvailableCities());
                            } else {
                              setSelectedCities([]);
                              setSelectedStoreIds([]);
                            }
                          }}
                        />
                        <label htmlFor="select-all-cities" className="text-sm font-medium font-semibold">
                          Select All
                        </label>
                </div>
                      {getAvailableCities().map((city) => (
                        <div key={city} className="flex items-center space-x-2">
                          <Checkbox
                            id={`city-${city}`}
                            checked={selectedCities.includes(city)}
                            onCheckedChange={(checked) => handleCityChange(city, checked as boolean)}
                          />
                          <label htmlFor={`city-${city}`} className="text-sm font-medium">
                            {city}
                          </label>
              </div>
                      ))}
              </div>
                  </PopoverContent>
                </Popover>
                </div>

              {/* Store ID Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-foreground">Store ID:</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                      {selectedStoreIds.length === 0 ? "Select Stores" : `${selectedStoreIds.length} selected`}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[250px] p-2 max-h-[300px] overflow-y-auto">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 border-b pb-2">
                        <Checkbox
                          id="select-all-stores"
                          checked={selectedStoreIds.length === getAvailableStores().length && getAvailableStores().length > 0}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedStoreIds(getAvailableStores());
                            } else {
                              setSelectedStoreIds([]);
                            }
                          }}
                        />
                        <label htmlFor="select-all-stores" className="text-sm font-medium font-semibold">
                          Select All
                        </label>
              </div>
                      {getAvailableStores().map((store) => (
                        <div key={store} className="flex items-center space-x-2">
                          <Checkbox
                            id={`store-${store}`}
                            checked={selectedStoreIds.includes(store)}
                            onCheckedChange={(checked) => handleStoreChange(store, checked as boolean)}
                          />
                          <label htmlFor={`store-${store}`} className="text-sm font-medium">
                            {store}
                          </label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                </div>

              {/* Date Range Filter */}
              <div className="flex items-center space-x-2">
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
              </div>

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
