import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { DualTextInput } from './text-input'
// import { ThresholdSlider } from './threshold-slider'
import { SampleTexts } from './sample-texts'
import { sampleTexts, SampleTextKey } from '@/lib/constants'
import { UseResumeAnalysisResult } from '@/hooks/use-resume-analysis'

interface ResumeAnalysisFormProps {
  analysis: UseResumeAnalysisResult
}

export function ResumeAnalysisForm({ analysis }: ResumeAnalysisFormProps) {
  const {
    resumeText,
    jobDescriptionText,
    threshold,
    isProcessing,
    processingStatus,
    setResumeText,
    setJobDescriptionText,
    // setThreshold,
    analyzeResume,
  } = analysis

  const handleSampleSelection = (sampleKey: SampleTextKey) => {
    if (sampleKey.includes('resume')) {
      setResumeText(sampleTexts[sampleKey])
    } else if (sampleKey.includes('job')) {
      setJobDescriptionText(sampleTexts[sampleKey])
    }
  }

  const isAnalyzeDisabled = !resumeText.trim() || !jobDescriptionText.trim() || isProcessing

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume Analysis</CardTitle>
        <CardDescription>
          Compare your resume against a job description to identify matching skills, missing skills,
          and get personalized course recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid gap-6'>
          <DualTextInput
            resumeText={resumeText}
            onResumeChange={(e) => setResumeText(e.target.value)}
            jobDescriptionText={jobDescriptionText}
            onJobDescriptionChange={(e) => setJobDescriptionText(e.target.value)}
          />

          <div className='grid gap-4'>
            {/* <ThresholdSlider threshold={threshold} onThresholdChange={setThreshold} /> */}
            <SampleTexts onSampleSelection={handleSampleSelection} />
          </div>
        </div>
      </CardContent>
      <CardFooter className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex w-full gap-2 sm:w-auto'>
          <Button
            onClick={analyzeResume}
            disabled={isAnalyzeDisabled}
            className='flex-1 sm:flex-none'
          >
            {isProcessing ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Analyzing...
              </>
            ) : (
              'Analyze Resume'
            )}
          </Button>

          <Button variant='outline' onClick={analysis.startDemoAnalysis} disabled={isProcessing}>
            🎬 Understand Analysis
          </Button>
        </div>

        {isProcessing && processingStatus && (
          <p className='text-sm text-muted-foreground'>{processingStatus}</p>
        )}
      </CardFooter>
    </Card>
  )
}
