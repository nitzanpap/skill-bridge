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
import { DualTextInput } from "./components/text-input"
import { SkillComparisonDisplay } from "./components/comparison-results"
import { CourseRecommendationsDisplay } from "./components/course-recommendations"
import { Loader2 } from "lucide-react"
import {
  getSkillBridgeData,
  extractSkillComparisonData,
  SkillBridgeResponse,
  SkillComparisonData,
} from "@/lib/api"
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
  // Resume and job description text states
  const [resumeText, setResumeText] = useState("")
  const [jobDescriptionText, setJobDescriptionText] = useState("")
  const [threshold, setThreshold] = useState(0.5)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState<string>("")
  const [skillData, setSkillData] = useState<SkillComparisonData | null>(null)
  const [recommendationData, setRecommendationData] = useState<SkillBridgeResponse | null>(null)

  const handleSampleSelection = (sampleKey: string) => {
    if (sampleKey.includes("resume")) {
      setResumeText(sampleTexts[sampleKey as keyof typeof sampleTexts])
    } else if (sampleKey.includes("job")) {
      setJobDescriptionText(sampleTexts[sampleKey as keyof typeof sampleTexts])
    }
  }

  const analyzeResume = useCallback(async () => {
    if (!resumeText.trim() || !jobDescriptionText.trim()) {
      toast({
        title: "Missing input",
        description: "Please provide both resume and job description texts.",
      })
      return
    }

    setIsProcessing(true)
    setSkillData(null)
    setRecommendationData(null)
    setProcessingStatus("Analyzing resume and finding recommendations...")

    try {
      const apiStartTime = performance.now()

      // Call the unified API to get both skill comparison and course recommendations
      const response = await getSkillBridgeData(resumeText, jobDescriptionText, threshold)

      // Extract the skill comparison data from the response
      const skillComparisonData = extractSkillComparisonData(response)

      const apiEndTime = performance.now()
      setProcessingStatus(`Analysis completed in ${Math.round(apiEndTime - apiStartTime)}ms.`)

      // Set both the skill comparison and recommendation data
      setSkillData(skillComparisonData)
      setRecommendationData(response)
      setIsProcessing(false)
    } catch (error) {
      console.error("Error analyzing resume:", error)

      toast({
        title: "Analysis Failed",
        description:
          "We couldn't analyze your resume against the job requirements. Please try again later.",
        variant: "destructive",
      })

      setIsProcessing(false)
    }
  }, [resumeText, jobDescriptionText, threshold])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Skill Bridge</h1>
            <p className="text-sm text-muted-foreground">Semantic Skill Matching Tool</p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container px-4 py-6 md:py-10">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Resume Analysis</CardTitle>
              <CardDescription>
                Compare your resume against a job description to identify matching skills, missing
                skills, and get personalized course recommendations
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

                <div className="grid gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="threshold" className="text-sm font-medium">
                      Similarity Threshold: {threshold}
                    </label>
                    <input
                      type="range"
                      id="threshold"
                      min="0.1"
                      max="0.9"
                      step="0.05"
                      value={threshold}
                      onChange={(e) => setThreshold(parseFloat(e.target.value))}
                      className="w-full max-w-md"
                    />
                    <p className="text-xs text-muted-foreground">
                      Lower values match more skills with weaker similarities. Higher values require
                      stronger matches.
                    </p>
                  </div>

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
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <Button
                onClick={analyzeResume}
                disabled={!resumeText.trim() || !jobDescriptionText.trim() || isProcessing}
                className="w-full sm:w-auto"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Resume"
                )}
              </Button>

              {isProcessing && processingStatus && (
                <p className="text-sm text-muted-foreground">{processingStatus}</p>
              )}
            </CardFooter>
          </Card>

          {/* Display skill comparison results */}
          {skillData && <SkillComparisonDisplay comparisonResults={skillData} />}

          {/* Display course recommendations */}
          {recommendationData && (
            <CourseRecommendationsDisplay recommendations={recommendationData} />
          )}
        </div>
      </main>
    </div>
  )
}
