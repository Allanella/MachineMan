/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Builds every page as /page/index.html so refreshing /gallery never shows a folder listing
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig