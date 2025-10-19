import { ParsedSegment } from "./types";

/**
 * Delimiters for Melony component blocks
 * Example: 
 * :::melony:v1 type="Card"
 * {"data": "here"}
 * :::
 */
export const BLOCK_START = ":::melony:";
export const BLOCK_END = ":::";

/**
 * Normalize inline melony blocks to multi-line format
 * Example: :::melony:v1 {"type":"Card"} ::: 
 * Becomes:
 * :::melony:v1
 * {"type":"Card"}
 * :::
 */
const normalizeInlineBlocks = (text: string): string => {
  // Match inline blocks: any content without newlines between :::melony:VERSION and :::
  const inlineBlockPattern = /(:::melony:[^\s]+)\s+([^\n]+?)\s+(:::)/g;
  
  return text.replace(inlineBlockPattern, (match, opening, content, closing) => {
    return `${opening}\n${content}\n${closing}`;
  });
};

/**
 * Parse text to extract mixed content (text and component blocks).
 * Identifies component blocks delimited by :::melony:v1 ... ::: and separates them from regular text.
 */
export const parseText = (text: string): ParsedSegment[] => {
  // First normalize any inline blocks to multi-line format
  const normalizedText = normalizeInlineBlocks(text);
  
  const segments: ParsedSegment[] = [];
  let position = 0;

  while (position < normalizedText.length) {
    const blockStartIndex = normalizedText.indexOf(BLOCK_START, position);

    // No more blocks found - add remaining text and exit
    if (blockStartIndex === -1) {
      if (position < normalizedText.length) {
        segments.push(createTextSegment(normalizedText.substring(position)));
      }
      break;
    }

    // Add text before block
    if (blockStartIndex > position) {
      segments.push(createTextSegment(normalizedText.substring(position, blockStartIndex)));
    }

    // Find end of opening line (first newline after block start)
    const lineEndIndex = normalizedText.indexOf('\n', blockStartIndex);
    
    if (lineEndIndex === -1) {
      // Incomplete block - still streaming opening line
      segments.push(createComposingSegment(normalizedText.substring(blockStartIndex)));
      break;
    }

    // Parse metadata from opening line
    const openingLine = normalizedText.substring(blockStartIndex, lineEndIndex);
    const metadata = parseBlockMetadata(openingLine);

    // Find closing delimiter
    const blockEndIndex = normalizedText.indexOf(BLOCK_END, lineEndIndex);
    
    if (blockEndIndex === -1) {
      // Block not closed yet - incomplete/streaming
      segments.push(createComposingSegment(normalizedText.substring(blockStartIndex)));
      break;
    }

    // Check if closing delimiter is at the start of its line (or only whitespace before it)
    const beforeClosing = normalizedText.substring(lineEndIndex + 1, blockEndIndex);
    const lastNewlineBeforeClosing = beforeClosing.lastIndexOf('\n');
    const lineWithClosing = lastNewlineBeforeClosing === -1 
      ? beforeClosing 
      : beforeClosing.substring(lastNewlineBeforeClosing + 1);
    
    const isClosingOnOwnLine = lineWithClosing.trim() === '';
    
    // Extract content between delimiters
    let content: string;
    if (isClosingOnOwnLine) {
      // Content ends at the newline before the closing delimiter
      const contentEnd = lastNewlineBeforeClosing === -1 
        ? lineEndIndex + 1 
        : lineEndIndex + 1 + lastNewlineBeforeClosing;
      content = normalizedText.substring(lineEndIndex + 1, contentEnd).trim();
    } else {
      // Closing delimiter is on the same line as content
      content = normalizedText.substring(lineEndIndex + 1, blockEndIndex).trim();
    }
    
    try {
      const parsed = JSON.parse(content);
      
      // Merge metadata with parsed content
      // If parsed content has a 'type' field, metadata 'type' should not override it
      const data = parsed.type ? { ...metadata, ...parsed } : { ...parsed, ...metadata };
      
      // Validate component structure: object with "type" property or array
      const isValid =
        Array.isArray(data) ||
        (typeof data === "object" && data !== null && "type" in data);
      
      if (isValid) {
        const blockEnd = blockEndIndex + BLOCK_END.length;
        segments.push(createComponentSegment(data, normalizedText.substring(blockStartIndex, blockEnd)));
        position = blockEnd;
      } else {
        // Invalid structure - treat as text
        const blockEnd = blockEndIndex + BLOCK_END.length;
        segments.push(createTextSegment(normalizedText.substring(blockStartIndex, blockEnd)));
        position = blockEnd;
      }
    } catch (e) {
      // Invalid JSON in block - treat as text
      const blockEnd = blockEndIndex + BLOCK_END.length;
      segments.push(createTextSegment(normalizedText.substring(blockStartIndex, blockEnd)));
      position = blockEnd;
    }
  }

  return segments;
};

/**
 * Parse metadata from the opening line of a block
 * Example: ":::melony:v1 type="Card" id="123"
 */
const parseBlockMetadata = (line: string): Record<string, string> => {
  const metadata: Record<string, string> = {};
  
  // Extract version (e.g., v1, v2)
  const versionMatch = line.match(/:::melony:(v\d+)/);
  if (versionMatch) {
    metadata.version = versionMatch[1];
  }
  
  // Extract key="value" pairs
  const attrPattern = /(\w+)="([^"]*)"/g;
  let match;
  while ((match = attrPattern.exec(line)) !== null) {
    metadata[match[1]] = match[2];
  }
  
  return metadata;
};

// Helper functions to create segments
const createTextSegment = (text: string): ParsedSegment => ({
  type: "text",
  data: null,
  originalText: text,
});

const createComponentSegment = (data: any, text: string): ParsedSegment => ({
  type: "component",
  data,
  originalText: text,
});

const createComposingSegment = (text: string): ParsedSegment => ({
  type: "composing",
  data: null,
  originalText: text,
});
