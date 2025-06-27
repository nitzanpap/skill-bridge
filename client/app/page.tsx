'use client'

import { AppHeader } from './components/app-header'
import { ResumeAnalysisForm } from './components/resume-analysis-form'
import { AnalysisResults } from './components/analysis-results'
import { ProcessingModal } from '@/components/processing'
import { useResumeAnalysis } from '@/hooks/use-resume-analysis'

export default function Home() {
  const analysis = useResumeAnalysis()

  return (
    <div className='flex min-h-screen w-full flex-col items-center bg-background'>
      <AppHeader />

      <main className='container px-4 py-6 md:py-10'>
        <div className='grid gap-6'>
          <ResumeAnalysisForm analysis={analysis} />
          <AnalysisResults analysis={analysis} />
        </div>
      </main>

      {/* Processing Modal */}
      <ProcessingModal
        isOpen={analysis.showProcessingModal}
        onClose={() => analysis.setShowProcessingModal(false)}
        processingState={analysis.processingState}
        onPause={analysis.pauseAnimation}
        onResume={analysis.resumeAnimation}
        onStop={analysis.stopAnimation}
        onNextStage={analysis.nextStage}
        onPreviousStage={analysis.previousStage}
        onGoToStage={analysis.goToStage}
      />
    </div>
  )
}
