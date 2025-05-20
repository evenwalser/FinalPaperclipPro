import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PaginationProps } from './types';

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  isLoading,
  isTransitioning,
  onPageChange
}) => {
  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1 || isLoading || isTransitioning}
      >
        Previous
      </Button>

      <div className="flex items-center space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            disabled={isLoading}
            className={cn(
              "w-8 h-8",
              currentPage === page && "bg-[#FF3B30] text-white"
            )}
          >
            {page}
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages || isLoading}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination; 