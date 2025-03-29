"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { fetchModels } from "@/lib/api"
import { Loader2 } from "lucide-react"

interface ModelSelectionProps {
  selectedModels: string[]
  onModelSelect: (model: string) => void
}

export function ModelSelection({ selectedModels, onModelSelect }: ModelSelectionProps) {
  const [models, setModels] = useState<{ id: string; name: string }[]>([
    { id: "all", name: "All Models" },
  ])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const availableModels = await fetchModels()

        // Format models for display
        const formattedModels = [
          { id: "all", name: "All Models" },
          ...availableModels.map((model) => ({
            id: model,
            name: model.charAt(0).toUpperCase() + model.slice(1).replace(/_/g, " "),
          })),
        ]

        setModels(formattedModels)
      } catch (err) {
        console.error("Failed to load models:", err)
        setError("Failed to load models. Using defaults.")
        // Fallback to default models
        setModels([
          { id: "all", name: "All Models" },
          { id: "en_core_web_sm", name: "Core Web (Small)" },
          { id: "en_core_web_md", name: "Core Web (Medium)" },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    loadModels()
  }, [])

  if (isLoading) {
    return (
      <div className="grid gap-2">
        <h3 className="text-sm font-medium">Select Models</h3>
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-muted-foreground">Loading models...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-2">
      <h3 className="text-sm font-medium">Select Models</h3>
      {error && <p className="text-sm text-red-500">{error}</p>}
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
