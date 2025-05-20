'use client'

import { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Category {
  id: string
  name: string
  slug: string
  path: string
  level: number
  full_path: string
}

interface CategorySelectorProps {
  onSelect: (category: string) => void
  selectedCategory?: string
}

export function CategorySelector({ onSelect, selectedCategory }: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (!response.ok) throw new Error('Failed to fetch categories')
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error('Error loading categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const groupedCategories = categories.reduce((acc, category) => {
    const pathParts = category.path.split('.')
    
    if (category.level === 1) {
      acc[category.path] = {
        name: category.name,
        subcategories: {}
      }
    } else if (category.level === 2) {
      const primary = pathParts[0]
      if (acc[primary]) {
        acc[primary].subcategories[category.path] = {
          name: category.name,
          subcategories: []
        }
      }
    } else if (category.level === 3) {
      const primary = pathParts[0]
      const level2Path = `${pathParts[0]}.${pathParts[1]}`
      if (acc[primary]?.subcategories[level2Path]) {
        acc[primary].subcategories[level2Path].subcategories.push(category)
      }
    }
    return acc
  }, {} as Record<string, { 
    name: string; 
    subcategories: Record<string, {
      name: string;
      subcategories: Category[];
    }>;
  }>)

  if (loading) {
    return <div>Loading categories...</div>
  }

  return (
    <Select onValueChange={onSelect} defaultValue={selectedCategory}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(groupedCategories).map(([primaryPath, { name: primaryName, subcategories }]) => (
          <SelectGroup key={primaryPath}>
            <SelectLabel>{primaryName}</SelectLabel>
            {Object.entries(subcategories).map(([level2Path, { name: level2Name, subcategories: level3Categories }]) => (
              <SelectGroup key={level2Path} className="pl-4">
                <SelectLabel className="font-normal">{level2Name}</SelectLabel>
                {level3Categories.map((level3) => (
                  <SelectItem key={level3.id} value={level3.path} className="pl-8">
                    {level3.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  )
} 