// LoadingSkeleton.tsx
import React from 'react';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Skeleton for a title */}
      <div className="w-3/4 h-6 bg-gray-300 rounded-md animate-pulse" />

      {/* Skeleton for text */}
      <div className="w-full h-4 bg-gray-300 rounded-md animate-pulse" />

      {/* Skeleton for image */}
      <div className="w-full h-48 bg-gray-300 rounded-md animate-pulse" />
      
      {/* Skeleton for another text */}
      <div className="w-5/6 h-4 bg-gray-300 rounded-md animate-pulse" />
    </div>
  );
};

export default LoadingSkeleton;
