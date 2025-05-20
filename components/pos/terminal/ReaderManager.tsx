import React from 'react';
import { Button } from "@/components/ui/button";
import { ReaderManagerProps } from '../types';

const ReaderManager: React.FC<ReaderManagerProps> = ({
  reader,
  availableReaders,
  terminalLoading,
  terminalStatus,
  discoverReaders,
  selectReader,
  setShowReaderManager
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Stripe Terminal Reader Manager</h2>
          
          <div className="space-y-4">
            {reader && (
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <h3 className="font-medium mb-2">Current Reader</h3>
                <p><strong>Name:</strong> {reader.label || 'Unnamed Reader'}</p>
                <p><strong>Type:</strong> {reader.device_type}</p>
                <p><strong>Status:</strong> {reader.status}</p>
              </div>
            )}
            
            <div className="flex justify-between">
              <Button 
                onClick={discoverReaders}
                disabled={terminalLoading}
                className="flex-1 mr-2"
              >
                {terminalLoading ? 'Discovering...' : 'Discover Readers'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowReaderManager(false)}
                className="flex-1 ml-2"
              >
                Close
              </Button>
            </div>
            
            {availableReaders.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Available Readers</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {availableReaders.map((r) => (
                    <div 
                      key={r.id} 
                      className={`p-3 rounded-md cursor-pointer border ${
                        reader?.id === r.id 
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                          : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50'
                      }`}
                      onClick={() => selectReader(r.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{r.label || 'Unnamed Reader'}</p>
                          <p className="text-sm text-gray-500">{r.device_type} • {r.status}</p>
                        </div>
                        {reader?.id === r.id && (
                          <div className="text-green-500 text-sm font-medium">Current</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReaderManager; 