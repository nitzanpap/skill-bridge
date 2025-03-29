"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Entity } from "@/lib/api"

interface SkillComparisonDisplayProps {
  resumeSkills: Entity[]
  jobSkills: Entity[]
  missingSkills: Entity[]
  entityTypes: Record<string, string>
}

export function SkillComparisonDisplay({
  resumeSkills,
  jobSkills,
  missingSkills,
  entityTypes,
}: SkillComparisonDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills Comparison Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Resume Skills</h3>
            <div className="flex flex-wrap gap-2">
              {resumeSkills.map((skill, index) => (
                <Badge
                  key={index}
                  className={`${entityTypes[skill.type as keyof typeof entityTypes] || ""} hover:${
                    entityTypes[skill.type as keyof typeof entityTypes] || ""
                  }`}
                >
                  {skill.text}
                </Badge>
              ))}
              {resumeSkills.length === 0 && (
                <p className="text-sm text-muted-foreground">No skills detected in resume</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Job Requirements</h3>
            <div className="flex flex-wrap gap-2">
              {jobSkills.map((skill, index) => (
                <Badge
                  key={index}
                  className={`${entityTypes[skill.type as keyof typeof entityTypes] || ""} hover:${
                    entityTypes[skill.type as keyof typeof entityTypes] || ""
                  }`}
                >
                  {skill.text}
                </Badge>
              ))}
              {jobSkills.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No skills detected in job description
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Missing Skills</h3>
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill, index) => (
                <Badge key={index} variant="destructive" className="hover:bg-destructive/80">
                  {skill.text}
                </Badge>
              ))}
              {missingSkills.length === 0 && (
                <p className="text-sm text-muted-foreground">You have all the required skills!</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
