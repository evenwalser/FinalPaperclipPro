import { createClient } from '@/utils/supabase/client';

export async function getShopifyCredentials(storeId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from('stores')
    .select('shopify_access_token, shopify_shop_name')
    .eq('id', storeId)
    .single();
  return { accessToken: data?.shopify_access_token, shopName: data?.shopify_shop_name };
}

export async function createShopifyProduct(storeId: string, item: any) {
  const { accessToken, shopName } = await getShopifyCredentials(storeId);
  if (!accessToken || !shopName) throw new Error('Shopify not connected');

  const productData = {
    product: {
      title: item.title,
      body_html: item.description,
      vendor: 'paperclip_test',
      product_type: item.categories?.[0]?.name || 'Uncategorized',
      tags: [item.condition, item.size, ...item.tags].filter(Boolean).join(', '),
      variants: [{ price: item.price, inventory_quantity: item.quantity, inventory_management: 'shopify' }],
    //   images: item.images.map((img: any) => ({ src: img.image_url || img.url })),
    images: ['https://img.freepik.com/free-photo/closeup-shot-bee-chamomile-flower_181624-31930.jpg?ga=GA1.1.1605806528.1743001276&semt=ais_hybrid'],
    // image:'https://icravvnxexuvxoehhfsa.supabase.co/storage/v…0bc5f92/f8ac6058-637e-4125-81bf-080473b0722e.webp'
    },
  };

  const response = await fetch(`https://${shopName}/admin/api/2023-10/products.json`, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  if (!response.ok) throw new Error('Failed to create Shopify product');
  return await response.json();
}

export async function updateShopifyProduct(storeId: string, item: any) {
  const { accessToken, shopName } = await getShopifyCredentials(storeId);
  if (!accessToken || !shopName) throw new Error('Shopify not connected');

  const productData = {
    product: {
      id: item.shopify_product_id,
      title: item.title,
      body_html: item.description,
      product_type: item.categories?.[0]?.name || 'Uncategorized',
      tags: [item.condition, item.size, ...item.tags].filter(Boolean).join(', '),
      variants: [{ id: item.shopify_variant_id, price: item.price, inventory_quantity: item.quantity }],
      images: item.images.map((img: any) => ({ src: img.image_url || img.url })),
    },
  };

  const response = await fetch(`https://${shopName}/admin/api/2023-10/products/${item.shopify_product_id}.json`, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  if (!response.ok) throw new Error('Failed to update Shopify product');
  return await response.json();
}