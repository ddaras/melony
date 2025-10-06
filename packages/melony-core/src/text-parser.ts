import { parse as parsePartialJson } from "partial-json";
import { ParsedSegment } from "./types";

/**
 * Parse the text to extract mixed content (text and JSON)
 * This function identifies JSON objects within text and separates them from regular text content
 */
export const parseText = (text: string): ParsedSegment[] => {
  const segments: ParsedSegment[] = [];
  let currentIndex = 0;

  while (currentIndex < text.length) {
    // Look for both opening brace and bracket
    const startBrace = text.indexOf("{", currentIndex);
    const startBracket = text.indexOf("[", currentIndex);

    // Determine which comes first (or if neither exists)
    let startJson = -1;
    let isArray = false;

    if (startBrace === -1 && startBracket === -1) {
      // No more JSON, add remaining text
      if (currentIndex < text.length) {
        segments.push({
          type: "text",
          data: null,
          originalText: text.substring(currentIndex),
        });
      }
      break;
    } else if (startBrace === -1) {
      startJson = startBracket;
      isArray = true;
    } else if (startBracket === -1) {
      startJson = startBrace;
      isArray = false;
    } else {
      // Both exist, use whichever comes first
      startJson = Math.min(startBrace, startBracket);
      isArray = startJson === startBracket;
    }

    // Add text before the JSON
    if (startJson > currentIndex) {
      segments.push({
        type: "text",
        data: null,
        originalText: text.substring(currentIndex, startJson),
      });
    }

    // Try to parse partial JSON directly from the remaining text
    const remainingText = text.substring(startJson);
    let foundValidJson = false;

    try {
      const parsed = parsePartialJson(remainingText);
      if (parsed !== null && parsed !== undefined) {
        // For objects, check if they have a "type" property
        // For arrays, check if it's an array (could contain components)
        const isValidComponent =
          (typeof parsed === "object" && "type" in parsed) ||
          Array.isArray(parsed);

        if (isValidComponent) {
          const jsonSegment = findCompleteJsonSegment(
            remainingText,
            parsed,
            isArray
          );

          if (jsonSegment) {
            segments.push(jsonSegment);
            foundValidJson = true;
            currentIndex = startJson + jsonSegment.originalText.length;
          } else {
            // Partial JSON - render it anyway
            segments.push({
              type: "json",
              data: parsed,
              originalText: remainingText,
            });
            foundValidJson = true;
            currentIndex = text.length; // Move to end of text since we're processing partial JSON
          }
        }
      }
    } catch (error) {
      // JSON parsing failed, treat as regular text
    }

    // If no valid JSON found, treat the character as regular text
    if (!foundValidJson) {
      segments.push({
        type: "text",
        data: null,
        originalText: text.substring(startJson, startJson + 1),
      });
      currentIndex = startJson + 1;
    }
  }

  return segments;
};

/**
 * Find the complete JSON segment by matching braces/brackets
 */
const findCompleteJsonSegment = (
  remainingText: string,
  parsed: any,
  isArray: boolean
): ParsedSegment | null => {
  let braceCount = 0;
  let bracketCount = 0;
  let jsonEndIndex = -1;
  let inString = false;
  let escapeNext = false;

  for (let i = 0; i < remainingText.length; i++) {
    const char = remainingText[i];

    // Handle string escaping
    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === "\\") {
      escapeNext = true;
      continue;
    }

    // Toggle string state
    if (char === '"') {
      inString = !inString;
      continue;
    }

    // Only count brackets/braces outside of strings
    if (!inString) {
      if (char === "{") {
        braceCount++;
      } else if (char === "}") {
        braceCount--;
      } else if (char === "[") {
        bracketCount++;
      } else if (char === "]") {
        bracketCount--;
      }

      // Check if we've closed the initial structure
      if (isArray && bracketCount === 0) {
        jsonEndIndex = i;
        break;
      } else if (!isArray && braceCount === 0) {
        jsonEndIndex = i;
        break;
      }
    }
  }

  if (jsonEndIndex !== -1) {
    // Complete JSON structure found
    return {
      type: "json",
      data: parsed,
      originalText: remainingText.substring(0, jsonEndIndex + 1),
    };
  }

  return null;
};
