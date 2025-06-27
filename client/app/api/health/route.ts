import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Get the backend URL from environment
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

    // Create abort controller for manual timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    try {
      // Test connectivity to the backend
      const backendResponse = await fetch(`${backendUrl}/healthz`, {
        method: 'GET',
        signal: controller.signal,
      })

      if (!backendResponse.ok) {
        throw new Error(`Backend health check failed: ${backendResponse.status}`)
      }

      return NextResponse.json({
        status: 'ok',
        backend: 'connected',
        backendUrl: backendUrl,
      })
    } finally {
      clearTimeout(timeoutId)
    }
  } catch (error) {
    console.error('Health check failed:', error)

    return NextResponse.json(
      {
        status: 'error',
        backend: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 },
    )
  }
}
