// API base URL - use relative URL when in browser environment
// to leverage Next.js rewrites and avoid CORS issues
const isClient = typeof window !== "undefined"
const API_BASE_URL = isClient ? "" : process.env.SERVER_BASE_URL || "http://localhost:8000"
const API_PREFIX = "/api/v1"

// Types for API requests and responses
export interface Entity {
  text: string
  label: string
}

export interface MatchDetail {
  job_skill: string
  best_match: string | null
  similarity: number
  is_match: boolean
}

export interface SkillComparisonData {
  score: number
  matched_skills: string[]
  missing_skills: string[]
  matching_details: MatchDetail[]
}

export interface CourseRecommendation {
  course_name: string
  url: string
  description: string
  potential_score: number
  score_improvement: number
}

export interface SkillBridgeResponse {
  recommended_courses: CourseRecommendation[]
  skill_gap: string[]
  job_skills: string[]
  user_skills: string[]
  recommendations_text: string | null
  matching_details: MatchDetail[]
}

// Get course recommendations and skill comparison data from a single endpoint
export const getSkillBridgeData = async (
  resumeText: string,
  jobDescriptionText: string,
  threshold: number = 0.5
): Promise<SkillBridgeResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_PREFIX}/recommend-courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resume_text: resumeText,
        job_description_text: jobDescriptionText,
        threshold: threshold,
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data: SkillBridgeResponse = await response.json()
    return data
  } catch (error) {
    console.error("Error getting skill bridge data:", error)
    throw error
  }
}

// Helper function to convert course recommendation response to skill comparison data format
export const extractSkillComparisonData = (response: SkillBridgeResponse): SkillComparisonData => {
  // Calculate a score based on matched vs total job skills
  const totalSkills = response.job_skills.length || 1 // Avoid division by zero
  const matchedSkills = response.job_skills.filter((skill) => !response.skill_gap.includes(skill))
  const score = Math.round((matchedSkills.length / totalSkills) * 100)

  return {
    score,
    matched_skills: matchedSkills,
    missing_skills: response.skill_gap,
    matching_details: response.matching_details,
  }
}
