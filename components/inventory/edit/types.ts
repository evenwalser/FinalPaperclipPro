// types.ts
export interface ItemImage {
    id: string;
    image_url: string;
    filepath: string;
    file?: File;
    url?: string;
    shopify_media_id?: string
  }
  
  export interface Category {
    id: string;
    name: string;
    parent_id: string | null;
    level: number;
    display_order: number;
    paperclip_marketplace_id?: string
  }
  
  export interface ItemType {
    shopify_product_id?: any;
    paperclip_marketplace_id?: string;
    id: string;
    title: string;
    description: string;
    price: number;
    quantity: number;
    category_id: string;
    condition: string;
    size?: string;
    status: "available" | "low_stock" | "out_of_stock";
    available_in_store: boolean;
    list_on_paper_clip: boolean;
    store_id: string;
    item_images: ItemImage[];
  }