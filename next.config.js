/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      'xsjwxulfsdljhneitlwl.supabase.co',
      'localhost',
      'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      'www.citypng.com',
      'media-hosting.imagekit.io'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      }
    ],
  }
}

module.exports = nextConfig 