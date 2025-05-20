import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export function InventorySettings({
  lowStockThreshold,
  setLowStockThreshold,
  hideLowStock,
  setHideLowStock,
  defaultSorting,
  setDefaultSorting,
}: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Inventory Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Manage your inventory preferences</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-gray-700 dark:text-gray-300" htmlFor="lowStockThreshold">Low Stock Alert Threshold</Label>
          <Input 
            id="lowStockThreshold" 
            type="number" 
            placeholder="e.g., 5 units"
            className="max-w-xs mt-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
            value={lowStockThreshold}
            onChange={(e) => setLowStockThreshold(parseInt(e.target.value))}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="hideLowStock" 
            checked={hideLowStock}
            onCheckedChange={setHideLowStock}
          />
          <Label htmlFor="hideLowStock" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Hide Low Stock Items on Marketplace
          </Label>
        </div>
        
        <div>
          <Label className="text-gray-700 dark:text-gray-300" htmlFor="defaultSorting">Default Inventory Sorting</Label>
          <Select onValueChange={setDefaultSorting} value={defaultSorting}>
            <SelectTrigger className="max-w-xs mt-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Select default sorting" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="lowStock">Low Stock First</SelectItem>
              <SelectItem value="highStock">High Stock First</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="bg-[#FF3B30] hover:bg-[#E6352B] text-white font-semibold py-2 px-6 rounded-lg">
          Save Changes
        </Button>
      </div>
    </div>
  )
}

