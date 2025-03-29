let userConfig = undefined
try {
  userConfig = await import("./v0-user-next.config")
} catch (e) {
  // ignore error
}

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
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  // Add async rewrites to proxy API requests in development
  async rewrites() {
    // Default to localhost:8000 if NEXT_PUBLIC_API_URL is not defined
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ]
  },
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (typeof nextConfig[key] === "object" && !Array.isArray(nextConfig[key])) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default nextConfig
