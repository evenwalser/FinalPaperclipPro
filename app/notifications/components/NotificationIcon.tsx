import { Mail, MessageSquare, Tag, Bell } from 'lucide-react'

interface NotificationIconProps {
  type: string
}

export function NotificationIcon({ type }: NotificationIconProps) {
  switch (type) {
    case 'offer':
      return <Tag className="h-5 w-5 text-green-500" />
    case 'message':
      return <MessageSquare className="h-5 w-5 text-blue-500" />
    case 'email':
      return <Mail className="h-5 w-5 text-purple-500" />
    case 'low_stock':
      return <Bell className="h-4 w-4 text-white" />
    default:
      return null
  }
}