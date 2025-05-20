"use client";

import { useEffect, useState } from "react";
import { fetchLevel1Categories, getItems } from "@/lib/services/items";
import { Item } from "@/types/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useCart } from "../contexts/CartContext";
import { useRole } from "@/hooks/useRole";
import { useUser } from "../contexts/UserContext";
import InventoryHeader from "../../components/inventory/InventoryHeader";
import InventoryFilters from "../../components/inventory/InventoryFilters";
import ItemCard from "../../components/inventory/ItemCard";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { sortItems } from "../../utils/inventory";
import { useMemo } from "react";
import { getShopifyCredentials } from "@/lib/shopify";  
import { cloneDeep } from "lodash";

interface Category {
  id: string;
  name: string;
  level?: number;
  parent_id?: string;
}

type Brand = {
  brand: string;
  logo_url: string;
};

export default function InventoryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allItemsCategories, setAllItemsCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [colors, setColors] = useState<{ id: string; name: string }[]>([]);
  const [filters, setFilters] = useState({
    category: "all",
    search: "",
    sizes: [] as string[],
    brands: [] as string[],
    ages: [] as string[],
    colors: [] as string[],
  });
  const [filterOptions, setFilterOptions] = useState({
    sizes: [] as string[],
    brands: [] as Brand[],
    ages: [] as string[],
    colors: [] as string[],
  });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { addItems } = useCart();
  const router = useRouter();
  const [deletingItems, setDeletingItems] = useState<Set<string>>(new Set());
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [storeSettings, setStoreSettings] = useState({
    lowStockThreshold: null,
    defaultSorting: "newest",
  });
  const { role } = useRole();
  const { user, refreshUser } = useUser();

  // Fetch categories and filter options
  useEffect(() => {
    const initialize = async () => {
      if (!user) return;
      try {
        const [categoryData, sizesData, brandsData, agesData, colorsData] =
          await Promise.all([
            fetchLevel1Categories(),
            supabase.rpc("get_distinct_sizes", { p_store_id: user.store_id }),
            supabase.rpc("get_distinct_brands_with_logo", {
              p_store_id: user.store_id,
            }),
            supabase.rpc("get_distinct_ages", { p_store_id: user.store_id }),
            supabase.rpc("get_distinct_colors", { p_store_id: user.store_id }),
          ]);
        setCategories(categoryData);
        setFilterOptions({
          sizes: sizesData.data || [],
          brands: brandsData.data || [],
          ages: agesData.data || [],
          colors: colorsData.data || [],
        });
      } catch (error) {
        console.error("Failed to load initial data:", error);
      }
    };
    initialize();
  }, [user]);

  // Fetch items based on filters and page
  useEffect(() => {
    const loadItems = async () => {
      let categoryFilter = cloneDeep(filters);

      const targetItem = allItemsCategories.find(
        (item) => item.parent_id === filters.category
      );

      if (targetItem) {
        const nextLevelItem = allItemsCategories.find(
          (item) => item.parent_id === targetItem.id
        );
        if (nextLevelItem) {
          categoryFilter.category = nextLevelItem.id;
        }
      }
      if (!user) return;
      try {
        setIsLoading(true);
        const { items, totalPages } = await getItems(
          currentPage,
          9,
          user,
          categoryFilter
        );
        console.log("🚀 ~ loadItems ~ items:", items)
        setItems(items.filter((item) => !item.deleted_at));
        if (allItemsCategories.length === 0) {
          setAllItemsCategories(
            items.map((item) => [...item.categories]).flat()
          );
        }
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Failed to load items:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadItems();
  }, [currentPage, user, filters]);
     

  // Fetch store settings
  useEffect(() => {
    const fetchStoreSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("stores")
          .select("low_stock_threshold, default_sorting")
          .eq("id", user.store_id)
          .single();
        if (error) throw error;
        if (data) {
          setStoreSettings({
            lowStockThreshold: data.low_stock_threshold,
            defaultSorting: data.default_sorting,
          });
        }
      } catch (error) {
        console.error("Error fetching store settings:", error);
      }
    };
    if (user) fetchStoreSettings();
  }, [user]);

  const brandLogoMap = useMemo(() => {
    return filterOptions.brands.reduce((acc, { brand, logo_url }) => {
      acc[brand] = logo_url;
      return acc;
    }, {} as Record<string, string | null>);
  }, [filterOptions.brands]);

  const sortedItems = sortItems(items, storeSettings.defaultSorting);

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const sendSelectedToPOS = () => {
    const selectedItemsData = items
      .filter((item) => selectedItems.includes(item.id))
      .map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        image_url: item.item_images?.[0]?.image_url,
        category: item.categories?.[0]?.name || item.category_id,
        size: item.size,
        quantity: item.quantity,
      }));
    addItems(selectedItemsData);
    router.push("/pos");
  };


  const handleDelete = async (itemId: string) => {
    setDeletingItems((prev) => new Set(prev).add(itemId));
    try {
      const response = await fetch('/api/delete-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId, storeId: user.store_id }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete item');
      }
  
      // Update UI by removing the item from state
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      setItemToDelete(null);
      toast.success('Item successfully removed from inventory and external platforms (if applicable)');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error(`Failed to remove item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setDeletingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  // const handleDelete = async (itemId: string) => {
  //   try {
  //     const storeId = user.store_id; // Adjust based on how you access storeId
  
  //     const response = await fetch('/api/shopify/delete-product', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ itemId, storeId }),
  //     });
  
  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.error || 'Failed to delete item');
  //     }
  
  //     // Update UI (e.g., remove item from list)
  //     setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  //     toast.success('Item successfully removed from inventory and Shopify (if applicable)');
  //   } catch (error) {
  //     console.error('Error removing item:', error);
  //     toast.error(`Failed to remove item: ${error instanceof Error ? error.message : 'Unknown error'}`);
  //   }
  // };

  // const handleDelete = async (itemId: string) => {
  //   setDeletingItems((prev) => new Set(prev).add(itemId));
  //   try {
  //     const { error } = await supabase
  //       .from("items")
  //       .update({ deleted_at: new Date().toISOString() })
  //       .eq("id", itemId);
  //     if (error) throw error;
  //     setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  //     setItemToDelete(null);
  //     toast.success("Item successfully removed from inventory");
  //   } catch (error) {
  //     console.error("Error removing item:", error);
  //     toast.error("Failed to remove item. Please try again.");
  //   } finally {
  //     setDeletingItems((prev) => {
  //       const next = new Set(prev);
  //       next.delete(itemId);
  //       return next;
  //     });
  //   }
  // };


  // const handleDelete = async (itemId: string) => {
  //   setDeletingItems((prev) => new Set(prev).add(itemId));
  //   try {
  //     // Find the item from your state list
  //     const itemToRemove = items.find((item) => item.id === itemId);
  //     if (!itemToRemove) {
  //       throw new Error("Item not found");
  //     }

  //     // If the item is listed on Paperclip, delete it there first.
  //     if (itemToRemove.paperclip_marketplace_id) {
  //       try {
  //         const paperclipPayload = {
  //           userId: user.id,
  //           paperclipItemId: itemToRemove.paperclip_marketplace_id,
  //         };
  //         const paperclipResponse = await fetch("/api/paperclip/delete-item", {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify(paperclipPayload),
  //         });
  //         if (!paperclipResponse.ok) {
  //           const errorText = await paperclipResponse.text();
  //           throw new Error(`Paperclip deletion failed: ${errorText}`);
  //         }
  //         console.log("Successfully deleted item from Paperclip");
  //       } catch (paperclipError) {
  //         console.error("Error deleting item on Paperclip:", paperclipError);
  //         toast.error("Failed to delete item on Paperclip. Please try again.");
  //         // Optionally, you might choose to abort the deletion process here.
  //         // return;
  //       }
  //     }

  //     // Mark the item as deleted in Supabase.
  //     const { error } = await supabase
  //       .from("items")
  //       .update({ deleted_at: new Date().toISOString() })
  //       .eq("id", itemId);
  //     if (error) throw error;

  //     // Update local state.
  //     setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  //     setItemToDelete(null);
  //     toast.success("Item successfully removed from inventory");
  //   } catch (error) {
  //     console.error("Error removing item:", error);
  //     toast.error(
  //       `Failed to remove item: ${
  //         error instanceof Error ? error.message : "Unknown error"
  //       }`
  //     );
  //   } finally {
  //     setDeletingItems((prev) => {
  //       const next = new Set(prev);
  //       next.delete(itemId);
  //       return next;
  //     });
  //   }
  // };

  const handleBrandFilter = (brand: string) => {
    setFilters((prev) => {
      const currentBrands = prev.brands;
      if (currentBrands.includes(brand)) {
        return { ...prev, brands: currentBrands.filter((b) => b !== brand) };
      } else {
        return { ...prev, brands: [...currentBrands, brand] };
      }
    });
    setCurrentPage(1); // Reset to page 1 when filters change
  };

  const handleDeleteClick = (itemId: string) => setItemToDelete(itemId);
  const handleDeleteConfirm = () => itemToDelete && handleDelete(itemToDelete);
  const handlePageChange = (newPage: number) => setCurrentPage(newPage);

  const canManageItems = () => !!role && ["store_owner"].includes(role);

  const ItemSkeleton = () => (
    <div className="animate-pulse">
      <div className="mb-4 aspect-[4/2] rounded-lg bg-gray-200" />
      <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-1/2 bg-gray-200 rounded mb-4" />
      <div className="h-3 w-full bg-gray-200 rounded mb-2" />
      <div className="h-3 w-5/6 bg-gray-200 rounded mb-2" />
      <div className="flex space-x-2 mt-4">
        <div className="h-8 w-20 bg-gray-200 rounded" />
        <div className="h-8 w-20 bg-gray-200 rounded" />
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <InventoryHeader
        selectedItemsCount={selectedItems.length}
        sendSelectedToPOS={sendSelectedToPOS}
        canManageItems={canManageItems()}
        user={user}
        onAddNewItem={() => router.push("/inventory/add")}
      />

      <InventoryFilters
        searchQuery={filters.search}
        onSearchChange={(value) => handleFilterChange("search", value)}
        categories={categories}
        onCategoryChange={(value) => handleFilterChange("category", value)}
        filterOptions={filterOptions}
        selectedFilters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* {filterOptions.brands.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-6">
          {filterOptions.brands.map((brandObj) => (
            <button
              key={brandObj.brand}
              onClick={() => handleBrandFilter(brandObj.brand)}
              className={`flex flex-col items-center space-y-2 p-2 border rounded hover:bg-[#afb8c7] ${
                filters.brands.includes(brandObj.brand) ? "bg-blue-100" : ""
              }`}
            >
              {brandObj.logo_url ? (
                <img
                  src={brandObj.logo_url}
                  alt={brandObj.brand}
                  className="h-12 w-12 object-contain"
                />
              ) : (
                <div className="h-12 w-12 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">No Logo</span>
                </div>
              )}
              <span
                className={`${
                  filters.brands.includes(brandObj.brand) ? "text-[#000]" : ""
                }`}
              >
                {brandObj.brand}
              </span>
            </button>
          ))}
        </div>
      )} */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 9 }).map((_, i) => <ItemSkeleton key={i} />)
        ) : sortedItems.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <p className="text-xl text-gray-500 mb-4">No items found</p>
          </div>
        ) : (
          sortedItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              brandLogoMap={brandLogoMap} // Add this prop
              isSelected={selectedItems.includes(item.id)}
              onSelect={toggleItemSelection}
              onEdit={(id) => router.push(`/inventory/edit/${id}`)}
              onDelete={handleDeleteClick}
              onDuplicate={(id) =>
                router.push(`/inventory/add?duplicate=${id}`)
              }
              isDeleting={deletingItems.has(item.id)}
              canManageItems={canManageItems()}
            />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1 || isLoading}
            className=""
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
              disabled={isLoading}
              className={cn(
                "w-8 h-8",
                currentPage === page && "bg-[#FF3B30] text-white"
              )}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handlePageChange(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages || isLoading}
          >
            Next
          </Button>
        </div>
      )}

      <DeleteDialog
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
