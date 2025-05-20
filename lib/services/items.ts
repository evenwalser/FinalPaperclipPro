import { createClient } from "@/utils/supabase/client";
import { Item, ItemImage } from "@/types/supabase";

const supabase = createClient();

export async function createItem(item: Omit<Item, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("items")
    .insert([item])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function uploadItemImage(
  file: File,
  itemId: string,
  displayOrder: number
) {
  try {
    // Upload to Supabase Storage
    const fileExt = file.name.split(".").pop();
    const fileName = `${itemId}_${Date.now()}.${fileExt}`;
    const filePath = `${itemId}/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from("items")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("items").getPublicUrl(filePath);

    // Create record in item_images table
    const { error: dbError } = await supabase.from("item_images").insert({
      item_id: itemId,
      image_url: filePath,
      display_order: displayOrder,
    });

    if (dbError) throw dbError;

    return publicUrl;
  } catch (error) {
    console.error("Error in uploadItemImage:", error);
    throw error;
  }
}

export const fetchLevel1Categories = async () => {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .eq("level", 1) // Fetch only level 1 categories
    .order("display_order", { ascending: true }); // Optional: Sort by display order

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  console.log("🚀 ~ fetchLevel1Categories ~ data:", data)
  return data;
};

export const getUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;

    const user = data?.user;
    if (!user) return null;

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (userError) throw userError;

    return userData || null;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error fetching user:", err.message);
    } else {
      console.error("Error fetching user:", err);
    }
    return null;
  }
};

export async function getItems(
  page: number = 1,
  itemsPerPage: number = 9,
  user: any,
  filters: any
) {
  if (!user || !user.store_id) {
    throw new Error("User is not authenticated or missing store ID.");
  }

  const startIndex = (page - 1) * itemsPerPage;
  const supabase = createClient();

  let query = supabase
    .from("items")
    .select(
      `
      *,
      item_images!inner (
        image_url,
        display_order
      ),
      colors:color_id (id, name),
      ages:age_id (id, name)
      `,
      { count: "exact" }
    )
    .eq("store_id", user.store_id)
    .is("deleted_at", null);

  // Apply filters
  if (filters.category && filters.category !== "all") {
    query = query.eq("category_id", filters.category);
  }
  if (filters.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }
  if (filters.sizes?.length) {
    query = query.in("size", filters.sizes);
  }
  if (filters.brands?.length) {
    query = query.in("brand", filters.brands);
  }
  if (filters.ages?.length) {
    query = query.in("age", filters.ages);
  }
  if (filters.colors?.length) {
    query = query.in("colors.name", filters.colors); // Updated to filter by color name
  }
  if (filters.ages?.length) {
    query = query.in("ages.name", filters.ages); // Updated to filter by age name
  }

  // Apply sorting and pagination
  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(startIndex, startIndex + itemsPerPage - 1);

  if (error) throw error;

  const itemsWithCategories = await Promise.all(
    data.map(async (item) => {
      const { data: categoryHierarchy, error } = await supabase.rpc(
        "get_category_hierarchy",
        { category_id: item.category_id }
      );
      return {
        ...item,
        categories: error ? [] : categoryHierarchy,
        color: item.colors?.name || null, // Add color name
        age: item.ages?.name || null,
      };
    })
  );

  return {
    items: itemsWithCategories,
    totalItems: count || 0,
    totalPages: Math.ceil((count || 0) / itemsPerPage),
  };
}

// export async function getItems(page: number = 1,
//   itemsPerPage: number = 9,
//   user: any) {
//   if (!user || !user.store_id) {
//     throw new Error("User is not authenticated or missing store ID.");
//   }

//   const startIndex = (page - 1) * itemsPerPage;
//   const supabase = createClient();

//   const [countResponse, itemsResponse] = await Promise.all([
//     supabase
//       .from("items")
//       .select("id", { count: "exact", head: true })
//       .eq("store_id", user.store_id),
//     supabase
//       .from("items")
//       .select(
//                 `
//                 *,
//                 item_images!inner (
//                   image_url,
//                   display_order
//                 )
//               `
//               )
//       .eq("store_id", user.store_id)
//       .is("deleted_at", null)
//       .order("created_at", { ascending: false })
//       .range(startIndex, startIndex + itemsPerPage - 1),
//   ]);

//   if (countResponse.error) throw countResponse.error;
//   if (itemsResponse.error) throw itemsResponse.error;

//   const itemsWithCategories = await Promise.all(
//     itemsResponse.data.map(async (item) => {
//       const { data: categoryHierarchy, error } = await supabase.rpc(
//         "get_category_hierarchy",
//         { category_id: item.category_id }
//       );
//       return { ...item, categories: error ? [] : categoryHierarchy };
//     })
//   );

//   return {
//     items: itemsWithCategories,
//     totalItems: countResponse.count || 0,
//     totalPages: Math.ceil((countResponse.count || 0) / itemsPerPage),
//   };
// }

export async function getItem(id: number) {
  const { data: item, error: itemError } = await supabase
    .from("items")
    .select("*")
    .eq("id", id)
    .single();

  if (itemError) throw itemError;

  const { data: images, error: imagesError } = await supabase
    .from("item_images")
    .select("image_url")
    .eq("item_id", id);

  if (imagesError) throw imagesError;

  return {
    ...item,
    images: images.map((img) => img.image_url),
  };
}

export async function updateItem(id: number, updates: Partial<Item>) {
  const { data, error } = await supabase
    .from("items")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteItem(id: number) {
  // Delete associated images from storage first
  const { data: images } = await supabase
    .from("item_images")
    .select("image_url")
    .eq("item_id", id);

  if (images) {
    for (const image of images) {
      const path = image.image_url.split("/").pop();
      await supabase.storage.from("items").remove([`item-images/${path}`]);
    }
  }

  const { error } = await supabase.from("items").delete().eq("id", id);

  if (error) throw error;
}
