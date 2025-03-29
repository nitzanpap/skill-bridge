import axios from "axios";

// Define the backend API URL
const API_URL = "http://localhost:8000/api/v1";

// Define the types based on the backend schemas
export interface Entity {
  text: string;
  label: string;
}

export interface AnalysisRequest {
  text: string;
  model?: string;
}

export interface AnalysisResponse {
  entities: Entity[];
}

export interface CombinedAnalysisRequest {
  text: string;
}

export interface CombinedAnalysisResponse {
  entities: Entity[];
}

export interface ModelsResponse {
  available_models: string[];
}

// Create the API service
const apiService = {
  // Get available models
  getModels: async (): Promise<string[]> => {
    try {
      const response = await axios.get<ModelsResponse>(`${API_URL}/models`);
      return response.data.available_models;
    } catch (error) {
      console.error("Error fetching models:", error);
      throw error;
    }
  },

  // Analyze text with a specific model
  analyzeText: async (text: string, model?: string): Promise<Entity[]> => {
    try {
      const response = await axios.post<AnalysisResponse>(
        `${API_URL}/analyze`,
        {
          text,
          model,
        },
      );
      return response.data.entities;
    } catch (error) {
      console.error("Error analyzing text:", error);
      throw error;
    }
  },

  // Analyze text with all models
  analyzeTextWithAllModels: async (text: string): Promise<Entity[]> => {
    try {
      const response = await axios.post<CombinedAnalysisResponse>(
        `${API_URL}/analyze/all`,
        {
          text,
        },
      );
      return response.data.entities;
    } catch (error) {
      console.error("Error analyzing text with all models:", error);
      throw error;
    }
  },
};

export default apiService;
