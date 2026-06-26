"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: number;
  isLoading: boolean;
}

export function KpiCard({
  title,
  value,
  subtitle,
  trend,
  isLoading,
}: KpiCardProps) {
  if (isLoading) {
    return (
      <Card className="min-w-0">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-7 w-32 sm:h-8" />
          <Skeleton className="mt-2 h-3 w-20" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="min-w-0">
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-xs font-medium leading-snug text-muted-foreground sm:text-sm">
          {title}
        </CardTitle>
        {trend !== undefined && (
          <Badge
            variant={trend >= 0 ? "default" : "destructive"}
            className="shrink-0 text-xs"
          >
            {trend >= 0 ? "+" : ""}
            {trend.toFixed(1)}%
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <p
          className="truncate text-xl font-bold sm:text-2xl"
          title={value}
        >
          {value}
        </p>
        {subtitle && (
          <p className="mt-1 truncate text-xs text-muted-foreground sm:text-sm">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
