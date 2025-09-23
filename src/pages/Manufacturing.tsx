import React from 'react';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Factory, TrendingUp, AlertTriangle, CheckCircle, Clock, Users, Zap } from 'lucide-react';
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
  Cell
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
  { name: 'Excellent', value: 78, color: '#10b981' },
  { name: 'Good', value: 18, color: '#3b82f6' },
  { name: 'Fair', value: 3, color: '#f59e0b' },
  { name: 'Poor', value: 1, color: '#ef4444' }
];

const safetyData = [
  { zone: 'Assembly Line A', incidents: 0, status: 'Safe' },
  { zone: 'Assembly Line B', incidents: 1, status: 'Warning' },
  { zone: 'Packaging', incidents: 0, status: 'Safe' },
  { zone: 'Quality Control', incidents: 0, status: 'Safe' },
  { zone: 'Warehouse', incidents: 2, status: 'Alert' }
];

const Manufacturing = () => {
  const navigate = useNavigate();

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
                  Algosights - Manufacturing
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
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Production Rate</CardTitle>
              <Factory className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">52 units/hr</div>
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
              <div className="text-2xl font-bold">96.8%</div>
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
              <CardTitle>Quality Distribution</CardTitle>
              <CardDescription>Product quality assessment breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={qualityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {qualityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
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

        {/* Coming Soon Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Advanced Manufacturing Analytics</span>
            </CardTitle>
            <CardDescription>Upcoming features for enhanced operational insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Predictive Maintenance</h4>
                <p className="text-sm text-muted-foreground">AI-powered equipment failure prediction</p>
                <Badge variant="outline" className="mt-2">Coming Soon</Badge>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Worker Safety Analytics</h4>
                <p className="text-sm text-muted-foreground">Real-time safety compliance monitoring</p>
                <Badge variant="outline" className="mt-2">Coming Soon</Badge>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Supply Chain Optimization</h4>
                <p className="text-sm text-muted-foreground">Inventory and logistics optimization</p>
                <Badge variant="outline" className="mt-2">Coming Soon</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Manufacturing;
