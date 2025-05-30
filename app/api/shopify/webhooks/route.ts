import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import crypto from "crypto";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Route segment config
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Updated interface to match the actual Shopify webhook payload
interface ShopifyProductData {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  status: string;
  tags: string;
  admin_graphql_api_id: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  published_scope: string;
  handle: string;
  template_suffix?: string;
  variants: ShopifyVariant[];
  images: ShopifyImage[];
  media: ShopifyMedia[];
  category?: {
    name: string;
    full_name: string;
    admin_graphql_api_id: string;
  };
  location_id?: string;
  options?: {
    name: string;
    id: number;
    product_id: number;
    position: number;
    values: string[];
  }[];
  variant_gids?: {
    admin_graphql_api_id: string;
    updated_at: string;
  }[];
  has_variants_that_requires_components?: boolean;
}

interface ShopifyVariant {
  id: number;
  price: string;
  inventory_quantity: number;
  inventory_item_id: number;
  admin_graphql_api_id: string;
  option1?: string;
  option2?: string;
  option3?: string;
  title: string;
  barcode?: string;
  compare_at_price?: string | null;
  created_at?: string;
  position?: number;
  product_id?: number;
  sku?: string;
  taxable?: boolean;
  updated_at?: string;
  image_id?: number | null;
  inventory_policy?: string;
  old_inventory_quantity?: number;
}

interface ShopifyImage {
  id: number;
  src: string;
  admin_graphql_api_id: string;
  product_id?: number;
  position?: number;
  created_at?: string;
  updated_at?: string;
  alt?: string | null;
  width?: number;
  height?: number;
  variant_ids?: number[];
}

interface ShopifyMedia {
  id: number;
  media_content_type: string;
  admin_graphql_api_id: string;
  product_id?: number;
  position?: number;
  created_at?: string;
  updated_at?: string;
  alt?: string | null;
  status?: string;
  preview_image?: {
    src: string;
    alt?: string | null;
    width?: number;
    height?: number;
  };
  variant_ids?: number[];
}

interface ShopifyInventoryData {
  inventory_item_id: number;
  location_id: number;
  available: number;
}

interface Category {
  id: string;
  name: string;
  parent_id: string | null;
}

interface Item {
  id: string;
  shopify_product_id: string;
  shopify_variant_id: string;
  shopify_inventory_item_id: string;
  shopify_location_id?: string;
}

async function getOrCreateLookup(
  supabase: any,
  table: "colors" | "ages",
  name: string
): Promise<string | null> {
  if (!name) return null;

  // Try to find existing record
  const { data: found, error: findErr } = await supabase
    .from(table)
    .select("id")
    .eq("name", name)
    .limit(1)
    .single();

  if (findErr && findErr.code !== "PGRST116") {
    console.error(`Error finding ${table}:`, findErr);
    return null;
  }
  if (found) {
    return found.id;
  }

  // Insert new record
  const { data: inserted, error: insertErr } = await supabase
    .from(table)
    .insert({ name })
    .select("id")
    .single();

  if (insertErr) {
    console.error(`Error inserting ${table}:`, insertErr);
    return null;
  }
  return inserted.id;
}


// Map of Shopify topic to handler functions
const topicHandlers: {
  [key: string]: (data: any, storeId: string) => Promise<any>;
} = {
  "products/create": handleProductCreate,
  "products/update": handleProductUpdate,
  "products/delete": handleProductDelete,
  "inventory_levels/update": handleInventoryUpdate,
};

