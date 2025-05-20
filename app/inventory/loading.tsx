"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const InventorySkeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-center animate-pulse">
        <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="flex space-x-2">
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-pulse">
        <div className="h-10 w-full sm:w-64 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-10 w-full sm:w-64 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>

      {/* Items Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-4">
              <div className="mb-4 aspect-[4/2] rounded-lg bg-gray-200 dark:bg-gray-700" />
              <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
              <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="flex space-x-2 mt-4">
                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center items-center space-x-2 mt-8 animate-pulse">
        <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-10 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
        ))}
        <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
};

export default InventorySkeleton;
