/**
 * Template Compiler
 * Converts BuilderNode structures to HTML-like template strings
 */

import { BuilderNode } from "./types";

/**
 * Compile a builder node to HTML-like template string
 */
export function compileToTemplate(node: BuilderNode): string {
  return compileNode(node);
}

/**
 * Compile a single node
 */
function compileNode(node: BuilderNode): string {
  const tagName = node.component.toLowerCase();
  const attributes = compileAttributes(node.props);
  const hasChildren = node.children && node.children.length > 0;

  if (!hasChildren) {
    // Self-closing tag
    return `<${tagName}${attributes} />`;
  }

  // Tag with children
  const childrenString = node.children!.map(compileNode).join("\n  ");
  return `<${tagName}${attributes}>\n  ${childrenString}\n</${tagName}>`;
}

/**
 * Compile attributes to string format
 */
function compileAttributes(props: Record<string, any>): string {
  const attributes: string[] = [];

  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null) {
      continue;
    }

    // Boolean attributes
    if (typeof value === "boolean") {
      if (value === true) {
        attributes.push(key);
      }
      continue;
    }

    // Array or object - convert to JSON string
    if (Array.isArray(value) || typeof value === "object") {
      const jsonString = JSON.stringify(value);
      // Escape quotes for HTML attributes
      const escapedString = jsonString.replace(/"/g, "&quot;");
      attributes.push(`${key}="${escapedString}"`);
      continue;
    }

    // String or number - escape quotes
    const stringValue = String(value);
    const escapedValue = stringValue.replace(/"/g, "&quot;");
    attributes.push(`${key}="${escapedValue}"`);
  }

  return attributes.length > 0 ? " " + attributes.join(" ") : "";
}

/**
 * Pretty print template with indentation
 */
export function prettyPrint(template: string, indent: number = 2): string {
  const lines = template.split("\n");
  let currentIndent = 0;
  const indentedLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    
    if (!trimmed) {
      continue;
    }

    // Decrease indent for closing tags
    if (trimmed.startsWith("</")) {
      currentIndent = Math.max(0, currentIndent - indent);
    }

    indentedLines.push(" ".repeat(currentIndent) + trimmed);

    // Increase indent for opening tags (not self-closing)
    if (trimmed.startsWith("<") && !trimmed.startsWith("</") && !trimmed.endsWith("/>")) {
      currentIndent += indent;
    }
  }

  return indentedLines.join("\n");
}

/**
 * Validate builder node structure
 */
export function validateBuilderNode(node: any): node is BuilderNode {
  if (!node || typeof node !== "object") {
    return false;
  }

  if (node._type !== "builder-node") {
    return false;
  }

  if (typeof node.component !== "string") {
    return false;
  }

  if (!node.props || typeof node.props !== "object") {
    return false;
  }

  if (node.children !== undefined) {
    if (!Array.isArray(node.children)) {
      return false;
    }

    // Recursively validate children
    for (const child of node.children) {
      if (!validateBuilderNode(child)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Minify template by removing extra whitespace
 */
export function minifyTemplate(template: string): string {
  return template
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("");
}

/**
 * Extract all component types used in a builder tree
 */
export function extractComponents(node: BuilderNode): Set<string> {
  const components = new Set<string>();
  
  function traverse(n: BuilderNode) {
    components.add(n.component);
    if (n.children) {
      n.children.forEach(traverse);
    }
  }
  
  traverse(node);
  return components;
}

/**
 * Calculate depth of builder tree
 */
export function calculateDepth(node: BuilderNode): number {
  if (!node.children || node.children.length === 0) {
    return 1;
  }
  
  const childDepths = node.children.map(calculateDepth);
  return 1 + Math.max(...childDepths);
}

/**
 * Count total nodes in builder tree
 */
export function countNodes(node: BuilderNode): number {
  let count = 1; // Count this node
  
  if (node.children) {
    for (const child of node.children) {
      count += countNodes(child);
    }
  }
  
  return count;
}

