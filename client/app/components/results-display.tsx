"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ResultsDisplayProps {
  highlightedText: string
  entities: Record<string, string[]>
  entityTypes: Record<string, string>
}

export function ResultsDisplay({ highlightedText, entities, entityTypes }: ResultsDisplayProps) {
  return (
    <Tabs defaultValue="highlighted" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="highlighted">Highlighted Text</TabsTrigger>
        <TabsTrigger value="entities">Extracted Entities</TabsTrigger>
      </TabsList>

      <TabsContent value="highlighted">
        <Card>
          <CardHeader>
            <CardTitle>Highlighted Text</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: highlightedText
                  .replace(/class="entity bg-pink-500"/g, 'class="inline-block px-1 rounded text-white bg-pink-500"')
                  .replace(/class="entity bg-teal-500"/g, 'class="inline-block px-1 rounded text-white bg-teal-500"')
                  .replace(
                    /class="entity bg-orange-500"/g,
                    'class="inline-block px-1 rounded text-white bg-orange-500"',
                  )
                  .replace(/class="entity bg-green-500"/g, 'class="inline-block px-1 rounded text-white bg-green-500"')
                  .replace(
                    /class="entity bg-purple-500"/g,
                    'class="inline-block px-1 rounded text-white bg-purple-500"',
                  )
                  .replace(/class="entity bg-red-500"/g, 'class="inline-block px-1 rounded text-white bg-red-500"')
                  .replace(
                    /class="entity bg-indigo-500"/g,
                    'class="inline-block px-1 rounded text-white bg-indigo-500"',
                  )
                  .replace(/class="entity bg-blue-500"/g, 'class="inline-block px-1 rounded text-white bg-blue-500"'),
              }}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="entities">
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
                        className={`${entityTypes[category as keyof typeof entityTypes]} hover:${entityTypes[category as keyof typeof entityTypes]}`}
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
      </TabsContent>
    </Tabs>
  )
}

