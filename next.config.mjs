/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      // Consolidate Tools under AI+1
      { source: '/tools', destination: '/ai1/tools', permanent: true },
      { source: '/tools/:slug', destination: '/ai1/tools/:slug', permanent: true },
    ]
  },
}

export default nextConfig
