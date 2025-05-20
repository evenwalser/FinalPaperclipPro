import { Item } from "@/types/supabase";

export interface InventoryItem {
  id: string;
  title: string;
  price: number;
  category: string;
  item_images?: { image_url: string }[];
  quantity?: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface StoreSettings {
  lowStockThreshold: number | null;
  defaultSorting: 'newest' | 'lowStock' | 'highStock' | 'alphabetical';
}

export interface ItemCardProps {
  item: Item;
  isSelected: boolean;
  brandLogoMap: Record<string, string | null>;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  isDeleting: boolean;
  canManageItems: boolean;
}

export interface InventoryHeaderProps {
  selectedItemsCount: number;
  sendSelectedToPOS: () => void;
  canManageItems: boolean;
  user: any;
  onAddNewItem: () => void;
}

export interface InventoryFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categories: Category[];
  onCategoryChange: (value: string) => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  isTransitioning: boolean;
  onPageChange: (page: number) => void;
} 