import { motion } from 'framer-motion'
import { Clock, CheckCircle2, XCircle, CornerUpRight } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from "@/lib/utils"

import { NotificationIcon } from './NotificationIcon'
import { NotificationBadge } from './NotificationBadge'
import { UnreadIndicator } from './UnreadIndicator'
import { NotificationActions } from './NotificationActions'
import { Button } from "@/components/ui/button"
import { Notification } from '../types'

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: string, isRead: boolean) => void
  onDelete: (id: string) => void
  onAction: (action: string, notification: Notification) => void
}

export function NotificationItem({ notification, onMarkAsRead, onDelete, onAction }: NotificationItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        'relative border-b border-gray-100 dark:border-gray-800',
        'hover:bg-gray-50 dark:hover:bg-gray-800/50',
        'transition-colors duration-200',
        !notification.read && 'bg-blue-50/50 dark:bg-blue-900/10'
      )}
    >
      {!notification.read && <UnreadIndicator />}
      <div className="p-4 flex items-start gap-4 pl-6">
        <div className="flex-shrink-0 pt-1">
          <div className="w-[26px] h-[26px] rounded-full bg-[#5a9300] flex items-center justify-center">
            <NotificationIcon type={notification.type} />
          </div>
        </div>
        
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <NotificationBadge type={notification.type} />
            <span className={cn(
              "text-sm",
              notification.read 
                ? "text-gray-500 dark:text-gray-400" 
                : "text-gray-900 dark:text-gray-100 font-medium"
            )}>
              from {notification.sender}
            </span>
          </div>
          
          <h3 className={cn(
            "text-lg mb-1",
            notification.read 
              ? "text-gray-700 dark:text-gray-300 font-normal"
              : "text-gray-900 dark:text-gray-100 font-semibold"
          )}>
            {notification.subject}
          </h3>
          
          <p className={cn(
            "line-clamp-2",
            notification.read 
              ? "text-gray-500 dark:text-gray-400"
              : "text-gray-700 dark:text-gray-200"
          )}>
            {notification.content}
          </p>
          
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            {format(new Date(notification.created_at), 'dd/MM/yyyy, HH:mm')}
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center gap-2">
          {notification.type === 'offer' && (
            <>
              <Button
                size="sm"
                variant="ghost"
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => onAction('accept-offer', notification)}
              >
                <CheckCircle2 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => onAction('decline-offer', notification)}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
          
          {(notification.type === 'message' || notification.type === 'email') && (
            <Button
              size="sm"
              variant="ghost"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => onAction('reply', notification)}
            >
              <CornerUpRight className="h-4 w-4" />
            </Button>
          )}

          <NotificationActions
            notification={notification}
            onMarkAsRead={onMarkAsRead}
            onDelete={onDelete}
          />
        </div>
      </div>
    </motion.div>
  )
}