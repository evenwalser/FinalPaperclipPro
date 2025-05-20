'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Image from 'next/image'

export function IntegrationSettings() {
  const [syncStatus, setSyncStatus] = useState('Loading...')
  const [lastSyncTime, setLastSyncTime] = useState<string>('Never')
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/shopify/integration-status')
        if (!response.ok) {
          throw new Error('Failed to fetch status')
        }
        const data = await response.json()
        setIsConnected(data.connected)
        setSyncStatus(data.connected ? 'Connected' : 'Disconnected')
        setLastSyncTime(data.lastSyncTime ? new Date(data.lastSyncTime).toLocaleString() : 'Never')
      } catch (error: unknown) {
        console.error('Error fetching integration status:', error)
        setSyncStatus('Error')
        setLastSyncTime('Unknown')
      }
    }
    fetchStatus()
  }, [])

  const handleConnect = () => {
    const shop = prompt('Enter your shop name (e.g., your-shop.myshopify.com)')
    if (shop) {
      window.location.href = `/api/shopify/auth?shop=${shop}`
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integration Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Image
            src="https://media-hosting.imagekit.io/3ee77e1121934ae1/e6606031b2ba7efa33a8657f629ec1eb.png?Expires=1837692607&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=oalvOfzURD2f3caEmxS2DNNlLINuUxhSzjLo6z~pAAmT6LZ7~cFlDT1rTDllNHx7IzPMsrJYa~OXdSAyCT8w9hISTtmhLKDPDVWJfLvllEl2NIrngZqWW8u5TYHhNGc6Y6Mo8XggZY6Iw1ILNQIL4WIYyBwv1tkPxAS2vdVW12~b-GvL82nsDuQ8vMa5E4eOJtJwmjFW9tP08-BGpnkY4p4bOTdYZzWRPm3fekYYaYQBczeCqwC0-E8xjPmCZMexAljdNBUrl8IL8gLbDpLFUfD3Q9rXWd6-sEnbmix7AnvtkGnC6GQ3QQLko6LfkzH3nrSAO97GYCJ0S~Qn7EzfXw__"
            alt="Paperclip Logo"
            width={200}
            height={40}
            className="mb-4"
            priority
          />
          <p className="text-center text-sm text-muted-foreground">
            Your inventory is automatically synced with the Shopify Marketplace.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-base">Shopify Marketplace Sync Status</Label>
            <span className={`font-semibold ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
              {syncStatus}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <Label className="text-base">Last Sync</Label>
            <span className="text-muted-foreground">
              {lastSyncTime}
            </span>
          </div>
          {!isConnected && (
            <div className="flex justify-end">
              <Button onClick={handleConnect}>
                Connect to Shopify
              </Button>
            </div>
          )}
        </div>  
      </CardContent>
    </Card>
  )
}