// Our database category structure - replace with your actual category hierarchy
const categoryTree = {
  Women: {
    Dresses: [
      "Mini",
      "Midi",
      "Maxi",
      "Going out",
      "Formal",
      "Casual",
      "Occasion",
      "Workwear",
      "Wedding",
      "Bodycon",
    ],
    Tops: [
      "T-shirts",
      "Vests",
      "Shirts",
      "Tank",
      "Long sleeve",
      "Bralettes",
      "Bodysuits",
    ],
    Jumpers: ["Cardigans", "Capes", "Hoodies", "Sweatshirts", "Vests"],
    Jeans: [
      "Flared",
      "Bootcut",
      "Cropped",
      "Skinny",
      "Straight",
      "High Waist",
      "Boyfriend",
      "Mom",
      "Ripped",
      "Other",
    ],
    Trousers: [
      "Leggings",
      "Casual",
      "Cullottes",
      "Flares",
      "Sweatpants",
      "Leather",
      "Formal",
    ],
    Skirts: ["Mini", "Midi", "Maxi", "Shorts", "Leather", "Denim", "Other"],
    Coats: [
      "Jacket",
      "Capes",
      "Peacoats",
      "Faux Fur",
      "Long",
      "Rain",
      "Trench",
      "Coat",
      "Gilet",
    ],
    Blazers: ["Blazer", "Suit"],
    Activewear: [
      "Outerwear",
      "Top",
      "Sports bra",
      "Trousers",
      "Tracksuits",
      "Hoodies",
      "Shorts",
      "Skirts",
      "Co-ords",
    ],
    Beach: ["One piece", "Bikini", "Cover-up"],
    Bags: [
      "Other",
      "Shoulder",
      "Hobo",
      "Backpacks",
      "Clutch",
      "Purse",
      "Totes",
      "Makeup bags",
      "Briefcase",
      "Handbags",
      "Bum bags",
    ],
    Accessories: [
      "Belts",
      "Sunglasses",
      "Gloves",
      "Hats",
      "Hair",
      "Scarves",
      "Wedding",
      "Umbrella",
      "Other",
    ],
    Jewellery: [
      "Rings",
      "Watches",
      "Necklaces",
      "Earrings",
      "Bracelets",
      "Other",
    ],
    Maternity: [
      "Knitwear",
      "Jumpers",
      "Coats",
      "Dresses",
      "Tops",
      "Jeans",
      "Trousers",
      "Shorts",
      "Skirts",
      "Hoodies",
      "Swimware",
      "Sleep",
      "Intimate",
      "Loungewear",
      "Bump bands",
    ],
    Shoes: [
      "Boots",
      "Flats",
      "Heels",
      "Trainers",
      "Sports",
      "Slippers",
      "Sandals",
    ],
    Nightwear: ["Bras", "Briefs", "Robes", "Nightwear"],
    Shorts: ["Denim", "Leather", "Other"],
    Tights: ["Tights", "Socks"],
    "One Piece": ["Jumpsuits", "Dungarees", "Playsuits"],
  },
  Men: {
    Tops: ["Polo shirt", "Vest", "Rugby", "T-shirts"],
    Shirts: ["Short", "Long"],
    Hoodies: ["Sweatshirt", "Hoodie"],
    Jumpers: ["Cardigan", "Jumper", "Polo neck", "V-neck"],
    Jeans: ["Bootcut", "Slim", "Regular", "Dungarees"],
    Trousers: ["Chino", "Combat", "Joggers", "Smart"],
    Shorts: ["Combat", "Sport", "Denim", "Jersey", "Smart"],
    Coats: [
      "Blazer",
      "Bomber",
      "Denim",
      "Leather",
      "Duffle",
      "Parka",
      "Raincoat",
      "Trench",
      "Mac",
      "Gilet",
      "Wool",
      "Lightweight",
    ],
    Suits: ["Jacket", "Sets", "Trousers", "Tuxedo", "Dinner", "Waistcoat"],
    Sportswear: ["Jacket", "Tops", "Joggers", "Shorts", "Tracksuit"],
    Swimwear: ["Swim", "Board", "Trunks"],
    Accessories: [
      "Belts",
      "Gloves",
      "Scarves",
      "Ties",
      "Sunglasses",
      "Hats",
      "Wallets",
    ],
    Jewellery: ["Jewellery", "Watches"],
    Bags: ["Backpack", "Briefcase", "Gymbag", "Holdall"],
    Shoes: [
      "Trainers",
      "Plimsolls",
      "Sports",
      "Brogues",
      "Boots",
      "Formal",
      "Loafers",
      "Slippers",
    ],
  },
  Kids: {
    Girls: [
      "Dresses",
      "Tops",
      "T-shirts",
      "Shorts",
      "Jumpers",
      "Hoodies",
      "Jeans",
      "Trousers",
      "Skirts",
      "Coats",
      "Swimwear",
      "Accessories",
      "Shoes",
    ],
    Boys: [
      "Tops",
      "Shirts",
      "Hoodies",
      "Jumpers",
      "Jeans",
      "Trousers",
      "Shorts",
      "Coats",
      "Swimwear",
      "Accessories",
      "Shoes",
    ],
    Products: [
      "Prams",
      "Car seats",
      "Nursery",
      "Feeding",
      "Changing",
      "Care",
      "Safety",
      "Maternity",
      "Accessories",
    ],
    Toys: [
      "Crafts",
      "Dolls",
      "Education",
      "Playsets",
      "Games",
      "Books",
      "Outdoors",
    ],
  },
  Electronics: {
    Computers: ["Tablets", "E-reader", "Watches", "Laptops", "Printers"],
    Camera: ["Cameras", "Video", "Accessories"],
    AV: ["TV", "Headphones", "Audio", "Audio accessories"],
    Mobile: ["Smartphones", "Cases", "Accessories"],
    Music: ["DJ", "Production"],
  },
  Beauty: {
    Perfume: ["Women", "Men"],
    Hair: ["Products", "Treatments", "Styling"],
    Skin: ["Body", "Face", "Bath"],
    Makeup: ["Face", "Nails", "Brushes"],
    Accessories: ["Bags", "Brushes", "Mirrors"],
  },
  Home: {
    Decor: ["Soft", "Ornaments", "Accessories"],
    Furniture: ["Bedroom", "Kitchen", "Living room"],
    Garden: ["Gardening", "Furniture", "Outdoor"],
    Appliances: ["Large", "Small", "Accessories"],
    Kitchen: ["Dining", "Appliances", "Accessories"],
    DIY: ["Power tools", "Hardware"],
  },
  Sport: {
    Sport: ["Indoor", "Outdoor", "Accessories", "Kits"],
    Fitness: ["Gym", "Studio", "Weights", "Accessories"],
    Footwear: ["Women", "Men", "Kids"],
    Outdoors: ["Camping", "Hiking", "Fishing", "Biking", "Games"],
  },
  Entertainment: {
    Consoles: ["Games", "Consoles", "VR", "Accessories"],
    DVD: ["DVD"],
    Music: ["CD & Vinyl", "DJ", "Instruments", "Accessories"],
  },
  Print: {
    Books: ["Cookbooks", "Fiction", "Non-fiction", "Other"],
    Textbooks: [
      "Business",
      "Sciences",
      "Engineering",
      "Medicine",
      "Law",
      "Social",
      "Sports",
      "Media",
      "Arts",
      "Hospitality",
      "Other",
    ],
  },
  Pet: {
    Accessories: [],
  },
  Motors: {
    Cars: [],
    Bikes: [],
    Parts: [],
    Accessories: [],
  },
  Other: {
    Handmade: ["Home", "Wedding"],
    Travel: ["Luggage", "Other"],
    Vintage: ["Home", "Clothing", "Collectibles", "Antiques"],
    Craft: ["Art supplies", "Party supplies", "Craft supplies"],
  },
};

// Function to map Shopify category to our database category using OpenAI
async function mapCategory(
  product: ShopifyProductData
): Promise<string | null> {
  try {
    // Extract relevant product info for the prompt
    const { title, body_html, product_type, category, vendor, tags } = product;

    const shopifyCategory = category?.full_name || product_type || "";

    // Create a prompt for OpenAI
    const prompt = `
    Map the following Shopify product to the most appropriate category in our database.
    
    Shopify Product Information:
    - Title: ${title}
    - Description: ${body_html ? body_html.replace(/<[^>]*>?/gm, "") : ""}
    - Shopify Category: ${shopifyCategory}
    - Brand: ${vendor || ""}
    - Tags: ${tags || ""}
    
    Our Database Category Structure:
    ${JSON.stringify(categoryTree, null, 2)}
    
    Return a category path in the format "Level1 > Level2 > Level3" that best matches this product from our category structure.
    ONLY return the category path, nothing else.
    `;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Using 3.5 for cost optimization, use gpt-4 for better accuracy if needed
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that maps product categories between different systems.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3, // Lower temperature for more deterministic responses
      max_tokens: 100,
    });

    // Extract the category path from response
    const categoryPath = response.choices[0].message.content || null;
    console.log("AI suggested category path:", categoryPath);

    return categoryPath;
  } catch (error) {
    console.error("Error mapping category with OpenAI:", error);
    return null;
  }
}

