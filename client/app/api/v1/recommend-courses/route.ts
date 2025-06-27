import { appConfig } from '@/configs/config'
import { NextRequest, NextResponse } from 'next/server'

// Helper function to make request with fallback using absolute URLs on server
const fetchWithFallback = async (
  endpoint: string,
  options: RequestInit,
  timeoutMs: number = 360000,
): Promise<Response> => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    // Try primary backend first with absolute URL
    try {
      const primaryUrl = `${appConfig.backendUrl}${endpoint}`
      const response = await fetch(primaryUrl, {
        ...options,
        signal: controller.signal,
      })

      if (response.ok) {
        return response
      }

      // If primary fails with a server error (5xx), try backup
      // Don't try backup for client errors (4xx) like 404, 400, etc.
      if (response.status >= 500) {
        throw new Error(`Primary backend server error: ${response.status}`)
      }

      // For client errors (4xx), return the response without trying backup
      console.warn(`⚠️ Primary backend unavailable (${response.status}), not retrying`)
      return response
    } catch (primaryError) {
      // Only try backup for network errors or server errors
      console.warn('🔄 Primary backend failed, trying backup...')

      const backupUrl = `${appConfig.backupBackendUrl}${endpoint}`
      const backupResponse = await fetch(backupUrl, {
        ...options,
        signal: controller.signal,
      })

      if (backupResponse.ok) {
        console.log('✅ Backup backend connected successfully')
        return backupResponse
      }

      // If backup also fails, throw the original error
      throw primaryError
    }
  } finally {
    clearTimeout(timeoutId)
  }
}

// This API route proxies requests to the backend with proper timeout handling and fallback
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const backendResponse = await fetchWithFallback('/api/v1/recommend-courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!backendResponse.ok) {
      console.error(`❌ Backend error: ${backendResponse.status} ${backendResponse.statusText}`)
      throw new Error(`Backend returned ${backendResponse.status}: ${backendResponse.statusText}`)
    }

    const data = await backendResponse.json()
    return NextResponse.json(data)
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
