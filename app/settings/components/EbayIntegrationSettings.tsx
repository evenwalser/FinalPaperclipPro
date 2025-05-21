import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import eBayLogo from "../../../public/ebay_logo.png";
import { useEffect, useState } from "react";

export function EbayIntegrationSettings() {
  const [syncStatus, setSyncStatus] = useState("Loading...");
  const [lastSyncTime, setLastSyncTime] = useState("Never");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch("/api/ebay/integration-status");
        if (!response.ok) throw new Error("Failed to fetch status");
        const data = await response.json();
        setIsConnected(data.connected);
        setSyncStatus(data.connected ? "Connected" : "Disconnected");
        setLastSyncTime(
          data.lastSyncTime
            ? new Date(data.lastSyncTime).toLocaleString()
            : "Never"
        );
      } catch (error) {
        console.error("Error fetching eBay integration status:", error);
        setSyncStatus("Error");
        setLastSyncTime("Unknown");
      }
    };
    fetchStatus();
  }, []);

  const handleConnect = () => {
    window.location.href = "/api/ebay/auth";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>eBay Integration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Image
            src={eBayLogo}
            alt="Paperclip Logo"
            width={200}
            height={40}
            className="mb-4"
            priority
          />
        </div>
        <div className="flex justify-between items-center">
          <Label className="text-base">eBay Sync Status</Label>
          <span
            className={`font-semibold ${
              isConnected ? "text-green-500" : "text-red-500"
            }`}
          >
            {syncStatus}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <Label className="text-base">Last Sync</Label>
          <span className="text-muted-foreground">{lastSyncTime}</span>
        </div>
        {!isConnected && (
          <div className="flex justify-end">
            <Button onClick={handleConnect}>Connect to eBay</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
