import { createClient } from "@/utils/supabase/server";
import fetch from "node-fetch";
import FormData from "form-data";

// Helper function to map local condition to Paperclip condition type
function mapConditionToType(condition: string): number {
  switch (condition.toLowerCase()) {
    case "new":
      return 0;
    case "refurbished":
      return 1;
    case "used":
      return 4;
    default:
      return 0; // default to new
  }
}

// Helper function to map Paperclip condition type to local condition
function mapConditionFromMarketplace(conditionType: number): string {
  switch (conditionType) {
    case 0:
      return "New";
    case 1:
      return "Refurbished";
    default:
      return "Used";
  }
}

// Helper function to get Paperclip category ID from local category ID
async function getPaperclipCategoryId(
  supabase: any,
  localCategoryId: number
): Promise<string | null> {
  const { data, error } = await supabase
    .from("categories")
    .select("paperclip_marketplace_id")
    .eq("id", localCategoryId)
    .single();

  if (error || !data) {
    return null;
  }
  return data.paperclip_marketplace_id;
}

// Helper function to get local category ID from Paperclip category ID
async function getLocalCategoryId(
  supabase: any,
  paperclipCategoryId: string
): Promise<number | null> {
  const { data, error } = await supabase
    .from("categories")
    .select("id")
    .eq("paperclip_marketplace_id", paperclipCategoryId)
    .single();

  if (!error && data) {
    return data.id;
  } else {
    // Fallback to a default category
    const { data: defaults } = await supabase
      .from("categories")
      .select("id")
      .limit(1);
    return defaults?.[0]?.id ?? null;
  }
}

