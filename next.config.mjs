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
  // The deck library (1.2GB+) is served statically by the CDN and is never read
  // inside a serverless function (lecture routes use lib/lectures-manifest.json).
  // Exclude it from function tracing so functions that touch public/ don't bundle
  // it and blow the 250MB limit.
  outputFileTracingExcludes: {
    '*': ['public/ai1/lectures/**'],
  },
  async redirects() {
    return [
      { source: '/tools', destination: '/ai1/tools', permanent: true },
      { source: '/tools/:slug', destination: '/ai1/tools/:slug', permanent: true },
    ]
  },
}

export default nextConfig