// Function to find category ID from path
async function getCategoryIdFromPath(
  categoryPath: string,
  storeId: string,
  supabase: any
): Promise<string | null> {
  if (!categoryPath) return null;

  // Define category interface
  interface CategoryItem {
    id: string;
    name: string;
    parent_id: string | null;
    display_order: number;
    [key: string]: any; // For other fields that might be present
  }

  // Get all categories for this store, ordered by display_order
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return null;
  }

  const allCategories = (data as CategoryItem[]) || [];

  if (allCategories.length === 0) {
    console.log("No categories found for store:", storeId);
    return null;
  }

  console.log("Category path from OpenAI:", categoryPath);
  const categoryNames = categoryPath.split(" > ");

  // First try direct path matching
  let matchLevel1: CategoryItem | null = null;
  let matchLevel2: CategoryItem | null = null;
  let matchLevel3: CategoryItem | null = null;

  // Find level 1 (root level) categories
  const rootCategories = allCategories.filter(
    (cat: CategoryItem) => !cat.parent_id
  );

  // Try exact name match first
  for (const rootCat of rootCategories) {
    if (rootCat.name.toLowerCase() === categoryNames[0]?.toLowerCase()) {
      matchLevel1 = rootCat;

      // If we have a level 1 match and there's a second level in the path
      if (matchLevel1 && categoryNames.length > 1) {
        // Find children of this category
        const level2Categories = allCategories.filter(
          (cat: CategoryItem) => cat.parent_id === matchLevel1?.id
        );

        for (const level2Cat of level2Categories) {
          if (
            level2Cat.name.toLowerCase() === categoryNames[1]?.toLowerCase()
          ) {
            matchLevel2 = level2Cat;

            // If we have a level 2 match and there's a third level in the path
            if (matchLevel2 && categoryNames.length > 2) {
              // Find children of this category
              const level3Categories = allCategories.filter(
                (cat: CategoryItem) => cat.parent_id === matchLevel2?.id
              );

              for (const level3Cat of level3Categories) {
                if (
                  level3Cat.name.toLowerCase() ===
                  categoryNames[2]?.toLowerCase()
                ) {
                  matchLevel3 = level3Cat;
                  break; // Found a level 3 match
                }
              }
            }

            break; // Found a level 2 match
          }
        }
      }

      break; // Found a level 1 match
    }
  }

  // If we couldn't find exact name matches, try fuzzy matching
  if (!matchLevel1) {
    // Try fuzzy matching for level 1
    for (const rootCat of rootCategories) {
      if (
        rootCat.name.toLowerCase().includes(categoryNames[0]?.toLowerCase()) ||
        categoryNames[0]?.toLowerCase().includes(rootCat.name.toLowerCase())
      ) {
        matchLevel1 = rootCat;

        // If we have a level 1 match and there's a second level in the path
        if (matchLevel1 && categoryNames.length > 1) {
          // Find children of this category
          const level2Categories = allCategories.filter(
            (cat: CategoryItem) => cat.parent_id === matchLevel1?.id
          );

          for (const level2Cat of level2Categories) {
            if (
              level2Cat.name
                .toLowerCase()
                .includes(categoryNames[1]?.toLowerCase()) ||
              categoryNames[1]
                ?.toLowerCase()
                .includes(level2Cat.name.toLowerCase())
            ) {
              matchLevel2 = level2Cat;

              // If we have a level 2 match and there's a third level in the path
              if (matchLevel2 && categoryNames.length > 2) {
                // Find children of this category
                const level3Categories = allCategories.filter(
                  (cat: CategoryItem) => cat.parent_id === matchLevel2?.id
                );

                for (const level3Cat of level3Categories) {
                  if (
                    level3Cat.name
                      .toLowerCase()
                      .includes(categoryNames[2]?.toLowerCase()) ||
                    categoryNames[2]
                      ?.toLowerCase()
                      .includes(level3Cat.name.toLowerCase())
                  ) {
                    matchLevel3 = level3Cat;
                    break; // Found a level 3 match
                  }
                }
              }

              break; // Found a level 2 match
            }
          }
        }

        break; // Found a level 1 match
      }
    }
  }

  // Log the matching categories for debugging
  console.log("Found category matches:", {
    level1: matchLevel1?.name,
    level2: matchLevel2?.name,
    level3: matchLevel3?.name,
  });

  // Return the deepest level category ID we found, following the same approach as in add item page
  const finalCategoryId =
    matchLevel3?.id || matchLevel2?.id || matchLevel1?.id || null;

  if (!finalCategoryId) {
    console.log("No matching category found for path:", categoryPath);

    // Return the first root category as fallback if no match
    if (rootCategories.length > 0) {
      console.log("Using default root category:", rootCategories[0].name);
      return rootCategories[0].id;
    }
  }

  console.log("Selected category ID:", finalCategoryId);
  return finalCategoryId;
}

