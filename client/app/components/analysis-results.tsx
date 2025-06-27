import { SkillComparisonDisplay } from './comparison-results'
import { CourseRecommendationsDisplay } from './course-recommendations'
import { UseResumeAnalysisResult } from '@/hooks/use-resume-analysis'

interface AnalysisResultsProps {
  analysis: UseResumeAnalysisResult
}

export function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const { skillData, recommendationData } = analysis

  if (!skillData && !recommendationData) {
    return null
  }

  return (
    <>
      {skillData && <SkillComparisonDisplay comparisonResults={skillData} />}
      {recommendationData && <CourseRecommendationsDisplay recommendations={recommendationData} />}
    </>
  )
}
