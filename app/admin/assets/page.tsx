'use client'

import { useState } from 'react'
import { uploadAsset } from '@/lib/services/storage'
import { Button } from '@/components/ui/button'

export default function AssetsPage() {
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      await uploadAsset(file, 'paperclip_logo_red.jpg')
      alert('Logo uploaded successfully')
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Asset Management</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Logo Upload</h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
            className="hidden"
            id="logo-upload"
          />
          <Button
            onClick={() => document.getElementById('logo-upload')?.click()}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload Logo'}
          </Button>
        </div>
      </div>
    </div>
  )
} 