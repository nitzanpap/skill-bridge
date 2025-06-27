// API base URL - use relative URL when in browser environment

import { appConfig } from '@/configs/config'
import { NodeEnvs } from '@/types/config'

// to leverage Next.js rewrites and avoid CORS issues
const isClient = typeof window !== 'undefined'
const API_BASE_URL = isClient
  ? '' // Always use relative URLs on client side to leverage Next.js rewrites
  : appConfig.backendUrl || 'http://localhost:8000'
const API_PREFIX = '/api/v1'

// Default timeout for API requests (in milliseconds) set to 6 minutes
const DEFAULT_TIMEOUT = 360000

if (appConfig.nodeEnv === NodeEnvs.LOCAL) {
  // Only log detailed API configuration in local development
  console.log('🔧 API configuration:', {
    isClient,
    primaryBackend: process.env.NEXT_PUBLIC_API_URL,
    backupBackend: process.env.NEXT_PUBLIC_BACKUP_API_URL,
    environment: process.env.NODE_ENV,
  })
}

/**
 * Attempts to fetch from primary backend, falls back to backup if primary fails
 * @param endpoint - The API endpoint to call
 * @param options - Fetch options
 * @param timeout - Timeout in milliseconds
 * @returns Promise with the fetch response
 */
const fetchWithFallback = async (
  endpoint: string,
  options: RequestInit = {},
  timeout: number = DEFAULT_TIMEOUT,
): Promise<Response> => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    // Try primary backend first
    let primaryUrl: string

    if (isClient) {
      // On client side, use the Next.js rewrite (which points to primary backend)
      primaryUrl = endpoint
    } else {
      // On server side, use the full URL
      primaryUrl = `${appConfig.backendUrl}${endpoint}`
    }

    try {
      const response = await fetch(primaryUrl, {
        ...options,
        signal: controller.signal,
      })

      if (response.ok) {
        return response
      }

      // If primary fails with a server error or 404, try backup
      if (response.status >= 400) {
        throw new Error(`Primary backend failed with status ${response.status}`)
      }

      return response
    } catch (primaryError) {
      // Try backup backend if available
      if (appConfig.backupBackendUrl) {
        console.warn('Primary backend failed, trying backup:', primaryError)

        let backupUrl: string

        if (isClient) {
          // On client side, use Next.js backup rewrite to hide the actual backup URL
          if (endpoint.startsWith('/api/')) {
            // For API endpoints, use the backup-api route
            backupUrl = endpoint.replace('/api/', '/backup-api/')
          } else if (endpoint === '/healthz') {
            // For health check, use the backup health route
            backupUrl = '/backup-healthz'
          } else if (endpoint === '/readyz') {
            // For readiness check, use the backup readiness route
            backupUrl = '/backup-readyz'
          } else {
            // For other endpoints, prepend backup- prefix
            backupUrl = `/backup${endpoint}`
          }
        } else {
          // On server side, use the full backup URL
          backupUrl = `${appConfig.backupBackendUrl}${endpoint}`
        }

        try {
          const backupResponse = await fetch(backupUrl, {
            ...options,
            signal: controller.signal,
            headers: {
              ...options.headers,
              // Add ngrok header for backup requests too (in case backup is also ngrok)
              ...(isClient && {
                'ngrok-skip-browser-warning': 'true',
              }),
            },
          })

          if (backupResponse.ok) {
            console.log('Successfully connected to backup backend via Next.js proxy')
            return backupResponse
          }

          throw new Error(`Backup backend also failed with status ${backupResponse.status}`)
        } catch (backupError) {
          console.error('Backup backend also failed:', backupError)
          // Throw the original error since both failed
          throw primaryError
        }
      }

      // If backup not available, throw the original error
      throw primaryError
    }
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Creates a fetch request with a timeout (legacy function, use fetchWithFallback for new code)
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @param timeout - Timeout in milliseconds (defaults to 60 seconds)
 * @returns Promise with the fetch response
 */
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout: number = DEFAULT_TIMEOUT,
): Promise<Response> => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })

    return response
  } finally {
    clearTimeout(timeoutId)
  }
}

// Types for API requests and responses
export interface Entity {
  text: string
  label: string
}

// Check server readiness
export const checkServerReadiness = async (): Promise<boolean> => {
  try {
    const response = await fetchWithFallback('/healthz', {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true', // Skip ngrok browser warning, if applicable
      },
    })

    if (!response.ok) {
      throw new Error(`Server readiness check failed with status ${response.status}`)
    }

    const data = await response.json()
    return data.status === 'alive'
  } catch (error) {
    console.error('Server readiness check failed:', error)
    return false
  }
}

export interface MatchDetail {
  job_skill: string
  best_match: string | null
  similarity: number
  is_match: boolean
}

export interface SkillComparisonData {
  score: number
  matched_skills: string[]
  missing_skills: string[]
  matching_details: MatchDetail[]
}

export interface CourseRecommendation {
  course_name: string
  url: string
  description: string
  potential_score: number
  score_improvement: number
}

export interface SkillBridgeResponse {
  recommended_courses: CourseRecommendation[]
  skill_gap: string[]
  job_skills: string[]
  user_skills: string[]
  recommendations_text: string | null
  matching_details: MatchDetail[]
}

// Get course recommendations and skill comparison data from a single endpoint
export const getSkillBridgeData = async (
  resumeText: string,
  jobDescriptionText: string,
  threshold: number = 0.5,
): Promise<SkillBridgeResponse> => {
  try {
    const response = await fetchWithFallback(`${API_PREFIX}/recommend-courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resume_text: resumeText,
        job_description_text: jobDescriptionText,
        threshold: threshold,
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data: SkillBridgeResponse = await response.json()
    return data
  } catch (error) {
    console.error('Error getting skill bridge data:', error)
    throw error
  }
}

// Helper function to convert course recommendation response to skill comparison data format
export const extractSkillComparisonData = (response: SkillBridgeResponse): SkillComparisonData => {
  // Calculate a score based on matched vs total job skills
  const totalSkills = response.job_skills.length || 1 // Avoid division by zero
  const matchedSkills = response.job_skills.filter((skill) => !response.skill_gap.includes(skill))
  const score = Math.round((matchedSkills.length / totalSkills) * 100)

  return {
    score,
    matched_skills: matchedSkills,
    missing_skills: response.skill_gap,
    matching_details: response.matching_details,
  }
}
