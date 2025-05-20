import React from 'react';
import { Button } from "@/components/ui/button";
import { TerminalStatusProps } from '../types';

const TerminalStatus: React.FC<TerminalStatusProps> = ({
  terminalStatus,
  terminalLoading,
  showTerminalOptions,
  setShowTerminalOptions,
  setIsProcessing
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Stripe Terminal Status</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-lg">{terminalStatus}</p>
              {terminalLoading && (
                <div className="flex justify-center mt-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white"></div>
                </div>
              )}
            </div>

            <Button
              className="w-full"
              variant="outline"
              onClick={() => {
                setShowTerminalOptions(false);
                setIsProcessing(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalStatus; 