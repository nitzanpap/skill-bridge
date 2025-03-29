"use client"

import { Button } from "@/components/ui/button"

interface ModelSelectionProps {
  selectedModels: string[]
  onModelSelect: (model: string) => void
}

export function ModelSelection({ selectedModels, onModelSelect }: ModelSelectionProps) {
  const models = [
    { id: "all", name: "All Models" },
    { id: "skills", name: "Skills Extractor" },
    { id: "tools", name: "Tools Detector" },
    { id: "languages", name: "Languages Identifier" },
    { id: "entities", name: "Named Entity Recognition" },
  ]

  return (
    <div className="grid gap-2">
      <h3 className="text-sm font-medium">Select Models</h3>
      <div className="flex flex-wrap gap-2">
        {models.map((model) => (
          <Button
            key={model.id}
            variant={selectedModels.includes(model.id) ? "default" : "outline"}
            size="sm"
            onClick={() => onModelSelect(model.id)}
          >
            {model.name}
          </Button>
        ))}
      </div>
    </div>
  )
}

