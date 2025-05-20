'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { createClient } from '@/utils/supabase/client'

interface InventorySettingsProps {
  storeId: string;
  lowStockThreshold: number;
  setLowStockThreshold: React.Dispatch<React.SetStateAction<number>>;
  hideLowStock: boolean;
  setHideLowStock: React.Dispatch<React.SetStateAction<boolean>>;
  defaultSorting: string;
  setDefaultSorting: React.Dispatch<React.SetStateAction<string>>;
}

export function InventorySettings({
  storeId,
  lowStockThreshold,
  setLowStockThreshold,
  hideLowStock,
  setHideLowStock,
  defaultSorting,
  setDefaultSorting,
}: InventorySettingsProps) {
  const supabase = createClient()
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const handleSaveChanges = async () => {
    // Validate numeric input
    const threshold = parseInt(lowStockThreshold.toString(), 10)
    if (isNaN(threshold) || threshold < 0) {
      setSaveMessage("Please enter a valid positive number for threshold")
      return
    }

    // Start a transaction to update both store and items
    const { data, error } = await supabase.rpc('update_store_threshold_and_items', {
      p_store_id: storeId,
      p_threshold: threshold,
      p_default_sorting: defaultSorting
    })
    console.log('here es my data', data, 'here is my error', error)
    if (error) {
      console.error("Error updating settings:", error)
      setSaveMessage("Error updating settings")
    } else {
      setSaveMessage("Settings and item statuses updated successfully!")
    }
    console.log("Settings saved:", {
      lowStockThreshold,
      hideLowStock,
      defaultSorting,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="lowStockThreshold">Low Stock Alert Threshold</Label>
          <Input 
            id="lowStockThreshold" 
            type="text" 
            pattern="[0-9]*"
            inputMode="numeric"
            placeholder="e.g., 5 units"
            className="max-w-xs mt-1"
            value={lowStockThreshold}
            onChange={(e) => {
              const value = e.target.value
              // Allow empty input or valid numbers
              if (value === '' || /^\d+$/.test(value)) {
                setLowStockThreshold(value === '' ? 0 : parseInt(value, 10))
              }
            }}
          />
        </div>
        
        {/* <div className="flex items-center space-x-2">
          <Switch 
            id="hideLowStock" 
            checked={hideLowStock}
            onCheckedChange={(checked) => setHideLowStock(checked)}
          />
          <Label htmlFor="hideLowStock">
            Hide Low Stock Items on Marketplace
          </Label>
        </div> */}
        
        <div>
          <Label htmlFor="defaultSorting">Default Inventory Sorting</Label>
          <Select onValueChange={setDefaultSorting} value={defaultSorting}>
            <SelectTrigger className="max-w-xs mt-1">
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

        <Button onClick={handleSaveChanges} className="w-full bg-[#FF3B30] hover:bg-[#E6352B] text-white">
          Save Changes
        </Button>
        {saveMessage && (
          <p className={`mt-2 text-sm ${saveMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
            {saveMessage}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
