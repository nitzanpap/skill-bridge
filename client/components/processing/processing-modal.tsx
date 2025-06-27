'use client'

import { X } from 'lucide-react'
import {
  ProcessingState,
  ProcessingStage,
  StageStatus,
  PROCESSING_STAGES,
} from '@/types/processing'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { StageIndicator } from '@/components/processing/stage-indicator'
import { ModelCard } from '@/components/processing/model-card'
import { ProgressPipeline } from '@/components/processing/progress-pipeline'
import { StageVisualization } from '@/components/processing/stage-visualization'

interface ProcessingModalProps {
  isOpen: boolean
  onClose: () => void
  processingState: ProcessingState
}

export function ProcessingModal({ isOpen, onClose, processingState }: ProcessingModalProps) {
  const {
    currentStage,
    timeElapsed,
    estimatedTimeRemaining,
    modelsInUse,
    totalProgress,
    extractedSkills,
  } = processingState

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`
  }

  const currentStageInfo = PROCESSING_STAGES[currentStage]
  const isCompleted = currentStage === ProcessingStage.COMPLETED

  return (
    <Dialog open={isOpen} onOpenChange={() => isCompleted && onClose()}>
      <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
        {/* Header */}
        <DialogHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <div className='flex items-center space-x-3'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600'>
              <span className='text-sm font-bold text-white'>SB</span>
            </div>
            <div>
              <DialogTitle className='text-xl font-semibold'>Skill Bridge AI Analysis</DialogTitle>
              <p className='text-sm text-muted-foreground'>
                Processing your resume and job requirements
              </p>
            </div>
          </div>
          {isCompleted && (
            <button
              onClick={onClose}
              className='rounded-md bg-secondary p-2 text-muted-foreground hover:text-foreground'
            >
              <X className='h-5 w-5' />
            </button>
          )}
        </DialogHeader>

        {/* Progress Pipeline */}
        <div className='mb-8'>
          <ProgressPipeline
            currentStage={currentStage}
            stageProgress={processingState.stageProgress}
          />
        </div>

        {/* Current Stage Info */}
        <div className='mb-6'>
          <div className='mb-2 flex items-center space-x-3'>
            <StageIndicator
              stage={currentStage}
              status={isCompleted ? StageStatus.COMPLETED : StageStatus.IN_PROGRESS}
              size='sm'
            />
            <div>
              <h3 className='text-lg font-medium'>{currentStageInfo.name}</h3>
              <p className='text-sm text-muted-foreground'>{currentStageInfo.description}</p>
            </div>
          </div>
        </div>

        {/* Stage Visualization */}
        <div className='mb-8'>
          <StageVisualization
            stage={currentStage}
            progress={processingState.stageProgress[currentStage]}
            extractedSkills={extractedSkills}
          />
        </div>

        {/* Models in Use */}
        {modelsInUse.length > 0 && (
          <div className='mb-6'>
            <h4 className='mb-3 text-sm font-medium text-muted-foreground'>AI Models in Use:</h4>
            <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
              {modelsInUse.map((model, index) => (
                <ModelCard key={index} model={model} />
              ))}
            </div>
          </div>
        )}

        {/* Progress Stats */}
        <div className='rounded-lg bg-secondary p-4'>
          <div className='grid grid-cols-2 gap-4 text-center md:grid-cols-4'>
            <div>
              <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                {Math.round(totalProgress)}%
              </div>
              <div className='text-xs text-muted-foreground'>Complete</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-green-600 dark:text-green-400'>
                {formatTime(timeElapsed)}
              </div>
              <div className='text-xs text-muted-foreground'>Elapsed</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-orange-600 dark:text-orange-400'>
                {formatTime(estimatedTimeRemaining)}
              </div>
              <div className='text-xs text-muted-foreground'>Remaining</div>
            </div>
            <div>
              <div className='text-2xl font-bold text-purple-600 dark:text-purple-400'>
                {extractedSkills.resume.length + extractedSkills.job.length}
              </div>
              <div className='text-xs text-muted-foreground'>Skills Found</div>
            </div>
          </div>
        </div>

        {/* Completion Message */}
        {isCompleted && (
          <div className='mt-6 text-center'>
            <div className='inline-flex items-center space-x-2 rounded-full bg-green-100 px-4 py-2 text-green-800 dark:bg-green-900 dark:text-green-200'>
              <div className='h-2 w-2 animate-pulse rounded-full bg-green-500' />
              <span className='text-sm font-medium'>Analysis completed successfully!</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
