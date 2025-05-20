import { supabase } from '../supabase'

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  level: number;
  path: string;
  metadata: {
    description?: string;
    icon?: string;
    displayOrder?: number;
  };
  children: Category[];
}

export async function createCategory({
  name,
  parentId,
  metadata = {}
}: {
  name: string;
  parentId?: string;
  metadata?: Record<string, any>;
}) {
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  
  // Get parent path if parentId exists
  let path = slug;
  let level = 1;
  
  if (parentId) {
    const { data: parent } = await supabase
      .from('categories')
      .select('path, level')
      .eq('id', parentId)
      .single();
      
    if (parent) {
      path = `${parent.path}.${slug}`;
      level = parent.level + 1;
    }
  }

  const { data, error } = await supabase
    .from('categories')
    .insert({
      name,
      slug,
      parent_id: parentId || null,
      level,
      path,
      metadata
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCategoryTree() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('path');

  if (error) throw error;

  // Convert flat list to tree structure
  return buildCategoryTree(data);
}

export async function updateCategory(
  id: string,
  updates: Partial<Omit<Category, 'id' | 'path'>>
) {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string) {
  // First check if category has children
  const { data: children } = await supabase
    .from('categories')
    .select('id')
    .eq('parent_id', id);

  if (children?.length) {
    throw new Error('Cannot delete category with subcategories');
  }

  // Check if category has items
  const { data: items } = await supabase
    .from('items')
    .select('id')
    .eq('category_path', id);

  if (items?.length) {
    throw new Error('Cannot delete category with items');
  }

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Helper function to build tree structure
function buildCategoryTree(categories: Category[]) {
  const tree: Record<string, any> = {};
  const lookup: Record<string, any> = {};

  categories.forEach(category => {
    lookup[category.id] = { 
      ...category, 
      children: [] 
    };
  });

  categories.forEach(category => {
    if (category.parent_id) {
      lookup[category.parent_id].children.push(lookup[category.id]);
    } else {
      tree[category.id] = lookup[category.id];
    }
  });

  return Object.values(tree);
} 