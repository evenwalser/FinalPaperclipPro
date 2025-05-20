"use client"

import * as React from "react"
import { X } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  subcategories?: Category[]
}

const categories: Category[] = [
  {
    id: "baby-child",
    name: "Baby & child",
    subcategories: [
      {
        id: "clothing",
        name: "Clothing",
        subcategories: [
          { id: "newborn", name: "Newborn (0-3M)" },
          { id: "infant", name: "Infant (3-12M)" },
          { id: "toddler", name: "Toddler (1-3Y)" },
        ],
      },
      {
        id: "toys",
        name: "Toys",
        subcategories: [
          { id: "educational", name: "Educational" },
          { id: "outdoor", name: "Outdoor" },
          { id: "pretend-play", name: "Pretend Play" },
        ],
      },
    ],
  },
  {
    id: "womens-fashion",
    name: "Women's fashion",
    subcategories: [
      {
        id: "clothing",
        name: "Clothing",
        subcategories: [
          { id: "dresses", name: "Dresses" },
          { id: "tops", name: "Tops" },
          { id: "bottoms", name: "Bottoms" },
        ],
      },
      {
        id: "shoes",
        name: "Shoes",
        subcategories: [
          { id: "sneakers", name: "Sneakers" },
          { id: "boots", name: "Boots" },
          { id: "sandals", name: "Sandals" },
        ],
      },
    ],
  },
  {
    id: "sports-fitness",
    name: "Sports & fitness",
    subcategories: [
      {
        id: "sport",
        name: "Sport",
        subcategories: [
          { id: "basketball", name: "Basketball" },
          { id: "soccer", name: "Soccer" },
          { id: "tennis", name: "Tennis" },
        ],
      },
      {
        id: "outdoors",
        name: "Outdoors",
        subcategories: [
          { id: "hiking-camping", name: "Hiking & camping" },
          { id: "fishing", name: "Fishing" },
          { id: "biking", name: "Biking" },
        ],
      },
    ],
  },
  // Add more categories as needed
]

interface CategorySelectorProps {
  onCategorySelect: (categories: { level1: string; level2?: string; level3?: string }) => void
  selectedCategories: {
    level1?: string
    level2?: string
    level3?: string
  }
}

export function CategorySelector({ onCategorySelect, selectedCategories }: CategorySelectorProps) {
  const [level1Categories, setLevel1Categories] = React.useState(categories)
  const [level2Categories, setLevel2Categories] = React.useState<Category[]>([])
  const [level3Categories, setLevel3Categories] = React.useState<Category[]>([])

  const handleLevel1Select = (category: Category) => {
    onCategorySelect({ level1: category.name })
    setLevel2Categories(category.subcategories || [])
    setLevel3Categories([])
  }

  const handleLevel2Select = (category: Category) => {
    if (!selectedCategories.level1) return
    onCategorySelect({ 
      level1: selectedCategories.level1,
      level2: category.name 
    })
    setLevel3Categories(category.subcategories || [])
  }

  const handleLevel3Select = (category: Category) => {
    if (!selectedCategories.level1 || !selectedCategories.level2) return
    onCategorySelect({ 
      level1: selectedCategories.level1,
      level2: selectedCategories.level2,
      level3: category.name 
    })
  }

  const clearSelection = (level: number) => {
    switch (level) {
      case 1:
        onCategorySelect({ level1: "" })
        setLevel2Categories([])
        setLevel3Categories([])
        break
      case 2:
        onCategorySelect({ level1: selectedCategories.level1!, level2: "" })
        setLevel3Categories([])
        break
      case 3:
        onCategorySelect({ 
          level1: selectedCategories.level1!, 
          level2: selectedCategories.level2!, 
          level3: "" 
        })
        break
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {selectedCategories.level1 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              {selectedCategories.level1}
              <button
                onClick={() => clearSelection(1)}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
            {selectedCategories.level2 && (
              <>
                <span className="text-muted-foreground">/</span>
                <Badge variant="secondary" className="text-sm">
                  {selectedCategories.level2}
                  <button
                    onClick={() => clearSelection(2)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              </>
            )}
            {selectedCategories.level3 && (
              <>
                <span className="text-muted-foreground">/</span>
                <Badge variant="secondary" className="text-sm">
                  {selectedCategories.level3}
                  <button
                    onClick={() => clearSelection(3)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              </>
            )}
          </div>
        )}
      </div>

      <ScrollArea className="h-72 rounded-md border bg-background">
        <div className="p-4 bg-background">
          {!selectedCategories.level1 && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Level 1 category</h4>
              <div className="flex flex-wrap gap-2">
                {level1Categories.map((category) => (
                  <Button
                    key={category.id}
                    variant="outline"
                    className={cn(
                      "text-sm bg-background border-border",
                      selectedCategories.level1 === category.name && 
                      "border-primary bg-primary/10"
                    )}
                    onClick={() => handleLevel1Select(category)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {selectedCategories.level1 && !selectedCategories.level2 && level2Categories.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Level 2 category</h4>
              <div className="flex flex-wrap gap-2">
                {level2Categories.map((category) => (
                  <Button
                    key={category.id}
                    variant="outline"
                    className={cn(
                      "text-sm bg-background border-border",
                      selectedCategories.level2 === category.name && 
                      "border-primary bg-primary/10"
                    )}
                    onClick={() => handleLevel2Select(category)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {selectedCategories.level2 && level3Categories.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Level 3 category</h4>
              <div className="flex flex-wrap gap-2">
                {level3Categories.map((category) => (
                  <Button
                    key={category.id}
                    variant="outline"
                    className={cn(
                      "text-sm bg-background border-border",
                      selectedCategories.level3 === category.name && 
                      "border-primary bg-primary/10"
                    )}
                    onClick={() => handleLevel3Select(category)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

