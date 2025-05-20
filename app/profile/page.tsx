'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Camera, ChevronLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const ProfilePage = () => {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '',
    address: '',
    categories: [],
    currency: 'USD',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    // Implement save logic here
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset form data and exit editing mode
    setIsEditing(false)
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow h-full overflow-y-auto pb-8">
      <Link href="/" className="flex items-center text-paperclip-grey mb-6">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Dashboard
      </Link>

      <div className="text-center mb-8">
        <div className="relative inline-block">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/placeholder.svg?height=150&width=150" alt="John Doe" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <button className="absolute bottom-0 right-0 bg-paperclip-red text-white rounded-full p-2">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <h1 className="text-2xl font-bold mt-4">{formData.firstName} {formData.lastName}</h1>
        <p className="text-paperclip-grey">{formData.email}</p>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="mt-4">
            Edit Profile
          </Button>
        )}
      </div>

      <form className="space-y-6 mt-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            value={formData.email}
            disabled
          />
          <p className="text-xs text-paperclip-grey mt-1">Email changes are managed via support.</p>
        </div>

        <div>
          <Label htmlFor="phone">Phone Number (Optional)</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <Label htmlFor="address">Shipping Address (Optional)</Label>
          <Textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="Enter your shipping address"
          />
        </div>

        <div>
          <Label htmlFor="categories">Preferred Categories</Label>
          <Select
            value={formData.categories.join(',')}
            onValueChange={(value) => handleSelectChange('categories', value.split(','))}
            disabled={!isEditing}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fashion">Fashion</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="home">Home & Garden</SelectItem>
              <SelectItem value="sports">Sports & Outdoors</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="currency">Default Currency</Label>
          <Select
            value={formData.currency}
            onValueChange={(value) => handleSelectChange('currency', value)}
            disabled={!isEditing}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isEditing && (
          <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
            <div className="max-w-2xl mx-auto flex justify-center space-x-4">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="w-full mb-4">
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default ProfilePage

