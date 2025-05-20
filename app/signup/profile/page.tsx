'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
// import { useSignupContext } from '../SignupContext'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera } from 'lucide-react'
import { useSignupContext } from '@/components/SignupContext'

export default function ProfileStep1() {
  const router = useRouter()
  const { firstName, setFirstName, lastName, setLastName, phoneNumber, setPhoneNumber, profilePicture, setProfilePicture } =  useSignupContext()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Here you would typically make an API call to update the user profile
    // For this MVP, we'll just simulate a delay and then redirect
    setTimeout(() => {
      setIsLoading(false)
      router.push('/signup/profile/preferences')
    }, 1000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicture(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
        Tell us a bit about yourself
      </h2>

      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <input
            type="file"
            id="profile-picture"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="profile-picture"
            className="absolute bottom-0 right-0 bg-paperclip-red text-white rounded-full p-2 cursor-pointer"
          >
            <Camera className="w-4 h-4" />
          </label>
        </div>
      </div>

      <div>
        <Label htmlFor="first-name">First Name</Label>
        <Input
          id="first-name"
          name="first-name"
          type="text"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="last-name">Last Name</Label>
        <Input
          id="last-name"
          name="last-name"
          type="text"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="phone-number">Phone Number (optional)</Label>
        <Input
          id="phone-number"
          name="phone-number"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="mt-1"
        />
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