export async function POST(req: Request) {
  try {
    // Extract HMAC header and topic
    const hmac = req.headers.get("x-shopify-hmac-sha256");
    const topic = req.headers.get("x-shopify-topic");
    console.log("Topic:", topic);
    const shop = req.headers.get("x-shopify-shop-domain");
    const isInternalCall = req.headers.get("x-internal-call");

    if (!topic || !shop) {
      return NextResponse.json(
        { error: "Missing required headers" },
        { status: 400 }
      );
    }

    // Get raw body as Buffer for HMAC verification
    const rawBody = Buffer.from(await req.arrayBuffer());

    console.log("Received webhook:", topic, "from", shop);
    if (!isInternalCall) {
      console.log("Verifying external webhook");
      if (!hmac) {
        return NextResponse.json(
          { error: "Missing HMAC header" },
          { status: 400 }
        );
      }
      // Verify the webhook's authenticity
      const apiSecret = process.env.SHOPIFY_API_SECRET;

      if (!apiSecret) {
        return NextResponse.json(
          { error: "Shopify API secret not configured" },
          { status: 500 }
        );
      }

      const calculatedHmac = crypto
        .createHmac("sha256", apiSecret)
        .update(rawBody)
        .digest("base64");
      console.log("Calculated HMAC:", calculatedHmac);
      console.log("Received HMAC:", hmac);

      if (calculatedHmac !== hmac) {
        console.log("Unauthorized: HMAC verification failed");
        return NextResponse.json(
          { error: "Unauthorized: Invalid HMAC" },
          { status: 401 }
        );
      }
    } else {
      console.log("Internal call - skipping HMAC verification");
    }

    // Parse the JSON payload
    const body = JSON.parse(rawBody.toString("utf-8"));
    console.log("Webhook payload:", body);

    // Use server-side supabase client
    const supabase = await createClient();

    // Check for a processing lock for this webhook to prevent duplicates
    if (topic === "products/create" || topic === "products/update") {
      const webhookId = `product-${body.id}`;

      // Try to get an existing lock
      const { data: existingLock } = await supabase
        .from("webhook_locks")
        .select("id, created_at")
        .eq("webhook_id", webhookId)
        .single();

      if (existingLock) {
        const lockTime = new Date(existingLock.created_at);
        const now = new Date();
        const lockAgeMinutes = (now.getTime() - lockTime.getTime()) / 60000;

        // If the lock is less than 10 seconds old, consider it a duplicate webhook
        if (lockAgeMinutes < 0.5) {
          // 10 seconds = 0.17 minutes
          console.log(
            `Ignoring duplicate webhook: ${webhookId} (processed ${lockAgeMinutes.toFixed(
              2
            )} minutes ago)`
          );
          return NextResponse.json(
            { message: "Webhook already processed" },
            { status: 200 }
          );
        } else {
          // Lock is old, delete it and proceed
          await supabase
            .from("webhook_locks")
            .delete()
            .eq("id", existingLock.id);
        }
      }

      // Create a new lock for this webhook
      await supabase.from("webhook_locks").insert({
        webhook_id: webhookId,
        topic,
        shop,
        product_id: body.id,
        status: "processing",
      });
    }

    // Get all stores - we'll find the correct one based on Shopify data later
    // Find the store based on the shop domain
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("id, shopify_access_token")
      .eq("shopify_shop_name", shop)
      .single();

    if (storeError || !store || !store.shopify_access_token) {
      console.log(
        "No store found or missing Shopify access token for shop:",
        shop
      );
      return NextResponse.json(
        { error: "No store found or missing Shopify integration" },
        { status: 404 }
      );
    }

    const storeId = store.id;
    console.log("Using store ID:", storeId);
    console.log("Using store ID:", storeId);

    // Process the webhook based on topic
    const handler = topicHandlers[topic];
    if (!handler) {
      return NextResponse.json(
        { message: "Webhook received but no handler for this topic" },
        { status: 200 }
      );
    }

    // Call the appropriate handler
    await handler(body, storeId);

    // Update the lock status to completed
    if (topic === "products/create" || topic === "products/update") {
      const webhookId = `product-${body.id}`;
      await supabase
        .from("webhook_locks")
        .update({ status: "completed" })
        .eq("webhook_id", webhookId);
    }

    return NextResponse.json(
      { message: "Webhook processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);

    // If there was an error, remove the lock to allow reprocessing
    try {
      if (
        req.headers.get("x-shopify-topic") === "products/create" ||
        req.headers.get("x-shopify-topic") === "products/update"
      ) {
        const body = JSON.parse(
          Buffer.from(await req.arrayBuffer()).toString("utf-8")
        );
        const webhookId = `product-${body.id}`;

        const supabase = await createClient();
        await supabase
          .from("webhook_locks")
          .delete()
          .eq("webhook_id", webhookId);
      }
    } catch (cleanupError) {
      console.error("Error cleaning up webhook lock:", cleanupError);
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handler for product creation events
async function handleProductCreate(
  data: ShopifyProductData,
  storeId: string
): Promise<Item> {
  const supabase = await createClient();
  const {
    id,
    title,
    body_html,
    vendor,
    product_type,
    variants,
    images,
    media,
    tags,
    category,
    status,
    options,
  } = data;
  console.log("Product create ");

  // Check for duplicates with more flexible matching
  const { data: existingItems } = await supabase
    .from("items")
    .select("id, shopify_product_id")
    .or(
      `shopify_product_id.eq.${data.admin_graphql_api_id},shopify_product_id.eq.gid://shopify/Product/${id}`
    )
    .eq("store_id", storeId)
    .is("deleted_at", null);

  // Handle existing items
  if (existingItems && existingItems.length > 0) {
    console.log("Product already exists, updating instead:", id);
    console.log("Existing items found:", existingItems.length);

    // If there are multiple items with the same Shopify ID, mark extras as duplicates
    if (existingItems.length > 1) {
      console.log(
        "Found multiple items with the same Shopify ID. Marking extras as duplicates."
      );

      // Keep the first one, mark others as duplicates
      for (let i = 1; i < existingItems.length; i++) {
        await supabase
          .from("items")
          .update({
            deleted_at: new Date().toISOString(),
            status: "deleted",
            duplicated: true,
          })
          .eq("id", existingItems[i].id);
        console.log(`Marked item ${existingItems[i].id} as duplicate`);
      }
    }

    // Update the first item
    return handleProductUpdate(data, storeId);
  }

  // Get the store's Shopify access token to make API calls
  const { data: store } = await supabase
    .from("stores")
    .select("shopify_access_token, shopify_shop_name")
    .eq("id", storeId)
    .single();

  if (!store?.shopify_access_token || !store?.shopify_shop_name) {
    console.error("Missing Shopify credentials for store:", storeId);
    throw new Error("Missing Shopify credentials");
  }

  // Fetch brand logo from logo.dev if vendor name is provided
  let logoUrl = "";
  if (vendor) {
    try {
      const baseUrl =
        "https://paperclipretail-git-development-project-retail-fa44f0e3.vercel.app";
      const logoResponse = await fetch(
        `${baseUrl}/api/logo-search?q=${encodeURIComponent(vendor)}`
      );

      // If logo search fails (like 401 error), just continue without a logo
      if (logoResponse.ok) {
        const logoData = await logoResponse.json();
        if (logoData.length > 0 && logoData[0].logo_url) {
          logoUrl = logoData[0].logo_url;
          console.log("Found logo for brand:", vendor, logoUrl);
        }
      } else {
        // Don't treat this as an error, just log and continue
        console.log(
          `Logo search returned status ${logoResponse.status} for brand: ${vendor}`
        );
      }
    } catch (error: any) {
      // Just log the error and continue without a logo
      console.log(
        "Failed to fetch brand logo, continuing without it:",
        error.message
      );
    }
  }

  // The webhook may not include complete inventory data, so we'll fetch it directly
  try {
    // Shopify GraphQL API call to get complete product with inventory data
    const graphqlQuery = `
      query {
        product(id: "${data.admin_graphql_api_id}") {
          id
          variants(first: 10) {
            edges {
              node {
                id
                price
                inventoryItem {
                  id
                  inventoryLevels(first: 1) {
                    edges {
                      node {
                        quantities(names: ["available"]) {
                          name
                          quantity
                        }
                        location {
                          id
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    // Make the API call to Shopify
    const shopifyResponse = await fetch(
      `https://${store.shopify_shop_name}/admin/api/2023-10/graphql.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": store.shopify_access_token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: graphqlQuery }),
      }
    );

    const shopifyData = await shopifyResponse.json();
    console.log(
      "Fetched complete product data from Shopify:",
      JSON.stringify(shopifyData, null, 2)
    );

    if (shopifyData.data?.product?.variants?.edges?.length > 0) {
      const firstVariant = shopifyData.data.product.variants.edges[0].node;

      // Update the variant with the correct price and inventory information
      if (variants.length > 0 && firstVariant) {
        variants[0].price = firstVariant.price;

        if (firstVariant.inventoryItem?.inventoryLevels?.edges?.length > 0) {
          const inventoryLevel =
            firstVariant.inventoryItem.inventoryLevels.edges[0].node;
          const availableQuantity = inventoryLevel.quantities.find(
            (q: { name: string; quantity: number }) => q.name === "available"
          );
          variants[0].inventory_quantity = availableQuantity
            ? availableQuantity.quantity
            : 0;
          variants[0].inventory_item_id = firstVariant.inventoryItem.id
            .split("/")
            .pop();

          // Store the location ID for future inventory updates
          data.location_id = inventoryLevel.location.id.split("/").pop();
        }
      }
    }
  } catch (error) {
    console.error("Error fetching complete product data from Shopify:", error);
    // Continue with the webhook data even if the additional fetch fails
  }

  // Map the Shopify category to our database category using OpenAI
  const categoryPath = await mapCategory(data);
  console.log("Category path from OpenAI:", categoryPath);

  // Get or create the category in our database
  const categoryId = await getCategoryIdFromPath(
    categoryPath || "",
    storeId,
    supabase
  );
  console.log("Category ID in our database:", categoryId);

  // Get the main variant
  const mainVariant = variants[0];

  // Extract attributes based on options and variant data
  let size: string | null = null;
  let color: string | null = null;
  let condition: string | null = null;

  // Try to extract values directly from options
  if (options && options.length > 0) {
    // Log all options for debugging
    console.log("Options from Shopify:", JSON.stringify(options, null, 2));

    // First, find which options correspond to size, color, and condition
    const sizeOption = options.find(
      (opt) =>
        opt.name.toLowerCase() === "size" ||
        opt.name.toLowerCase().includes("size")
    );

    const colorOption = options.find(
      (opt) =>
        opt.name.toLowerCase() === "color" ||
        opt.name.toLowerCase().includes("color") ||
        opt.name.toLowerCase().includes("colour")
    );

    const conditionOption = options.find(
      (opt) =>
        opt.name.toLowerCase() === "condition" ||
        opt.name.toLowerCase().includes("condition") ||
        opt.name.toLowerCase().includes("state")
    );

    // Then get the values for each option from the variant
    if (sizeOption) {
      const optionIndex = sizeOption.position;
      if (optionIndex === 1 && mainVariant.option1) size = mainVariant.option1;
      else if (optionIndex === 2 && mainVariant.option2)
        size = mainVariant.option2;
      else if (optionIndex === 3 && mainVariant.option3)
        size = mainVariant.option3;
      console.log(`Found size option at position ${optionIndex}: ${size}`);
    }

    if (colorOption) {
      const optionIndex = colorOption.position;
      if (optionIndex === 1 && mainVariant.option1) color = mainVariant.option1;
      else if (optionIndex === 2 && mainVariant.option2)
        color = mainVariant.option2;
      else if (optionIndex === 3 && mainVariant.option3)
        color = mainVariant.option3;
      console.log(`Found color option at position ${optionIndex}: ${color}`);
    }

    if (conditionOption) {
      const optionIndex = conditionOption.position;
      if (optionIndex === 1 && mainVariant.option1)
        condition = mainVariant.option1;
      else if (optionIndex === 2 && mainVariant.option2)
        condition = mainVariant.option2;
      else if (optionIndex === 3 && mainVariant.option3)
        condition = mainVariant.option3;
      console.log(
        `Found condition option at position ${optionIndex}: ${condition}`
      );
    }
  }

  // If we couldn't extract the values from the options, try to extract from variant title
  if (
    (!size || !color || !condition) &&
    mainVariant.title &&
    mainVariant.title !== "Default Title"
  ) {
    console.log("Attempting to extract from variant title:", mainVariant.title);
    const titleParts = mainVariant.title.split(" / ");

    // Try to identify each part based on pattern matching
    for (const part of titleParts) {
      const trimmedPart = part.trim();

      // Common size patterns
      if (!size && /^(XS|S|M|L|XL|XXL)$/i.test(trimmedPart)) {
        size = trimmedPart;
        console.log("Extracted size from title:", size);
      }
      // Common color patterns
      else if (
        !color &&
        /^(Red|Blue|Green|Black|White|Yellow|Purple|Pink|Orange|Brown|Grey|Gray)$/i.test(
          trimmedPart
        )
      ) {
        color = trimmedPart;
        console.log("Extracted color from title:", color);
      }
      // Common condition patterns
      else if (!condition && /^(New|Used|Refurbished)$/i.test(trimmedPart)) {
        condition = trimmedPart;
        console.log("Extracted condition from title:", condition);
      }
    }
  }

  // Extract color from title or description if still not found
  if (!color) {
    const colorMatch = (title + " " + body_html).match(
      /\b(red|blue|green|black|white|yellow|purple|pink|orange|brown|grey|gray)\b/i
    );
    if (colorMatch) {
      color = colorMatch[0].toLowerCase();
      console.log("Extracted color from product text:", color);
    }
  }

    // Set age to null for Shopify products (extend logic if age is available)
  

  let color_id: string | null = null;
  let age_id: string | null = null;

  if (color) {
    color_id = await getOrCreateLookup(supabase, "colors", color);
  }

   console.log(
    "Product attributes - Size:",
    size,
    "Color:",
    color,
    "Condition:",
    condition
  );
  console.log("Product price from Shopify (update):", mainVariant.price);
  console.log(
    "Product quantity from Shopify (update):",
    mainVariant.inventory_quantity
  );
  console.log("Inventory item ID:", mainVariant.inventory_item_id);
  console.log("Location ID:", data.location_id);

  // Validate condition against allowed values
  const validConditions = ["New", "Refurbished", "Used"] as const;
  type ValidCondition = (typeof validConditions)[number];
  let normalizedCondition: ValidCondition = "New"; // Default value

  // Normalize condition value
  if (condition !== null) {
    // First try exact match
    const exactMatch = validConditions.find((c) => c === condition);
    if (exactMatch) {
      normalizedCondition = exactMatch;
    } else {
      // Try case-insensitive match
      const caseInsensitiveMatch = validConditions.find(
        (c) => c.toLowerCase() === condition?.toLowerCase()
      );

      if (caseInsensitiveMatch) {
        normalizedCondition = caseInsensitiveMatch;
      } else {
        // Try to match by similarity ("Uesd" should match "Used")
        if (
          condition.toLowerCase().includes("new") ||
          condition.toLowerCase() === "brand new"
        ) {
          normalizedCondition = "New";
        } else if (
          condition.toLowerCase().includes("used") ||
          condition.toLowerCase().includes("uesd") ||
          condition.toLowerCase().includes("second hand")
        ) {
          normalizedCondition = "Used";
        } else if (
          condition.toLowerCase().includes("refurbished") ||
          condition.toLowerCase().includes("refurb") ||
          condition.toLowerCase().includes("renewed")
        ) {
          normalizedCondition = "Refurbished";
        } else {
          // Default to New if no match
          console.log(
            `Condition "${condition}" is not valid. Using default value "New".`
          );
          normalizedCondition = "New";
        }
      }
    }
  } else {
    // If no condition provided, default to New
    console.log("No condition provided. Using default value 'New'.");
    normalizedCondition = "New";
  }

  console.log("Normalized condition:", normalizedCondition);

  // Parse tags into an array
  const tagArray = tags ? tags.split(",").map((tag) => tag.trim()) : [];
  console.log("Product tags:", tagArray);

  console.log("Product price from Shopify:", mainVariant.price);
  console.log("Product quantity from Shopify:", mainVariant.inventory_quantity);

  // Create the item record
  const { data: item, error } = await supabase
    .from("items")
    .insert({
      store_id: storeId,
      title,
      description: body_html,
      brand: vendor,
      logo_url: logoUrl,
      category_id: categoryId,
      price: parseFloat(mainVariant.price) || 0,
      quantity: mainVariant.inventory_quantity || 0,
      size,
      color,
      color_id,
      condition: normalizedCondition,
      shopify_product_id: data.admin_graphql_api_id,
      shopify_variant_id: mainVariant.admin_graphql_api_id,
      shopify_inventory_item_id: mainVariant.inventory_item_id
        ? `gid://shopify/InventoryItem/${mainVariant.inventory_item_id}`
        : null,
      shopify_location_id: data.location_id
        ? `gid://shopify/Location/${data.location_id}`
        : null,
      tags: tags ? tags.split(", ") : [],
      status: status.toLowerCase(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating item:", error);
    throw error;
  }

  console.log("Created new item:", item.id);

  // Handle images
  if (images && images.length > 0) {
    const imagePromises = images.map(async (image, index) => {
      return supabase.from("item_images").insert({
        item_id: item.id,
        image_url: image.src,
        display_order: index,
        shopify_media_id: image.admin_graphql_api_id,
      });
    });

    await Promise.all(imagePromises);
    console.log(`Added ${images.length} images to item`);
  }

  return item;
}

// Handler for product update events
async function handleProductUpdate(
  data: ShopifyProductData,
  storeId: string
): Promise<Item> {
  const supabase = await createClient();
  const {
    id,
    title,
    body_html,
    vendor,
    product_type,
    variants,
    images,
    tags,
    category,
    status,
    options,
  } = data;
  console.log("Product update received");

  // Find the existing item by shopify_product_id with more flexible matching
  const { data: existingItems } = await supabase
    .from("items")
    .select(
      "id, shopify_product_id, shopify_variant_id, shopify_inventory_item_id, shopify_location_id"
    )
    .or(
      `shopify_product_id.eq.${data.admin_graphql_api_id},shopify_product_id.eq.gid://shopify/Product/${id}`
    )
    .is("deleted_at", null);

  // Handle no items found
  if (!existingItems || existingItems.length === 0) {
    console.log("Item not found for update, creating new item:", id);
    return handleProductCreate(data, storeId);
  }

  // Handle multiple matching items - keep the first, mark others as duplicates
  if (existingItems.length > 1) {
    console.log(
      "Found multiple items with the same Shopify ID. Marking extras as duplicates."
    );

    // Keep the first one, mark others as duplicates
    for (let i = 1; i < existingItems.length; i++) {
      await supabase
        .from("items")
        .update({
          deleted_at: new Date().toISOString(),
          status: "deleted",
          duplicated: true,
        })
        .eq("id", existingItems[i].id);
      console.log(`Marked item ${existingItems[i].id} as duplicate`);
    }
  }

  // Use the first item for update
  const existingItem = existingItems[0];

  // Get the store's Shopify access token to make API calls
  const { data: store } = await supabase
    .from("stores")
    .select("shopify_access_token, shopify_shop_name")
    .eq("id", storeId)
    .single();

  if (!store?.shopify_access_token || !store?.shopify_shop_name) {
    console.error("Missing Shopify credentials for store:", storeId);
    throw new Error("Missing Shopify credentials");
  }

  // Fetch brand logo from logo.dev if vendor name is provided
  let logoUrl = "";
  if (vendor) {
    try {
      const baseUrl =
        "https://paperclipretail-git-development-project-retail-fa44f0e3.vercel.app";
      const logoResponse = await fetch(
        `${baseUrl}/api/logo-search?q=${encodeURIComponent(vendor)}`
      );

      // If logo search fails (like 401 error), just continue without a logo
      if (logoResponse.ok) {
        const logoData = await logoResponse.json();
        if (logoData.length > 0 && logoData[0].logo_url) {
          logoUrl = logoData[0].logo_url;
          console.log("Found logo for brand (update):", vendor, logoUrl);
        }
      } else {
        // Don't treat this as an error, just log and continue
        console.log(
          `Logo search returned status ${logoResponse.status} for brand: ${vendor}`
        );
      }
    } catch (error: any) {
      // Just log the error and continue without a logo
      console.log(
        "Failed to fetch brand logo, continuing without it:",
        error.message
      );
    }
  }

  // Fetch complete product data with inventory information
  try {
    const graphqlQuery = `
      query {
        product(id: "${data.admin_graphql_api_id}") {
          id
          variants(first: 10) {
            edges {
              node {
                id
                price
                inventoryItem {
                  id
                  inventoryLevels(first: 1) {
                    edges {
                      node {
                        quantities(names: ["available"]) {
                          name
                          quantity
                        }
                        location {
                          id
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const shopifyResponse = await fetch(
      `https://${store.shopify_shop_name}/admin/api/2023-10/graphql.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": store.shopify_access_token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: graphqlQuery }),
      }
    );

    const shopifyData = await shopifyResponse.json();
    console.log(
      "Fetched complete product data from Shopify for update:",
      JSON.stringify(shopifyData, null, 2)
    );

    if (shopifyData.data?.product?.variants?.edges?.length > 0) {
      const firstVariant = shopifyData.data.product.variants.edges[0].node;

      // Update the variant with the correct price and inventory information
      if (variants.length > 0 && firstVariant) {
        variants[0].price = firstVariant.price;

        if (firstVariant.inventoryItem?.inventoryLevels?.edges?.length > 0) {
          const inventoryLevel =
            firstVariant.inventoryItem.inventoryLevels.edges[0].node;
          const availableQuantity = inventoryLevel.quantities.find(
            (q: { name: string; quantity: number }) => q.name === "available"
          );
          variants[0].inventory_quantity = availableQuantity
            ? availableQuantity.quantity
            : 0;
          variants[0].inventory_item_id = firstVariant.inventoryItem.id
            .split("/")
            .pop();

          // Store the location ID for future inventory updates
          data.location_id = inventoryLevel.location.id.split("/").pop();
        }
      }
    }
  } catch (error) {
    console.error(
      "Error fetching complete product data from Shopify for update:",
      error
    );
    // Continue with the webhook data even if the additional fetch fails
  }

  // Map the Shopify category to our database category using OpenAI
  // Always use OpenAI for mapping, even if category data is provided in the webhook
  const categoryPath = await mapCategory(data);
  console.log("Category path from OpenAI:", categoryPath);

  // Get or create the category in our database
  const categoryId = await getCategoryIdFromPath(
    categoryPath || "",
    storeId,
    supabase
  );
  console.log("Category ID in our database:", categoryId);

  // Get the main variant
  const mainVariant = variants[0];

  // Extract attributes based on options and variant data
  let size: string | null = null;
  let color: string | null = null;
  let condition: string | null = null;

  // Try to extract values directly from options
  if (options && options.length > 0 && variants && variants.length > 0) {
    // Log all options for debugging
    console.log("Options from Shopify:", JSON.stringify(options, null, 2));
    console.log("Variant data:", JSON.stringify(variants[0], null, 2));

    // First, find which options correspond to size, color, and condition
    const sizeOption = options.find(
      (opt) =>
        opt.name.toLowerCase() === "size" ||
        opt.name.toLowerCase().includes("size")
    );

    const colorOption = options.find(
      (opt) =>
        opt.name.toLowerCase() === "color" ||
        opt.name.toLowerCase().includes("color") ||
        opt.name.toLowerCase().includes("colour")
    );

    const conditionOption = options.find(
      (opt) =>
        opt.name.toLowerCase() === "condition" ||
        opt.name.toLowerCase().includes("condition") ||
        opt.name.toLowerCase().includes("state")
    );

    // Then get the values for each option from the variant
    if (sizeOption) {
      const optionIndex = sizeOption.position;
      if (optionIndex === 1 && mainVariant.option1) size = mainVariant.option1;
      else if (optionIndex === 2 && mainVariant.option2)
        size = mainVariant.option2;
      else if (optionIndex === 3 && mainVariant.option3)
        size = mainVariant.option3;
      console.log(`Found size option at position ${optionIndex}: ${size}`);
    }

    if (colorOption) {
      const optionIndex = colorOption.position;
      if (optionIndex === 1 && mainVariant.option1) color = mainVariant.option1;
      else if (optionIndex === 2 && mainVariant.option2)
        color = mainVariant.option2;
      else if (optionIndex === 3 && mainVariant.option3)
        color = mainVariant.option3;
      console.log(`Found color option at position ${optionIndex}: ${color}`);
    }

    if (conditionOption) {
      const optionIndex = conditionOption.position;
      if (optionIndex === 1 && mainVariant.option1)
        condition = mainVariant.option1;
      else if (optionIndex === 2 && mainVariant.option2)
        condition = mainVariant.option2;
      else if (optionIndex === 3 && mainVariant.option3)
        condition = mainVariant.option3;
      console.log(
        `Found condition option at position ${optionIndex}: ${condition}`
      );
    }
  }

  // If we couldn't extract the values from the options, try to extract from variant title
  if ((!size || !color || !condition) && variants && variants.length > 0) {
    const mainVariant = variants[0];

    if (mainVariant.title && mainVariant.title !== "Default Title") {
      console.log(
        "Attempting to extract from variant title:",
        mainVariant.title
      );
      const titleParts = mainVariant.title.split(" / ");

      // Try to identify each part based on pattern matching
      for (const part of titleParts) {
        const trimmedPart = part.trim();

        // Common size patterns
        if (!size && /^(XS|S|M|L|XL|XXL)$/i.test(trimmedPart)) {
          size = trimmedPart;
          console.log("Extracted size from title:", size);
        }
        // Common color patterns
        else if (
          !color &&
          /^(Red|Blue|Green|Black|White|Yellow|Purple|Pink|Orange|Brown|Grey|Gray)$/i.test(
            trimmedPart
          )
        ) {
          color = trimmedPart;
          console.log("Extracted color from title:", color);
        }
        // Common condition patterns
        else if (!condition && /^(New|Used|Refurbished)$/i.test(trimmedPart)) {
          condition = trimmedPart;
          console.log("Extracted condition from title:", condition);
        }
      }
    }
  }

  // Extract color from title or description if still not found
  if (!color) {
    const colorMatch = (title + " " + body_html).match(
      /\b(red|blue|green|black|white|yellow|purple|pink|orange|brown|grey|gray)\b/i
    );
    if (colorMatch) {
      color = colorMatch[0].toLowerCase();
      console.log("Extracted color from product text:", color);
    }
  }

  let color_id: string | null = null;

    if (color) {
    color_id = await getOrCreateLookup(supabase, "colors", color);
  }

  console.log(
    "Product attributes - Size:",
    size,
    "Color:",
    color,
    "Condition:",
    condition
  );
  console.log("Product price from Shopify (update):", mainVariant.price);
  console.log(
    "Product quantity from Shopify (update):",
    mainVariant.inventory_quantity
  );
  console.log("Inventory item ID:", mainVariant.inventory_item_id);
  console.log("Location ID:", data.location_id);

  // Validate condition against allowed values
  const validConditions = ["New", "Refurbished", "Used"] as const;
  type ValidCondition = (typeof validConditions)[number];
  let normalizedCondition: ValidCondition = "New"; // Default value

  // Normalize condition value
  if (condition !== null) {
    // First try exact match
    const exactMatch = validConditions.find((c) => c === condition);
    if (exactMatch) {
      normalizedCondition = exactMatch;
    } else {
      // Try case-insensitive match
      const caseInsensitiveMatch = validConditions.find(
        (c) => c.toLowerCase() === condition?.toLowerCase()
      );

      if (caseInsensitiveMatch) {
        normalizedCondition = caseInsensitiveMatch;
      } else if (condition) {
        // Try to match by similarity ("Uesd" should match "Used")
        if (
          condition.toLowerCase().includes("new") ||
          condition.toLowerCase() === "brand new"
        ) {
          normalizedCondition = "New";
        } else if (
          condition.toLowerCase().includes("used") ||
          condition.toLowerCase().includes("uesd") ||
          condition.toLowerCase().includes("second hand")
        ) {
          normalizedCondition = "Used";
        } else if (
          condition.toLowerCase().includes("refurbished") ||
          condition.toLowerCase().includes("refurb") ||
          condition.toLowerCase().includes("renewed")
        ) {
          normalizedCondition = "Refurbished";
        } else {
          // Default to New if no match
          console.log(
            `Condition "${condition}" is not valid. Using default value "New".`
          );
          normalizedCondition = "New";
        }
      }
    }
  } else {
    // If no condition provided, default to New
    console.log("No condition provided. Using default value 'New'.");
    normalizedCondition = "New";
  }

  console.log("Normalized condition:", normalizedCondition);

  // Parse tags into an array
  const tagArray = tags ? tags.split(",").map((tag) => tag.trim()) : [];
  console.log("Product tags:", tagArray);

  // Update the item record
  const { error: updateError } = await supabase
    .from("items")
    .update({
      title,
      description: body_html,
      brand: vendor,
      logo_url: logoUrl,
      category_id: categoryId,
      price: parseFloat(mainVariant.price) || 0,
      quantity: mainVariant.inventory_quantity || 0,
      size,
      color,
       color_id,
      condition: normalizedCondition,
      shopify_variant_id: mainVariant.admin_graphql_api_id,
      shopify_inventory_item_id: mainVariant.inventory_item_id
        ? `gid://shopify/InventoryItem/${mainVariant.inventory_item_id}`
        : existingItem.shopify_inventory_item_id,
      shopify_location_id: data.location_id
        ? `gid://shopify/Location/${data.location_id}`
        : existingItem.shopify_location_id,
      tags: tagArray,
      status: status.toLowerCase(),
    })
    .eq("id", existingItem.id);

  if (updateError) {
    console.error("Error updating item:", updateError);
    throw updateError;
  }

  console.log("Updated item:", existingItem.id);

  // Handle images
  if (images && images.length > 0) {
    console.log(`Processing ${images.length} images from Shopify`);

    try {
      // First, get all existing images for this item
      const { data: existingImages, error: imageQueryError } = await supabase
        .from("item_images")
        .select("id, image_url, shopify_media_id")
        .eq("item_id", existingItem.id);

      if (imageQueryError) {
        console.error("Error fetching existing images:", imageQueryError);
        throw imageQueryError;
      }

      console.log(
        `Found ${existingImages?.length || 0} existing images in our database`
      );

      // Map of Shopify media IDs to our database record IDs
      const existingImageMap = new Map();
      existingImages?.forEach((img) => {
        if (img.shopify_media_id) {
          existingImageMap.set(img.shopify_media_id, img.id);
        }
      });

      // Create a set of Shopify media IDs from the updated product
      const shopifyMediaIds = new Set(
        images.map((img) => img.admin_graphql_api_id)
      );

      // Images that are no longer in Shopify should be deleted
      const imagesToDelete =
        existingImages?.filter(
          (img) =>
            img.shopify_media_id && !shopifyMediaIds.has(img.shopify_media_id)
        ) || [];

      if (imagesToDelete.length > 0) {
        console.log(
          `Deleting ${imagesToDelete.length} images that no longer exist in Shopify`
        );

        const imageIdsToDelete = imagesToDelete.map((img) => img.id);

        const { error: deleteError } = await supabase
          .from("item_images")
          .delete()
          .in("id", imageIdsToDelete);

        if (deleteError) {
          console.error("Error deleting images:", deleteError);
        }
      }

      // Process the updated/new images from Shopify
      const imagePromises = images.map(async (image, index) => {
        const existingId = existingImageMap.get(image.admin_graphql_api_id);

        if (existingId) {
          // Image already exists, update it
          return supabase
            .from("item_images")
            .update({
              image_url: image.src,
              display_order: index,
            })
            .eq("id", existingId);
        } else {
          // New image, insert it
          return supabase.from("item_images").insert({
            item_id: existingItem.id,
            image_url: image.src,
            display_order: index,
            shopify_media_id: image.admin_graphql_api_id,
          });
        }
      });

      await Promise.all(imagePromises);
      console.log(`Successfully processed ${images.length} images for item`);
    } catch (error) {
      console.error("Error handling images:", error);
      // Don't throw here, allow the update to complete even if image processing fails
    }
  } else if (images && images.length === 0) {
    // If Shopify has no images, delete all our images
    console.log("No images in Shopify product, deleting all existing images");

    // const { error: deleteError } = await supabase
    //   .from("item_images")
    //   .delete()
    //   .eq("item_id", existingItem.id);

    // if (deleteError) {
    //   console.error("Error deleting images:", deleteError);
    // }
  }

  return existingItem;
}

// Handler for product deletion events
async function handleProductDelete(
  data: { id: number },
  storeId: string
): Promise<void> {
  const supabase = await createClient();

  // Format the ID as GraphQL ID
  const graphqlId = `gid://shopify/Product/${data.id}`;

  // Mark the item as deleted in the database
  const { error } = await supabase
    .from("items")
    .update({
      deleted_at: new Date().toISOString(),
      status: "deleted",
    })
    .or(`shopify_product_id.eq.${graphqlId},shopify_product_id.eq.${data.id}`);

  if (error) {
    console.error("Error marking item as deleted:", error);
    throw error;
  }

  console.log("Marked item as deleted:", data.id);
}

// Handler for inventory update events
async function handleInventoryUpdate(
  data: ShopifyInventoryData,
  storeId: string
): Promise<void> {
  const supabase = await createClient();
  const { inventory_item_id, location_id, available } = data;

  // Format the full GIDs for inventory item and location
  const fullInventoryItemId = `gid://shopify/InventoryItem/${inventory_item_id}`;
  const fullLocationId = `gid://shopify/Location/${location_id}`;

  // Update the quantity in the database
  const { data: item, error: fetchError } = await supabase
    .from("items")
    .select("id, quantity")
    .eq("shopify_inventory_item_id", fullInventoryItemId)
    .eq("shopify_location_id", fullLocationId)
    .single();

  if (fetchError) {
    console.error("Item not found for inventory update:", {
      inventory_item_id,
      location_id,
      fetchError,
    });
    throw fetchError;
  }

  const { error: updateError } = await supabase
    .from("items")
    .update({ quantity: available })
    .eq("id", item.id);

  if (updateError) {
    console.error("Error updating inventory level:", updateError);
    throw updateError;
  }

  console.log(
    `Updated item ${item.id} quantity from ${item.quantity} to ${available}`
  );
}
