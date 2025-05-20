// import LoadingSkeleton from "@/components/LoadingSkeleton";

// export default function Loading() {
//   // You can add any UI inside Loading, including a Skeleton.
//   return <LoadingSkeleton />
// }
"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList } from "@/components/ui/tabs";

const Skeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-6xl h-full">
    {/* Page Title Skeleton */}
    <div className="mb-6">
      <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
    </div>

    {/* Tabs & Content Skeleton */}
    <Tabs defaultValue="store-profile" className="w-full space-y-6 h-full">
      <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-[8px] overflow-hidden animate-pulse h-full">
        <CardHeader className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <TabsList className="w-full justify-start bg-transparent p-0 space-x-2">
            {["Store Profile", "Inventory", "POS", "Notifications", "Integrations"].map(
              (tab, index) => (
                <div
                  key={index}
                  className="h-8 w-28 bg-gray-200 dark:bg-gray-700 rounded"
                />
              )
            )}
          </TabsList>
        </CardHeader>
        <CardContent className="p-6 h-full">
          {/* Content placeholders mimic form fields/settings */}
          <div className="space-y-4 ">
            <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />
            
          </div>
        </CardContent>
      </Card>
    </Tabs>
  </div>
  );
};

export default Skeleton;
