'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
// import { useSignupContext } from '../../SignupContext'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useSignupContext } from '@/components/SignupContext'

const categories = [
  'Fashion', 'Electronics', 'Home Décor', 'Books', 'Sports', 'Toys', 'Jewelry', 'Art'
]

const currencies = [
  { value: 'USD', label: 'US Dollar (USD)' },
  { value: 'GBP', label: 'British Pound (GBP)' },
  { value: 'EUR', label: 'Euro (EUR)' },
]

export default function ProfileStep2() {
  const router = useRouter()
  const { preferredCategories, setPreferredCategories, location, setLocation, currency, setCurrency } = useSignupContext()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Here you would typically make an API call to update the user preferences
    // For this MVP, we'll just simulate a delay and then redirect
    setTimeout(() => {
      setIsLoading(false)
      router.push('/signup/profile/payment')
    }, 1000)
  }
  const toggleCategory = (category: string) => {
    setPreferredCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-center
text-gray-900 mb-8">
        Set your preferences
      </h2>

      <div>
        <Label>Preferred Categories</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {categories.map(category => (
            <Badge
              key={category}
              variant={preferredCategories.includes(category) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => toggleCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location (Optional)</Label>
        <Input
          id="location"
          name="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="mt-1"
          placeholder="Enter your city or region"
        />
      </div>

      <div>
        <Label htmlFor="currency">Default Currency</Label>
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Select your currency" />
          </SelectTrigger>
          <SelectContent>
            {currencies.map(({ value, label }) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        className="w-full bg-paperclip-red hover:bg-red-700 focus:ring-red-500"
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : 'Next'}
      </Button>
    </form>
  )
}

