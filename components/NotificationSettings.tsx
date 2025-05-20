import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Bell, Mail, MessageSquare } from 'lucide-react'

export function NotificationSettings({
  notificationChannels,
  toggleNotificationChannel,
  lowStockAlert,
  setLowStockAlert,
  newSaleAlert,
  setNewSaleAlert,
  notificationEmail,
  setNotificationEmail,
  notificationPhone,
  setNotificationPhone,
}: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Notifications Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Customize your notification experience</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Notification Channels</h3>
        <div className="flex space-x-4">
          {['in-app', 'email', 'sms'].map((channel) => (
            <Button
              key={channel}
              variant="outline"
              className={`flex items-center ${
                notificationChannels.includes(channel)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => toggleNotificationChannel(channel)}
            >
              {channel === 'in-app' && <Bell className="mr-2 h-4 w-4" />}
              {channel === 'email' && <Mail className="mr-2 h-4 w-4" />}
              {channel === 'sms' && <MessageSquare className="mr-2 h-4 w-4" />}
              {channel.charAt(0).toUpperCase() + channel.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Alert Types</h3>
        <div className="flex justify-between items-center">
          <Label htmlFor="low-stock-alert" className="text-gray-700 dark:text-gray-300 text-base flex items-center">
            <span className="mr-2">Low Stock Alert</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">(Get notified when stock is low)</span>
          </Label>
          <Switch
            id="low-stock-alert"
            checked={lowStockAlert}
            onCheckedChange={setLowStockAlert}
          />
        </div>
        <div className="flex justify-between items-center">
          <Label htmlFor="new-sale-alert" className="text-gray-700 dark:text-gray-300 text-base flex items-center">
            <span className="mr-2">New Sale Alert</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">(Get notified for new sales)</span>
          </Label>
          <Switch
            id="new-sale-alert"
            checked={newSaleAlert}
            onCheckedChange={setNewSaleAlert}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="notification-email" className="text-gray-700 dark:text-gray-300 text-base">Email Address</Label>
            <Input
              id="notification-email"
              type="email"
              placeholder="Enter your email address"
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
              value={notificationEmail}
              onChange={(e) => setNotificationEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notification-phone" className="text-gray-700 dark:text-gray-300 text-base">Phone Number</Label>
            <Input
              id="notification-phone"
              type="tel"
              placeholder="Enter your phone number"
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
              value={notificationPhone}
              onChange={(e) => setNotificationPhone(e.target.value)}
            />
          </div>
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

