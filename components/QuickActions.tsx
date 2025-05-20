import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, ShoppingCart, RotateCcw } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  return (
    <div>
      {/* <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader> */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="!pb-0 h-max border foreground">
          <CardContent className="p-0 !mb-0">
            <Link href="/inventory/add">
              <Button
                className="w-full h-24 flex flex-col items-center justify-center space-y-2 bg-card text-card-foreground shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 p-6 pt-0 flex flex-col items-center justify-center h-32"
              >
                <PlusCircle className="!h-8 !w-8 !text-[#dc2626]" />
                <span className="text-2xl font-semibold leading-none tracking-tight">
                  Add New Item
                </span>
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="!pb-0 h-max border foreground">
          <CardContent className="p-0 !mb-0">
            <Link href="/inventory">
              <Button
                className="w-full h-24 flex flex-col items-center justify-center space-y-2 bg-card text-card-foreground shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 p-6 pt-0 flex flex-col items-center justify-center h-32"
              >
                <ShoppingCart className="!h-8 !w-8 !text-[#dc2626]" />
                <span className="text-2xl font-semibold leading-none tracking-tight">
                  New Sale
                </span>
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="!pb-0 h-max border foreground">
          <CardContent className="p-0 !mb-0">
            <Link href="/pos">
              <Button
                className="w-full h-24 flex flex-col items-center justify-center space-y-2 bg-card text-card-foreground shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 p-6 pt-0 flex flex-col items-center justify-center h-32"
              >
                <RotateCcw className="!h-8 !w-8 !text-[#dc2626]" />
                <span className="text-2xl font-semibold leading-none tracking-tight">
                  Process Return
                </span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
