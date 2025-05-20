import React from 'react';
import { Button } from "@/components/ui/button";
import { TerminalWaitingProps } from '../types';

const TerminalWaiting: React.FC<TerminalWaitingProps> = ({
  setWaitingForTerminal,
  setIsProcessing,
  setTerminalStatus
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Processing Payment</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-lg text-center mb-4">
                Payment is being processed on the terminal...
              </p>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 dark:border-white"></div>
              </div>
            </div>
            <p className="text-sm text-center text-gray-500">
              Please do not refresh or close this page. The receipt will appear
              automatically when payment is complete.
            </p>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => {
                setWaitingForTerminal(false);
                setIsProcessing(false);
                setTerminalStatus("Reader Ready");
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

export default TerminalWaiting; 