import { appConfig } from '@/configs/config'

// Types for job API
export enum JobStatus {
  QUEUED = 'queued',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum JobType {
  COURSE_RECOMMENDATION = 'course_recommendation',
}

export interface JobSubmitRequest {
  type: JobType
  payload: {
    resume_text: string
    job_description_text: string
    threshold: number
  }
}

export interface JobSubmitResponse {
  job_id: string
  status: JobStatus
  position_in_queue: number
  estimated_wait_seconds: number
  message: string
}

export interface JobStatusResponse {
  job_id: string
  status: JobStatus
  position_in_queue?: number
  estimated_wait_seconds?: number
  result?: any
  error?: string
  created_at: string
  started_at?: string
  completed_at?: string
}

// Default polling intervals
const INITIAL_POLL_INTERVAL = 200 // 200ms for faster queue status updates
const MAX_POLL_INTERVAL = 2000 // 2 seconds max
const POLL_BACKOFF_FACTOR = 1.5

// API configuration
const isClient = typeof window !== 'undefined'
const API_BASE_URL = isClient ? '' : appConfig.backendUrl || 'http://localhost:8000'
const API_PREFIX = '/api/v1'

// Helper function to make API calls with fallback
const fetchWithFallback = async (
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> => {
  const url = isClient ? endpoint : `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(isClient && {
          'ngrok-skip-browser-warning': 'true',
        }),
      },
    })

    if (!response.ok && appConfig.backupBackendUrl) {
      // Try backup URL
      const backupUrl = isClient
        ? endpoint.replace('/api/', '/backup-api/')
        : `${appConfig.backupBackendUrl}${endpoint}`

      const backupResponse = await fetch(backupUrl, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
          ...(isClient && {
            'ngrok-skip-browser-warning': 'true',
          }),
        },
      })

      if (backupResponse.ok) {
        return backupResponse
      }
    }

    return response
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// Submit a job to the queue
export const submitJob = async (request: JobSubmitRequest): Promise<JobSubmitResponse> => {
  const response = await fetchWithFallback(`${API_PREFIX}/jobs/submit`, {
    method: 'POST',
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to submit job: ${error}`)
  }

  return response.json()
}

// Get job status
export const getJobStatus = async (jobId: string): Promise<JobStatusResponse> => {
  const response = await fetchWithFallback(`${API_PREFIX}/jobs/status/${jobId}`, {
    method: 'GET',
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get job status: ${error}`)
  }

  return response.json()
}

// Poll for job completion with exponential backoff
export const pollJobStatus = async (
  jobId: string,
  onStatusUpdate?: (status: JobStatusResponse) => void,
  signal?: AbortSignal,
): Promise<JobStatusResponse> => {
  let pollInterval = INITIAL_POLL_INTERVAL

  while (true) {
    if (signal?.aborted) {
      throw new Error('Polling cancelled')
    }

    try {
      const status = await getJobStatus(jobId)

      if (onStatusUpdate) {
        onStatusUpdate(status)
      }

      // Check if job is complete
      if (status.status === JobStatus.COMPLETED || status.status === JobStatus.FAILED) {
        return status
      }

      // Wait before next poll with exponential backoff
      await new Promise((resolve) => setTimeout(resolve, pollInterval))
      pollInterval = Math.min(pollInterval * POLL_BACKOFF_FACTOR, MAX_POLL_INTERVAL)
    } catch (error) {
      console.error('Error polling job status:', error)
      throw error
    }
  }
}

// Submit job and wait for completion
export const submitAndWaitForJob = async (
  request: JobSubmitRequest,
  onStatusUpdate?: (status: JobStatusResponse) => void,
  signal?: AbortSignal,
): Promise<JobStatusResponse> => {
  // Submit the job
  const submitResponse = await submitJob(request)

  // Initial status update
  if (onStatusUpdate) {
    onStatusUpdate({
      job_id: submitResponse.job_id,
      status: submitResponse.status,
      position_in_queue: submitResponse.position_in_queue,
      estimated_wait_seconds: submitResponse.estimated_wait_seconds,
      created_at: new Date().toISOString(),
    })
  }

  // Poll for completion
  return pollJobStatus(submitResponse.job_id, onStatusUpdate, signal)
}