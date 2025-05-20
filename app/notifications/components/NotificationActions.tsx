import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from 'lucide-react'
import { Notification } from "../types"


interface NotificationActionsProps {
  notification: Notification
  onMarkAsRead: (id: string, isRead: boolean) => void
  onDelete: (id: string) => void
}

export function NotificationActions({ notification, onMarkAsRead, onDelete }: NotificationActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => onMarkAsRead(notification.id, !notification.read)}
        >
          Mark as {notification.read ? 'unread' : 'read'}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onDelete(notification.id)}
          className="text-red-600"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}