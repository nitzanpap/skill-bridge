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
import { TextInput, DualTextInput } from "./components/text-input"
import { ResultsDisplay } from "./components/results-display"
import { SkillComparisonDisplay } from "./components/comparison-results"
import { Loader2 } from "lucide-react"
import { analyzeTextAllModels, compareSkills, SkillComparisonResponse, Entity } from "@/lib/api"
import { transformEntitiesForUI, entityTypeColors } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

// Sample texts for quick testing
const sampleTexts = {
  "software-engineer-resume": `PROFESSIONAL SUMMARY
Experienced software engineer with 7 years of experience developing web applications using React, TypeScript, and Node.js. Strong background in cloud architecture with AWS. Proven ability to design scalable solutions and mentor junior developers.

SKILLS
Programming Languages: JavaScript, TypeScript, Python
Frontend: React, Redux, HTML5, CSS3, SASS
Backend: Node.js, Express, NestJS
Databases: MongoDB, PostgreSQL, MySQL
Cloud: AWS (EC2, S3, Lambda), Docker, Kubernetes
Tools: Git, JIRA, CI/CD pipelines

EXPERIENCE
Senior Software Engineer at TechCorp
Led development of a customer-facing portal using React and TypeScript
Implemented serverless architecture using AWS Lambda and API Gateway
Reduced page load time by 40% through code optimization
`,

  "software-engineer-job": `We are looking for a Software Engineer with 5+ years of experience in React, Node.js, and TypeScript. The ideal candidate should have strong problem-solving skills and experience with AWS, Docker, and CI/CD pipelines. Knowledge of Python and machine learning frameworks like TensorFlow or PyTorch is a plus. Must be located in San Francisco or willing to relocate.`,

  "data-scientist-resume": `PROFESSIONAL SUMMARY
Data scientist with 4 years of experience analyzing large datasets and building predictive models. Proficient in Python, R, and SQL with strong background in statistical analysis and machine learning.

SKILLS
Programming: Python, R, SQL
Data Analysis: Pandas, NumPy, Scikit-learn
Visualization: Tableau, Matplotlib, Seaborn
Databases: PostgreSQL, MongoDB
Big Data: Hadoop, Spark
Machine Learning: Regression, Classification, Clustering
`,

  "data-scientist-job": `Seeking a Data Scientist with expertise in Python, R, and SQL. Must have experience with data visualization tools like Tableau or Power BI, and machine learning libraries such as scikit-learn, TensorFlow, and PyTorch. Knowledge of big data technologies like Hadoop and Spark is required. The position is at DataTech in New York City.`,
}

