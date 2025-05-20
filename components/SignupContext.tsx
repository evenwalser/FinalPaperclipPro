'use client'

import React, { createContext, useContext, useState } from 'react'

interface SignupContextType {
  email: string
  setEmail: (email: string) => void
  firstName: string
  setFirstName: (firstName: string) => void
  lastName: string
  setLastName: (lastName: string) => void
  phoneNumber: string
  setPhoneNumber: (phoneNumber: string) => void
  profilePicture: string | null
  setProfilePicture: (profilePicture: string | null) => void
  preferredCategories: string[]
  setPreferredCategories: React.Dispatch<React.SetStateAction<string[]>>
  location: string
  setLocation: React.Dispatch<React.SetStateAction<string>>
  currency: string
  setCurrency: React.Dispatch<React.SetStateAction<string>>
}

const SignupContext = createContext<SignupContextType | undefined>(undefined)

export const useSignupContext = () => {
  const context = useContext(SignupContext)
  if (!context) {
    throw new Error('useSignupContext must be used within a SignupProvider')
  }
  return context
}

export const SignupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [preferredCategories, setPreferredCategories] = useState<string[]>([])
  const [location, setLocation] = useState('')
  const [currency, setCurrency] = useState('USD')

  return (
    <SignupContext.Provider value={{
      email, setEmail,
      firstName, setFirstName,
      lastName, setLastName,
      phoneNumber, setPhoneNumber,
      profilePicture, setProfilePicture,
      preferredCategories, setPreferredCategories,
      location, setLocation,
      currency, setCurrency
    }}>
      {children}
    </SignupContext.Provider>
  )
}

