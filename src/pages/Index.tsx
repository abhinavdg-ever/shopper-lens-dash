import React from "react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Video Retail Analytics Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Real-time insights and performance metrics from video feed analysis
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
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
              title="Interactive People Dashboard" 
              description="Real-time video monitoring with AI-powered people tracking and analytics"
              className="mb-6"
            />
            
            {/* Main Video Interface */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Video Selection Sidebar */}
              <div className="xl:col-span-1 space-y-6">
                <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Video Sources</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg cursor-pointer transition-all hover:bg-primary/15">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Small Shop Multiple Video</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Live • 1080p</p>
                    </div>
                    <div className="p-3 bg-muted/30 border border-border/30 rounded-lg cursor-pointer transition-all hover:bg-muted/50">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Mall Video</span>
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Offline</p>
                    </div>
                    <div className="p-3 bg-muted/30 border border-border/30 rounded-lg cursor-pointer transition-all hover:bg-muted/50">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Warehouse Video</span>
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Offline</p>
                    </div>
                  </div>
                </div>

                {/* Tracking Controls */}
                <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Tracking Options</h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="radio" name="tracking" value="no" className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">No Tracking</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="radio" name="tracking" value="recognition" className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Recognition</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="radio" name="tracking" value="tracking" className="w-4 h-4 text-primary" defaultChecked />
                      <span className="text-sm font-medium">Tracking</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="radio" name="tracking" value="counting" className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Counting</span>
                    </label>
                  </div>
                  
                  <button className="w-full mt-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                    Draw Line
                  </button>
                  
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-red-700">Tracking: 10 tracked</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Video Display */}
              <div className="xl:col-span-3">
                <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-lg font-semibold">Live Store View</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>2017/12/22</span>
                        <span>•</span>
                        <span>1 Camera</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-green-700">Live</span>
                    </div>
                  </div>
                  
                  <div className="relative aspect-video bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden border border-border/30">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-muted-foreground text-lg">Live video feed with AI tracking</p>
                        <p className="text-muted-foreground/70 text-sm mt-2">People detection and tracking enabled</p>
                      </div>
                    </div>
                    
                    {/* Simulated tracking boxes */}
                    <div className="absolute top-1/4 left-1/4 w-16 h-20 border-2 border-green-400 rounded-lg">
                      <div className="absolute -top-6 left-0 bg-green-400 text-black text-xs px-1 rounded font-mono">ID:2</div>
                    </div>
                    <div className="absolute top-1/3 right-1/3 w-14 h-18 border-2 border-green-400 rounded-lg">
                      <div className="absolute -top-6 left-0 bg-green-400 text-black text-xs px-1 rounded font-mono">ID:11</div>
                    </div>
                    <div className="absolute bottom-1/3 left-1/3 w-12 h-16 border-2 border-green-400 rounded-lg">
                      <div className="absolute -top-6 left-0 bg-green-400 text-black text-xs px-1 rounded font-mono">ID:22</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Feed Analytics Overview */}
            <section>
              <SectionHeader 
                title="Video Feed Analytics Overview" 
                description="Real-time customer behavior insights derived from video analysis - Based on Last 1 hour"
                className="mb-6"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Live Customer Count"
                  value="47"
                  subtitle="Currently in store"
                  trend="up"
                  trendValue="+8 from last hour"
                  badge={{ text: "Live", variant: "default" }}
                />
                <MetricCard
                  title="Peak Hour Activity"
                  value="750"
                  subtitle="Max visitors (7PM)"
                  trend="up"
                  trendValue="Peak time"
                  badge={{ text: "Peak", variant: "destructive" }}
                />
                <MetricCard
                  title="Average Dwell Time"
                  value="7.2 min"
                  subtitle="Per customer visit"
                  trend="up"
                  trendValue="+0.5 min improvement"
                />
                <MetricCard
                  title="Conversion Rate"
                  value="21%"
                  subtitle="Video tracked purchases"
                  trend="up"
                  trendValue="+2.3% from avg"
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

            {/* Customer Journey & Store Heat Map Analysis */}
            <section>
              <SectionHeader 
                title="Customer Journey & Store Heat Map" 
                className="mb-6"
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Customer Journey Funnel" description="Video-tracked customer flow through store - showing conversion rates at each stage">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={customerJourneyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="stage" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip formatter={(value, name) => [value, "Customers"]} />
                      <Bar dataKey="count" fill="#3b82f6" name="Customer Count" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Store Zone Activity Map" description="Customer density and activity levels across different store zones">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={zonePerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="zone" />
                      <YAxis />
                      <Tooltip formatter={(value, name) => [value, name === "footfall" ? "Visitors" : "Conversion %"]} />
                      <Bar dataKey="footfall" fill="#ff6b6b" name="Footfall" />
                      <Bar dataKey="conversion" fill="#82ca9d" name="Conversion %" />
                    </BarChart>
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

            {/* Zone Coverage & Staff Distribution */}
            <section>
              <SectionHeader 
                title="Zone Coverage & Staff Distribution" 
                className="mb-6"
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Staff Zone Coverage" description="Staff presence and coverage across store zones">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={zonePerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="zone" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="footfall" fill="#3b82f6" name="Footfall" />
                      <Line yAxisId="right" type="monotone" dataKey="conversion" stroke="#82ca9d" name="Conversion %" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Staff Efficiency by Zone" description="Staff performance metrics by store zone">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={customerDwellTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="zone" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="visitors" fill="#8884d8" name="Visitors Served" />
                    </BarChart>
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
    </div>
  );
}