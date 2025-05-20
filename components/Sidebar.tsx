"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Package,
  PoundSterling,
  Bell,
  Settings,
  LogOut,
  Link as LinkIcon,
} from "lucide-react";
import Image from "next/image";
import { logout } from "@/app/login/actions";
import { generateLinkingToken } from "@/app/marketplace/actions";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useRoleContext } from "@/app/contexts/RoleContext";
import { useUser } from "@/app/contexts/UserContext";

const NotificationBadge = ({ count }: { count: number }) => {
  if (count === 0) return null;
  return (
    <div className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
      {count > 99 ? "99+" : count}
    </div>
  );
};

export function Sidebar() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const { role, isLoading } = useRoleContext();
  console.log("🚀 ~ Sidebar ~ role:", role)
  const { user, refreshUser } = useUser();
  const userStoreId = user?.store_id;
  const [isLinking, setIsLinking] = useState(false);

  useEffect(() => {
    fetchUnreadCount();

    const channel = supabase
      .channel("notification-changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "notifications" },
        () => fetchUnreadCount()
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        () => fetchUnreadCount()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("store_id", userStoreId)
        .eq("read", false)
        .is("deleted_at", null);
      if (error) throw error;
      setUnreadCount(count || 0);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const allSidebarItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      roles: ["store_owner", "user"],
    },
    {
      name: "Inventory",
      href: "/inventory",
      icon: Package,
      roles: ["store_owner", "sales_associate", "user"],
    },
    {
      name: "POS",
      href: "/pos",
      icon: PoundSterling,
      roles: ["store_owner", "sales_associate", "user"],
    },
    {
      name: "Notifications",
      href: "/notifications",
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : null,
      roles: ["store_owner", "user"],
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      roles: ["admin", "store_owner", "user"],
    },
  ];

  const handleItemClick = (
    e: React.MouseEvent,
    item: (typeof allSidebarItems)[0]
  ) => {
    if (role === "sales_associate" && !item.roles.includes("sales_associate")) {
      e.preventDefault();
      toast.error("You don't have permission to access this feature");
    }
  };

  const handleLinkMarketplace = async () => {
    try {
      setIsLinking(true);
      const { deepLinkUrl } = await generateLinkingToken();
      
      // Open the deep link URL directly
      window.location.href = deepLinkUrl;
      
      // Show a message in case the app doesn't open
      setTimeout(() => {
        toast.info("If the app didn't open, please make sure you have the Paperclip Marketplace app installed on your device.");
      }, 2000);
    } catch (error) {
      console.error("Error generating linking token:", error);
      toast.error("Failed to generate linking URL");
    } finally {
      setIsLinking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-gray-900 w-64 border-r border-gray-200 dark:border-gray-800">
        <div className="p-4 flex items-center justify-center border-b border-gray-200 dark:border-gray-800">
          <img
            src="https://icravvnxexuvxoehhfsa.supabase.co/storage/v1/object/public/store-images//paperclip_logo_red.png"
            alt="Paperclip Logo"
            width={200}
            height={67}
            className="filter-none"
          />
        </div>
        <div className="p-4 space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 w-64 border-r border-gray-200 dark:border-gray-800">
      <div className="p-4 flex items-center justify-center border-b border-gray-200 dark:border-gray-800">
        <img
          src="https://icravvnxexuvxoehhfsa.supabase.co/storage/v1/object/public/store-images//paperclip_logo_red.png"
          alt="Paperclip Logo"
          width={200}
          height={67}
          className="filter-none"
        />
      </div>
      <ScrollArea className="flex-1">
        <nav className="space-y-2 p-4">
          {allSidebarItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={(e) => handleItemClick(e, item)}
              className={cn(
                role === "sales_associate" &&
                  !item.roles.includes("sales_associate") &&
                  "opacity-50 cursor-not-allowed"
              )}
            >
              <Button
                variant="ghost"
                // disabled={
                //   role === "sales_associate" &&
                //   !item.roles.includes("sales_associate")
                // }
                className={cn(
                  "w-full justify-start rounded-[8px] relative",
                  pathname === item.href
                    ? "bg-gray-100 dark:bg-gray-800 text-[#dc2626]"
                    : "hover:bg-gray-800 hover:text-[#fff]",
                  role === "sales_associate" &&
                    !item.roles.includes("sales_associate") &&
                    "opacity-50 cursor-not-allowed"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
                {item.badge && <NotificationBadge count={item.badge} />}
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-4 border-t border-gray-800">
        <form action={logout}>
          <Button
            variant="ghost"
            className="w-full justify-start rounded-[8px] text-[#dc2626] hover:bg-[#7f1d1d] hover:text-[#fff]"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </form>
      </div>
    </div>
  );
}
