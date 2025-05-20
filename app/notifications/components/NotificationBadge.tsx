import { Badge } from "@/components/ui/badge"

interface NotificationBadgeProps {
  type: string
}

export function NotificationBadge({ type }: NotificationBadgeProps) {
  switch (type) {
    case 'offer':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Offer</Badge>
    case 'message':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Message</Badge>
    case 'email':
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Email</Badge>
    case 'low_stock':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Low Stock</Badge>
    default:
      return null
  }
}