import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Utility function to get Shopify credentials (assumed to exist)
import { getShopifyCredentials } from "@/lib/shopify";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { storeId, itemId } = body; 
    console.log("Received itemId in API:", itemId);
    if (!storeId || !itemId) {
      return NextResponse.json(
        { error: "Missing storeId or itemId" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify store ownership
    const { data: store } = await supabase
      .from("stores")
      .select("id")
      .eq("id", storeId)
      .eq("owner_id", user.id)
      .single();

    if (!store) {
      return NextResponse.json(
        { error: "Forbidden: You do not own this store" },
        { status: 403 }
      );
    }

    const { accessToken, shopName } = await getShopifyCredentials(storeId);
    if (!accessToken || !shopName) {
      return NextResponse.json(
        { error: "Shopify not connected" },
        { status: 400 }
      );
    }

    // Fetch item details
    const { data: item, error: itemError } = await supabase
      .from("items")
      .select("*")
      .eq("id", itemId)
      .single();
    if (itemError || !item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Fetch item images
    const { data: images, error: imageError } = await supabase
      .from("item_images")
      .select("*")
      .eq("item_id", itemId)
      .order("display_order");
      console.log("🚀 ~ POST ~ images:", images)
      console.log("🚀 ~ POST ~ itemid:", itemId)

    if (imageError) {
      return NextResponse.json(
        { error: "Failed to fetch images" },
        { status: 500 }
      );
    }

    // Fetch category hierarchy
    const categoryHierarchy = await getCategoryHierarchy(
      item.category_id,
      supabase
    );

    // Create Shopify product
    const product = await createShopifyProduct(
      shopName,
      accessToken,
      item,
      images,
      categoryHierarchy
    );
    await publishProduct(product.productId, shopName, accessToken);

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error creating Shopify product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function createShopifyProduct(
  shopName: string,
  accessToken: string,
  item: any,
  images: any[],
  categoryHierarchy: string[]
) {
  console.log("here is images", images);

  // Fetch location ID
  const locationQuery = `
    query {
      locations(first: 1) {
        edges {
          node {
            id
          }
        }
      }
    }
  `;
  const locationResponse = await fetch(
    `https://${shopName}/admin/api/2023-10/graphql.json`,
    {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: locationQuery }),
    }
  );
  const locationData = await locationResponse.json();
  if (locationData.errors) {
    throw new Error(JSON.stringify(locationData.errors));
  }
  const locationId = locationData.data.locations.edges[0].node.id;
  console.log("Location DATA:", locationData);
  console.log("Location ID:", locationId);

  async function getCollectionIdByTitle(shopName: string, accessToken: string, title: string) {
    const query = `
      query {
        collections(first: 1, query: "title:'${title}'") {
          edges {
            node {
              id
            }
          }
        }
      }
    `;
    const response = await fetch(
      `https://${shopName}/admin/api/2023-10/graphql.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      }
    );
    const result = await response.json();
    if (result.errors) {
      throw new Error(JSON.stringify(result.errors));
    }
    const collections = result.data.collections.edges;
    return collections.length > 0 ? collections[0].node.id : null;
  }

  // Fetch collection ID
  const collectionTitle = categoryHierarchy.join(" > ");
  const collectionId = await getCollectionIdByTitle(
    shopName,
    accessToken,
    collectionTitle
  );

  // Build product options and variant options
  const productOptions = [];
  const variantOptions = [];
  if (item.size) {
    productOptions.push({ name: "Size", values: [{ name: item.size }] });
    variantOptions.push(item.size);
  }
  if (item.color) {
    productOptions.push({ name: "Color", values: [{ name: item.color }] });
    variantOptions.push(item.color);
  }
  if (item.condition) {
    productOptions.push({
      name: "Condition",
      values: [{ name: item.condition }],
    });
    variantOptions.push(item.condition);
  }

  // Mutation to create product and fetch inventory details
  const mutation = `
    mutation CreateProduct($input: ProductInput!, $media: [CreateMediaInput!]) {
      productCreate(input: $input, media: $media) {
        product {
          id
          variants(first: 1) {
            edges {
              node {
                id
                inventoryItem {
                  id
                  inventoryLevels(first: 1) {
                    edges {
                      node {
                        id
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
            media(first: 10) { nodes { id } }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      title: item.title,
      descriptionHtml: item.description || "",
      vendor: item.brand || "Default Vendor",
      productType: categoryHierarchy.join(" > "),
      tags: item.tags || [],
      status: "ACTIVE",
      collectionsToJoin: collectionId ? [collectionId] : [],
      productOptions: productOptions,
      variants: [
        {
          options: variantOptions,
          price: item.price.toString(),
          inventoryManagement: "SHOPIFY",
          inventoryQuantities: [
            {
              locationId: locationId,
              availableQuantity: item.quantity,
            },
          ],
        },
      ],
    },
    media: images.map((img, index) => ({
      mediaContentType: "IMAGE",
      originalSource: img.image_url,
      alt: `${item.title} - Image ${index + 1}`,
    })),
  };
  console.log("here is media ", variables);

  const response = await fetch(
    `https://${shopName}/admin/api/2023-10/graphql.json`,
    {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: mutation, variables }),
    }
  );

  const result = await response.json();
  if (result.errors || result.data.productCreate.userErrors.length > 0) {
    throw new Error(
      JSON.stringify(result.errors || result.data.productCreate.userErrors)
    );
  }

  // Extract required IDs
  const productId = result.data.productCreate.product.id;
  const variantId = result.data.productCreate.product.variants.edges[0].node.id;
  const inventoryLevelId =
    result.data.productCreate.product.variants.edges[0].node.inventoryItem
      .inventoryLevels.edges[0].node.id;
  const inventoryItemId =
    result.data.productCreate.product.variants.edges[0].node.inventoryItem.id;
  const locationIdFromResponse =
    result.data.productCreate.product.variants.edges[0].node.inventoryItem
      .inventoryLevels.edges[0].node.location.id;
  const media = result.data.productCreate.product.media.nodes

  console.log('product id', productId);
  console.log('variant id', variantId);
  console.log('inventoryLevelId', inventoryLevelId);
  console.log('inventoryItemId', inventoryItemId);
  console.log('locationId', locationIdFromResponse);
  console.log('media', media);
  console.log('media[0]', media[0]);



  return { productId, variantId, inventoryLevelId, inventoryItemId, locationId: locationIdFromResponse };
}


// async function createShopifyProduct(
//   shopName,
//   accessToken,
//   item,
//   images,
//   categoryHierarchy
// ) {
//   console.log("here is images", images);
//   // Fetch location ID (already present in your code)
//   const locationQuery = `
//     query {
//       locations(first: 1) {
//         edges {
//           node {
//             id
//           }
//         }
//       }
//     }
//   `;
//   const locationResponse = await fetch(
//     `https://${shopName}/admin/api/2023-10/graphql.json`,
//     {
//       method: "POST",
//       headers: {
//         "X-Shopify-Access-Token": accessToken,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ query: locationQuery }),
//     }
//   );
//   const locationData = await locationResponse.json();
//   if (locationData.errors) {
//     throw new Error(JSON.stringify(locationData.errors));
//   }
//   const locationId = locationData.data.locations.edges[0].node.id;
//   console.log("Location DATA:", locationData);
//   console.log("Location ID:", locationId);

//   async function getCollectionIdByTitle(shopName, accessToken, title) {
//     const query = `
//       query {
//         collections(first: 1, query: "title:'${title}'") {
//           edges {
//             node {
//               id
//             }
//           }
//         }
//       }
//     `;
//     const response = await fetch(
//       `https://${shopName}/admin/api/2023-10/graphql.json`,
//       {
//         method: "POST",
//         headers: {
//           "X-Shopify-Access-Token": accessToken,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ query }),
//       }
//     );
//     const result = await response.json();
//     if (result.errors) {
//       throw new Error(JSON.stringify(result.errors));
//     }
//     const collections = result.data.collections.edges;
//     return collections.length > 0 ? collections[0].node.id : null;
//   }

//   // Fetch collection ID (already present in your code)
//   const collectionTitle = categoryHierarchy.join(" > ");
//   const collectionId = await getCollectionIdByTitle(
//     shopName,
//     accessToken,
//     collectionTitle
//   );

//   // Build product options and variant options
//   const productOptions = [];
//   const variantOptions = [];
//   if (item.size) {
//     productOptions.push({ name: "Size", values: [{ name: item.size }] });
//     variantOptions.push(item.size);
//   }
//   if (item.color) {
//     productOptions.push({ name: "Color", values: [{ name: item.color }] });
//     variantOptions.push(item.color);
//   }
//   if (item.condition) {
//     productOptions.push({
//       name: "Condition",
//       values: [{ name: item.condition }],
//     });
//     variantOptions.push(item.condition);
//   }

//   // Updated mutation to include inventoryLevels
//   const mutation = `
//     mutation CreateProduct($input: ProductInput!, $media: [CreateMediaInput!]) {
//       productCreate(input: $input, media: $media) {
//         product {
//           id
//           variants(first: 1) {
//             edges {
//               node {
//                 id
//                 inventoryItem {
//                   id
//                   inventoryLevels(first: 1) {
//                     edges {
//                         node {
//                     id
//                     quantities(names: ["available"]) {
//                       name
//                       quantity
//                     }
//                         location {
//                           id
//                         }
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//         userErrors {
//           field
//           message
//         }
//       }
//     }
//   `;

//   const variables = {
//     input: {
//       title: item.title,
//       descriptionHtml: item.description || "",
//       vendor: item.brand || "Default Vendor",
//       productType: categoryHierarchy.join(" > "),
//       tags: item.tags || [],
//       status: "ACTIVE",
//       collectionsToJoin: collectionId ? [collectionId] : [],
//       productOptions: productOptions,
//       variants: [
//         {
//           options: variantOptions,
//           price: item.price.toString(),
//           inventoryManagement: "SHOPIFY",
//           inventoryQuantities: [
//             {
//               locationId: locationId,
//               availableQuantity: item.quantity,
//             },
//           ],
//         },
//       ],
//     },
//     media: images.map((img, index) => ({
//       mediaContentType: "IMAGE",
//       originalSource: img.image_url,
//       alt: `${item.title} - Image ${index + 1}`,
//     })),
//   };
//   console.log("here is media ", variables);
//   const response = await fetch(
//     `https://${shopName}/admin/api/2023-10/graphql.json`,
//     {
//       method: "POST",
//       headers: {
//         "X-Shopify-Access-Token": accessToken,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ query: mutation, variables }),
//     }
//   );

//   const result = await response.json();
//   if (result.errors || result.data.productCreate.userErrors.length > 0) {
//     throw new Error(
//       JSON.stringify(result.errors || result.data.productCreate.userErrors)
//     );
//   }

//   const productId = result.data.productCreate.product.id;
//   const variantId = result.data.productCreate.product.variants.edges[0].node.id;
//   const inventoryLevelId =
//     result.data.productCreate.product.variants.edges[0].node.inventoryItem
//       .inventoryLevels.edges[0].node.id;
//   console.log('product id', productId);
//   console.log('varient id', variantId)
//   console.log('inventoryLevelId',inventoryLevelId)
//   return { productId, variantId, inventoryLevelId };
// }

async function getOnlineStorePublicationId(shopName: string, accessToken: string) {
  const query = `
    query {
      publications(first: 10) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  `;

  const response = await fetch(
    `https://${shopName}/admin/api/2023-10/graphql.json`,
    {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    }
  );

  const result = await response.json();
  if (result.errors) {
    throw new Error(JSON.stringify(result.errors));
  }

  const publications = result.data.publications.edges;
  const onlineStorePub = publications.find(
    (pub: { node: { name: string } }) => pub.node.name === "Online Store"
  );
  if (!onlineStorePub) {
    throw new Error("Online Store publication not found");
  }

  return onlineStorePub.node.id;
}

export async function publishProduct(productId: string, shopName: string, accessToken: string) {
  const publicationId = await getOnlineStorePublicationId(
    shopName,
    accessToken
  );
  const publishMutation = `
    mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
      publishablePublish(id: $id, input: $input) {
        userErrors {
          field
          message
        }
      }
    }
  `;
  const publishVariables = {
    id: productId,
    input: [
      {
        publicationId, // Publish to Online Store immediately
      },
    ],
  };
  const publishResponse = await fetch(
    `https://${shopName}/admin/api/2023-10/graphql.json`,
    {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: publishMutation,
        variables: publishVariables,
      }),
    }
  );
  const publishResult = await publishResponse.json();
  if (
    publishResult.errors ||
    publishResult.data.publishablePublish.userErrors.length > 0
  ) {
    throw new Error(
      JSON.stringify(
        publishResult.errors || publishResult.data.publishablePublish.userErrors
      )
    );
  }
  // No return needed; product is returned from createShopifyProduct
}

export async function getCategoryHierarchy(categoryId: string, supabase: any) {
  let hierarchy = [];
  let currentId = categoryId;
  while (currentId) {
    const { data } = await supabase
      .from("categories")
      .select("id, name, parent_id")
      .eq("id", currentId)
      .single();
    if (!data) break;
    hierarchy.unshift(data.name);
    currentId = data.parent_id;
  }
  return hierarchy;
}
