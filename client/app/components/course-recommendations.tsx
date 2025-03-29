"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { CourseRecommendationResponse } from "@/lib/api"

interface CourseRecommendationsDisplayProps {
  recommendations: CourseRecommendationResponse
}

export function CourseRecommendationsDisplay({
  recommendations,
}: CourseRecommendationsDisplayProps) {
  const { recommended_courses, skill_gap } = recommendations

  return (
    <div className="grid gap-6">
      {/* Main Recommendations Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Course Recommendations</span>
            <Badge variant="outline" className="ml-2">
              {recommended_courses.length} courses
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Introduction */}
            <div className="rounded-lg bg-muted p-4">
              <h3 className="font-semibold">Based on your skill gap</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {skill_gap.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                  >
                    {skill}
                  </Badge>
                ))}
                {skill_gap.length === 0 && (
                  <p className="text-sm text-muted-foreground">No skill gaps identified</p>
                )}
              </div>
            </div>

            {/* Course Cards */}
            <div className="space-y-4">
              {recommended_courses.map((course, index) => (
                <div
                  key={index}
                  className="flex flex-col space-y-2 rounded-lg border p-4 transition-all hover:bg-accent/50"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold">
                      {index + 1}. {course.course_name}
                    </h3>
                    {course.url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1"
                        onClick={() => window.open(course.url, "_blank")}
                      >
                        <ExternalLink size={14} />
                        <span className="hidden sm:inline">Visit Course</span>
                      </Button>
                    )}
                  </div>
                  {course.description && (
                    <p className="text-sm text-muted-foreground">
                      {course.description.length > 200
                        ? `${course.description.substring(0, 200)}...`
                        : course.description}
                    </p>
                  )}
                </div>
              ))}

              {recommended_courses.length === 0 && (
                <p className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">
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
          <p className="text-sm text-muted-foreground mb-4">
            Here are some additional platforms where you can find courses to help bridge your skill
            gap:
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => window.open("https://www.coursera.org", "_blank")}
            >
              Coursera
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => window.open("https://www.udemy.com", "_blank")}
            >
              Udemy
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => window.open("https://www.pluralsight.com", "_blank")}
            >
              Pluralsight
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => window.open("https://www.edx.org", "_blank")}
            >
              edX
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => window.open("https://www.linkedin.com/learning", "_blank")}
            >
              LinkedIn Learning
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
