'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard } from 'lucide-react'

export default function ProfileStep3() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Here you would typically make an API call to save the shipping address
    // For this MVP, we'll just simulate a delay and then redirect
    setTimeout(() => {
      setIsLoading(false)
      router.push('/signup/success')
    }, 1000)
  }

  const handleSkip = () => {
    router.push('/signup/success')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
        Set up payment and shipping details (optional)
      </h2>

      <div>
        <Label htmlFor="address">Shipping Address</Label>
        <Input
          id="address"
          name="address"
          type="text"
          className="mt-1"
          placeholder="Enter your shipping address"
        />
      </div>

      <div className="border border-gray-200 rounded-md p-4">
        <div className="flex items-center space-x-2 text-gray-600">
          <CreditCard className="w-5 h-5" />
          <span>Add a payment method later in your profile settings.</span>
        </div>
      </div>

      <div className="flex space-x-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={handleSkip}
        >
          Skip for now
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-paperclip-red hover:bg-red-700 focus:ring-red-500"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Complete Profile'}
        </Button>
      </div>
    </form>
  )
}

