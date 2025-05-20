// import { SignupProvider } from './SignupContext'

import { SignupProvider } from "@/components/SignupContext"

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SignupProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-12 w-auto"
            src="/paperclip_logo_red@1x.jpg"
            alt="Paperclip"
          />
        </div>
        {children}
      </div>
    </SignupProvider>
  )
}

