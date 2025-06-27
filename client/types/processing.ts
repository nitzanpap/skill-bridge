export enum ProcessingStage {
  IDLE = 'idle',
  DATA_RECEPTION = 'data_reception',
  NAMED_ENTITY_RECOGNITION = 'named_entity_recognition',
  SKILL_EXTRACTION = 'skill_extraction',
  SIMILARITY_ANALYSIS = 'similarity_analysis',
  COURSE_RETRIEVAL = 'course_retrieval',
  LLM_RECOMMENDATION = 'llm_recommendation',
  FINAL_PROCESSING = 'final_processing',
  COMPLETED = 'completed',
}

export enum StageStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum ProcessingMode {
  ANALYSIS = 'analysis',
  DEMO = 'demo',
}

export enum PlaybackState {
  PLAYING = 'playing',
  PAUSED = 'paused',
  STOPPED = 'stopped',
}

export interface ModelStatus {
  name: string
  type: 'NER' | 'Embedding' | 'LLM' | 'Database'
  progress: number
  status: StageStatus
  description: string
}

export interface ProcessingStageInfo {
  id: ProcessingStage
  name: string
  description: string
  estimatedDuration: number // in milliseconds
  models: string[]
}

export interface ProcessingState {
  currentStage: ProcessingStage
  stageProgress: Record<ProcessingStage, number>
  extractedSkills: {
    resume: string[]
    job: string[]
  }
  timeElapsed: number
  estimatedTimeRemaining: number
  modelsInUse: ModelStatus[]
  totalProgress: number
  mode: ProcessingMode
  playbackState: PlaybackState
  isInteractive: boolean
}

export const PROCESSING_STAGES: Record<ProcessingStage, ProcessingStageInfo> = {
  [ProcessingStage.IDLE]: {
    id: ProcessingStage.IDLE,
    name: 'Ready',
    description: 'Waiting to begin analysis',
    estimatedDuration: 0,
    models: [],
  },
  [ProcessingStage.DATA_RECEPTION]: {
    id: ProcessingStage.DATA_RECEPTION,
    name: 'Data Reception',
    description: 'Receiving and validating your resume and job description',
    estimatedDuration: 1500,
    models: ['FastAPI Backend'],
  },
  [ProcessingStage.NAMED_ENTITY_RECOGNITION]: {
    id: ProcessingStage.NAMED_ENTITY_RECOGNITION,
    name: 'Entity Recognition',
    description: 'Extracting skills and entities using advanced NLP models',
    estimatedDuration: 15000,
    models: [
      'spaCy NER (ner_model_20000)',
      'spaCy NER (ner_10000_word2vec_glassdoor)',
      'spaCy NER (ner_model_1000_word2vec)',
    ],
  },
  [ProcessingStage.SKILL_EXTRACTION]: {
    id: ProcessingStage.SKILL_EXTRACTION,
    name: 'Skill Processing',
    description: 'Filtering and organizing extracted skills',
    estimatedDuration: 3500,
    models: ['Skill Filter Engine'],
  },
  [ProcessingStage.SIMILARITY_ANALYSIS]: {
    id: ProcessingStage.SIMILARITY_ANALYSIS,
    name: 'Similarity Analysis',
    description: 'Computing semantic similarity between resume and job requirements',
    estimatedDuration: 20000,
    models: ['SentenceTransformer (all-MiniLM-L6-v2)'],
  },
  [ProcessingStage.COURSE_RETRIEVAL]: {
    id: ProcessingStage.COURSE_RETRIEVAL,
    name: 'Course Discovery',
    description: 'Finding relevant courses from our database',
    estimatedDuration: 15000,
    models: ['Pinecone Vector DB', 'SentenceTransformer (all-MiniLM-L6-v2)'],
  },
  [ProcessingStage.LLM_RECOMMENDATION]: {
    id: ProcessingStage.LLM_RECOMMENDATION,
    name: 'AI Recommendations',
    description: 'Generating personalized course recommendations',
    estimatedDuration: 10000,
    models: ['Cohere LLM'],
  },
  [ProcessingStage.FINAL_PROCESSING]: {
    id: ProcessingStage.FINAL_PROCESSING,
    name: 'Final Processing',
    description: 'Calculating scores and preparing results',
    estimatedDuration: 3500,
    models: ['Score Calculator'],
  },
  [ProcessingStage.COMPLETED]: {
    id: ProcessingStage.COMPLETED,
    name: 'Complete',
    description: 'Analysis completed successfully',
    estimatedDuration: 0,
    models: [],
  },
}

export const STAGE_ORDER = [
  ProcessingStage.DATA_RECEPTION,
  ProcessingStage.NAMED_ENTITY_RECOGNITION,
  ProcessingStage.SKILL_EXTRACTION,
  ProcessingStage.SIMILARITY_ANALYSIS,
  ProcessingStage.COURSE_RETRIEVAL,
  ProcessingStage.LLM_RECOMMENDATION,
  ProcessingStage.FINAL_PROCESSING,
  ProcessingStage.COMPLETED,
]
