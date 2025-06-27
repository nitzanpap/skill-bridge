import { appConfig } from '@/configs/config'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Create abort controller for manual timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    try {
      // Test connectivity to the backend
      const backendResponse = await fetch(`${appConfig.backendUrl}/healthz`, {
        method: 'GET',
        signal: controller.signal,
      })

      if (!backendResponse.ok) {
        throw new Error(`Backend health check failed: ${backendResponse.status}`)
      }

      return NextResponse.json({
        status: 'ok',
        backend: 'connected',
        backendUrl: appConfig.backendUrl,
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
