'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from "@/utils/supabase/client"
import { useUser } from '../contexts/UserContext'
import { NotificationItem } from './components/NotificationItem'
import { ReplyDialog } from './components/ReplyDialog'
import { OfferActionDialog } from './components/OfferActionDialog'
import { Notification } from './types'

export default function NotificationsPage() {
  const supabase = createClient()
  const [notificationList, setNotificationList] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [activeNotification, setActiveNotification] = useState<Notification | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [counterOffer, setCounterOffer] = useState('')
  const { user, refreshUser } = useUser();
  const userStoreId = user?.store_id
  console.log("🚀 ~ NotificationsPage ~ userStoreId:", userStoreId)

  useEffect(() => {
    fetchNotifications()
    subscribeToNotifications()
  }, [user, userStoreId])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('store_id', userStoreId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      if (error) throw error
      setNotificationList(data || [])
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const subscribeToNotifications = () => {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotificationList(prev => [payload.new as Notification, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setNotificationList(prev => 
              prev.map(notification => 
                notification.id === payload.new.id ? payload.new as Notification : notification
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setNotificationList(prev => 
              prev.filter(notification => notification.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const markAsRead = async (notificationId: string, isRead: boolean) => {
    try {
      const timestamp = new Date().toISOString()
      
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ 
          read: isRead,
          updated_at: timestamp
        })
        .eq('id', notificationId)

      if (updateError) throw updateError

      setNotificationList(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: isRead }
            : notification
        )
      )
    } catch (error) {
      console.error('Error updating notification:', error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const timestamp = new Date().toISOString()
      
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ 
          deleted_at: timestamp,
          updated_at: timestamp
        })
        .eq('id', notificationId)

      if (updateError) throw updateError

      setNotificationList(prev => 
        prev.filter(n => n.id !== notificationId)
      )
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const handleAction = (action: string, notification: Notification) => {
    setActiveModal(action)
    setActiveNotification(notification)
  }

  const handleReply = async () => {
    console.log('Sending reply:', replyContent)
    setNotificationList(prev => prev.map(n => 
      n.id === activeNotification?.id ? { ...n, read: true } : n
    ))
    setActiveModal(null)
    setReplyContent('')
  }

  const handleOfferAction = async (action: 'accept' | 'counter' | 'decline') => {
    console.log('Offer action:', action, counterOffer)
    setNotificationList(prev => prev.map(n => 
      n.id === activeNotification?.id ? { ...n, read: true } : n
    ))
    setActiveModal(null)
    setCounterOffer('')
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
      <Link href="/" passHref>
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to Dashboard
        </Button>
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Notifications</h1>
      
      <Card className="overflow-hidden border-0 shadow-lg bg-[#0a0a0a]">
        <CardHeader className="border-b bg-gray-50 dark:bg-gray-800/50">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Inbox</CardTitle>
            <div className="text-sm text-gray-500">
              {notificationList.filter(n => !n.read).length} unread
            </div>
          </div>
        </CardHeader>
        {
          notificationList.length === 0 && !loading ? (
            <CardContent className="p-0 text-center py-20">
              No notifications available.
              </CardContent>
          ) : null
        }
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <AnimatePresence>
              {notificationList.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                  onAction={handleAction}
                />
              ))}
            </AnimatePresence>
          </ScrollArea>
        </CardContent>
      </Card>

      <ReplyDialog
        open={activeModal === 'reply'}
        onOpenChange={(open) => !open && setActiveModal(null)}
        notification={activeNotification}
        replyContent={replyContent}
        setReplyContent={setReplyContent}
        onReply={handleReply}
      />

      <OfferActionDialog
        open={activeModal?.includes('offer')}
        onOpenChange={(open) => !open && setActiveModal(null)}
        notification={activeNotification}
        activeModal={activeModal}
        counterOffer={counterOffer}
        setCounterOffer={setCounterOffer}
        onOfferAction={handleOfferAction}
      />
    </div>
  )
}