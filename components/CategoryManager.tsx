'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, ChevronRight, ChevronDown, MoreVertical, Trash } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Category, createCategory, deleteCategory } from '@/lib/services/categories'

interface CategoryNodeProps {
  category: Category & { children: Category[] };
  onDelete: (id: string) => void;
  onAdd: (parentId: string) => void;
  level: number;
}

function CategoryNode({ category, onDelete, onAdd, level }: CategoryNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between group">
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ paddingLeft: `${level * 1.5}rem` }}
        >
          {category.children.length > 0 && (
            <Button variant="ghost" size="sm">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          )}
          <span className="font-medium">{category.name}</span>
        </div>
        
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onAdd(category.id)}>
                Add Subcategory
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(category.id)}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isExpanded && category.children.length > 0 && (
        <div className="ml-4">
          {category.children.map(child => (
            <CategoryNode
              key={child.id}
              category={child as Category & { children: Category[] }}
              onDelete={onDelete}
              onAdd={onAdd}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const newCategory = {
        ...await createCategory({
          name: newCategoryName,
          parentId: selectedParentId || undefined
        }),
        children: []
      };

      setCategories(prev => [...prev, newCategory]);
      setNewCategoryName('');
      setSelectedParentId(null);
    } catch (error) {
      console.error('Failed to create category:', error);
      alert('Failed to create category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Failed to delete category');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="category-name">New Category</Label>
              <Input
                id="category-name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
              />
            </div>
            <Button 
              onClick={handleAddCategory}
              className="mt-6"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>

          <div className="mt-8">
            {categories.map(category => (
              <CategoryNode
                key={category.id}
                category={category}
                onDelete={handleDeleteCategory}
                onAdd={(parentId) => setSelectedParentId(parentId)}
                level={0}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 