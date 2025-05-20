import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RefreshCw } from 'lucide-react'
import Image from 'next/image'

export interface IntegrationSettingsProps {
  syncStatus: string;
  lastSyncTime: string;
  isReconnecting: boolean;
  handleReconnect: () => void;
}

export function IntegrationSettings({
  syncStatus,
  lastSyncTime,
  isReconnecting,
  handleReconnect,
}: IntegrationSettingsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Integrations Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Manage your connection with Paperclip Marketplace</p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/paperclip_logo_red@1x.jpg-t3B9TdkGvq1AYhUm9oz2nXTQvDf1IM.png"
          alt="Paperclip Logo"
          width={200}
          height={40}
          className="mb-4"
          priority
        />
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Your inventory is automatically synced with the Paperclip Marketplace.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-gray-700 dark:text-gray-300 text-base">Paperclip Marketplace Sync Status</Label>
          <span className={`font-semibold ${syncStatus === 'Connected' ? 'text-green-500' : 'text-red-500'}`}>
            {syncStatus}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <Label className="text-gray-700 dark:text-gray-300 text-base">Last Sync</Label>
          <span className="text-gray-600 dark:text-gray-400">
            {lastSyncTime}
          </span>
        </div>
        {syncStatus !== 'Connected' && (
          <div className="flex justify-end">
            <Button
              onClick={handleReconnect}
              disabled={isReconnecting}
              className="bg-[#FF3B30] hover:bg-[#E6352B] text-white font-semibold py-2 px-6 rounded-lg"
            >
              {isReconnecting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Reconnecting...
                </>
              ) : (
                'Reconnect'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