export default function Home() {
  const [mode, setMode] = useState<"single" | "compare">("compare")

  // Single mode state
  const [inputText, setInputText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState<string>("")
  const [entities, setEntities] = useState<Record<string, string[]> | null>(null)

  // Compare mode state
  const [resumeText, setResumeText] = useState("")
  const [jobDescriptionText, setJobDescriptionText] = useState("")
  const [isComparing, setIsComparing] = useState(false)
  const [comparisonStatus, setComparisonStatus] = useState<string>("")
  const [comparisonResults, setComparisonResults] = useState<SkillComparisonResponse | null>(null)

  const handleSampleSelection = (sampleKey: string) => {
    if (mode === "single") {
      setInputText(sampleTexts[sampleKey as keyof typeof sampleTexts])
    } else {
      if (sampleKey.includes("resume")) {
        setResumeText(sampleTexts[sampleKey as keyof typeof sampleTexts])
      } else if (sampleKey.includes("job")) {
        setJobDescriptionText(sampleTexts[sampleKey as keyof typeof sampleTexts])
      }
    }
  }

  const analyzeInputText = useCallback(async () => {
    if (!inputText.trim()) return

    setIsAnalyzing(true)
    setEntities(null)
    setProcessingStatus("Requesting data from API...")

    try {
      const apiStartTime = performance.now()

      // Always use all models
      const apiEntities = await analyzeTextAllModels(inputText)

      const apiEndTime = performance.now()
      setProcessingStatus(
        `API response received (${Math.round(apiEndTime - apiStartTime)}ms). Processing entities...`
      )

      // Validate entities before transforming
      if (!Array.isArray(apiEntities)) {
        throw new Error("Invalid response format from API")
      }

      // Check if entities is empty
      if (apiEntities.length === 0) {
        toast({
          title: "No entities found",
          description: "No entities were detected in the provided text.",
        })
        setIsAnalyzing(false)
        return
      }

      // Process the entities
      const transformStartTime = performance.now()
      const groupedEntities = transformEntitiesForUI(apiEntities)
      const transformEndTime = performance.now()

      console.log(`Entity grouping took: ${Math.round(transformEndTime - transformStartTime)}ms`)

      setEntities(groupedEntities)
      setIsAnalyzing(false)
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
  }, [inputText])

  const compareResume = useCallback(async () => {
    if (!resumeText.trim() || !jobDescriptionText.trim()) {
      toast({
        title: "Missing input",
        description: "Please provide both resume and job description texts.",
      })
      return
    }

    setIsComparing(true)
    setComparisonResults(null)
    setComparisonStatus("Comparing resume against job requirements...")

    try {
      const apiStartTime = performance.now()

      // Call the API to compare skills
      const results = await compareSkills(resumeText, jobDescriptionText)

      const apiEndTime = performance.now()
      setComparisonStatus(`Comparison completed in ${Math.round(apiEndTime - apiStartTime)}ms.`)

      setComparisonResults(results)
      setIsComparing(false)
    } catch (error) {
      console.error("Error comparing skills:", error)

      toast({
        title: "Comparison Failed",
        description:
          "We couldn't compare your resume against the job requirements. Please try again later.",
        variant: "destructive",
      })

      setIsComparing(false)
    }
  }, [resumeText, jobDescriptionText])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Skill Bridge</h1>
            <p className="text-sm text-muted-foreground">Entity Extraction Tool</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button
                variant={mode === "single" ? "default" : "outline"}
                size="sm"
                onClick={() => setMode("single")}
              >
                Single Text
              </Button>
              <Button
                variant={mode === "compare" ? "default" : "outline"}
                size="sm"
                onClick={() => setMode("compare")}
              >
                Compare Skills
              </Button>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container px-4 py-6 md:py-10">
        <div className="grid gap-6">
          {mode === "single" ? (
            // Single mode UI
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
                        onClick={() => handleSampleSelection("software-engineer-job")}
                      >
                        Software Engineer
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSampleSelection("data-scientist-job")}
                      >
                        Data Scientist
                      </Button>
                    </div>
                  </div>
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
          ) : (
            // Compare mode UI
            <Card>
              <CardHeader>
                <CardTitle>Skill Comparison</CardTitle>
                <CardDescription>
                  Compare your resume against a job description to identify missing skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <DualTextInput
                    resumeText={resumeText}
                    onResumeChange={(e) => setResumeText(e.target.value)}
                    jobDescriptionText={jobDescriptionText}
                    onJobDescriptionChange={(e) => setJobDescriptionText(e.target.value)}
                  />

                  <div className="grid gap-2">
                    <h3 className="text-sm font-medium">Sample Texts</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSampleSelection("software-engineer-resume")}
                      >
                        Software Engineer Resume
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSampleSelection("software-engineer-job")}
                      >
                        Software Engineer Job
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSampleSelection("data-scientist-resume")}
                      >
                        Data Scientist Resume
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSampleSelection("data-scientist-job")}
                      >
                        Data Scientist Job
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                <Button
                  onClick={compareResume}
                  disabled={!resumeText.trim() || !jobDescriptionText.trim() || isComparing}
                  className="w-full sm:w-auto"
                >
                  {isComparing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Comparing...
                    </>
                  ) : (
                    "Compare Skills"
                  )}
                </Button>
                {isComparing && comparisonStatus && (
                  <p className="text-sm text-muted-foreground">{comparisonStatus}</p>
                )}
              </CardFooter>
            </Card>
          )}

          {/* Display results based on mode */}
          {mode === "single" && entities && (
            <ResultsDisplay entities={entities} entityTypes={entityTypeColors} />
          )}

          {mode === "compare" && comparisonResults && (
            <SkillComparisonDisplay
              resumeSkills={comparisonResults.resume_skills}
              jobSkills={comparisonResults.job_skills}
              missingSkills={comparisonResults.missing_skills}
              entityTypes={entityTypeColors}
            />
          )}
        </div>
      </main>
    </div>
  )
}
