import { useMemo } from "react";
import { Entity } from "../services/api";
import { Badge } from "./ui/badge";

interface EntityHighlighterProps {
  text: string;
  entities: Entity[];
}

const EntityHighlighter = ({ text, entities }: EntityHighlighterProps) => {
  // Get entity color based on label
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

  // Generate highlighted text with entity markers
  const highlightedText = useMemo(() => {
    if (!entities.length) return text;

    // Sort entities by their position in the text
    const sortedEntities = [...entities].sort((a, b) => {
      const indexA = text.indexOf(a.text);
      const indexB = text.indexOf(b.text);
      return indexA - indexB;
    });

    let lastIndex = 0;
    const fragments = [];

    for (const entity of sortedEntities) {
      const entityIndex = text.indexOf(entity.text, lastIndex);

      // If entity not found or overlaps with previous entity, skip
      if (entityIndex === -1 || entityIndex < lastIndex) {
        continue;
      }

      // Add text before the entity
      if (entityIndex > lastIndex) {
        fragments.push(
          <span key={`text-${lastIndex}`}>
            {text.substring(lastIndex, entityIndex)}
          </span>,
        );
      }

      // Add the highlighted entity
      fragments.push(
        <span
          key={`entity-${entityIndex}`}
          className="relative inline-block group"
        >
          <Badge
            className={`px-1.5 py-0.5 text-white leading-tight ${getEntityColor(entity.label)}`}
            variant="default"
          >
            {entity.text}
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity z-50 pointer-events-none">
              {entity.label}
            </span>
          </Badge>
        </span>,
      );

      lastIndex = entityIndex + entity.text.length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      fragments.push(
        <span key={`text-${lastIndex}`}>{text.substring(lastIndex)}</span>,
      );
    }

    return fragments;
  }, [text, entities]);

  return <div className="leading-relaxed break-words">{highlightedText}</div>;
};

export default EntityHighlighter;
