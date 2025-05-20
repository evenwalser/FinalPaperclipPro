'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { CheckCircle } from 'lucide-react'

export default function SignupSuccess() {
  const router = useRouter()

  return (
    <div className="text-center">
      <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
      <h2 className="mt-6 text-3xl font-extrabold text-gray-900">{`You're`} all set!</h2>
      <p className="mt-2 text-sm text-gray-600">
        Your account has been created and your profile is ready.
      </p>
      <div className="mt-8 space-y-4">
        <Button
          onClick={() => router.push('/dashboard')}
          className="w-full bg-paperclip-red hover:bg-red-700 focus:ring-red-500"
        >
          Go to Dashboard
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push('/profile')}
          className="w-full"
        >
          Edit Profile
        </Button>
      </div>
    </div>
  )
}

