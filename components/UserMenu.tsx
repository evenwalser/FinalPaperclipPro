'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChevronDown, User, Users, LogOut } from 'lucide-react'

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const toggleMenu = () => setIsOpen(!isOpen)

  const handleLogout = () => {
    // Implement logout logic here
    router.push('/login')
  }

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <Avatar className="h-8 w-8">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <ChevronDown className="w-4 h-4 text-paperclip-grey" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
            <User className="mr-2 h-4 w-4" />
            View Profile
          </Link>
          <Link href="/switch-user" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Switch User
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu

