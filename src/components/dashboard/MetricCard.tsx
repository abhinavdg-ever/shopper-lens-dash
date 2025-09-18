import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "warning" | "outline";
  };
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendValue, 
  badge,
  className 
}: MetricCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground";

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {badge && (
          <Badge variant={badge.variant || "default"} className="text-xs">
            {badge.text}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
        {trend && trendValue && (
          <div className={`flex items-center text-xs mt-2 ${trendColor}`}>
            <TrendIcon className="h-3 w-3 mr-1" />
            {trendValue}
          </div>
        )}
      </CardContent>
    </Card>
  );
}