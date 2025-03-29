"use client"

import { useState, useCallback } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./components/theme-toggle"
import { TextInput } from "./components/text-input"
import { ModelSelection } from "./components/model-selection"
import { ResultsDisplay } from "./components/results-display"
import { Loader2 } from "lucide-react"
import { analyzeText, analyzeTextAllModels, Entity } from "@/lib/api"
import { transformEntitiesForUI, entityTypeColors } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

// Sample job descriptions for quick testing
const sampleTexts = {
  "software-engineer": `We are looking for a Software Engineer with 5+ years of experience in React, Node.js, and TypeScript. The ideal candidate should have strong problem-solving skills and experience with AWS, Docker, and CI/CD pipelines. Knowledge of Python and machine learning frameworks like TensorFlow or PyTorch is a plus. Must be located in San Francisco or willing to relocate. This position reports to the Engineering Manager at TechCorp.`,

  "data-scientist": `Seeking a Data Scientist with expertise in Python, R, and SQL. Must have experience with data visualization tools like Tableau or Power BI, and machine learning libraries such as scikit-learn, TensorFlow, and PyTorch. Knowledge of big data technologies like Hadoop and Spark is required. The position is at DataTech in New York City, starting January 2024.`,

  "product-manager": `Product Manager needed with 3+ years of experience in SaaS products. Must have excellent communication skills and experience with Agile methodologies, JIRA, and product roadmapping tools. Knowledge of UX design principles and basic understanding of web technologies is required. The role involves collaboration with engineering teams at ProductCo in Austin, Texas.`,
}

export default function Home() {
  const [inputText, setInputText] = useState("")
  const [selectedModels, setSelectedModels] = useState<string[]>(["all"])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState<string>("")
  const [results, setResults] = useState<null | {
    highlightedText: string
    entities: Record<string, string[]>
  }>(null)

  const handleModelSelection = (model: string) => {
    if (model === "all") {
      setSelectedModels(["all"])
    } else {
      const newSelection = selectedModels.filter((m) => m !== "all")
      if (newSelection.includes(model)) {
        setSelectedModels(newSelection.filter((m) => m !== model))
      } else {
        setSelectedModels([...newSelection, model])
      }

      // If no models are selected, default to "all"
      if (newSelection.length === 0) {
        setSelectedModels(["all"])
      }
    }
  }

  const handleSampleSelection = (sampleKey: string) => {
    setInputText(sampleTexts[sampleKey as keyof typeof sampleTexts])
  }

  const analyzeInputText = useCallback(async () => {
    if (!inputText.trim()) return

    setIsAnalyzing(true)
    setResults(null)
    setProcessingStatus("Requesting data from API...")

    try {
      const apiStartTime = performance.now()
      let entities: Entity[] = []

      // Check if "all" is selected or if specific models are selected
      if (selectedModels.includes("all")) {
        entities = await analyzeTextAllModels(inputText)
      } else {
        // If multiple models are selected, get results from first selected model
        // (backend doesn't support multiple specific models in one call)
        entities = await analyzeText(inputText, selectedModels[0])
      }

      const apiEndTime = performance.now()
      setProcessingStatus(
        `API response received (${Math.round(apiEndTime - apiStartTime)}ms). Processing entities...`
      )

      // Validate entities before transforming
      if (!Array.isArray(entities)) {
        throw new Error("Invalid response format from API")
      }

      // Check if entities is empty
      if (entities.length === 0) {
        toast({
          title: "No entities found",
          description: "No entities were detected in the provided text.",
        })
        setIsAnalyzing(false)
        return
      }

      // For larger texts or many entities, use requestAnimationFrame to avoid UI blocking
      window.requestAnimationFrame(() => {
        const transformStartTime = performance.now()

        // Transform the response into the format expected by the UI
        const transformedResults = transformEntitiesForUI(entities, inputText)

        const transformEndTime = performance.now()
        console.log(
          `Entity transformation took: ${Math.round(transformEndTime - transformStartTime)}ms`
        )

        setResults(transformedResults)
        setIsAnalyzing(false)
      })
    } catch (error) {
      console.error("Error analyzing text:", error)

      // More specific error messages based on error type
      if (error instanceof TypeError) {
        toast({
          title: "Data Format Error",
          description: "There was an issue with the data format from the API.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Analysis Failed",
          description: "We couldn't analyze your text. Please try again later.",
          variant: "destructive",
        })
      }
      setIsAnalyzing(false)
    }
  }, [inputText, selectedModels])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Skill Bridge</h1>
            <p className="text-sm text-muted-foreground">Entity Extraction Tool</p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container px-4 py-6 md:py-10">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Text Analysis</CardTitle>
              <CardDescription>
                Enter a job description or resume to extract skills and other entities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <TextInput value={inputText} onChange={(e) => setInputText(e.target.value)} />

                <div className="grid gap-2">
                  <h3 className="text-sm font-medium">Sample Texts</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSampleSelection("software-engineer")}
                    >
                      Software Engineer
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSampleSelection("data-scientist")}
                    >
                      Data Scientist
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSampleSelection("product-manager")}
                    >
                      Product Manager
                    </Button>
                  </div>
                </div>

                <ModelSelection
                  selectedModels={selectedModels}
                  onModelSelect={handleModelSelection}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
              <Button
                onClick={analyzeInputText}
                disabled={!inputText.trim() || isAnalyzing}
                className="w-full sm:w-auto"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Text"
                )}
              </Button>
              {isAnalyzing && processingStatus && (
                <p className="text-sm text-muted-foreground">{processingStatus}</p>
              )}
            </CardFooter>
          </Card>

          {results && (
            <ResultsDisplay
              highlightedText={results.highlightedText}
              entities={results.entities}
              entityTypes={entityTypeColors}
            />
          )}
        </div>
      </main>
    </div>
  )
}
