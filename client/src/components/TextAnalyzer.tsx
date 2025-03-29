import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Spinner } from "./ui/spinner";
import EntityHighlighter from "./EntityHighlighter";
import SampleTexts from "./SampleTexts";
import apiService, { Entity } from "../services/api";
import { toast } from "sonner";

const TextAnalyzer = () => {
  const [text, setText] = useState("");
  const [selectedModel, setSelectedModel] = useState<string | undefined>(
    undefined,
  );
  const [models, setModels] = useState<string[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch available models on component mount
    const fetchModels = async () => {
      try {
        const availableModels = await apiService.getModels();
        setModels(availableModels);
        if (availableModels.length > 0) {
          setSelectedModel(availableModels[0]);
        }
      } catch (error) {
        setError("Failed to fetch available models");
        toast.error("Failed to fetch available models");
        console.error(error);
      }
    };

    fetchModels();
  }, []);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError("Please enter some text to analyze");
      toast.error("Please enter some text to analyze");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiService.analyzeText(text, selectedModel);
      setEntities(result);
      toast.success("Analysis complete!");
    } catch (error) {
      setError("Failed to analyze text");
      toast.error("Failed to analyze text");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeAll = async () => {
    if (!text.trim()) {
      setError("Please enter some text to analyze");
      toast.error("Please enter some text to analyze");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiService.analyzeTextWithAllModels(text);
      setEntities(result);
      toast.success("Analysis with all models complete!");
    } catch (error) {
      setError("Failed to analyze text with all models");
      toast.error("Failed to analyze text with all models");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSampleTextSelect = (sampleText: string) => {
    setText(sampleText);
    toast.info("Sample text selected");
  };

  // Get unique entity labels for grouping
  const entityLabels = [...new Set(entities.map((entity) => entity.label))];

  // Group entities by label
  const entityGroups = entityLabels.map((label) => ({
    label,
    entities: entities.filter((entity) => entity.label === label),
  }));

  // Map entity labels to colors
  const getEntityColor = (label: string): string => {
    const colorMap: Record<string, string> = {
      PERSON: "bg-blue-500",
      ORG: "bg-green-500",
      GPE: "bg-yellow-500",
      LOC: "bg-purple-500",
      DATE: "bg-red-500",
      PRODUCT: "bg-indigo-500",
      SKILL: "bg-pink-500",
      TOOL: "bg-teal-500",
      LANGUAGE: "bg-orange-500",
    };

    return colorMap[label] || "bg-gray-500";
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Skill Bridge</CardTitle>
          <CardDescription>
            Extract named entities from text using custom-trained spaCy models
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Model Selection */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Select Model</h3>
            <div className="flex flex-wrap gap-2">
              {models.length === 0 ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" />
                  <span className="text-sm text-muted-foreground">
                    Loading models...
                  </span>
                </div>
              ) : (
                models.map((model) => (
                  <Button
                    key={model}
                    variant={selectedModel === model ? "default" : "outline"}
                    onClick={() => setSelectedModel(model)}
                    className="h-8 px-3 text-xs"
                  >
                    {model}
                  </Button>
                ))
              )}
            </div>
          </div>

          {/* Text Input */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Enter Text for Analysis</h3>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to analyze for entities..."
              className="min-h-[150px] resize-none"
            />
            <SampleTexts onSelect={handleSampleTextSelect} />
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Spinner size="sm" />
                  Analyzing...
                </span>
              ) : (
                "Analyze with Selected Model"
              )}
            </Button>
            <Button
              onClick={handleAnalyzeAll}
              disabled={loading}
              variant="outline"
              className="w-full sm:w-auto"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Spinner size="sm" />
                  Analyzing...
                </span>
              ) : (
                "Analyze with All Models"
              )}
            </Button>
          </div>

          {/* Results */}
          {entities.length > 0 && (
            <div className="space-y-6 border-t pt-6">
              {/* Highlighted Text */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Highlighted Text</h3>
                <div className="rounded-md border p-4 bg-muted/30">
                  <EntityHighlighter text={text} entities={entities} />
                </div>
              </div>

              {/* Extracted Entities */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Extracted Entities</h3>
                <div className="space-y-4">
                  {entityGroups.map((group) => (
                    <div key={group.label} className="border rounded-md p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={getEntityColor(group.label)}>
                          {group.label}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {group.entities.length}{" "}
                          {group.entities.length === 1 ? "entity" : "entities"}{" "}
                          found
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {group.entities.map((entity, index) => (
                          <Badge key={index} variant="outline">
                            {entity.text}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t px-6 py-4">
          <p className="text-xs text-muted-foreground">
            Powered by spaCy NER models
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TextAnalyzer;
