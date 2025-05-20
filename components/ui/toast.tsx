// components/ui/toast.tsx
'use client'

import { Toaster as SonnerToaster, toast } from 'sonner'

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      richColors
      expand={true}
      closeButton
    />
  )
}

// Direct export of the toast function
export { toast }