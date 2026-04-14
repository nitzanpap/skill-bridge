import { NodeEnvs } from '@/types/config'

// Use a getter so env vars are read at request time, not at build/import time.
// This is critical for Docker where BACKEND_URL is only available at runtime.
export const appConfig: {
  readonly backendUrl: string
  readonly backupBackendUrl: string
  readonly nodeEnv: keyof typeof NodeEnvs
} = {
  get backendUrl() {
    return process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  },
  get backupBackendUrl() {
    return (
      process.env.BACKUP_BACKEND_URL ||
      process.env.NEXT_PUBLIC_BACKUP_API_URL ||
      'http://localhost:8001'
    )
  },
  get nodeEnv() {
    return (process.env.NODE_ENV as keyof typeof NodeEnvs) || NodeEnvs.LOCAL
  },
}
