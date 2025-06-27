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
    // Determine the API URL based on environment
    // In Docker: use internal service name, otherwise use env var or localhost
    let apiUrl

    if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_API_URL) {
      // Production Docker environment - use internal service name
      apiUrl = "http://backend:8000"
    } else {
      // Development or when NEXT_PUBLIC_API_URL is explicitly set
      apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    }

    console.log("API URL used for rewrites:", apiUrl)

    // Log both client and server side environment
    console.log("Environment:", {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    })

    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
      // Add root-level API endpoints for health checks
      {
        source: "/healthz",
        destination: `${apiUrl}/healthz`,
      },
      {
        source: "/readyz",
        destination: `${apiUrl}/readyz`,
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
