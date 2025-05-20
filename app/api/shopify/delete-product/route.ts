

// File: app/api/shopify/delete-product/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server'; // Adjust path as needed
import { getShopifyCredentials } from '@/lib/shopify'; // Adjust path as needed

export async function POST(request: Request) {
  try {
    // Parse JSON body
    const { itemId, storeId } = await request.json();
    if (!itemId || !storeId) {
      return NextResponse.json(
        { error: 'Missing itemId or storeId' },
        { status: 400 }
      );
    }

    // Initialize Supabase client and authenticate user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify store ownership
    const { data: store } = await supabase
      .from('stores')
      .select('id')
      .eq('id', storeId)
      .eq('owner_id', user.id)
      .single();
    if (!store) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Fetch the item's Shopify product ID
    const { data: item, error: itemError } = await supabase
      .from('items')
      .select('shopify_product_id')
      .eq('id', itemId)
      .single();
    if (itemError) {
      throw itemError;
    }

    // If the item has a Shopify product ID, attempt to delete it from Shopify
    if (item.shopify_product_id) {
      const { accessToken, shopName } = await getShopifyCredentials(storeId);
      if (!accessToken || !shopName) {
        throw new Error('Shopify not connected');
      }

      const mutation = `
        mutation {
          productDelete(input: {id: "${item.shopify_product_id}"}) {
            deletedProductId
            userErrors {
              field
              message
            }
          }
        }
      `;

      const response = await fetch(
        `https://${shopName}/admin/api/2025-01/graphql.json`,
        {
          method: 'POST',
          headers: {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: mutation }),
        }
      );

      const result = await response.json();
      if (result.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
      }
      const { deletedProductId, userErrors } = result.data.productDelete;
      if (userErrors?.length > 0) {
        throw new Error(`Shopify errors: ${JSON.stringify(userErrors)}`);
      }
      if (!deletedProductId) {
        throw new Error('Failed to delete product in Shopify');
      }
      console.log(`Deleted Shopify product with ID: ${deletedProductId}`);
    // }

    // Mark the item as deleted in the local database
    const { error: deleteError } = await supabase
      .from('items')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', itemId);
    if (deleteError) {
      throw deleteError;
    }

    // Return success response regardless of whether a Shopify deletion was needed
    return NextResponse.json(
      { message: 'Item successfully deleted' },
      { status: 200 }
    );
}
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
