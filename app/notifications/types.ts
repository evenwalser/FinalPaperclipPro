export interface Notification {
    id: string
    type: 'offer' | 'message' | 'email' | 'low_stock'
    sender: string
    subject: string
    content: string
    created_at: string
    read: boolean
    deleted_at: string | null
    metadata: {
      offerAmount?: number
      itemImage?: string
      itemTitle?: string
      quantity?: number
      threshold?: number
    }
    item_id?: string
    store_id?: number
  }