import { ParsedSegment } from "./types";

/**
 * Prefix to identify JSON that should be rendered as UI components
 * Example: "@melony:{"type": "weather-card", "data": {...}}"
 */
export const MELONY_PREFIX = "@melony:";

/**
 * Parse text to extract mixed content (text and JSON components).
 * Identifies JSON objects prefixed with @melony: and separates them from regular text.
 */
export const parseText = (text: string): ParsedSegment[] => {
  const segments: ParsedSegment[] = [];
  let position = 0;

  while (position < text.length) {
    const prefixIndex = text.indexOf(MELONY_PREFIX, position);

    // No more prefixes found - add remaining text and exit
    if (prefixIndex === -1) {
      if (position < text.length) {
        segments.push(createTextSegment(text.substring(position)));
      }
      break;
    }

    // Add text before prefix
    if (prefixIndex > position) {
      segments.push(createTextSegment(text.substring(position, prefixIndex)));
    }

    // Try to extract JSON after prefix
    const afterPrefix = text.substring(prefixIndex + MELONY_PREFIX.length);
    const result = extractJson(afterPrefix);

    if (result.type === "complete") {
      segments.push(createJsonSegment(result.data, result.text));
      position = prefixIndex + MELONY_PREFIX.length + result.text.length;
    } else if (result.type === "incomplete") {
      segments.push(createLoadingSegment(MELONY_PREFIX + result.text));
      position = text.length; // Incomplete JSON at end - stop parsing
    } else {
      // Invalid or no JSON - treat prefix + following text as regular text
      // Find the next prefix or end of text to determine how much to include
      const nextPrefixIndex = text.indexOf(MELONY_PREFIX, prefixIndex + MELONY_PREFIX.length);
      const endIndex = nextPrefixIndex === -1 ? text.length : nextPrefixIndex;
      const textToInclude = text.substring(prefixIndex, endIndex);
      segments.push(createTextSegment(textToInclude));
      position = endIndex;
    }
  }

  return segments;
};

/**
 * Extract and validate JSON from text.
 * Returns complete JSON, incomplete JSON, or none.
 */
const extractJson = (
  text: string
): 
  | { type: "complete"; data: any; text: string }
  | { type: "incomplete"; text: string }
  | { type: "none" } => {
  const trimmed = text.trimStart();
  const firstChar = trimmed[0];

  // Must start with { or [
  if (firstChar !== "{" && firstChar !== "[") {
    return { type: "none" };
  }

  const endIndex = findJsonEnd(trimmed, firstChar === "[");

  if (endIndex === -1) {
    // Has opening bracket/brace but no closing - incomplete
    return { type: "incomplete", text: text };
  }

  const jsonText = trimmed.substring(0, endIndex + 1);

  try {
    const parsed = JSON.parse(jsonText);
    
    // Validate component structure: object with "type" property or array
    const isValid =
      Array.isArray(parsed) ||
      (typeof parsed === "object" && parsed !== null && "type" in parsed);

    if (isValid) {
      // Include whitespace in original text
      const whitespace = text.substring(0, text.length - trimmed.length);
      return { type: "complete", data: parsed, text: whitespace + jsonText };
    }
  } catch {
    // Invalid JSON
  }

  return { type: "none" };
};

/**
 * Find the end index of a JSON structure by matching brackets/braces.
 * Returns -1 if structure is incomplete.
 */
const findJsonEnd = (text: string, isArray: boolean): number => {
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (!inString) {
      const isOpen = (isArray && char === "[") || (!isArray && char === "{");
      const isClose = (isArray && char === "]") || (!isArray && char === "}");

      if (isOpen) depth++;
      if (isClose) depth--;

      // Found complete structure
      if (depth === 0) {
        return i;
      }
    }
  }

  return -1; // Incomplete
};

// Helper functions to create segments
const createTextSegment = (text: string): ParsedSegment => ({
  type: "text",
  data: null,
  originalText: text,
});

const createJsonSegment = (data: any, text: string): ParsedSegment => ({
  type: "json",
  data,
  originalText: text,
});

const createLoadingSegment = (text: string): ParsedSegment => ({
  type: "loading",
  data: null,
  originalText: text,
});
