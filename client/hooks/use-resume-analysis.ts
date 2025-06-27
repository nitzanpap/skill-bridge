import { useState, useCallback } from 'react'
import {
  getSkillBridgeData,
  extractSkillComparisonData,
  SkillBridgeResponse,
  SkillComparisonData,
} from '@/lib/api'
import { toast } from '@/components/ui/use-toast'

export interface UseResumeAnalysisResult {
  // State
  resumeText: string
  jobDescriptionText: string
  threshold: number
  isProcessing: boolean
  processingStatus: string
  skillData: SkillComparisonData | null
  recommendationData: SkillBridgeResponse | null

  // Actions
  setResumeText: (text: string) => void
  setJobDescriptionText: (text: string) => void
  setThreshold: (threshold: number) => void
  analyzeResume: () => Promise<void>
  resetResults: () => void
}

export function useResumeAnalysis(): UseResumeAnalysisResult {
  const [resumeText, setResumeText] = useState('')
  const [jobDescriptionText, setJobDescriptionText] = useState('')
  const [threshold, setThreshold] = useState(0.5)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState('')
  const [skillData, setSkillData] = useState<SkillComparisonData | null>(null)
  const [recommendationData, setRecommendationData] = useState<SkillBridgeResponse | null>(null)

  const resetResults = useCallback(() => {
    setSkillData(null)
    setRecommendationData(null)
    setProcessingStatus('')
  }, [])

  const analyzeResume = useCallback(async () => {
    if (!resumeText.trim() || !jobDescriptionText.trim()) {
      toast({
        title: 'Missing input',
        description: 'Please provide both resume and job description texts.',
      })
      return
    }

    setIsProcessing(true)
    resetResults()
    setProcessingStatus('Analyzing resume and finding recommendations...')

    try {
      const apiStartTime = performance.now()

      const response = await getSkillBridgeData(resumeText, jobDescriptionText, threshold)
      const skillComparisonData = extractSkillComparisonData(response)

      const apiEndTime = performance.now()
      setProcessingStatus(`Analysis completed in ${Math.round(apiEndTime - apiStartTime)}ms.`)

      setSkillData(skillComparisonData)
      setRecommendationData(response)
    } catch (error) {
      console.error('Error analyzing resume:', error)

      toast({
        title: 'Analysis Failed',
        description:
          "We couldn't analyze your resume against the job requirements. Please try again later.",
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }, [resumeText, jobDescriptionText, threshold, resetResults])

  return {
    resumeText,
    jobDescriptionText,
    threshold,
    isProcessing,
    processingStatus,
    skillData,
    recommendationData,
    setResumeText,
    setJobDescriptionText,
    setThreshold,
    analyzeResume,
    resetResults,
  }
}
