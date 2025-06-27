import { appConfig } from '@/configs/config'
import { NextRequest, NextResponse } from 'next/server'

// Helper function to test backend connectivity using absolute URLs
const testBackendHealth = async (
  backendUrl: string,
  timeoutMs: number = 5000,
): Promise<{ status: string; error?: string }> => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    // Use absolute URLs for server-side requests
    const response = await fetch(`${backendUrl}/healthz`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    })

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`)
    }

    return { status: 'connected' }
  } catch (error) {
    return {
      status: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function GET() {
  try {
    // Test primary backend using absolute URL
    const primaryResult = await testBackendHealth(appConfig.backendUrl)

    // If primary is successful, return success immediately
    if (primaryResult.status === 'connected') {
      return NextResponse.json({
        status: 'ok',
        backend: 'connected',
        backendUrl: 'primary (hidden via Next.js proxy)',
        primaryBackend: 'connected',
        backupBackend: 'not_tested',
      })
    }

    // If primary fails, test backup using absolute URL
    const backupResult = await testBackendHealth(appConfig.backupBackendUrl)

    if (backupResult.status === 'connected') {
      return NextResponse.json({
        status: 'ok',
        backend: 'connected',
        backendUrl: 'backup (hidden via Next.js proxy)',
        primaryBackend: 'disconnected',
        backupBackend: 'connected',
        warning: 'Primary backend is down, using backup',
      })
    }

    // Both backends failed
    return NextResponse.json(
      {
        status: 'error',
        backend: 'disconnected',
        primaryBackend: 'disconnected',
        backupBackend: 'disconnected',
        primaryError: primaryResult.error,
        backupError: backupResult.error,
      },
      { status: 503 },
    )
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
