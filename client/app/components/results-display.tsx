"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ResultsDisplayProps {
  entities: Record<string, string[]>
  entityTypes: Record<string, string>
}

export function ResultsDisplay({ entities, entityTypes }: ResultsDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Extracted Entities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {Object.entries(entities).map(([category, items]) => (
            <div key={category} className="space-y-2">
              <h3 className="text-lg font-medium">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map((item, index) => (
                  <Badge
                    key={index}
                    className={`${entityTypes[category as keyof typeof entityTypes]} hover:${
                      entityTypes[category as keyof typeof entityTypes]
                    }`}
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
