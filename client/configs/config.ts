import { NodeEnvs } from '@/types/config'

export const appConfig: {
  backendUrl: string
  nodeEnv: keyof typeof NodeEnvs
} = {
  backendUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  nodeEnv: (process.env.NODE_ENV as keyof typeof NodeEnvs) || NodeEnvs.LOCAL,
}
