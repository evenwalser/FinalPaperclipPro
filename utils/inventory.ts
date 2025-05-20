import { Item } from "@/types/supabase";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const isVideo = (url: string) => {
  return url.match(/\.(mp4|webm|ogg|mov)$/i);
};

export const handleDelete = async (itemId: string, setItems: React.Dispatch<React.SetStateAction<Item[]>>) => {
  try {
    const { error } = await supabase
      .from("items")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", itemId);

    if (error) throw error;

    setItems((prevItems: Item[]) => prevItems.filter((item: Item) => item.id !== itemId));
    toast.success("Item successfully removed from inventory");
    return true;
  } catch (error) {
    console.error("Error removing item:", error);
    toast.error("Failed to remove item. Please try again.");
    return false;
  }
};

export const sortItems = (items: Item[], sortingMethod: string) => {
  return items?.slice().sort((a, b) => {
    switch (sortingMethod) {
      case "newest":
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      case "lowStock":
        return (a.quantity || 0) - (b.quantity || 0);
      case "highStock":
        return (b.quantity || 0) - (a.quantity || 0);
      case "alphabetical":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });
};

export const filterItems = (items: Item[], selectedCategory: string, searchQuery: string) => {
  return items.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" ||
      item.categories.some((category) => category.id === selectedCategory);

    const matchesSearch =
      searchQuery.trim() === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });
}; 