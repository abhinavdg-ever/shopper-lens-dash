import { MetricCard } from "@/components/dashboard/MetricCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  AreaChart
} from "recharts";

const ageGroupData = [
  { name: "18-25", value: 30, fill: "#3b82f6" },
  { name: "26-35", value: 40, fill: "#06b6d4" },
  { name: "36-50", value: 20, fill: "#8b5cf6" },
  { name: "50+", value: 10, fill: "#f59e0b" }
];

const zoneEngagementData = [
  { zone: "Apparel", engagement: 38, conversion: 20 },
  { zone: "Electronics", engagement: 25, conversion: 35 },
  { zone: "Groceries", engagement: 22, conversion: 15 },
  { zone: "Accessories", engagement: 15, conversion: 12 }
];

const hourlyFootfallData = [
  { hour: "9AM", visitors: 120 },
  { hour: "11AM", visitors: 280 },
  { hour: "1PM", visitors: 450 },
  { hour: "3PM", visitors: 380 },
  { hour: "5PM", visitors: 620 },
  { hour: "7PM", visitors: 750 },
  { hour: "9PM", visitors: 340 }
];

const conversionFunnelData = [
  { stage: "Entry", value: 4520 },
  { stage: "Browse", value: 3800 },
  { stage: "Interact", value: 814 },
  { stage: "Trial", value: 586 },
  { stage: "Purchase", value: 950 }
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-foreground">
            Video Retail Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time insights and performance metrics
          </p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="customer" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="customer">Customer Analytics</TabsTrigger>
            <TabsTrigger value="employee">Employee & Operations</TabsTrigger>
          </TabsList>

          {/* Customer Analytics Tab */}
          <TabsContent value="customer" className="space-y-8">
            {/* Key Customer Metrics Overview */}
            <section>
              <SectionHeader 
                title="Customer Performance Overview" 
                description="Key customer metrics and satisfaction indicators"
                className="mb-6"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Total Visitors"
                  value="4,520"
                  subtitle="Daily footfall"
                  trend="up"
                  trendValue="+12% from yesterday"
                />
                <MetricCard
                  title="Conversion Rate"
                  value="21%"
                  subtitle="Entry to checkout"
                  trend="up"
                  trendValue="+2.3% from avg"
                />
                <MetricCard
                  title="Average Basket"
                  value="₹1,850"
                  subtitle="Per transaction"
                  trend="up"
                  trendValue="+₹150 from yesterday"
                />
                <MetricCard
                  title="Customer Satisfaction"
                  value="86%"
                  subtitle="Happy/Neutral sentiment"
                  trend="neutral"
                  trendValue="Stable"
                  badge={{ text: "AI Analyzed", variant: "secondary" }}
                />
              </div>
            </section>

            {/* Customer Demographics & Footfall */}
            <section>
              <SectionHeader 
                title="Customer Footfall & Demographics" 
                className="mb-6"
              />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="grid grid-cols-1 gap-4">
                  <MetricCard
                    title="Unique Visitors"
                    value="3,800"
                    subtitle="84% of total visitors"
                  />
                  <MetricCard
                    title="Repeat Visitors"
                    value="22%"
                    subtitle="720 returning customers"
                  />
                  <MetricCard
                    title="Peak Hour Footfall"
                    value="750"
                    subtitle="6-7 PM today"
                    badge={{ text: "Peak", variant: "destructive" }}
                  />
                </div>
                
                <ChartCard title="Age Group Distribution">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={ageGroupData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {ageGroupData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Hourly Footfall Pattern">
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={hourlyFootfallData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="visitors" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </section>

            {/* Store Engagement */}
            <section>
              <SectionHeader 
                title="Store Engagement & Customer Journey" 
                className="mb-6"
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <MetricCard
                    title="Average Stay Time"
                    value="7.5 min"
                    subtitle="Store visit duration"
                  />
                  <MetricCard
                    title="Product Interaction"
                    value="18%"
                    subtitle="Customer engagement rate"
                  />
                  <MetricCard
                    title="Trial Room Usage"
                    value="72%"
                    subtitle="Peak hour utilization"
                    badge={{ text: "High", variant: "secondary" }}
                  />
                  <MetricCard
                    title="Promo Zone Engagement"
                    value="26%"
                    subtitle="Visitor interaction rate"
                  />
                </div>

                <ChartCard title="Zone Performance" description="Footfall vs Conversion by store zone">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={zoneEngagementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="zone" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="engagement" fill="#3b82f6" name="Footfall %" />
                      <Bar dataKey="conversion" fill="#06b6d4" name="Conversion %" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </section>

            {/* Conversion & Sales */}
            <section>
              <SectionHeader 
                title="Conversion & Sales Funnel" 
                className="mb-6"
              />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ChartCard title="Sales Funnel" description="Customer journey conversion stages">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={conversionFunnelData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="stage" type="category" width={60} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <div className="grid grid-cols-1 gap-4">
                  <MetricCard
                    title="Abandonment Rate"
                    value="79%"
                    subtitle="No purchase made"
                    trend="down"
                    trendValue="Needs improvement"
                  />
                  <MetricCard
                    title="Cross-sell Success"
                    value="14%"
                    subtitle="Additional items sold"
                    trend="up"
                    trendValue="+3% this month"
                  />
                  <MetricCard
                    title="Impulse Purchases"
                    value="9%"
                    subtitle="Unplanned buying"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <MetricCard
                    title="Queue Wait Time"
                    value="4.2 min"
                    subtitle="Average checkout time"
                    badge={{ text: "Target: <3min", variant: "outline" }}
                  />
                  <MetricCard
                    title="Queue Abandonment"
                    value="8%"
                    subtitle="Left without purchase"
                    trend="down"
                    trendValue="Within target"
                  />
                  <MetricCard
                    title="Loyalty Sign-ups"
                    value="115"
                    subtitle="New members today"
                    trend="up"
                    trendValue="+25% vs yesterday"
                  />
                </div>
              </div>
            </section>

            {/* Customer Safety & Security */}
            <section>
              <SectionHeader 
                title="Customer Safety & Experience" 
                className="mb-6"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricCard
                  title="Safety Compliance"
                  value="95%"
                  subtitle="Overall score"
                  trend="up"
                  trendValue="Excellent"
                />
                <MetricCard
                  title="Crowd Density Alerts"
                  value="3"
                  subtitle="High traffic warnings"
                />
                <MetricCard
                  title="Emergency Access"
                  value="100%"
                  subtitle="Exit accessibility"
                  trend="up"
                  trendValue="Fully compliant"
                />
              </div>
            </section>

            {/* Customer Strategic Insights */}
            <section>
              <SectionHeader 
                title="Customer Insights & Recommendations" 
                className="mb-6"
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <MetricCard
                    title="Electronics Zone ROI"
                    value="35%"
                    subtitle="Conversion rate (25% footfall)"
                    trend="up"
                    trendValue="High performance zone"
                    badge={{ text: "Top Performer", variant: "default" }}
                  />
                  <MetricCard
                    title="Apparel Zone Performance"
                    value="20%"
                    subtitle="Conversion rate (38% footfall)"
                    trend="down"
                    trendValue="Underperforming potential"
                    badge={{ text: "Optimization Needed", variant: "destructive" }}
                  />
                </div>
                <div className="space-y-4">
                  <MetricCard
                    title="Customer Lifetime Value"
                    value="₹14,500"
                    subtitle="Projected value per customer"
                    trend="up"
                    trendValue="Growth opportunity"
                  />
                  <MetricCard
                    title="End-cap Display Impact"
                    value="+18%"
                    subtitle="Engagement boost near checkout"
                    trend="up"
                    trendValue="Layout optimization success"
                    badge={{ text: "Success", variant: "default" }}
                  />
                </div>
              </div>
            </section>
          </TabsContent>

          {/* Employee & Operations Tab */}
          <TabsContent value="employee" className="space-y-8">
            {/* Staff Overview */}
            <section>
              <SectionHeader 
                title="Staff Performance Overview" 
                description="Key operational and staff efficiency metrics"
                className="mb-6"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Staff Presence"
                  value="88%"
                  subtitle="Compliance rate"
                  trend="down"
                  trendValue="12% absent from stations"
                  badge={{ text: "Needs Attention", variant: "destructive" }}
                />
                <MetricCard
                  title="Customer Response"
                  value="1.8 min"
                  subtitle="Avg assistance time"
                  trend="up"
                  trendValue="Good performance"
                />
                <MetricCard
                  title="Cashier Efficiency"
                  value="32/hr"
                  subtitle="Transactions per hour"
                  trend="up"
                  trendValue="Above target"
                />
                <MetricCard
                  title="Staff-Customer Ratio"
                  value="1:12"
                  subtitle="Staff to customer interaction"
                  trend="neutral"
                  trendValue="Optimal range"
                />
              </div>
            </section>

            {/* Staff Presence & Coverage */}
            <section>
              <SectionHeader 
                title="Staff Presence & Service Coverage" 
                className="mb-6"
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <MetricCard
                    title="Absence from Station"
                    value="12%"
                    subtitle="≈45 mins per staff per shift"
                    trend="down"
                    trendValue="Above optimal"
                    badge={{ text: "Monitor", variant: "warning" }}
                  />
                  <MetricCard
                    title="Unattended Counters"
                    value="3/day"
                    subtitle="Checkout coverage gaps"
                    badge={{ text: "Action Needed", variant: "destructive" }}
                  />
                  <MetricCard
                    title="Electronics Desk"
                    value="15%"
                    subtitle="Time unmanned"
                    trend="down"
                    trendValue="High impact area"
                  />
                  <MetricCard
                    title="Service Desk Coverage"
                    value="90%"
                    subtitle="Staffed availability"
                    trend="up"
                    trendValue="Good coverage"
                  />
                </div>

                <div className="space-y-4">
                  <MetricCard
                    title="Customer Impact from Staff Absence"
                    value="+14%"
                    subtitle="Walk-away rate increase"
                    trend="down"
                    trendValue="Revenue impact"
                    badge={{ text: "Critical", variant: "destructive" }}
                  />
                  <MetricCard
                    title="Additional Wait Time"
                    value="+3.5 min"
                    subtitle="When staff absent"
                    trend="down"
                    trendValue="Customer experience impact"
                  />
                  <MetricCard
                    title="Trial Room Coverage"
                    value="92%"
                    subtitle="Staff availability"
                    trend="up"
                    trendValue="Excellent service"
                  />
                </div>
              </div>
            </section>

            {/* Operational Efficiency */}
            <section>
              <SectionHeader 
                title="Operational Efficiency" 
                className="mb-6"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Planogram Compliance"
                  value="92%"
                  subtitle="Display arrangement accuracy"
                  trend="up"
                  trendValue="High compliance"
                />
                <MetricCard
                  title="Empty Shelf Alerts"
                  value="27"
                  subtitle="Restocking needed today"
                  badge={{ text: "Active", variant: "warning" }}
                />
                <MetricCard
                  title="Restocking Efficiency"
                  value="16 min"
                  subtitle="Average restocking time"
                  trend="up"
                  trendValue="Within target"
                />
                <MetricCard
                  title="Inventory Accuracy"
                  value="96%"
                  subtitle="Stock level precision"
                  trend="up"
                  trendValue="Excellent accuracy"
                />
              </div>
            </section>

            {/* Security & Safety Operations */}
            <section>
              <SectionHeader 
                title="Security & Safety Operations" 
                className="mb-6"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Security Incidents"
                  value="4"
                  subtitle="Flagged today"
                  badge={{ text: "Monitored", variant: "outline" }}
                />
                <MetricCard
                  title="Restricted Breaches"
                  value="2"
                  subtitle="Zone violations"
                  trend="down"
                  trendValue="Staff area access"
                />
                <MetricCard
                  title="Staff Safety Training"
                  value="100%"
                  subtitle="Compliance rate"
                  trend="up"
                  trendValue="Fully trained"
                />
                <MetricCard
                  title="Incident Response Time"
                  value="2.1 min"
                  subtitle="Average response time"
                  trend="up"
                  trendValue="Quick response"
                />
              </div>
            </section>

            {/* Staff Optimization Insights */}
            <section>
              <SectionHeader 
                title="Staff Optimization & Recommendations" 
                className="mb-6"
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <MetricCard
                    title="Staff Optimization Potential"
                    value="12%"
                    subtitle="Cost savings during off-peak"
                    trend="up"
                    trendValue="Efficiency improvement"
                    badge={{ text: "Action Item", variant: "warning" }}
                  />
                  <MetricCard
                    title="Peak Hour Staffing"
                    value="95%"
                    subtitle="Optimal coverage achieved"
                    trend="up"
                    trendValue="Well staffed"
                  />
                </div>
                <div className="space-y-4">
                  <MetricCard
                    title="Training ROI"
                    value="22%"
                    subtitle="Performance improvement post-training"
                    trend="up"
                    trendValue="High impact investment"
                  />
                  <MetricCard
                    title="Staff Satisfaction"
                    value="84%"
                    subtitle="Based on performance metrics"
                    trend="up"
                    trendValue="Positive trend"
                    badge={{ text: "Survey Due", variant: "outline" }}
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