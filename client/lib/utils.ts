import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Entity } from "./api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Entity type mapping for UI display
export const entityTypeColors: Record<string, string> = {
  SKILL: "bg-pink-500",
  TOOL: "bg-teal-500",
  LANGUAGE: "bg-orange-500",
  ORG: "bg-green-500",
  GPE: "bg-purple-500", // Location/Geopolitical entity
  DATE: "bg-red-500",
  PRODUCT: "bg-indigo-500",
  PERSON: "bg-blue-500",
  // Default for any other types
  OTHER: "bg-gray-500",
};

// Map API entity types to UI categories
export const entityTypeToCategory: Record<string, string> = {
  SKILL: "Skills",
  TOOL: "Tools",
  LANGUAGE: "Languages",
  ORG: "Organizations",
  GPE: "Locations",
  DATE: "Dates",
  PRODUCT: "Products",
  PERSON: "People",
  // Map any other types to Other
  OTHER: "Other",
};

// Transform API entities to UI format - simplified to only handle entity categorization
export function transformEntitiesForUI(
  entities: Entity[],
): Record<string, string[]> {
  // Group entities by category
  const groupedEntities: Record<string, string[]> = {};

  entities.forEach((entity) => {
    const category = entityTypeToCategory[entity.type] || "Other";

    if (!groupedEntities[category]) {
      groupedEntities[category] = [];
    }

    // Only add the entity if it's not already in the array
    if (!groupedEntities[category].includes(entity.text)) {
      groupedEntities[category].push(entity.text);
    }
  });

  return groupedEntities;
}
