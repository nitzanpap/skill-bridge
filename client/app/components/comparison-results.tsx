'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SkillComparisonData, MatchDetail } from '@/lib/api'
import { Progress } from '@/components/ui/progress'

interface SkillComparisonDisplayProps {
  comparisonResults: SkillComparisonData
}

export function SkillComparisonDisplay({ comparisonResults }: SkillComparisonDisplayProps) {
  const { score, matched_skills, missing_skills, matching_details } = comparisonResults

  // Get score color based on percentage
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-amber-500'
    return 'text-red-500'
  }

  // Get progress color based on percentage
  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-amber-500'
    return 'bg-red-500'
  }

  return (
    <div className='grid gap-6'>
      {/* Score Card */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <span>Match Score</span>
            <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}%</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress className={`h-2 w-full ${getProgressColor(score)}`} value={score} />
          <p className='mt-4 text-sm text-muted-foreground'>
            {score >= 80
              ? 'Excellent match! Your skills align well with the job requirements.'
              : score >= 60
                ? 'Good match. You have most of the required skills but could improve in some areas.'
                : 'You may need to develop more skills to be competitive for this position.'}
          </p>
        </CardContent>
      </Card>

      {/* Skills Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Skills Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-6 md:grid-cols-2'>
            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Matched Skills ({matched_skills.length})</h3>
              <div className='flex flex-wrap gap-2'>
                {matched_skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant='outline'
                    className='bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:text-green-400'
                  >
                    {skill}
                  </Badge>
                ))}
                {matched_skills.length === 0 && (
                  <p className='text-sm text-muted-foreground'>No matching skills found</p>
                )}
              </div>
            </div>

            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Missing Skills ({missing_skills.length})</h3>
              <div className='flex flex-wrap gap-2'>
                {missing_skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant='outline'
                    className='bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:text-red-400'
                  >
                    {skill}
                  </Badge>
                ))}
                {missing_skills.length === 0 && (
                  <p className='text-sm text-muted-foreground'>You have all the required skills!</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Matching Card */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Skill Matching</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='grid grid-cols-3 text-sm font-medium'>
              <div>Job Skill</div>
              <div>Best Match</div>
              <div>Similarity</div>
            </div>
            <div className='divide-y'>
              {matching_details.map((detail, index) => (
                <div key={index} className='grid grid-cols-3 py-3 text-sm'>
                  <div>{detail.job_skill}</div>
                  <div>{detail.best_match || '—'}</div>
                  <div>
                    <div className='flex items-center gap-2'>
                      <Progress
                        className={`h-2 w-20 ${detail.is_match ? 'bg-green-500' : 'bg-amber-500'}`}
                        value={detail.similarity * 100}
                      />
                      <span className={detail.is_match ? 'text-green-500' : 'text-amber-500'}>
                        {Math.round(detail.similarity * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
