
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2, Check } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useCart } from "@/app/contexts/CartContext"
import { useEffect } from "react"

interface InventoryCardProps {
  item: {
    id: string;
    title: string;
    price: number;
    category: string;
    status: string;
    size?: string;
    item_images?: { image_url: string }[];
  }
}

export function InventoryCard({ item }: InventoryCardProps) {
  const router = useRouter()
  const { addItems } = useCart()

  const getImageUrl = (path: string) => {
    return supabase.storage
      .from('items')
      .getPublicUrl(path)
      .data.publicUrl;
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      // First delete all images associated with this item
      const { error: imagesError } = await supabase
        .from('item_images')
        .delete()
        .eq('item_id', item.id);

      if (imagesError) throw imagesError;

      // Then delete the item itself
      const { error: itemError } = await supabase
        .from('items')
        .delete()
        .eq('id', item.id);

      if (itemError) throw itemError;

      // Force a refresh of the page
      window.location.reload();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item. Please try again.');
    }
  };

  const handleSelect = () => {
    const firstImage = item.item_images?.[0]?.image_url 
      ? getImageUrl(item.item_images[0].image_url)
      : '/placeholder.svg';
    
    addItems([{
      id: item.id,
      title: item.title,
      price: item.price,
      image_url: firstImage,
      category: item.category,
      size: item.size,
    }]);
    router.push('/pos');
  };

  useEffect(() => {
    if (item.item_images?.[0]) {
      console.log('Image path:', item.item_images[0].image_url);
      console.log('Public URL:', getImageUrl(item.item_images[0].image_url));
    }
  }, [item]);

  return (
    <Card className="overflow-hidden transition-shadow duration-300">
      <CardContent className="p-4">
        <div className="relative mb-4">
          <img 
            src={item.item_images?.[0]?.image_url 
              ? getImageUrl(item.item_images[0].image_url)
              : '/placeholder.svg'
            } 
            alt={item.title} 
            className="w-full h-40 sm:h-48 object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          <div className="absolute top-2 right-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${item.status === 'available' ? 'bg-green-100 text-green-800' : 
                item.status === 'low_stock' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'}`}
            >
              {item.status.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">{item.title}</h3>
            <p className="text-xl sm:text-2xl font-bold text-gray-700">£{item.price.toFixed(2)}</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">Category: {item.category}</p>

        <div className="flex gap-2">
          <Link href={`/inventory/edit/${item.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleSelect}
          >
            <Check className="h-4 w-4 mr-2" />
            Select
          </Button>
          <Button 
            variant="destructive" 
            size="icon"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 