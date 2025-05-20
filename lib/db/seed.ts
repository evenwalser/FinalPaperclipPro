import { db } from '@/lib/db'
import { addDays, subDays, format } from 'date-fns'

async function seed() {
  // 1. Categories
  const categories = [
    // Primary Categories (level 1)
    { id: 'womens', name: "Women's Fashion", path: 'womens', level: 1 },
    { id: 'mens', name: "Men's Fashion", path: 'mens', level: 1 },
    
    // Level 1 Categories (level 2)
    { id: 'womens_bottoms', name: 'Bottoms', path: 'womens.bottoms', level: 2 },
    { id: 'womens_dresses', name: 'Dresses', path: 'womens.dresses', level: 2 },
    { id: 'mens_bottoms', name: 'Bottoms', path: 'mens.bottoms', level: 2 },
    { id: 'mens_tops', name: 'Tops', path: 'mens.tops', level: 2 },
    
    // Level 2 Categories (level 3)
    { id: 'womens_bottoms_jeans', name: 'Jeans', path: 'womens.bottoms.jeans', level: 3 },
    { id: 'womens_bottoms_skirts', name: 'Skirts', path: 'womens.bottoms.skirts', level: 3 },
    { id: 'womens_dresses_mini', name: 'Mini Dresses', path: 'womens.dresses.mini', level: 3 },
    { id: 'mens_bottoms_jeans', name: 'Jeans', path: 'mens.bottoms.jeans', level: 3 },
    { id: 'mens_tops_tshirts', name: 'T-Shirts', path: 'mens.tops.tshirts', level: 3 },
  ]

  // 2. Items with GBP prices
  const items = []
  const now = new Date()
  
  // Price ranges in GBP
  const priceRanges = {
    'womens.bottoms.jeans': { min: 45, max: 120 },
    'womens.bottoms.skirts': { min: 35, max: 85 },
    'womens.dresses.mini': { min: 55, max: 150 },
    'mens.bottoms.jeans': { min: 45, max: 120 },
    'mens.tops.tshirts': { min: 25, max: 60 },
    // Default range for any other categories
    default: { min: 30, max: 100 }
  }

  // Cost is typically 40-60% of retail price
  const getCost = (price: number) => Math.round(price * (0.4 + Math.random() * 0.2))

  for (let i = 0; i < 100; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const priceRange = priceRanges[category.path as keyof typeof priceRanges] || priceRanges.default
    
    const price = Math.floor(
      Math.random() * (priceRange.max - priceRange.min) + priceRange.min
    )
    
    const status = ['in_stock', 'sold', 'returned'][Math.floor(Math.random() * 3)]
    const createdAt = subDays(now, Math.floor(Math.random() * 30))
    const soldAt = status === 'sold' || status === 'returned' 
      ? addDays(createdAt, Math.floor(Math.random() * 14))
      : null
    const returnedAt = status === 'returned'
      ? addDays(soldAt!, Math.floor(Math.random() * 7))
      : null

    items.push({
      id: `item_${i}`,
      title: `Test Item ${i}`,
      description: `Description for item ${i}`,
      category_id: category.id,
      price,
      cost: getCost(price),
      currency: 'GBP',
      status,
      created_at: format(createdAt, 'yyyy-MM-dd'),
      sold_at: soldAt ? format(soldAt, 'yyyy-MM-dd') : null,
      returned_at: returnedAt ? format(returnedAt, 'yyyy-MM-dd') : null,
    })
  }

  try {
    // Clear existing data
    await db.query('TRUNCATE categories, items CASCADE')

    // Insert categories
    for (const category of categories) {
      await db.query(`
        INSERT INTO categories (id, name, path, level)
        VALUES ($1, $2, $3, $4)
      `, [category.id, category.name, category.path, category.level])
    }

    // Insert items
    for (const item of items) {
      await db.query(`
        INSERT INTO items (
          id, title, description, category_id, price, cost,
          currency, status, created_at, sold_at, returned_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [
        item.id, item.title, item.description, item.category_id,
        item.price, item.cost, item.currency, item.status, 
        item.created_at, item.sold_at, item.returned_at
      ])
    }

    console.log('Seed data inserted successfully')
  } catch (error) {
    console.error('Error seeding database:', error)
  }
}

seed() 