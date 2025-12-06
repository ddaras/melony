import { parse, HTMLElement, TextNode, Node } from "node-html-parser";

export interface ComponentBlock {
  type: "component";
  name: string;
  props: Record<string, any>;
  children: (ComponentBlock | string)[];
}

export type ContentBlock = string | ComponentBlock;

export function parseContent(content: string): ContentBlock[] {
  // Wrap in a root element to handle multiple top-level nodes
  const root = parse(`<div>${content}</div>`);
  const wrapper = root.querySelector("div");

  if (!wrapper) return [content];

  return Array.from(wrapper.childNodes)
    .map((node) => parseNode(node))
    .filter((node): node is ContentBlock => node !== null);
}

function decodeHTMLEntities(str: string): string {
  const htmlEntities: Record<string, string> = {
    "&quot;": '"',
    "&#34": '"',
    "&apos;": "'",
    "&#39;": "'",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
  };

  return str.replace(
    /&(?:quot|#34|apos|#39|amp|lt|gt);/g,
    (match) => htmlEntities[match] || match
  );
}

function parseAttributeValue(value: string): any {
  if (value === "") return true; // Boolean attribute without value

  const decodedValue = decodeHTMLEntities(value);

  // Try to parse as JSON (for objects/arrays)
  if (decodedValue.startsWith("{") || decodedValue.startsWith("[")) {
    try {
      return JSON.parse(decodedValue);
    } catch {
      // Handle JSX-style syntax: {value} where value is valid JSON
      if (decodedValue.startsWith("{") && decodedValue.endsWith("}")) {
        const inner = decodedValue.slice(1, -1).trim();
        try {
          return JSON.parse(inner);
        } catch {
          // Handle undefined which is valid in JS/JSX but not JSON
          if (inner === "undefined") return undefined;
        }
      }
      // If JSON parse fails, return as string
    }
  }

  // Parse special string values
  if (decodedValue === "true") return true;
  if (decodedValue === "false") return false;
  if (decodedValue === "null") return null;
  if (decodedValue === "undefined") return undefined;

  // Try to parse as number
  if (!isNaN(Number(decodedValue)) && decodedValue.trim() !== "") {
    return Number(decodedValue);
  }

  return decodedValue;
}

function parseNode(node: Node): ContentBlock | null {
  // Handle Text Nodes
  if (node.nodeType === 3 || node instanceof TextNode) {
    if (!node.text.trim()) return null;
    return node.text; // Keep whitespace
  }

  // Handle Elements
  if (node instanceof HTMLElement) {
    const name = node.rawTagName.toLowerCase();

    // Parse attributes
    const props: Record<string, any> = {};
    for (const [key, value] of Object.entries(node.attributes)) {
      props[key] = parseAttributeValue(value);
    }

    // Recursively parse children
    const children = Array.from(node.childNodes)
      .map((child) => parseNode(child))
      .filter((child): child is ContentBlock => child !== null);

    return {
      type: "component",
      name,
      props,
      children,
    };
  }

  return null;
}