export async function syncItemsWithPaperclip(userId: string) {
  const supabase = await createClient();

  try {
    // Fetch the Paperclip API token for the user
    const { data: tokenData, error: tokenError } = await supabase
      .from("user_tokens")
      .select("paperclip_token")
      .eq("user_id", userId)
      .single();
      
      console.log("🚀 ~ syncItemsWithPaperclip ~ tokenData:", tokenData)
    if (tokenError || !tokenData) {
      throw new Error("Unable to fetch Paperclip token");
    }

    const paperclipToken = tokenData.paperclip_token;

    // Fetch user's store_id
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("store_id")
      .eq("id", userId)
      .single();
      console.log("🚀 ~ syncItemsWithPaperclip ~ userData:", userData)

    if (userError || !userData) {
      throw new Error("User not found");
    }

    const storeId = userData.store_id;

    // Pull items from Paperclip
    const pullResponse = await fetch(
      `${process.env.NEXT_PUBLIC_PAPERCLIP_API_URL}/v4/items/pull`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${paperclipToken}` },
      }
    );

    if (!pullResponse.ok) {
      const errorText = await pullResponse.text();
      throw new Error(`Failed to fetch items from Paperclip: ${errorText}`);
    }

    const paperclipItems = await pullResponse.json();
    console.log("🚀 ~ syncItemsWithPaperclip ~ paperclipItems:", paperclipItems)

    // Sync Paperclip items to local database
    for (const item of paperclipItems.data) {
        console.log("🚀 ~ syncItemsWithPaperclip ~ paperclipItems:", item.id)
      const { data: existingItem, error: fetchError } = await supabase
        .from("items")
        .select("*")
        .eq("paperclip_marketplace_id", item.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error(`Error fetching item ${item.id}:`, fetchError);
        continue;
      }

      // Map condition from Paperclip's condition_type
      const condition = mapConditionFromMarketplace(item.condition_type || 0);

      // Resolve local category ID from Paperclip categoryId
      const categoryId = item.categoryId
        ? await getLocalCategoryId(supabase, item.categoryId)
        : null;

      // Prepare item data
      const itemData = {
        title: item.name,
        description: item.description,
        price: parseFloat(item.price),
        quantity: item.quantity ?? 1,
        condition: condition,
        category_id: categoryId,
        size: item.size || null,
        brand: item.brand || null,
        tags: item.tags || [],
        color: item.color || null,
        logo_url: item.logo_url || null,
        available_in_store: true,
        list_on_paperclip: true,
        store_id: storeId,
        created_by: userId,
        paperclip_marketplace_id: item.id,
        paperclip_listed_at: new Date().toISOString(),
        listed_on_paperclip: true,
      };

      let localItemId: string;

      if (!existingItem) {
        // Insert new item
        const { data: newItem, error: insertError } = await supabase
          .from("items")
          .insert(itemData)
          .select()
          .single();

        if (insertError) {
          console.error(`Error inserting item ${item.id}:`, insertError);
          continue;
        }
        localItemId = newItem.id;
      } else {
        // Update existing item
        const { error: updateError } = await supabase
          .from("items")
          .update(itemData)
          .eq("id", existingItem.id);

        if (updateError) {
          console.error(`Error updating item ${existingItem.id}:`, updateError);
          continue;
        }
        localItemId = existingItem.id;
      }

      // Handle media
      if (item.media && Array.isArray(item.media)) {
        // Delete existing images
        const { error: deleteError } = await supabase
          .from("item_images")
          .delete()
          .eq("item_id", localItemId);

        if (deleteError) {
          console.error(
            `Error deleting images for item ${localItemId}:`,
            deleteError
          );
        }

        // Insert new images
        const imageInserts = item.media.map((url: string, index: number) => ({
          item_id: localItemId,
          image_url: url,
          display_order: index,
        }));

        const { error: imageError } = await supabase
          .from("item_images")
          .insert(imageInserts);

        if (imageError) {
          console.error(
            `Error inserting images for item ${localItemId}:`,
            imageError
          );
        }
      }
    }

    // Push unsynced local items to Paperclip
    const { data: unsyncedItems, error: unsyncedError } = await supabase
      .from("items")
      .select("*")
      .eq("store_id", storeId)
      .is("paperclip_marketplace_id", null);

    if (unsyncedError) {
      console.error("Error fetching unsynced items:", unsyncedError);
    } else {
      for (const item of unsyncedItems) {
        try {
            
            const formData = new FormData();

            // Append basic fields
            formData.append("name", item.title.trim());
            formData.append("description", item.description.trim());
            formData.append("price", item.price.toString());
            formData.append(
              "conditionType",
              mapConditionToType(item.condition).toString()
            );
            formData.append("packageSize", "Medium");
            formData.append("brand", item.brand || "");
            formData.append("size", item.size || "");
            formData.append("colorId", item.color || "");
            formData.append("retailId", item.id);
            formData.append("age", item.age || "");
  
            // Append category
            const paperclipCategoryId = await getPaperclipCategoryId(
              supabase,
              item.category_id
            );
            if (paperclipCategoryId) {
              formData.append("categoryId", paperclipCategoryId);
            }
  
            // Append tags
            const tags = item.tags || [];
            tags.forEach((tag: string | { id: string; name: string }, index: number) => {
              formData.append(
                `tags[${index}]`,
                typeof tag === "string" ? tag : tag.id
              );
            });
  
            // Fetch and append media
            const { data: images, error: imagesError } = await supabase
              .from("item_images")
              .select("image_url")
              .eq("item_id", item.id)
              .order("display_order");
            console.log("🚀 ~ syncItemsWithPaperclip ~ images:", images);
  
            if (imagesError) {
              console.error(
                `Error fetching images for item ${item.id}:`,
                imagesError
              );
              continue;
            }
  
            if (images && images.length > 0) {
              for (let index = 0; index < images.length; index++) {
                try {
                  const img = images[index];
                  const response = await fetch(img.image_url);
                  if (!response.ok) {
                    throw new Error(`Failed to fetch image ${img.image_url}`);
                  }
                  const buffer = await response.buffer();
                  formData.append(`media[${index}]`, buffer, {
                    filename: `image${index}.jpg`,
                    contentType: response.headers.get("content-type") || "image/jpeg",
                  });
                } catch (error) {
                  console.error(
                    `Error fetching image for item ${item.id}:`,
                    error
                  );
                  continue;
                }
              }
            }
  
            // Send to Paperclip
            const createResponse = await fetch(
              `${process.env.NEXT_PUBLIC_PAPERCLIP_API_URL}/v4/items`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${paperclipToken}`,
                },
                body: formData as any,
              }
            );
            console.log("🚀 ~ syncItemsWithPaperclip ~ createResponse:", createResponse);


          if (!createResponse.ok) {
            const errorText = await createResponse.text();
            console.error(`Failed to create item ${item.id}: ${errorText}`);
            continue;
          }

          const result = await createResponse.json();
          console.log("🚀 ~ syncItemsWithPaperclip ~ result:", result)
          const paperclipId = result.data.id;
          console.log("🚀 ~ syncItemsWithPaperclip ~ paperclipId:", paperclipId)

          // Update local item with Paperclip ID
          const { error: updateError } = await supabase
            .from("items")
            .update({
              paperclip_marketplace_id: paperclipId,
              listed_on_paperclip: true,
            })
            .eq("id", item.id);

          if (updateError) {
            console.error(`Failed to update item ${item.id}:`, updateError);
          }
        } catch (error) {
          console.error(`Error syncing item ${item.id}:`, error);
        }
      }
    }
  } catch (error) {
    console.error("Error during synchronization:", error);
  }
}
