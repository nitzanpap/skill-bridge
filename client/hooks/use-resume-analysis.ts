import { useState, useCallback, useEffect, useRef } from 'react'
import {
  getSkillBridgeData,
  extractSkillComparisonData,
  SkillBridgeResponse,
  SkillComparisonData,
} from '@/lib/api'
import { toast } from '@/components/ui/use-toast'
import {
  ProcessingStage,
  ProcessingState,
  StageStatus,
  PROCESSING_STAGES,
  STAGE_ORDER,
  ModelStatus,
} from '@/types/processing'

export interface UseResumeAnalysisResult {
  // State
  resumeText: string
  jobDescriptionText: string
  threshold: number
  isProcessing: boolean
  processingStatus: string
  skillData: SkillComparisonData | null
  recommendationData: SkillBridgeResponse | null
  processingState: ProcessingState
  showProcessingModal: boolean

  // Actions
  setResumeText: (text: string) => void
  setJobDescriptionText: (text: string) => void
  setThreshold: (threshold: number) => void
  analyzeResume: () => Promise<void>
  resetResults: () => void
  setShowProcessingModal: (show: boolean) => void
}

export function useResumeAnalysis(): UseResumeAnalysisResult {
  const [resumeText, setResumeText] = useState('')
  const [jobDescriptionText, setJobDescriptionText] = useState('')
  const [threshold, setThreshold] = useState(0.5)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState('')
  const [skillData, setSkillData] = useState<SkillComparisonData | null>(null)
  const [recommendationData, setRecommendationData] = useState<SkillBridgeResponse | null>(null)
  const [showProcessingModal, setShowProcessingModal] = useState(false)

  // Processing state for animations
  const [processingState, setProcessingState] = useState<ProcessingState>({
    currentStage: ProcessingStage.IDLE,
    stageProgress: Object.values(ProcessingStage).reduce(
      (acc, stage) => {
        acc[stage] = 0
        return acc
      },
      {} as Record<ProcessingStage, number>,
    ),
    extractedSkills: { resume: [], job: [] },
    timeElapsed: 0,
    estimatedTimeRemaining: 0,
    modelsInUse: [],
    totalProgress: 0,
  })

  // Refs for timers and intervals
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const stageTimerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  const resetResults = useCallback(() => {
    setSkillData(null)
    setRecommendationData(null)
    setProcessingStatus('')
    setProcessingState({
      currentStage: ProcessingStage.IDLE,
      stageProgress: Object.values(ProcessingStage).reduce(
        (acc, stage) => {
          acc[stage] = 0
          return acc
        },
        {} as Record<ProcessingStage, number>,
      ),
      extractedSkills: { resume: [], job: [] },
      timeElapsed: 0,
      estimatedTimeRemaining: 0,
      modelsInUse: [],
      totalProgress: 0,
    })
  }, [])

  // Calculate total estimated time
  const getTotalEstimatedTime = useCallback(() => {
    return STAGE_ORDER.reduce((total, stage) => {
      return total + PROCESSING_STAGES[stage].estimatedDuration
    }, 0)
  }, [])

  // Create model status for current stage
  const createModelStatus = useCallback((stage: ProcessingStage): ModelStatus[] => {
    const stageInfo = PROCESSING_STAGES[stage]
    return stageInfo.models.map((modelName) => ({
      name: modelName,
      type:
        modelName.includes('spaCy') || modelName.includes('NER')
          ? 'NER'
          : modelName.includes('SentenceTransformer')
            ? 'Embedding'
            : modelName.includes('Cohere')
              ? 'LLM'
              : 'Database',
      progress: 0,
      status: StageStatus.PENDING,
      description: getModelDescription(modelName),
    }))
  }, [])

  const getModelDescription = (modelName: string): string => {
    if (modelName.includes('spaCy')) return 'Extracting entities and skills'
    if (modelName.includes('SentenceTransformer')) return 'Computing semantic embeddings'
    if (modelName.includes('Cohere')) return 'Generating recommendations'
    if (modelName.includes('Pinecone')) return 'Searching course database'
    return 'Processing data'
  }

  // Simulate progressive stage completion
  const simulateStageProgress = useCallback(
    async (stage: ProcessingStage, stageIndex: number) => {
      const stageInfo = PROCESSING_STAGES[stage]
      const duration = stageInfo.estimatedDuration

      // Update models for this stage
      const models = createModelStatus(stage)

      setProcessingState((prev) => ({
        ...prev,
        currentStage: stage,
        modelsInUse: models,
      }))

      // Simulate progress over the duration
      const updateInterval = 100 // Update every 100ms
      const totalUpdates = duration / updateInterval
      let currentUpdate = 0

      return new Promise<void>((resolve) => {
        const progressInterval = setInterval(() => {
          currentUpdate++
          const progress = Math.min((currentUpdate / totalUpdates) * 100, 100)

          setProcessingState((prev) => {
            const newStageProgress = { ...prev.stageProgress }
            newStageProgress[stage] = progress

            // Update model progress
            const updatedModels = prev.modelsInUse.map((model) => ({
              ...model,
              progress: progress,
              status: progress === 100 ? StageStatus.COMPLETED : StageStatus.IN_PROGRESS,
            }))

            // Calculate total progress
            const completedStages = stageIndex
            const currentStageProgress = progress / 100
            const totalProgress =
              ((completedStages + currentStageProgress) / STAGE_ORDER.length) * 100

            // Simulate skill extraction during NER stage
            let extractedSkills = prev.extractedSkills
            if (stage === ProcessingStage.NAMED_ENTITY_RECOGNITION && progress > 50) {
              extractedSkills = {
                resume: ['JavaScript', 'React', 'TypeScript', 'Node.js', 'Python'].slice(
                  0,
                  Math.floor(progress / 20),
                ),
                job: ['React', 'TypeScript', 'AWS', 'Docker', 'GraphQL'].slice(
                  0,
                  Math.floor(progress / 25),
                ),
              }
            }

            return {
              ...prev,
              stageProgress: newStageProgress,
              modelsInUse: updatedModels,
              totalProgress,
              extractedSkills,
            }
          })

          if (progress >= 100) {
            clearInterval(progressInterval)
            resolve()
          }
        }, updateInterval)
      })
    },
    [createModelStatus],
  )

  // Main processing simulation
  const simulateProcessing = useCallback(async () => {
    startTimeRef.current = Date.now()
    const totalEstimatedTime = getTotalEstimatedTime()

    setProcessingState((prev) => ({
      ...prev,
      estimatedTimeRemaining: totalEstimatedTime,
    }))

    // Update elapsed time every second
    progressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      setProcessingState((prev) => ({
        ...prev,
        timeElapsed: elapsed,
        estimatedTimeRemaining: Math.max(0, totalEstimatedTime - elapsed),
      }))
    }, 1000)

    // Process each stage
    for (let i = 0; i < STAGE_ORDER.length; i++) {
      const stage = STAGE_ORDER[i]
      await simulateStageProgress(stage, i)
    }

    // Clean up timer
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current)
      progressTimerRef.current = null
    }
  }, [simulateStageProgress, getTotalEstimatedTime])

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current)
      }
      if (stageTimerRef.current) {
        clearTimeout(stageTimerRef.current)
      }
    }
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
    setShowProcessingModal(true)
    resetResults()
    setProcessingStatus('Starting analysis...')

    try {
      // Start the animation simulation
      const simulationPromise = simulateProcessing()

      // Start the actual API call
      const apiStartTime = performance.now()
      const apiPromise = getSkillBridgeData(resumeText, jobDescriptionText, threshold)

      // Wait for both to complete
      const [, response] = await Promise.all([simulationPromise, apiPromise])

      const skillComparisonData = extractSkillComparisonData(response)

      const apiEndTime = performance.now()
      setProcessingStatus(`Analysis completed in ${Math.round(apiEndTime - apiStartTime)}ms.`)

      setSkillData(skillComparisonData)
      setRecommendationData(response)

      // Set final state
      setProcessingState((prev) => ({
        ...prev,
        currentStage: ProcessingStage.COMPLETED,
        totalProgress: 100,
      }))

      // Auto-close modal after a brief delay
      setTimeout(() => {
        setShowProcessingModal(false)
      }, 2000)
    } catch (error) {
      console.error('Error analyzing resume:', error)

      // Update processing state to show error
      setProcessingState((prev) => ({
        ...prev,
        modelsInUse: prev.modelsInUse.map((model) => ({
          ...model,
          status: StageStatus.FAILED,
        })),
      }))

      toast({
        title: 'Analysis Failed',
        description:
          "We couldn't analyze your resume against the job requirements. Please try again later.",
        variant: 'destructive',
      })

      setShowProcessingModal(false)
    } finally {
      setIsProcessing(false)
    }
  }, [resumeText, jobDescriptionText, threshold, resetResults, simulateProcessing])

  return {
    resumeText,
    jobDescriptionText,
    threshold,
    isProcessing,
    processingStatus,
    skillData,
    recommendationData,
    processingState,
    showProcessingModal,
    setResumeText,
    setJobDescriptionText,
    setThreshold,
    analyzeResume,
    resetResults,
    setShowProcessingModal,
  }
}
