import { ReactNode } from 'react'

export default function ProfileBuilderLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div className="mb-8 flex justify-center space-x-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full ${
                step === 1 ? 'bg-paperclip-red' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        {children}
      </div>
    </div>
  )
}

