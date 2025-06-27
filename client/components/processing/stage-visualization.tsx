'use client'

import { cn } from '@/lib/utils'
import { ProcessingStage } from '@/types/processing'
import { Badge } from '@/components/ui/badge'
import { FileText, Search, Filter, BarChart3, Database, Brain, Calculator } from 'lucide-react'

interface StageVisualizationProps {
  stage: ProcessingStage
  progress: number
  extractedSkills: {
    resume: string[]
    job: string[]
  }
  className?: string
}

export function StageVisualization({
  stage,
  progress,
  extractedSkills,
  className,
}: StageVisualizationProps) {
  const renderDataReception = () => (
    <div className='flex items-center justify-center space-x-8 py-8'>
      <div className='flex flex-col items-center space-y-2'>
        <div
          className={cn(
            'rounded-lg border-2 border-dashed p-4 transition-all duration-500',
            progress > 30
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600',
          )}
        >
          <FileText className='h-8 w-8 text-blue-500' />
        </div>
        <span className='text-sm font-medium'>Resume</span>
      </div>

      <div className='flex items-center space-x-2'>
        <div
          className={cn(
            'h-3 w-3 rounded-full transition-all duration-300',
            progress > 60 ? 'animate-pulse bg-green-500' : 'bg-gray-300',
          )}
        />
        <div
          className={cn(
            'h-3 w-3 rounded-full transition-all delay-100 duration-300',
            progress > 70 ? 'animate-pulse bg-green-500' : 'bg-gray-300',
          )}
        />
        <div
          className={cn(
            'h-3 w-3 rounded-full transition-all delay-200 duration-300',
            progress > 80 ? 'animate-pulse bg-green-500' : 'bg-gray-300',
          )}
        />
      </div>

      <div className='flex flex-col items-center space-y-2'>
        <div
          className={cn(
            'rounded-lg border-2 border-dashed p-4 transition-all duration-500',
            progress > 30
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600',
          )}
        >
          <FileText className='h-8 w-8 text-blue-500' />
        </div>
        <span className='text-sm font-medium'>Job Description</span>
      </div>
    </div>
  )

  const renderNER = () => (
    <div className='space-y-6'>
      <div className='flex items-center justify-center space-x-8 py-4'>
        <div className='flex flex-col items-center space-y-2'>
          <Search
            className={cn(
              'h-12 w-12 transition-all duration-500',
              progress > 20 ? 'animate-pulse text-blue-500' : 'text-gray-400',
            )}
          />
          <span className='text-sm font-medium'>Extracting Entities</span>
        </div>
      </div>

      {extractedSkills.resume.length > 0 && (
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <h4 className='mb-2 text-sm font-medium'>
              Resume Skills ({extractedSkills.resume.length})
            </h4>
            <div className='flex flex-wrap gap-1'>
              {extractedSkills.resume.map((skill, index) => (
                <Badge
                  key={index}
                  variant='secondary'
                  className='animate-fadeIn text-xs'
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className='mb-2 text-sm font-medium'>Job Skills ({extractedSkills.job.length})</h4>
            <div className='flex flex-wrap gap-1'>
              {extractedSkills.job.map((skill, index) => (
                <Badge
                  key={index}
                  variant='outline'
                  className='animate-fadeIn text-xs'
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderSkillExtraction = () => (
    <div className='flex items-center justify-center space-x-8 py-8'>
      <div className='flex flex-col items-center space-y-2'>
        <Filter
          className={cn(
            'h-12 w-12 transition-all duration-500',
            progress > 20 ? 'animate-pulse text-purple-500' : 'text-gray-400',
          )}
        />
        <span className='text-sm font-medium'>Filtering & Organizing</span>
      </div>
    </div>
  )

  const renderSimilarityAnalysis = () => (
    <div className='flex items-center justify-center space-x-8 py-8'>
      <div className='flex flex-col items-center space-y-2'>
        <BarChart3
          className={cn(
            'h-12 w-12 transition-all duration-500',
            progress > 20 ? 'animate-pulse text-green-500' : 'text-gray-400',
          )}
        />
        <span className='text-sm font-medium'>Computing Similarities</span>
      </div>
    </div>
  )

  const renderCourseRetrieval = () => (
    <div className='flex items-center justify-center space-x-8 py-8'>
      <div className='flex flex-col items-center space-y-2'>
        <Database
          className={cn(
            'h-12 w-12 transition-all duration-500',
            progress > 20 ? 'animate-pulse text-blue-500' : 'text-gray-400',
          )}
        />
        <span className='text-sm font-medium'>Searching Course Database</span>
      </div>
    </div>
  )

  const renderLLMRecommendation = () => (
    <div className='flex items-center justify-center space-x-8 py-8'>
      <div className='flex flex-col items-center space-y-2'>
        <Brain
          className={cn(
            'h-12 w-12 transition-all duration-500',
            progress > 20 ? 'animate-pulse text-purple-500' : 'text-gray-400',
          )}
        />
        <span className='text-sm font-medium'>Generating Recommendations</span>
      </div>
    </div>
  )

  const renderFinalProcessing = () => (
    <div className='flex items-center justify-center space-x-8 py-8'>
      <div className='flex flex-col items-center space-y-2'>
        <Calculator
          className={cn(
            'h-12 w-12 transition-all duration-500',
            progress > 20 ? 'animate-pulse text-orange-500' : 'text-gray-400',
          )}
        />
        <span className='text-sm font-medium'>Calculating Final Scores</span>
      </div>
    </div>
  )

  const renderVisualization = () => {
    switch (stage) {
      case ProcessingStage.DATA_RECEPTION:
        return renderDataReception()
      case ProcessingStage.NAMED_ENTITY_RECOGNITION:
        return renderNER()
      case ProcessingStage.SKILL_EXTRACTION:
        return renderSkillExtraction()
      case ProcessingStage.SIMILARITY_ANALYSIS:
        return renderSimilarityAnalysis()
      case ProcessingStage.COURSE_RETRIEVAL:
        return renderCourseRetrieval()
      case ProcessingStage.LLM_RECOMMENDATION:
        return renderLLMRecommendation()
      case ProcessingStage.FINAL_PROCESSING:
        return renderFinalProcessing()
      default:
        return (
          <div className='flex items-center justify-center py-8'>
            <div className='text-center'>
              <div className='mx-auto mb-2 h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700' />
              <span className='text-sm text-gray-500'>Ready to begin</span>
            </div>
          </div>
        )
    }
  }

  return (
    <div className={cn('min-h-32 rounded-lg bg-gray-50 p-6 dark:bg-gray-800', className)}>
      {renderVisualization()}
    </div>
  )
}
