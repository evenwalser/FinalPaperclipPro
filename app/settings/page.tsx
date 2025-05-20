"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Mail, MessageSquare, RefreshCw, Upload } from "lucide-react";
import Image from "next/image";

import { StoreProfileSettings } from "./components/StoreProfileSettings";
import { InventorySettings } from "./components/InventorySettings";
import { POSSettings } from "./components/POSSettings";
import { NotificationSettings } from "./components/NotificationSettings";
import { IntegrationSettings } from "./components/IntegrationSettings";
import { createClient } from "@/utils/supabase/client";
import { getUser } from "@/lib/services/items";
import { EbayIntegrationSettings } from "./components/EbayIntegrationSettings";

interface Address {
  street: string;
  city: string;
  county: string;
  postcode: string;
}

const SettingsPage = (): any => {
  // Store Profile states
  // Store Profile states
  const [logo, setLogo] = useState<string | null>(null);
  const [user, setuser] = useState<any>(null);
  const [storefrontImage, setStorefrontImage] = useState<string | null>(null);
  const [postcode, setPostcode] = useState("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isManualEdit, setIsManualEdit] = useState(false);
  const [storeDetails, setStoreDetails] = useState({
    name: "",
    phone: "",
    email: "",
  });

  // Inventory states
  const [lowStockThreshold, setLowStockThreshold] = useState(0);
  const [hideLowStock, setHideLowStock] = useState(false);
  const [defaultSorting, setDefaultSorting] = useState("newest");
  const [storeId, setStoreId] = useState<string>("");

  // Notification states
  const [notificationChannels, setNotificationChannels] = useState<string[]>(
    []
  );
  const [lowStockAlert, setLowStockAlert] = useState(false);
  const [newSaleAlert, setNewSaleAlert] = useState(false);
  const [notificationEmail, setNotificationEmail] = useState("");
  const [notificationPhone, setNotificationPhone] = useState("");

  // Integration states
  const [syncStatus, setSyncStatus] = useState("Connected");
  const [lastSyncTime, setLastSyncTime] = useState("2 minutes ago");
  const [isReconnecting, setIsReconnecting] = useState(false);

  const supabase = createClient();

  // On mount, fetch the current low_stock_threshold setting from the database.
  // Fetch both low_stock_threshold and default_sorting settings on mount.
  useEffect(() => {
    const fetchStoreSettings = async () => {
      // Replace with your method for fetching the current user.
      const user = await getUser();
      setuser(user);
      const userId = user.id;

      const { data, error } = await supabase
        .from("stores")
        .select(
          "id, low_stock_threshold, default_sorting, store_name, contact_details"
        )
        .eq("owner_id", userId)
        .single();
      if (error) {
        console.error("Error fetching store settings:", error);
      } else if (data) {
        setStoreId(data.id);
        setLowStockThreshold(data.low_stock_threshold);
        setDefaultSorting(data.default_sorting);
        setStoreDetails({
          name: data.store_name || "",
          phone: data.contact_details?.phone || "",
          email: data.contact_details?.email || "",
        });
      }
    };

    fetchStoreSettings();
  }, [supabase]);

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: (value: string | null) => void
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostcodeLookup = async () => {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setAddresses([
      {
        street: "123 Main St",
        city: "London",
        county: "Greater London",
        postcode,
      },
      {
        street: "456 High St",
        city: "London",
        county: "Greater London",
        postcode,
      },
    ]);
  };

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    setIsManualEdit(false);
  };

  const toggleNotificationChannel = (channel: string) => {
    setNotificationChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((ch) => ch !== channel)
        : [...prev, channel]
    );
  };

  const handleReconnect = () => {
    setIsReconnecting(true);
    // Simulating reconnection process
    setTimeout(() => {
      setSyncStatus("Connected");
      setLastSyncTime("Just now");
      setIsReconnecting(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Settings
      </h1>
      <Tabs defaultValue="store-profile" className="w-full space-y-6">
        <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-[8px] overflow-hidden">
          <CardHeader className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <TabsList className="w-full justify-start bg-transparent p-0 space-x-2">
              <TabsTrigger
                value="store-profile"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 rounded-t-[8px]"
              >
                Store Profile
              </TabsTrigger>
              <TabsTrigger
                value="inventory"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 rounded-t-[8px]"
              >
                Inventory
              </TabsTrigger>
              <TabsTrigger
                value="pos"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 rounded-t-[8px]"
              >
                POS
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 rounded-t-[8px]"
              >
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="Shopify"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 rounded-t-[8px]"
              >
                Shopify
              </TabsTrigger>
              <TabsTrigger
                value="eBay"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 rounded-t-[8px]"
              >
                eBay
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent className="p-6">
            <TabsContent value="store-profile">
              <StoreProfileSettings
              // logo={logo}
              // storefrontImage={storefrontImage}
              // setLogo={setLogo}
              // setStorefrontImage={setStorefrontImage}
              // postcode={postcode}
              // setPostcode={setPostcode}
              // addresses={addresses}
              // setAddresses={setAddresses}
              // selectedAddress={selectedAddress}
              // setSelectedAddress={setSelectedAddress}
              // isManualEdit={isManualEdit}
              // setIsManualEdit={setIsManualEdit}
              // storeDetails={storeDetails}
              // setStoreDetails={setStoreDetails}
              // handlePostcodeLookup={handlePostcodeLookup}
              // handleAddressSelect={handleAddressSelect}
              />
            </TabsContent>
            <TabsContent value="inventory">
              <InventorySettings
                storeId={storeId}
                lowStockThreshold={lowStockThreshold}
                setLowStockThreshold={setLowStockThreshold}
                hideLowStock={hideLowStock}
                setHideLowStock={setHideLowStock}
                defaultSorting={defaultSorting}
                setDefaultSorting={setDefaultSorting}
              />
            </TabsContent>
            <TabsContent value="pos">
              <POSSettings />
            </TabsContent>
            <TabsContent value="notifications">
              <NotificationSettings
              // notificationChannels={notificationChannels}
              // toggleNotificationChannel={toggleNotificationChannel}
              // lowStockAlert={lowStockAlert}
              // setLowStockAlert={setLowStockAlert}
              // newSaleAlert={newSaleAlert}
              // setNewSaleAlert={setNewSaleAlert}
              // notificationEmail={notificationEmail}
              // setNotificationEmail={setNotificationEmail}
              // notificationPhone={notificationPhone}
              // setNotificationPhone={setNotificationPhone}
              />
            </TabsContent>
            <TabsContent value="Shopify">
              <IntegrationSettings
              // syncStatus={syncStatus}
              // lastSyncTime={lastSyncTime}
              // isReconnecting={isReconnecting}
              // handleReconnect={handleReconnect}
              />
            </TabsContent>
            <TabsContent value="eBay">
              <EbayIntegrationSettings />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
