export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  profile_image?: string;
  role: 'admin' | 'staff';
}

 interface CategoryItem {
  id: string;
  name: string;
  level: number;
  parent_id: string
}

interface ImageFile {
  display_order: number;
  image_url: string;
}
export interface Item {
  available_in_store?: boolean;
  categories: CategoryItem[];
  category_id: string;
  condition: string;
  created_at: string;
  created_by: string;
  description: string;
  id: string;
  item_images: ImageFile[]; // or another interface if you have a more specific type
  list_on_paperclip: boolean;
  price: number;
  size: string;
  brand: string;
  age: string;
  color: string;
  status: string;
  image_url?: string;
  store_id: number;
  title: string;
  quantity: number;
  updated_at: string;
}

export interface ItemImage {
  id: string;
  item_id: string;
  image_url: string;
  display_order: number;
  created_at?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  total_amount: number;
  transaction_date: string;
  status: 'completed' | 'refunded';
}

export interface TransactionItem {
  id: string;
  transaction_id: string;
  item_id: string;
  quantity: number;
  price: number;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface SalesSummary {
  id: string;
  category: string;
  total_sales: number;
  total_customers: number;
  total_inventory: number;
  sales_velocity: number;
  date_range: string;
}

export interface Settings {
  id: string;
  user_id: string;
  store_profile: {
    name?: string;
    description?: string;
    logo?: string;
    contact?: {
      email?: string;
      phone?: string;
      address?: string;
    };
  };
  inventory_settings: {
    low_stock_threshold?: number;
    auto_sync_marketplace?: boolean;
    default_category?: string;
  };
  pos_settings: {
    accepted_payment_methods?: string[];
    receipt_template?: string;
    tax_rate?: number;
  };
  notification_settings: {
    email_notifications?: boolean;
    push_notifications?: boolean;
    low_stock_alerts?: boolean;
  };
  integration_settings: {
    marketplace_enabled?: boolean;
    payment_gateway?: string;
    ai_assistance?: boolean;
  };
} 