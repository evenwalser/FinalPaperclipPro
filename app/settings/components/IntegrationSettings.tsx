"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import shopifyLogo from "../../../public/shopify_logo.png";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

export function IntegrationSettings() {
  const [syncStatus, setSyncStatus] = useState("Loading...");
  const [storeId, setStoreId] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string>("Never");
  const [isConnected, setIsConnected] = useState(false);
  const supabase = createClient();
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch("/api/shopify/integration-status");
        if (!response.ok) {
          throw new Error("Failed to fetch status");
        }
        const data = await response.json();
        setIsConnected(data.connected);
        setSyncStatus(data.connected ? "Connected" : "Disconnected");
        setLastSyncTime(
          data.lastSyncTime
            ? new Date(data.lastSyncTime).toLocaleString()
            : "Never"
        );
      } catch (error: unknown) {
        console.error("Error fetching integration status:", error);
        setSyncStatus("Error");
        setLastSyncTime("Unknown");
      }
    };
    fetchStatus();
  }, []);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("Not signed in");
        return;
      }
      // pull *exactly one* store for this user:
      const { data: store, error: storeError } = await supabase
        .from("stores")
        .select("id")
        .eq("owner_id", user.id)
        .single();

      if (storeError || !store) {
        console.error("No store found for user:", storeError);
        return;
      }
      setStoreId(store.id);
    })();
  }, []);

  const handleConnect = () => {
    const shop = prompt("Enter your shop name (e.g., your-shop.myshopify.com)");
    if (!shop) return;
    if (!storeId) {
      alert("Could not determine your store ID—please refresh and try again.");
      return;
    }
    

    const params = new URLSearchParams({ shop, store_id: storeId });
    window.location.href = `/api/shopify/auth?${params.toString()}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integration Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Image
            src={shopifyLogo}
            alt="shopify Logo"
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
              <Button onClick={handleConnect}>Connect to Shopify</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
