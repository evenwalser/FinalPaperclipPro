import { NextResponse } from 'next/server';
import { getShopifyCredentials } from '@/lib/shopify';
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const { storeId, updates } = await req.json(); // updates: [{ itemId, quantityDelta }]
    if (!storeId || !updates || !Array.isArray(updates)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify store ownership
    const { data: store } = await supabase
      .from('stores')
      .select('id')
      .eq('id', storeId)
      .eq('owner_id', user.id)
      .single();
    if (!store) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { accessToken, shopName } = await getShopifyCredentials(storeId);
    if (!accessToken || !shopName) {
      return NextResponse.json({ error: 'Shopify not connected' }, { status: 400 });
    }

    // Fetch items with shopify_inventory_item_id and shopify_location_id
    const itemIds = updates.map(u => u.itemId);
    const { data: items, error: itemsError } = await supabase
      .from('items')
      .select('id, shopify_inventory_item_id, shopify_location_id')
      .in('id', itemIds);
    if (itemsError) throw itemsError;
    console.log("🚀 ~ POST ~ items:", items);

    const itemMap = new Map(items.map(item => [item.id, {
      inventoryItemId: item.shopify_inventory_item_id, // Dynamic value from DB
      locationId: item.shopify_location_id,           // Dynamic value from DB
    }]));

    const validUpdates = updates.filter(update => {
      const item = itemMap.get(update.itemId);
      return item && item.inventoryItemId && item.locationId;
    });

    if (validUpdates.length === 0) {
      console.log('No valid items to update');
      return NextResponse.json({ message: 'No items to update' }, { status: 200 });
    }

    // Update inventory for each item
    for (const update of validUpdates) {
      const item = itemMap.get(update.itemId) as { inventoryItemId: string; locationId: string };
      const { inventoryItemId, locationId } = item;
      const quantityDelta = update.quantityDelta;
      console.log("🚀 ~ POST ~ quantityDelta:", quantityDelta)

      console.log(`Processing update - Item ID: ${update.itemId}, Delta: ${quantityDelta}`);

      const mutation = `
        mutation {
          inventoryAdjustQuantities(input: {
            changes: [{
              inventoryItemId: "${inventoryItemId}",
              locationId: "${locationId}",
              delta: ${-5}
            }],
            name: "available",
            reason: "correction"
          }) {
            inventoryAdjustmentGroup {
              id
              changes {
                item {
                  id
                }
                location {
                  id
                }
                delta
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const response = await fetch(`https://${shopName}/admin/api/2025-01/graphql.json`, {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: mutation }),
      });

      const result = await response.json();
      console.log('Shopify API result:', JSON.stringify(result, null, 2));

      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
      } else if (result.data && result.data.inventoryAdjustQuantities) {
        const { inventoryAdjustmentGroup, userErrors } = result.data.inventoryAdjustQuantities;
        if (userErrors.length > 0) {
          console.error('User errors:', userErrors);
        } else if (inventoryAdjustmentGroup) {
          console.log('Inventory adjusted successfully:', inventoryAdjustmentGroup);
        } else {
          console.error('Unexpected response structure:', result.data);
        }
      } else {
        console.error('Mutation failed, no data returned:', result);
      }
    }

    return NextResponse.json({ message: 'Inventory updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating Shopify inventory:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}