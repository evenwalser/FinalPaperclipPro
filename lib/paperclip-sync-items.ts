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
  console.log("🚀 [SYNC] Starting syncItemsWithPaperclip for userId:", userId);
  const supabase = await createClient();
  console.log("🚀 [SYNC] Supabase client created successfully");

  try {
    console.log("🚀 [SYNC] Step 1: Fetching Paperclip API token...");
    // Fetch the Paperclip API token for the user
    const { data: tokenData, error: tokenError } = await supabase
      .from("user_tokens")
      .select("paperclip_token")
      .eq("user_id", userId)
      .single();

    console.log("🚀 ~ syncItemsWithPaperclip ~ tokenData:", tokenData);
    console.log("🚀 [SYNC] Token query result:", { tokenData, tokenError });
    console.log("🚀 [SYNC] Token data exists:", !!tokenData);
    console.log("🚀 [SYNC] Token error exists:", !!tokenError);

    if (tokenError || !tokenData) {
      console.error("🚀 [SYNC] ERROR: Unable to fetch Paperclip token", {
        tokenError,
        tokenData,
      });
      throw new Error("Unable to fetch Paperclip token");
    }

    const paperclipToken = tokenData.paperclip_token;
    console.log(
      "🚀 [SYNC] Paperclip token retrieved, length:",
      paperclipToken?.length || 0
    );
    console.log(
      "🚀 [SYNC] Token starts with:",
      paperclipToken?.substring(0, 10) + "..."
    );

    console.log("🚀 [SYNC] Step 2: Fetching user's store_id...");
    // Fetch user's store_id
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("store_id")
      .eq("id", userId)
      .single();
    console.log("🚀 ~ syncItemsWithPaperclip ~ userData:", userData);
    console.log("🚀 [SYNC] User query result:", { userData, userError });
    console.log("🚀 [SYNC] User data exists:", !!userData);
    console.log("🚀 [SYNC] User error exists:", !!userError);

    if (userError || !userData) {
      console.error("🚀 [SYNC] ERROR: User not found", { userError, userData });
      throw new Error("User not found");
    }

    const storeId = userData.store_id;
    console.log("🚀 [SYNC] Store ID retrieved:", storeId);

    console.log("🚀 [SYNC] Step 3: Pulling items from Paperclip...");
    console.log(
      "🚀 [SYNC] API URL:",
      `${process.env.NEXT_PUBLIC_PAPERCLIP_API_URL}/v4/items/pull`
    );

    // Pull items from Paperclip
    const pullResponse = await fetch(
      `${process.env.NEXT_PUBLIC_PAPERCLIP_API_URL}/v4/items/pull`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${paperclipToken}` },
      }
    );

    console.log("🚀 [SYNC] Pull response status:", pullResponse.status);
    console.log("🚀 [SYNC] Pull response ok:", pullResponse.ok);
    console.log(
      "🚀 [SYNC] Pull response headers:",
      Object.fromEntries(pullResponse.headers.entries())
    );

    if (!pullResponse.ok) {
      const errorText = await pullResponse.text();
      console.error("🚀 [SYNC] ERROR: Failed to fetch items from Paperclip", {
        status: pullResponse.status,
        statusText: pullResponse.statusText,
        errorText,
      });
      throw new Error(`Failed to fetch items from Paperclip: ${errorText}`);
    }

    const paperclipItems = await pullResponse.json();
    console.log(
      "🚀 ~ syncItemsWithPaperclip ~ paperclipItems:",
      paperclipItems
    );
    console.log("🚀 [SYNC] Paperclip items response:", paperclipItems);
    console.log(
      "🚀 [SYNC] Number of items received:",
      paperclipItems?.data?.length || 0
    );

    console.log(
      "🚀 [SYNC] Step 4: Syncing Paperclip items to local database..."
    );
    // Sync Paperclip items to local database
    for (const item of paperclipItems.data) {
      console.log("🚀 ~ syncItemsWithPaperclip ~ item:", item);
      console.log("🚀 ~ syncItemsWithPaperclip ~ paperclipItems:", item.id);
      console.log("🚀 [SYNC] Processing item:", {
        id: item.id,
        name: item.name,
      });
      console.log("🚀 [SYNC] Full item data:", item);

      const { data: existingItem, error: fetchError } = await supabase
        .from("items")
        .select("*")
        .eq("paperclip_marketplace_id", item.id)
        .single();

      console.log("🚀 [SYNC] Existing item query result:", {
        existingItem,
        fetchError,
      });

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error(
          `🚀 [SYNC] ERROR: Error fetching item ${item.id}:`,
          fetchError
        );
        continue;
      }

      // Map condition from Paperclip's condition_type
      const condition = mapConditionFromMarketplace(item.condition_type || 0);
      console.log("🚀 [SYNC] Mapped condition:", {
        original: item.condition_type,
        mapped: condition,
      });

      // Resolve local category ID from Paperclip categoryId
      const categoryId = item.categoryId
        ? await getLocalCategoryId(supabase, item.categoryId)
        : null;
      console.log("🚀 [SYNC] Category mapping:", {
        paperclipCategoryId: item.categoryId,
        localCategoryId: categoryId,
      });

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

      console.log("🚀 [SYNC] Prepared item data:", itemData);

      let localItemId: string;

      if (!existingItem) {
        console.log("🚀 [SYNC] Inserting new item...");
        // Insert new item
        const { data: newItem, error: insertError } = await supabase
          .from("items")
          .insert(itemData)
          .select()
          .single();

        console.log("🚀 [SYNC] Insert result:", { newItem, insertError });

        if (insertError) {
          console.error(
            `🚀 [SYNC] ERROR: Error inserting item ${item.id}:`,
            insertError
          );
          continue;
        }
        localItemId = newItem.id;
        console.log("🚀 [SYNC] New item created with ID:", localItemId);
      } else {
        console.log("🚀 [SYNC] Updating existing item...");
        // Update existing item
        const { error: updateError } = await supabase
          .from("items")
          .update(itemData)
          .eq("id", existingItem.id);

        console.log("🚀 [SYNC] Update result:", { updateError });

        if (updateError) {
          console.error(
            `🚀 [SYNC] ERROR: Error updating item ${existingItem.id}:`,
            updateError
          );
          continue;
        }
        localItemId = existingItem.id;
        console.log("🚀 [SYNC] Item updated with ID:", localItemId);
      }

      console.log("🚀 [SYNC] Step 4.1: Handling media for item:", localItemId);
      // Handle media
      if (item.media && Array.isArray(item.media)) {
        console.log("🚀 [SYNC] Media array found, length:", item.media.length);

        // Delete existing images
        const { error: deleteError } = await supabase
          .from("item_images")
          .delete()
          .eq("item_id", localItemId);

        console.log("🚀 [SYNC] Delete existing images result:", {
          deleteError,
        });

        if (deleteError) {
          console.error(
            `🚀 [SYNC] ERROR: Error deleting images for item ${localItemId}:`,
            deleteError
          );
        }

        // Insert new images
        const imageInserts = item.media.map((url: string, index: number) => ({
          item_id: localItemId,
          image_url: url,
          display_order: index,
        }));
        console.log("🚀 [SYNC] Image inserts prepared:", imageInserts);

        const { error: imageError } = await supabase
          .from("item_images")
          .insert(imageInserts);

        console.log("🚀 [SYNC] Image insert result:", { imageError });

        if (imageError) {
          console.error(
            `🚀 [SYNC] ERROR: Error inserting images for item ${localItemId}:`,
            imageError
          );
        }
      } else {
        console.log("🚀 [SYNC] No media found for item");
      }
    }

    console.log(
      "🚀 [SYNC] Step 5: Pushing unsynced local items to Paperclip..."
    );
    // Push unsynced local items to Paperclip
    const { data: unsyncedItems, error: unsyncedError } = await supabase
      .from("items")
      .select("*")
      .eq("store_id", storeId)
      .is("paperclip_marketplace_id", null);

    console.log("🚀 [SYNC] Unsynced items query result:", {
      count: unsyncedItems?.length || 0,
      error: unsyncedError,
    });

    if (unsyncedError) {
      console.error(
        "🚀 [SYNC] ERROR: Error fetching unsynced items:",
        unsyncedError
      );
    } else {
      console.log(
        "🚀 [SYNC] Processing",
        unsyncedItems.length,
        "unsynced items"
      );

      for (const item of unsyncedItems) {
        try {
          console.log("🚀 [SYNC] Processing unsynced item:", {
            id: item.id,
            title: item.title,
          });

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

          console.log("🚀 [SYNC] Basic fields appended to formData");

          // Append category
          const paperclipCategoryId = await getPaperclipCategoryId(
            supabase,
            item.category_id
          );
          console.log("🚀 [SYNC] Category mapping for push:", {
            localCategoryId: item.category_id,
            paperclipCategoryId,
          });

          if (paperclipCategoryId) {
            formData.append("categoryId", paperclipCategoryId);
          }

          // Append tags
          const tags = item.tags || [];
          console.log("🚀 [SYNC] Processing tags:", tags);
          tags.forEach(
            (tag: string | { id: string; name: string }, index: number) => {
              formData.append(
                `tags[${index}]`,
                typeof tag === "string" ? tag : tag.id
              );
            }
          );

          console.log("🚀 [SYNC] Step 5.1: Fetching and appending media...");
          // Fetch and append media
          const { data: images, error: imagesError } = await supabase
            .from("item_images")
            .select("image_url")
            .eq("item_id", item.id)
            .order("display_order");

          console.log("🚀 [SYNC] Images query result:", {
            images,
            imagesError,
          });

          if (imagesError) {
            console.error(
              `🚀 [SYNC] ERROR: Error fetching images for item ${item.id}:`,
              imagesError
            );
            continue;
          }

          if (images && images.length > 0) {
            console.log("🚀 [SYNC] Processing", images.length, "images");
            for (let index = 0; index < images.length; index++) {
              try {
                const img = images[index];
                console.log("🚀 [SYNC] Fetching image:", img.image_url);

                const response = await fetch(img.image_url);
                console.log("🚀 [SYNC] Image fetch response:", {
                  status: response.status,
                  ok: response.ok,
                });

                if (!response.ok) {
                  throw new Error(`Failed to fetch image ${img.image_url}`);
                }

                const buffer = await response.buffer();
                console.log("🚀 [SYNC] Image buffer size:", buffer.length);

                formData.append(`media[${index}]`, buffer, {
                  filename: `image${index}.jpg`,
                  contentType:
                    response.headers.get("content-type") || "image/jpeg",
                });
                console.log("🚀 [SYNC] Image appended to formData");
              } catch (error) {
                console.error(
                  `🚀 [SYNC] ERROR: Error fetching image for item ${item.id}:`,
                  error
                );
                continue;
              }
            }
          } else {
            console.log("🚀 [SYNC] No images found for item");
          }

          console.log("🚀 [SYNC] Step 5.2: Sending item to Paperclip...");
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

          console.log("🚀 [SYNC] Create response:", {
            status: createResponse.status,
            statusText: createResponse.statusText,
            ok: createResponse.ok,
          });

          if (!createResponse.ok) {
            const errorText = await createResponse.text();
            console.error(
              `🚀 [SYNC] ERROR: Failed to create item ${item.id}:`,
              {
                status: createResponse.status,
                errorText,
              }
            );
            continue;
          }

          const result = await createResponse.json();
          console.log("🚀 [SYNC] Create result:", result);

          const paperclipId = result.data.id;
          console.log("🚀 [SYNC] Paperclip ID received:", paperclipId);

          console.log(
            "🚀 [SYNC] Step 5.3: Updating local item with Paperclip ID..."
          );
          // Update local item with Paperclip ID
          const { error: updateError } = await supabase
            .from("items")
            .update({
              paperclip_marketplace_id: paperclipId,
              listed_on_paperclip: true,
            })
            .eq("id", item.id);

          console.log("🚀 [SYNC] Update local item result:", { updateError });

          if (updateError) {
            console.error(
              `🚀 [SYNC] ERROR: Failed to update item ${item.id}:`,
              updateError
            );
          } else {
            console.log("🚀 [SYNC] Successfully synced item:", item.id);
          }
        } catch (error) {
          console.error(
            `🚀 [SYNC] ERROR: Error syncing item ${item.id}:`,
            error
          );
        }
      }
    }

    console.log("🚀 [SYNC] ✅ Sync completed successfully for userId:", userId);
  } catch (error) {
    console.error("🚀 [SYNC] ❌ ERROR during synchronization:", error);
    console.error(
      "🚀 [SYNC] Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    throw error; // Re-throw to ensure the error is propagated
  }
}
