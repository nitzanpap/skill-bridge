'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Star, ArrowUp, TrendingUp } from 'lucide-react'
import { SkillBridgeResponse } from '@/lib/api'

interface CourseRecommendationsDisplayProps {
  recommendations: SkillBridgeResponse
}

export function CourseRecommendationsDisplay({
  recommendations,
}: CourseRecommendationsDisplayProps) {
  const { recommended_courses, skill_gap } = recommendations

  // Find the course with the highest potential score
  const maxPotentialScore = Math.max(
    ...recommended_courses.map((course) => course.potential_score || 0),
  )

  return (
    <div className='grid gap-6'>
      {/* Main Recommendations Card */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <span>Course Recommendations</span>
            <Badge variant='outline' className='ml-2'>
              {recommended_courses.length} courses
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-6'>
            {/* Introduction */}
            <div className='rounded-lg bg-muted p-4'>
              <h3 className='font-semibold'>Based on your skill gap</h3>
              <div className='mt-2 flex flex-wrap gap-2'>
                {skill_gap.map((skill, index) => (
                  <Badge
                    key={index}
                    variant='outline'
                    className='bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 dark:text-blue-400'
                  >
                    {skill}
                  </Badge>
                ))}
                {skill_gap.length === 0 && (
                  <p className='text-sm text-muted-foreground'>No skill gaps identified</p>
                )}
              </div>
            </div>

            {/* Course Cards */}
            <div className='space-y-4'>
              {recommended_courses.map((course, index) => {
                const isHighestScore =
                  course.potential_score === maxPotentialScore && course.score_improvement > 0
                const potentialScoreValue = course.potential_score?.toFixed(1) || '0.0'
                const scoreImprovement = course.score_improvement?.toFixed(1) || '0.0'

                return (
                  <div
                    key={index}
                    className={`relative flex flex-col space-y-2 rounded-lg border p-4 transition-all ${
                      isHighestScore
                        ? 'animate-pulse-shadow border-2 border-green-500 bg-green-50 shadow-lg dark:bg-green-950/20'
                        : 'hover:bg-accent/50'
                    }`}
                  >
                    {isHighestScore && (
                      <div className='absolute -right-3 -top-3 rounded-full bg-green-500 p-1 text-white'>
                        <Star className='h-5 w-5 fill-white' />
                      </div>
                    )}
                    <div className='flex items-start justify-between'>
                      <div>
                        <h3
                          className={`font-semibold ${
                            isHighestScore ? 'text-green-700 dark:text-green-300' : ''
                          }`}
                        >
                          {index + 1}. {course.course_name}
                        </h3>
                        <div className='mt-1 flex flex-wrap gap-2'>
                          {isHighestScore ? (
                            <>
                              {/* // TODO: Add back in */}
                              {/* <div className="bg-blue-100 dark:bg-blue-900 p-1 px-3 rounded-md flex items-center shadow-md scale-in">
                                <TrendingUp className="h-4 w-4 text-blue-700 dark:text-blue-300 mr-1" />
                                <span className="text-blue-800 dark:text-blue-200 text-xs font-medium mr-1">
                                  Score:
                                </span>
                                <span className="text-blue-800 dark:text-blue-200 text-xl font-extrabold animate-glow-text">
                                  {potentialScoreValue}%
                                </span>
                              </div> */}
                              <div className='scale-in flex items-center rounded-md border border-green-200 bg-green-100 p-1 px-3 shadow-md dark:border-green-800 dark:bg-green-900/40'>
                                <ArrowUp className='mr-1 h-4 w-4 text-green-700 dark:text-green-300' />
                                <span className='animate-glow-text text-xl font-extrabold text-green-800 dark:text-green-200'>
                                  +{scoreImprovement}%
                                </span>
                                <span className='ml-1 text-xs font-medium text-green-800 dark:text-green-200'>
                                  boost
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              {/* // TODO: Add back in */}
                              {/* <Badge
                                variant="secondary"
                                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              >
                                Potential Score: {potentialScoreValue}%
                              </Badge> */}
                              <Badge
                                variant='outline'
                                className='bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
                              >
                                +{scoreImprovement}% improvement
                              </Badge>
                            </>
                          )}
                          {isHighestScore && (
                            <Badge className='bg-green-500 font-bold text-white'>Best Match</Badge>
                          )}
                        </div>
                      </div>
                      {course.url && (
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 gap-1'
                          onClick={() => window.open(course.url, '_blank')}
                        >
                          <ExternalLink size={14} />
                          <span className='hidden sm:inline'>Visit Course</span>
                        </Button>
                      )}
                    </div>
                    {course.description && (
                      <p className='text-sm text-muted-foreground'>
                        {course.description.length > 200
                          ? `${course.description.substring(0, 200)}...`
                          : course.description}
                      </p>
                    )}
                  </div>
                )
              })}

              {recommended_courses.length === 0 && (
                <p className='rounded-lg border border-dashed p-6 text-center text-muted-foreground'>
                  No course recommendations available
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='mb-4 text-sm text-muted-foreground'>
            Here are some additional platforms where you can find courses to help bridge your skill
            gap:
          </p>
          <div className='flex flex-wrap gap-2'>
            <Button
              variant='outline'
              size='sm'
              className='h-8'
              onClick={() => window.open('https://www.coursera.org', '_blank')}
            >
              Coursera
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='h-8'
              onClick={() => window.open('https://www.udemy.com', '_blank')}
            >
              Udemy
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='h-8'
              onClick={() => window.open('https://www.pluralsight.com', '_blank')}
            >
              Pluralsight
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='h-8'
              onClick={() => window.open('https://www.edx.org', '_blank')}
            >
              edX
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='h-8'
              onClick={() => window.open('https://www.linkedin.com/learning', '_blank')}
            >
              LinkedIn Learning
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
