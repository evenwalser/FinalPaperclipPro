'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  name: string
  slug: string
  path: string
  level: number
}

interface CategorySelectorProps {
  onSelect: (category: string) => void
  selectedCategory?: string
}

export function CategorySelectorV2({ onSelect, selectedCategory }: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPrimary, setSelectedPrimary] = useState<Category | null>(null)
  const [selectedLevel1, setSelectedLevel1] = useState<Category | null>(null)
  const [selectedLevel2, setSelectedLevel2] = useState<Category | null>(null)

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

  const primaryCategories = categories.filter(c => c.level === 1)
  const level1Categories = selectedPrimary 
    ? categories.filter(c => c.level === 2 && c.path.startsWith(selectedPrimary.path))
    : []
  const level2Categories = selectedLevel1
    ? categories.filter(c => c.level === 3 && c.path.startsWith(selectedLevel1.path))
    : []

  const handlePrimarySelect = (category: Category) => {
    if (selectedPrimary?.id === category.id) {
      setSelectedPrimary(null)
      setSelectedLevel1(null)
      setSelectedLevel2(null)
      onSelect('')
    } else {
      setSelectedPrimary(category)
      setSelectedLevel1(null)
      setSelectedLevel2(null)
      onSelect(category.path)
    }
  }

  const handleLevel1Select = (category: Category) => {
    if (selectedLevel1?.id === category.id) {
      setSelectedLevel1(null)
      setSelectedLevel2(null)
      onSelect(selectedPrimary?.path || '')
    } else {
      setSelectedLevel1(category)
      setSelectedLevel2(null)
      onSelect(category.path)
    }
  }

  const handleLevel2Select = (category: Category) => {
    if (selectedLevel2?.id === category.id) {
      setSelectedLevel2(null)
      onSelect(selectedLevel1?.path || '')
    } else {
      setSelectedLevel2(category)
      onSelect(category.path)
    }
  }

  if (loading) return <div>Loading categories...</div>

  return (
    <div className="space-y-4">
      {/* Selected Categories Display */}
      <div className="flex gap-2">
        {selectedPrimary && (
          <Card className={cn(
            "px-3 py-2 cursor-pointer",
            "bg-primary/10 hover:bg-primary/20 transition-colors",
            selectedLevel1 && "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
          onClick={() => handlePrimarySelect(selectedPrimary)}>
            <span className="text-sm font-medium">{selectedPrimary.name}</span>
          </Card>
        )}
        
        {selectedLevel1 && (
          <Card className={cn(
            "px-3 py-2 cursor-pointer",
            "bg-primary/10 hover:bg-primary/20 transition-colors",
            selectedLevel2 && "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
          onClick={() => handleLevel1Select(selectedLevel1)}>
            <span className="text-sm font-medium">{selectedLevel1.name}</span>
          </Card>
        )}
        
        {selectedLevel2 && (
          <Card className={cn(
            "px-3 py-2 cursor-pointer",
            "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          )}
          onClick={() => handleLevel2Select(selectedLevel2)}>
            <span className="text-sm font-medium">{selectedLevel2.name}</span>
          </Card>
        )}
      </div>

      {/* Category Selection Area */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {!selectedPrimary && primaryCategories.map((category) => (
          <Card
            key={category.id}
            className={cn(
              "px-3 py-2 cursor-pointer transition-colors",
              "hover:bg-accent"
            )}
            onClick={() => handlePrimarySelect(category)}
          >
            <span className="text-sm font-medium">{category.name}</span>
          </Card>
        ))}

        {selectedPrimary && !selectedLevel1 && level1Categories.map((category) => (
          <Card
            key={category.id}
            className={cn(
              "px-3 py-2 cursor-pointer transition-colors",
              "hover:bg-accent"
            )}
            onClick={() => handleLevel1Select(category)}
          >
            <span className="text-sm font-medium">{category.name}</span>
          </Card>
        ))}

        {selectedLevel1 && level2Categories.map((category) => (
          <Card
            key={category.id}
            className={cn(
              "px-3 py-2 cursor-pointer transition-colors",
              "hover:bg-accent"
            )}
            onClick={() => handleLevel2Select(category)}
          >
            <span className="text-sm font-medium">{category.name}</span>
          </Card>
        ))}
      </div>
    </div>
  )
} 