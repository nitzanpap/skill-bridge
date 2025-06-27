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
  ProcessingMode,
  PlaybackState,
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

  // Demo and Interactive Controls
  startDemo: () => void
  pauseAnimation: () => void
  resumeAnimation: () => void
  stopAnimation: () => void
  goToStage: (stage: ProcessingStage) => void
  nextStage: () => void
  previousStage: () => void
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
    mode: ProcessingMode.ANALYSIS,
    playbackState: PlaybackState.STOPPED,
    isInteractive: false,
  })

  // Refs for timers and intervals
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const stageTimerRef = useRef<NodeJS.Timeout | null>(null)
  const stageProgressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const pausedTimeRef = useRef<number>(0)
  const isPausedRef = useRef<boolean>(false)
  const pausedAtRef = useRef<number>(0)
  const totalPausedTimeRef = useRef<number>(0)
  const actualCurrentStageRef = useRef<ProcessingStage>(ProcessingStage.IDLE)

  const resetResults = useCallback(() => {
    setSkillData(null)
    setRecommendationData(null)
    setProcessingStatus('')

    // Reset pause state
    isPausedRef.current = false
    pausedAtRef.current = 0
    totalPausedTimeRef.current = 0
    actualCurrentStageRef.current = ProcessingStage.IDLE

    // Cleanup timers
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current)
      progressTimerRef.current = null
    }
    if (stageTimerRef.current) {
      clearTimeout(stageTimerRef.current)
      stageTimerRef.current = null
    }
    if (stageProgressIntervalRef.current) {
      clearInterval(stageProgressIntervalRef.current)
      stageProgressIntervalRef.current = null
    }

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
      mode: ProcessingMode.ANALYSIS,
      playbackState: PlaybackState.STOPPED,
      isInteractive: false,
    })
  }, [])

  // Cleanup all timers
  const cleanupTimers = useCallback(() => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current)
      progressTimerRef.current = null
    }
    if (stageTimerRef.current) {
      clearTimeout(stageTimerRef.current)
      stageTimerRef.current = null
    }
    if (stageProgressIntervalRef.current) {
      clearInterval(stageProgressIntervalRef.current)
      stageProgressIntervalRef.current = null
    }
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

      // Update the actual current stage reference
      actualCurrentStageRef.current = stage

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
          // Check if paused
          if (isPausedRef.current) {
            return // Skip this update cycle but keep the interval running
          }

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
            stageProgressIntervalRef.current = null
            resolve()
          }
        }, updateInterval)

        // Store the interval reference for cleanup
        stageProgressIntervalRef.current = progressInterval
      })
    },
    [createModelStatus],
  )

  // Main processing simulation
  const simulateProcessing = useCallback(async () => {
    isPausedRef.current = false
    startTimeRef.current = Date.now()
    totalPausedTimeRef.current = 0
    actualCurrentStageRef.current = ProcessingStage.DATA_RECEPTION
    const totalEstimatedTime = getTotalEstimatedTime()

    setProcessingState((prev) => ({
      ...prev,
      estimatedTimeRemaining: totalEstimatedTime,
      playbackState: PlaybackState.PLAYING,
    }))

    // Update elapsed time every second
    progressTimerRef.current = setInterval(() => {
      if (isPausedRef.current) {
        return // Skip updates when paused
      }

      const elapsed = Date.now() - startTimeRef.current - totalPausedTimeRef.current
      setProcessingState((prev) => ({
        ...prev,
        timeElapsed: elapsed,
        estimatedTimeRemaining: Math.max(0, totalEstimatedTime - elapsed),
      }))
    }, 1000)

    // Process each stage
    for (let i = 0; i < STAGE_ORDER.length; i++) {
      // Wait for pause to resume before starting next stage
      while (isPausedRef.current) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

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
      cleanupTimers()
    }
  }, [cleanupTimers])

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

  // Demo and Interactive Controls
  const startDemo = useCallback(() => {
    // Reset pause state
    isPausedRef.current = false
    pausedAtRef.current = 0
    totalPausedTimeRef.current = 0
    actualCurrentStageRef.current = ProcessingStage.DATA_RECEPTION

    setShowProcessingModal(true)
    setProcessingState((prev) => ({
      ...prev,
      currentStage: ProcessingStage.DATA_RECEPTION,
      mode: ProcessingMode.DEMO,
      playbackState: PlaybackState.PLAYING,
      isInteractive: true,
      stageProgress: Object.values(ProcessingStage).reduce(
        (acc, stage) => {
          acc[stage] = 0
          return acc
        },
        {} as Record<ProcessingStage, number>,
      ),
      extractedSkills: {
        resume: ['JavaScript', 'React', 'TypeScript', 'Node.js'],
        job: ['React', 'TypeScript', 'AWS', 'Docker'],
      },
      timeElapsed: 0,
      estimatedTimeRemaining: getTotalEstimatedTime(),
      modelsInUse: [],
      totalProgress: 0,
    }))

    // Start the demo simulation
    simulateProcessing()
  }, [simulateProcessing, getTotalEstimatedTime])

  const pauseAnimation = useCallback(() => {
    isPausedRef.current = true
    pausedAtRef.current = Date.now()

    setProcessingState((prev) => ({
      ...prev,
      playbackState: PlaybackState.PAUSED,
    }))
  }, [])

  const resumeAnimation = useCallback(() => {
    if (isPausedRef.current && pausedAtRef.current > 0) {
      const pauseDuration = Date.now() - pausedAtRef.current
      totalPausedTimeRef.current += pauseDuration
    }

    isPausedRef.current = false
    pausedAtRef.current = 0

    // Return to the actual current stage where the animation should be
    setProcessingState((prev) => ({
      ...prev,
      currentStage: actualCurrentStageRef.current,
      playbackState: PlaybackState.PLAYING,
    }))
  }, [])

  const stopAnimation = useCallback(() => {
    isPausedRef.current = false
    pausedAtRef.current = 0
    totalPausedTimeRef.current = 0
    actualCurrentStageRef.current = ProcessingStage.IDLE

    // Cleanup timers
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current)
      progressTimerRef.current = null
    }
    if (stageTimerRef.current) {
      clearTimeout(stageTimerRef.current)
      stageTimerRef.current = null
    }
    if (stageProgressIntervalRef.current) {
      clearInterval(stageProgressIntervalRef.current)
      stageProgressIntervalRef.current = null
    }

    setProcessingState((prev) => ({
      ...prev,
      currentStage: ProcessingStage.IDLE,
      playbackState: PlaybackState.STOPPED,
      isInteractive: false,
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
    }))
    setShowProcessingModal(false)
  }, [])

  const goToStage = useCallback((stage: ProcessingStage) => {
    setProcessingState((prev) => ({
      ...prev,
      currentStage: stage,
      // Don't update stage progress when manually navigating
    }))
  }, [])

  const nextStage = useCallback(() => {
    setProcessingState((prev) => {
      const currentIndex = STAGE_ORDER.indexOf(prev.currentStage)
      const nextIndex = Math.min(currentIndex + 1, STAGE_ORDER.length - 1)
      const nextStage = STAGE_ORDER[nextIndex]

      return {
        ...prev,
        currentStage: nextStage,
        // Don't update stage progress when manually navigating
      }
    })
  }, [])

  const previousStage = useCallback(() => {
    setProcessingState((prev) => {
      const currentIndex = STAGE_ORDER.indexOf(prev.currentStage)
      const previousIndex = Math.max(currentIndex - 1, 0)
      const previousStage = STAGE_ORDER[previousIndex]

      return {
        ...prev,
        currentStage: previousStage,
        // Don't update stage progress when manually navigating
      }
    })
  }, [])

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
    startDemo,
    pauseAnimation,
    resumeAnimation,
    stopAnimation,
    goToStage,
    nextStage,
    previousStage,
  }
}
