import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Store, 
  Factory, 
  CreditCard, 
  GraduationCap, 
  Truck, 
  Building2,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const industries = [
    {
      id: 'retail',
      title: 'Retail',
      subtitle: 'Store Level Insights',
      description: 'Customer behavior analytics, queue management, and store optimization insights.',
      icon: Store,
      enabled: true,
      features: ['Customer Tracking', 'Queue Analytics', 'Heat Maps', 'Conversion Metrics'],
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    },
    {
      id: 'manufacturing',
      title: 'Manufacturing',
      subtitle: 'Operational Efficiency',
      description: 'Production line monitoring, quality control, and workforce optimization.',
      icon: Factory,
      enabled: true,
      features: ['Production Monitoring', 'Quality Control', 'Safety Compliance', 'Efficiency Metrics'],
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    },
    {
      id: 'education',
      title: 'Education',
      subtitle: 'Campus Analytics',
      description: 'Student engagement tracking and campus safety monitoring.',
      icon: GraduationCap,
      enabled: true,
      features: ['Attendance Tracking', 'Engagement Metrics', 'Safety Monitoring', 'Space Utilization'],
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    },
    {
      id: 'restaurants',
      title: 'Restaurants',
      subtitle: 'Food Service Analytics',
      description: 'Customer analytics and operational efficiency for food service.',
      icon: CreditCard,
      enabled: false,
      features: ['Customer Tracking', 'Queue Analytics', 'Order Analytics', 'Staff Optimization'],
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    },
    {
      id: 'logistics',
      title: 'Logistics',
      subtitle: 'Supply Chain Optimization',
      description: 'Warehouse management and delivery optimization solutions.',
      icon: Truck,
      enabled: false,
      features: ['Inventory Tracking', 'Route Optimization', 'Delivery Monitoring', 'Efficiency Analytics'],
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    },
    {
      id: 'government',
      title: 'Government',
      subtitle: 'Public Safety & Services',
      description: 'Public space monitoring and citizen service optimization.',
      icon: Building2,
      enabled: false,
      features: ['Public Safety', 'Service Analytics', 'Traffic Management', 'Resource Optimization'],
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    }
  ];

  const handleIndustrySelect = (industryId: string) => {
    if (industryId === 'retail') {
      navigate('/retail');
    } else if (industryId === 'manufacturing') {
      navigate('/manufacturing');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
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
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Choose Your Industry
          </h2>
          <p className="text-xl text-slate-600 whitespace-nowrap">
            Select your industry to access specialized use cases and analytics tailored to your business needs.
          </p>
        </div>

        {/* Industry Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((industry) => {
            const IconComponent = industry.icon;
            return (
              <Card 
                key={industry.id}
                className={`relative transition-all duration-300 ${
                  industry.enabled 
                    ? 'hover:shadow-xl hover:scale-105 cursor-pointer border-2 hover:border-slate-300' 
                    : 'opacity-60 cursor-not-allowed'
                }`}
                onClick={() => handleIndustrySelect(industry.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 ${industry.color} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    {industry.enabled && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Available
                      </Badge>
                    )}
                    {!industry.enabled && (
                      <Badge variant="outline" className="text-slate-500">
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl text-slate-900 mt-4">
                    {industry.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 font-medium">
                    {industry.subtitle}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-slate-600 mb-6">
                    {industry.description}
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-900 text-sm">Key Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {industry.features.map((feature, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-xs"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {industry.enabled && (
                    <Button 
                      className={`w-full mt-6 ${industry.color} ${industry.hoverColor} text-white`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleIndustrySelect(industry.id);
                      }}
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <p className="text-slate-600 mb-4">
            Contact our team for personalized recommendations.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-slate-500">
            <span>✓ Enterprise Ready</span>
            <span>✓ 24/7 Support</span>
            <span>✓ Custom Integrations</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
