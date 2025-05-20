import { NextResponse } from "next/server";
import { getItems } from "@/lib/services/items";
import { getShopifyCredentials } from "@/lib/shopify";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get("storeId");
  const nextToken = searchParams.get("nextToken");
  const filters = searchParams.get("filters");

  if (!storeId) {
    return NextResponse.json({ error: "storeId is required" }, { status: 400 });
  }

  try {
    const { accessToken, shopName } = await getShopifyCredentials(storeId);
    const perPage = 9;

    if (accessToken && shopName) {
      console.log("Fetching from Shopify");
      let shop = shopName.replace(".myshopify.com", "");
      const endpoint = `https://${shop}.myshopify.com/admin/api/2023-10/graphql.json`;
      const headers = {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      };

      let queryString = "";
      if (filters) {
        const filterObj = JSON.parse(filters);
        if (filterObj.search) queryString += `title:*${filterObj.search}* `;
        if (filterObj.category !== "all") queryString += `product_type:${filterObj.category} `;
        if (filterObj.brands?.length) {
          queryString += filterObj.brands.map((b: string) => `vendor:${b}`).join(" OR ");
        }
      }

      const graphqlQuery = {
        query: `
          query {
            products(first: ${perPage}, ${nextToken ? `after: "${nextToken}"` : ""} ${
          queryString ? `, query: "${queryString.trim()}"` : ""
        }) {
              edges {
                node {
                  id
                  title
                  description
                  productType
                  vendor
                  images(first: 1) {
                    edges {
                      node {
                        src
                      }
                    }
                  }
                  options {
                    name
                    values
                  }
                  variants(first: 250) {
                    edges {
                      node {
                        price
                        inventoryQuantity
                      }
                    }
                  }
                }
                cursor
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        `,
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(graphqlQuery),
      });

      const data = await response.json();
      console.log("🚀 ~ GET ~ data:", data)
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      const items = data.data.products.edges.map((edge: any) => ({
        id: edge.node.id,
        title: edge.node.title,
        price: parseFloat(edge.node.variants.edges[0]?.node.price || "0"),
        image_url: edge.node.images.edges[0]?.node.src || null,
        categories: [{ name: edge.node.productType || "N/A" }],
        brand: edge.node.vendor || "N/A",
        quantity: edge.node.variants.edges.reduce(
          (sum: number, v: any) => sum + (v.node.inventoryQuantity || 0),
          0
        ),
        description: edge.node.description || "",
        available_options: edge.node.options.map((opt: any) => ({
            name: opt.name,
          values: opt.values,
        })),
        
      }));
    //   console.log("🚀 ~ available_options:edge.node.options.map ~ available_options:", available_options)
      console.log("🚀 ~ items ~ data.data.products.edges:", data.data.products.edges)

      const pageInfo = data.data.products.pageInfo;
      console.log("🚀 ~ GET ~ pageInfo:", pageInfo)
      return NextResponse.json({
        items,
        hasMore: pageInfo.hasNextPage,
        nextToken: pageInfo.hasNextPage ? pageInfo.endCursor : null,
      });
    } else {
      console.log("Falling back to Supabase");
      const page = nextToken ? parseInt(nextToken) : 1;
      const user = { store_id: storeId };
      const { items, totalPages } = await getItems(
        page,
        perPage,
        user,
        filters ? JSON.parse(filters) : {}
      );

      return NextResponse.json({
        items,
        hasMore: page < totalPages,
        nextToken: page < totalPages ? (page + 1).toString() : null,
      });
    }
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}