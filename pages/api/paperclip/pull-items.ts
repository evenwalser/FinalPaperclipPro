import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/utils/supabase/server';
import fetch from 'node-fetch';

async function getPaperclipToken(userId: string): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('user_tokens')
    .select('paperclip_token')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    throw new Error('Unable to fetch Paperclip token');
  }
  return data.paperclip_token;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const paperclipToken = await getPaperclipToken(user.id);
    const response = await fetch(`${process.env.NEXT_PUBLIC_PAPERCLIP_API_URL}/v4/items`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${paperclipToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch items from Paperclip: ${errorText}`);
    }

    const paperclipItems = await response.json();

    for (const item of paperclipItems.data) {
      const { data: existingItem, error: fetchError } = await supabase
        .from('items')
        .select('*')
        .eq('paperclip_marketplace_id', item.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error('Error fetching item:', fetchError);
        continue;
      }

      if (!existingItem) {
        // Insert new item
        const { error: insertError } = await supabase
          .from('items')
          .insert({
            name: item.name,
            description: item.description,
            price: item.price,
            condition: item.condition,
            paperclip_marketplace_id: item.id,
            listed_on_paperclip: true,
            // Add other fields as needed (e.g., brand, size, tags)
          });

        if (insertError) {
          console.error('Error inserting item:', insertError);
        }
      } else {
        // Update existing item if there are differences (optional)
        const { error: updateError } = await supabase
          .from('items')
          .update({
            name: item.name,
            description: item.description,
            price: item.price,
            condition: item.condition,
            // Update other fields as needed
          })
          .eq('paperclip_marketplace_id', item.id);

        if (updateError) {
          console.error('Error updating item:', updateError);
        }
      }
    }

    return res.status(200).json({ message: 'Items pulled successfully' });
  } catch (error) {
    console.error('Error pulling items:', error);
    return res.status(500).json({ error: 'Failed to pull items' });
  }
}