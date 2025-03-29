"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { TextInput } from "@/components/text-input";
import { ModelSelection } from "@/components/model-selection";
import { ResultsDisplay } from "@/components/results-display";
import { Loader2 } from "lucide-react";

// Sample job descriptions for quick testing
const sampleTexts = {
  "software-engineer": `We are looking for a Software Engineer with 5+ years of experience in React, Node.js, and TypeScript. The ideal candidate should have strong problem-solving skills and experience with AWS, Docker, and CI/CD pipelines. Knowledge of Python and machine learning frameworks like TensorFlow or PyTorch is a plus. Must be located in San Francisco or willing to relocate. This position reports to the Engineering Manager at TechCorp.`,

  "data-scientist": `Seeking a Data Scientist with expertise in Python, R, and SQL. Must have experience with data visualization tools like Tableau or Power BI, and machine learning libraries such as scikit-learn, TensorFlow, and PyTorch. Knowledge of big data technologies like Hadoop and Spark is required. The position is at DataTech in New York City, starting January 2024.`,

  "product-manager": `Product Manager needed with 3+ years of experience in SaaS products. Must have excellent communication skills and experience with Agile methodologies, JIRA, and product roadmapping tools. Knowledge of UX design principles and basic understanding of web technologies is required. The role involves collaboration with engineering teams at ProductCo in Austin, Texas.`,
};

// Entity types and their corresponding colors
const entityTypes = {
  Skills: "bg-pink-500",
  Tools: "bg-teal-500",
  Languages: "bg-orange-500",
  Organizations: "bg-green-500",
  Locations: "bg-purple-500",
  Dates: "bg-red-500",
  Products: "bg-indigo-500",
  People: "bg-blue-500",
};

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [selectedModels, setSelectedModels] = useState<string[]>(["all"]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<null | {
    highlightedText: string;
    entities: Record<string, string[]>;
  }>(null);

  const handleModelSelection = (model: string) => {
    if (model === "all") {
      setSelectedModels(["all"]);
    } else {
      const newSelection = selectedModels.filter((m) => m !== "all");
      if (newSelection.includes(model)) {
        setSelectedModels(newSelection.filter((m) => m !== model));
      } else {
        setSelectedModels([...newSelection, model]);
      }

      // If no models are selected, default to "all"
      if (newSelection.length === 0) {
        setSelectedModels(["all"]);
      }
    }
  };

  const handleSampleSelection = (sampleKey: string) => {
    setInputText(sampleTexts[sampleKey as keyof typeof sampleTexts]);
  };

  const analyzeText = () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);

    // Simulate API call with setTimeout
    setTimeout(() => {
      // Mock results based on the input text
      const mockEntities: Record<string, string[]> = {
        Skills: ["problem-solving", "communication"],
        Tools: ["React", "Node.js", "AWS", "Docker", "CI/CD", "JIRA"],
        Languages: ["TypeScript", "Python", "R", "SQL"],
        Organizations: ["TechCorp", "DataTech", "ProductCo"],
        Locations: ["San Francisco", "New York City", "Austin, Texas"],
        Dates: ["January 2024", "5+ years", "3+ years"],
        Products: [
          "TensorFlow",
          "PyTorch",
          "Tableau",
          "Power BI",
          "Hadoop",
          "Spark",
        ],
        People: ["Engineering Manager"],
      };

      // Filter entities based on what's actually in the input text
      const filteredEntities: Record<string, string[]> = {};
      Object.entries(mockEntities).forEach(([category, items]) => {
        const found = items.filter((item) =>
          inputText.toLowerCase().includes(item.toLowerCase()),
        );
        if (found.length > 0) {
          filteredEntities[category] = found;
        }
      });

      // Create highlighted text by wrapping entities with span tags
      let highlightedText = inputText;
      Object.entries(filteredEntities).forEach(([category, items]) => {
        items.forEach((item) => {
          const regex = new RegExp(`\\b${item}\\b`, "gi");
          highlightedText = highlightedText.replace(
            regex,
            `<span class="entity ${entityTypes[category as keyof typeof entityTypes]}">${item}</span>`,
          );
        });
      });

      setResults({
        highlightedText,
        entities: filteredEntities,
      });

      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Skill Bridge</h1>
            <p className="text-sm text-muted-foreground">
              Entity Extraction Tool
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container px-4 py-8 md:py-12 max-w-7xl mx-auto">
        <div className="grid gap-8">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Text Analysis</CardTitle>
              <CardDescription>
                Enter a job description or resume to extract skills and other
                entities
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="grid gap-6">
                <TextInput
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />

                <div className="grid gap-3">
                  <h3 className="text-sm font-medium">Sample Texts</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSampleSelection("software-engineer")}
                      className="transition-colors"
                    >
                      Software Engineer
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSampleSelection("data-scientist")}
                      className="transition-colors"
                    >
                      Data Scientist
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSampleSelection("product-manager")}
                      className="transition-colors"
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
            <CardFooter className="border-t bg-muted/50 p-4">
              <Button
                onClick={analyzeText}
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
            </CardFooter>
          </Card>

          {results && (
            <ResultsDisplay
              highlightedText={results.highlightedText}
              entities={results.entities}
              entityTypes={entityTypes}
            />
          )}
        </div>
      </main>
    </div>
  );
}
