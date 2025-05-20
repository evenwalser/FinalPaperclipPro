/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
      // !! WARNING !!
      // Dangerously allow production builds to complete even if there are type errors.
      ignoreBuildErrors: true,
    },
    eslint: {
      // Optionally, disable ESLint during production builds
      ignoreDuringBuilds: true,
    },
  };
  
  export default nextConfig;
  