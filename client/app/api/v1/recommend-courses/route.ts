import { appConfig } from '@/configs/config'
import { NextRequest, NextResponse } from 'next/server'

// This API route proxies requests to the backend with proper timeout handling
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Create abort controller for manual timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 360000) // 6 minutes

    try {
      // Create the request to the backend
      const backendResponse = await fetch(`${appConfig.backendUrl}/api/v1/recommend-courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      })

      if (!backendResponse.ok) {
        throw new Error(`Backend returned ${backendResponse.status}: ${backendResponse.statusText}`)
      }

      const data = await backendResponse.json()

      return NextResponse.json(data)
    } finally {
      clearTimeout(timeoutId)
    }
  } catch (error) {
    console.error('Proxy error:', error)

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json({ error: 'Request timed out' }, { status: 408 })
      }

      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
