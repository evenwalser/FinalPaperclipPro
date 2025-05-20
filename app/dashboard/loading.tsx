"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardSkeleton: React.FC = () => {
  return (
    <div className="flex-1 space-y-8 px-4 py-8">
      {/* Header & Date Picker Skeleton */}
      <div className="flex items-center justify-between animate-pulse">
        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>

      {/* Overview Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart & Recent Sales Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Overview Chart Skeleton */}
        <Card className="col-span-4 animate-pulse">
          <CardHeader>
            <CardTitle className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full bg-gray-200 dark:bg-gray-700 rounded" />
          </CardContent>
        </Card>

        {/* Recent Sales Skeleton */}
        <Card className="col-span-3 animate-pulse">
          <CardHeader>
            <CardTitle className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
          </CardHeader>
          <CardContent>
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="mb-2 h-8 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Skeleton */}
      <div className="animate-pulse">
        <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
};

export default DashboardSkeleton;
