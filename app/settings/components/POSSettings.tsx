'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Upload, CreditCard, Banknote } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/utils/supabase/client"
import { getUser } from "@/lib/services/items"
import { toast } from "sonner"

export function POSSettings() {
  const [acceptCash, setAcceptCash] = useState(true)
  const [acceptCard, setAcceptCard] = useState(true)
  const [receiptLogo, setReceiptLogo] = useState<string>('')
  const [receiptMessage, setReceiptMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchPOSSettings = async () => {
      try {
        const user = await getUser()
        setUser(user)
        const { data, error } = await supabase
          .from('stores')
          .select('accept_cash, accept_card, receipt_logo, receipt_message')
          .eq('owner_id', user.id)
          .single()

        if (error) throw error

        if (data) {
          setAcceptCash(data.accept_cash ?? true)
          setAcceptCard(data.accept_card ?? true)
          setReceiptLogo(data.receipt_logo || '')
          setReceiptMessage(data.receipt_message || 'Thank you for shopping with us!')
        }
      } catch (error) {
        console.error('Error fetching POS settings:', error)
        toast.error('Failed to load POS settings')
      }
    }

    fetchPOSSettings()
  }, [supabase])

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Delete previous image if exists
    let pathToDelete = "";
    if (receiptLogo) {
      try {
        // Extract path from URL
        const urlParts = receiptLogo.split("/");
        const bucket = urlParts[3];
        const fileName = urlParts.slice(4).join("/");
        pathToDelete = fileName;
      } catch (error) {
        console.error("Error parsing image URL:", error);
      }
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/receipt-logo-${Date.now()}.${fileExt}`;

    try {
      if (pathToDelete) {
        const { error: deleteError } = await supabase.storage
          .from("store-images")
          .remove([pathToDelete]);

        if (deleteError) throw deleteError;
      }

      const { error: uploadError } = await supabase.storage
        .from("store-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("store-images").getPublicUrl(fileName);

      setReceiptLogo(publicUrl);

      // Update the store record with the new receipt logo URL
      const { error: updateError } = await supabase
        .from('stores')
        .update({ receipt_logo: publicUrl })
        .eq('owner_id', user.id);

      if (updateError) throw updateError;

      toast.success("Receipt logo uploaded successfully");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed", {
        description: error instanceof Error ? error.message : "Could not upload image",
      });
    }
  };

  const handleSaveChanges = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('stores')
        .update({
          accept_cash: acceptCash,
          accept_card: acceptCard,
          receipt_logo: receiptLogo,
          receipt_message: receiptMessage
        })
        .eq('owner_id', user.id)

      if (error) throw error
      toast.success('POS settings updated successfully')
    } catch (error) {
      console.error('Error saving POS settings:', error)
      toast.error('Failed to save POS settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Main Content Card - Adding the outer border and padding */}
      <Card className="rounded-xl border border-gray-200 dark:border-gray-800 bg-card">
        <CardHeader>
          <CardTitle>POS Settings</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Payment Methods Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base font-medium">Payment Methods</Label>
              <p className="text-sm text-muted-foreground">
                Choose which payment methods you want to accept at your point of sale
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm">
                    <Banknote className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="cash-toggle" className="text-base font-medium">Cash Payments</Label>
                    <p className="text-sm text-muted-foreground">Accept physical cash at POS</p>
                  </div>
                </div>
                <Switch
                  id="cash-toggle"
                  checked={acceptCash}
                  onCheckedChange={setAcceptCash}
                  className="data-[state=checked]:bg-[#34C759]"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm">
                    <CreditCard className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="card-toggle" className="text-base font-medium">Card Payments</Label>
                    <p className="text-sm text-muted-foreground">Accept card payments at POS</p>
                  </div>
                </div>
                <Switch
                  id="card-toggle"
                  checked={acceptCard}
                  onCheckedChange={setAcceptCard}
                  className="data-[state=checked]:bg-[#34C759]"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Receipt Customization Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold tracking-tight">Receipt Customization</h3>
              <p className="text-sm text-muted-foreground">
                Customize how your receipts look to customers
              </p>
            </div>
            
            <div className="space-y-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="receipt-logo-upload" className="text-base font-medium">Receipt Logo</Label>
                  <div className="mt-2 flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Label
                        htmlFor="receipt-logo-upload"
                        className="cursor-pointer inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors border border-gray-200 dark:border-gray-700 shadow-sm"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Choose file
                      </Label>
                      <Input
                        id="receipt-logo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="h-20 w-40 bg-white dark:bg-gray-800 rounded-md flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700">
                        {receiptLogo ? (
                          <img src={receiptLogo} alt="Receipt Logo" className="max-h-full max-w-full object-contain" />
                        ) : (
                          <span className="text-sm text-muted-foreground">Logo Preview</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receipt-message" className="text-base font-medium">Receipt Message</Label>
                  <p className="text-sm text-muted-foreground">
                    Add a custom message that will appear at the bottom of receipts
                  </p>
                  <Textarea
                    id="receipt-message"
                    placeholder="Thank you for shopping with us!"
                    value={receiptMessage}
                    onChange={(e) => setReceiptMessage(e.target.value)}
                    className="min-h-[100px] resize-none bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                </div>
              </div>
            </div>
          </div>

          <Button 
            className="w-full bg-[#FF3B30] hover:bg-[#E6352B] text-white font-medium"
            onClick={handleSaveChanges}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 