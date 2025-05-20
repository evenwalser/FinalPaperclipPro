'use client'

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Mail, MessageSquare } from 'lucide-react';
import { createClient } from "@/utils/supabase/client";
import { useUser } from '@/app/contexts/UserContext';

export function NotificationSettings() {
  const supabase = createClient();
  const { user, refreshUser } = useUser();
  const [notificationChannels, setNotificationChannels] = useState<string[]>(['in-app']);
  const [lowStockAlert, setLowStockAlert] = useState(true);
  const [newSaleAlert, setNewSaleAlert] = useState(true);
  const [notificationEmail, setNotificationEmail] = useState('');
  const [notificationPhone, setNotificationPhone] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setNotificationChannels(data.notification_channels || ['in-app']);
        setLowStockAlert(data.low_stock_alert ?? true);
        setNewSaleAlert(data.new_sale_alert ?? true);
        setNotificationEmail(data.notification_email || '');
        setNotificationPhone(data.notification_phone || '');
      }
    };

    fetchSettings();
  }, [user]);

  const toggleNotificationChannel = (channel: string) => {
    setNotificationChannels(current =>
      current.includes(channel)
        ? current.filter(c => c !== channel)
        : [...current, channel]
    );
  };

  const validatePhoneNumber = (phone: string) => {
    return /^\+[1-9]\d{1,14}$/.test(phone);
  };

  const handleSave = async () => {
    if (!user) return;

    // Validate SMS settings
    if (notificationChannels.includes('sms')) {
      if (!notificationPhone) {
        setMessage('Phone number is required for SMS notifications');
        setMessageType('error');
        return;
      }
      if (!validatePhoneNumber(notificationPhone)) {
        setMessage('Phone number must be in E.164 format (e.g., +1234567890)');
        setMessageType('error');
        return;
      }
    }

    const { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: user.id,
        notification_email: notificationEmail,
        notification_phone: notificationPhone,
        notification_channels: notificationChannels,
        low_stock_alert: lowStockAlert,
        new_sale_alert: newSaleAlert,
      });

    if (error) {
      setMessage('Failed to save settings');
      setMessageType('error');
      console.error('Error saving settings:', error);
    } else {
      setMessage('Settings saved successfully');
      setMessageType('success');
    }

    setTimeout(() => {
      setMessage('');
      setMessageType(null);
    }, 3000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
        <h3 className="text-lg font-semibold">Notification Channels</h3>
          <div className="flex flex-wrap gap-2">
            {['in-app', 'email', 'sms'].map((channel) => (
              <Button
                key={channel}
                variant="outline"
                className={`flex items-center gap-2 ${
                  notificationChannels.includes(channel)
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => toggleNotificationChannel(channel)}
              >
                {channel === 'in-app' && <Bell className="h-4 w-4" />}
                {channel === 'email' && <Mail className="h-4 w-4" />}
                {channel === 'sms' && <MessageSquare className="h-4 w-4" />}
                {channel.charAt(0).toUpperCase() + channel.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Alert Types</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="low-stock-alert">
                Low Stock Alert
                <span className="block text-sm text-gray-500">Get notified when stock is low</span>
              </Label>
              <Switch
                id="low-stock-alert"
                checked={lowStockAlert}
                onCheckedChange={setLowStockAlert}
              />
            </div>
            <div className="flex justify-between items-center">
              <Label htmlFor="new-sale-alert">
                New Sale Alert
                <span className="block text-sm text-gray-500">Get notified for new sales</span>
              </Label>
              <Switch
                id="new-sale-alert"
                checked={newSaleAlert}
                onCheckedChange={setNewSaleAlert}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="notification-email">Email Address</Label>
              <Input
                id="notification-email"
                type="email"
                placeholder="Enter your email address"
                value={notificationEmail}
                onChange={(e) => setNotificationEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="notification-phone">Phone Number</Label>
              <Input
                id="notification-phone"
                type="tel"
                placeholder="Enter your phone number"
                value={notificationPhone}
                onChange={(e) => setNotificationPhone(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Button
          onClick={handleSave}
          className="w-full bg-[#FF3B30] hover:bg-[#E6352B] text-white"
        >
          Save Changes
        </Button>

        {/* Display the success or error message */}
        {message && (
          <div
            className={`mt-4 p-2 rounded ${
              messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}
      </CardContent>
    </Card>
  );
}