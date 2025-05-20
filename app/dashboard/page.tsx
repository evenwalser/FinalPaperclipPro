"use client";

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { createClient } from "@/utils/supabase/client";
import { DateRange } from "react-day-picker";
import { getUserData } from "@/utils/supabase/actions";
import { CategorySelectorV2 } from "@/components/CategorySelectorV2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/Overview";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { Package, PoundSterling, Users, Activity } from "lucide-react";
import { addDays, set } from "date-fns";
import { TopSellingItems } from "@/components/TopSellingItems";
import { CategoryInsights } from "@/components/CategoryInsights";
import { CategoryStats, getCategoryStats } from "@/lib/services/categoryStats";
import { QuickActions } from "@/components/QuickActions";
import { getRecentSales, RecentSale } from "@/lib/services/recentSales";
import { RecentSales } from "@/components/RecentSales";
import { useUser } from "../contexts/UserContext";


interface OverviewProps {
  currency: string;
  categoryId?: string;
  dateRange?: DateRange;
}

type DashboardMetrics = {
  inventory: {
    total_items: number;
    total_value: number;
    low_stock_items: number;
    out_of_stock_items: number;
  };
  revenue: {
    total_revenue: number;
    total_sales: number;
    average_sale_amount: number;
    cash_sales_amount: number;
    card_sales_amount: number;
    completed_sales: number;
    pending_sales: number;
  };
  customers: {
    total_customers: number;
    active_customers: number;
    new_customers: number;
    returning_customers: number;
    average_purchase_value: number;
    total_customer_spent: number;
    top_spending_customers: any[];
  };
  monthly_sales: {
    month: number;
    month_name: string;
    total_sales: number;
    year: number;
  }[];
}

export default function DashboardPage() {
  const supabase = createClient();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)), // Last 30 days
    to: new Date(),
  });
  const [recentSales, setRecentSales] = useState<RecentSale[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [stats, setStats] = useState<CategoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [storeId, setStoreId] = useState<number | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  const handleSignIn = () => {
    signIn("google", { prompt: "select_account" });
  };
  const { user, refreshUser } = useUser();
  console.log("🚀 ~ DashboardPage ~ user:", user)

  useEffect(() => {
    async function fetchUserStore() {
      try {
        setStoreId(user?.store_id);
        console.log("User store ID:", user);
      } catch (error) {
        console.error("Failed to fetch user store:", error);
        setError("Failed to load store information");
      }
    }

    fetchUserStore();
  }, [session, user]);

  useEffect(() => {
    async function fetchRecentSales() {
      console.log("here is store id ", storeId);
      if (!storeId) return;

      try {
        const sales = await getRecentSales(date, storeId);
        setRecentSales(sales);
      } catch (error) {
        console.error("Failed to fetch recent sales:", error);
      }
    }

    fetchRecentSales();
  }, [date, storeId]);

  useEffect(() => {
    async function fetchDashboardMetrics() {
      if (!storeId) return;
      setLoading(true);

      try {
        const [inventoryData, revenueData, customerData, monthlySalesData] = await Promise.all([
          supabase.rpc('get_total_inventory', { 
            store_id_param: storeId,
            start_date: date?.from?.toISOString() || null,
            end_date: date?.to?.toISOString() || null
          }),
          supabase.rpc('get_total_revenue', { 
            store_id_param: storeId,
            start_date: date?.from?.toISOString() || null,
            end_date: date?.to?.toISOString() || null
          }),
          supabase.rpc('get_active_customers', { 
            store_id_param: storeId,
            start_date: date?.from?.toISOString() || null,
            end_date: date?.to?.toISOString() || null
          }),
          supabase.rpc('get_monthly_sales', { 
            store_id_param: storeId,
            start_date: date?.from?.toISOString() || null,
            end_date: date?.to?.toISOString() || null
          })
        ]);

        if (inventoryData.error) throw inventoryData.error;
        if (revenueData.error) throw revenueData.error;
        if (customerData.error) throw customerData.error;
        if (monthlySalesData.error) throw monthlySalesData.error;

        setMetrics({
          inventory: inventoryData.data[0],
          revenue: revenueData.data[0],
          customers: customerData.data[0],
          monthly_sales: monthlySalesData.data
        });

      } catch (error) {
        console.error("Error fetching metrics:", error);
        setError("Failed to load dashboard metrics");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardMetrics();
  }, [storeId, date, supabase]);

  // useEffect(() => {
  //   async function fetchStats() {
  //     try {
  //       setLoading(true);
  //       const stats = await getCategoryStats(selectedCategory, date);
  //       console.log(stats);
  //       setStats(stats);
  //     } catch (error) {
  //       console.error("Failed to fetch stats:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchStats();
  // }, [selectedCategory, date]);

  const setDateHandler = (data: DateRange | undefined) => {
    setDate(data);
  };
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex-1 space-y-8 px-4 py-8">
       {/* {session ? (
        <>
          <p>Welcome!</p>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      ) : (
        <button onClick={() => signIn("google")}>Sign in with Google</button>
      )}  */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1"></div>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-4">
          <CalendarDateRangePicker date={date} onDateChange={setDate} />
        </div>
      </div>

      {/* Quick Actions */}

      {/* Category Selector - Now using V2 */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Select Category</CardTitle>
        </CardHeader>
        <CardContent>
          <CategorySelectorV2
            onSelect={handleCategoryChange}
            selectedCategory={selectedCategory}
          />
        </CardContent>
      </Card> */}

      {/* Category Performance Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border foreground ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <PoundSterling className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              £{metrics?.revenue?.total_revenue.toLocaleString() ?? "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.revenue?.total_sales ?? 0} total sales
            </p>
          </CardContent>
        </Card>

        <Card className="border foreground ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.inventory?.total_items.toLocaleString() ?? "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.inventory?.low_stock_items ?? 0} items low in stock
            </p>
          </CardContent>
        </Card>

        <Card className="border foreground ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.customers?.active_customers.toLocaleString() ?? "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.customers?.new_customers ?? 0} new this month
            </p>
          </CardContent>
        </Card>

        {/* <Card className="border foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales Velocity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              £{metrics?.revenue?.average_sale_amount.toFixed(2) ?? "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              Average sale amount
            </p>
          </CardContent>
        </Card> */}
      </div>

      {/* Category Analytics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border foreground">
          <CardHeader>
            <CardTitle>Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview
              currency="£"
              storeId={storeId ?? undefined}
              dateRange={date}
            />
          </CardContent>
        </Card>

        {recentSales && (
          <Card className="col-span-3 border foreground">
            <CardHeader>
              <CardTitle className="text-2xl">Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentSales data={recentSales} />
            </CardContent>
          </Card>
        )}
        {/* <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Selling Items</CardTitle>
          </CardHeader>
          <CardContent>
            <TopSellingItems categoryId={selectedCategory} dateRange={date} />
          </CardContent>
        </Card> */}
      </div>

      <QuickActions />
    </div>
  );
}

// export function DashboardRouter() {
//   const { role, storeId } = useProfile();

//   if (!role) return <LoadingScreen />;

//   return (
//     <>
//       {role === 'user' && <OnboardingScreen />}
//       {role === 'store_owner' && <StoreDashboard storeId={storeId} />}
//       {role === 'sales_associate' && <AssociateDashboard storeId={storeId} />}
//     </>
//   );
// }
