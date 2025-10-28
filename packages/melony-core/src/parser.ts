import { parse, HTMLElement, TextNode } from "node-html-parser";
import { ComponentDef } from "./renderer";
import { TemplateEngine } from "./template-engine";
import { WidgetTemplate } from "./widget-template";

/**
 * MelonyParser - Parses HTML-like widget component tags into ComponentDef structures
 * 
 * This parser is responsible for converting Melony widget syntax (HTML-like tags)
 * into structured ComponentDef objects that can be rendered by the widget renderer.
 * It's used by both MelonyMarkdown (for mixed markdown+widget content) and 
 * MelonyWidget (for widget-only content).
 * 
 * Uses node-html-parser for robust HTML parsing
 */
export class MelonyParser {
  private componentTags: Set<string>;
  private specialCaseNames: Record<string, string>;
  private widgetSchemas: Map<string, WidgetTemplate>;

  constructor(widgets?: WidgetTemplate[]) {
    // Initialize component tags
    // Note: "for" and "if" removed - they're now template syntax ({{#condition}}, {{#array}})
    this.componentTags = new Set([
      "card",
      "row",
      "col",
      "box",
      "text",
      "heading",
      "button",
      "badge",
      "input",
      "textarea",
      "select",
      "checkbox",
      "radiogroup",
      "form",
      "label",
      "image",
      "icon",
      "spacer",
      "divider",
      "list",
      "listitem",
      "chart",
      "widget",
    ]);

    // Special cases for multi-word component names
    this.specialCaseNames = {
      listitem: "ListItem",
      radiogroup: "RadioGroup",
    };

    // Initialize widget schemas for validation
    this.widgetSchemas = new Map();
    if (widgets) {
      widgets.forEach((widget) => {
        this.widgetSchemas.set(widget.type, widget);
      });
    }
  }

  /**
   * Main parsing method - converts content string into blocks. replacing reference {{}} with the context value.
   * @param content - The content string to parse.
   * @param context - The context object to use for replacing references.
   * @returns An array of strings and ComponentDef objects.
   */
  public parseContentAsBlocks(content: string, context?: Record<string, any>): (string | ComponentDef)[] {
    const result: (string | ComponentDef)[] = [];

    // Check if content has component tags
    if (!this.hasComponentTags(content)) {
      return [content];
    }

    // Check for incomplete/unclosed tags. card and widgets are required root level tags.
    const incompleteCard = this.detectIncompleteTag(content, 'card');
    const incompleteWidget = this.detectIncompleteWidget(content);

    try {
      // Normalize escaped quotes in attributes before parsing
      const normalizedContent = this.normalizeAttributeEscapes(content);
      
      // Wrap content in a root element to ensure proper parsing
      const wrapped = `<div>${normalizedContent}</div>`;
      const root = parse(wrapped, {
        lowerCaseTagName: true,
        comment: false,
        voidTag: {
          closingSlash: false,
          tags: [
            "area",
            "base",
            "br",
            "embed",
            "hr",
            "img",
            "input",
            "link",
            "meta",
            "param",
            "source",
            "track",
            "wbr",
          ],
        },
      });

      // Process the children of the wrapper div
      const wrapperDiv = root.querySelector("div");
      if (!wrapperDiv) {
        return [content];
      }

      // Parse child nodes
      for (const child of wrapperDiv.childNodes) {
        const parsed = this.parseNode(child, context);
        if (parsed !== null) {
          result.push(parsed);
        }
      }

      // If we detected an incomplete card, add a loading indicator
      if (incompleteCard) {
        result.push({
          component: "Card",
          props: { isLoading: true },
          children: [
            {
              component: "Text",
              props: { value: "Composing card..." },
            },
          ],
        });
      }

      // If we detected an incomplete widget, add a loading indicator
      if (incompleteWidget) {
        result.push({
          component: "Card",
          props: { isLoading: true },
          children: [
            {
              component: "Text",
              props: { value: "Composing widget..." },
            },
          ],
        });
      }

      return result.length > 0 ? result : [content];
    } catch (error) {
      console.warn("Failed to parse component tags:", error);
      return [content];
    }
  }

  /**
   * Detect if there's an incomplete (unclosed) tag in the content
   */
  private detectIncompleteTag(content: string, tagName: string): boolean {
    // Count opening tags (including incomplete ones without closing >)
    const openingPattern = new RegExp(`<${tagName}(?:[\\s>]|$)`, 'gi');
    const openingTags = (content.match(openingPattern) || []).length;
    const closingTags = (content.match(new RegExp(`<\\/${tagName}>`, 'gi')) || []).length;
    
    // If there are more opening tags than closing tags, we have an incomplete tag
    return openingTags > closingTags;
  }

  /**
   * Detect if there's an incomplete (not properly closed) widget tag in the content
   * Checks for both self-closing (widget />) and regular closing (</widget>)
   */
  private detectIncompleteWidget(content: string): boolean {
    // Find all widget opening tags (including incomplete ones without closing >)
    const openingPattern = /<widget(?:[\s>]|$)/gi;
    const openingMatches = content.match(openingPattern);
    if (!openingMatches) {
      return false;
    }

    // Count different types of closures
    const selfClosingTags = (content.match(/<widget[^>]*\/>/gi) || []).length;
    const regularClosingTags = (content.match(/<\/widget>/gi) || []).length;
    const totalClosedTags = selfClosingTags + regularClosingTags;

    // Check if there's an opening tag without proper closure
    const openingTags = openingMatches.length;
    
    // If there are more opening tags than closed tags, we have an incomplete widget
    return openingTags > totalClosedTags;
  }

  /**
   * Check if content contains component tags (including incomplete ones)
   */
  private hasComponentTags(content: string): boolean {
    // Match complete tags or incomplete tags (with or without closing >)
    return /<[a-z][a-z0-9]*/i.test(content);
  }

  /**
   * Normalize escaped quotes in HTML attributes
   * Converts \' to &apos; in single-quoted attributes
   * Converts \" to &quot; in double-quoted attributes
   * Also handles JSON objects in attributes by escaping nested quotes
   */
  private normalizeAttributeEscapes(content: string): string {
    let result = "";
    let i = 0;
    
    while (i < content.length) {
      // Check if we're at the start of an attribute
      const attrMatch = content.slice(i).match(/^(\w+)=(['"])/);
      
      if (attrMatch) {
        const attrName = attrMatch[1];
        const quote = attrMatch[2];
        const startPos = i;
        
        // Add attribute name and opening quote
        result += attrName + "=" + quote;
        i += attrMatch[0].length;
        
        // Process the attribute value until we find the unescaped closing quote
        let attrValue = "";
        let depth = 0; // Track nesting depth for braces/brackets (for JSON detection)
        let inNestedQuote = false; // Track if we're inside a nested quote
        
        while (i < content.length) {
          const char = content[i];
          const nextChar = content[i + 1];
          
          // Check for escaped quote
          if (char === "\\" && nextChar === quote) {
            // Convert escaped quote to HTML entity
            attrValue += quote === "'" ? "&apos;" : "&quot;";
            i += 2; // Skip both the backslash and the quote
            continue;
          }
          
          // Track JSON structure depth
          if (char === "{" || char === "[") {
            depth++;
            attrValue += char;
            i++;
            continue;
          } else if (char === "}" || char === "]") {
            depth--;
            attrValue += char;
            i++;
            continue;
          }
          
          // Handle quotes inside JSON (when depth > 0)
          if (depth > 0 && char === quote) {
            // We're inside a JSON object/array, so this quote should be escaped
            attrValue += quote === '"' ? "&quot;" : "&apos;";
            i++;
            continue;
          }
          
          // Handle the opposite quote type (doesn't need escaping in HTML)
          const oppositeQuote = quote === '"' ? "'" : '"';
          if (char === oppositeQuote) {
            attrValue += char;
            i++;
            continue;
          }
          
          // Check for closing quote of the attribute (when depth is 0)
          if (char === quote && depth === 0) {
            // Found unescaped closing quote - end of attribute value
            result += attrValue + quote;
            i++;
            break;
          }
          
          // Regular character
          attrValue += char;
          i++;
        }
      } else {
        // Not at an attribute, just copy the character
        result += content[i];
        i++;
      }
    }
    
    return result;
  }

  /**
   * Parse a single HTML node into either a string or ComponentDef
   */
  private parseNode(node: any, context?: Record<string, any>): string | ComponentDef | null {
    // Text node
    if (node.nodeType === 3 || node instanceof TextNode) {
      const text = node.text?.trim();
      return text || null;
    }

    // Element node
    if (node instanceof HTMLElement) {
      const tagName = node.rawTagName?.toLowerCase();

      // Skip non-component tags (like div, span, etc. used in markdown)
      if (!tagName || !this.isComponentTag(tagName)) {
        const text = node.text?.trim();
        return text || null;
      }

      // Parse attributes into props
      let props = this.parseAttributes(node.attributes || {}, context);

      // Validate props for widget components
      if (tagName === "widget" && props.type) {
        const validation = this.validateProps(props.type, props);

        if (!validation.valid) {
          console.warn(
            `Widget validation errors for type="${props.type}":`,
            validation.errors
          );
          // Optionally: you could return an error component here
          // For now, we'll use the validated props which include defaults
        }

        // Use validated props (with defaults applied)
        props = validation.validatedProps;
      }

      // Parse children recursively
      const children = this.parseChildren(node.childNodes, context);

      return {
        component: this.capitalizeComponentName(tagName),
        props,
        children: children.length > 0 ? children : undefined,
      };
    }

    return null;
  }

  /**
   * Parse HTML attributes into props object
   */
  private parseAttributes(attrs: Record<string, string>, context?: Record<string, any>): Record<string, any> {
    const props: Record<string, any> = {};

    for (const [key, value] of Object.entries(attrs)) {
      props[key] = this.parseAttributeValue(value, context);
    }

    return props;
  }

  /**
   * Parse child nodes recursively
   */
  private parseChildren(childNodes: any[], context?: Record<string, any>): ComponentDef[] {
    const children: ComponentDef[] = [];

    for (const child of childNodes) {
      const parsed = this.parseNode(child, context);
      if (parsed !== null) {
        if (typeof parsed === "string") {
          // Wrap text content in Text component
          const textContent = parsed.trim();
          if (textContent) {
            children.push({
              component: "Text",
              props: { value: textContent },
            });
          }
        } else {
          children.push(parsed);
        }
      }
    }

    return children;
  }

  /**
   * Check if a tag name is a valid Melony component
   */
  private isComponentTag(tagName: string): boolean {
    return this.componentTags.has(tagName.toLowerCase());
  }

  /**
   * Parse attribute value and convert to appropriate type
   */
  private parseAttributeValue(value: string, context?: Record<string, any>): any {
    if (!value) return true; // Boolean attribute

    let processedValue = value;

    // If context is available and value contains template references, resolve them
    if (context && typeof value === 'string' && value.includes('{{') && value.includes('}}')) {
      processedValue = TemplateEngine.render(value, context);
    }

    // Decode HTML entities first (important for JSON strings from templates)
    const decodedValue = this.decodeHTMLEntities(processedValue);

    // Try to parse as JSON (for objects/arrays)
    if (decodedValue.startsWith("{") || decodedValue.startsWith("[")) {
      try {
        return JSON.parse(decodedValue);
      } catch {
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

  /**
   * Decode HTML entities in attribute values
   */
  private decodeHTMLEntities(str: string): string {
    const htmlEntities: Record<string, string> = {
      '&quot;': '"',
      '&#34;': '"',
      '&apos;': "'",
      '&#39;': "'",
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
    };

    return str.replace(/&(?:quot|#34|apos|#39|amp|lt|gt);/g, (match) => htmlEntities[match] || match);
  }

  /**
   * Capitalize component name (e.g., "card" -> "Card", "listitem" -> "ListItem")
   */
  private capitalizeComponentName(name: string): string {
    const lowerName = name.toLowerCase();

    // Check for special cases
    if (this.specialCaseNames[lowerName]) {
      return this.specialCaseNames[lowerName];
    }

    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  /**
   * Validate props against widget schema
   */
  private validateProps(
    widgetType: string,
    props: Record<string, any>
  ): {
    valid: boolean;
    errors: string[];
    validatedProps: Record<string, any>;
  } {
    const widget = this.widgetSchemas.get(widgetType);

    if (!widget || !widget.props) {
      // No schema available - pass through
      return { valid: true, errors: [], validatedProps: props };
    }

    const errors: string[] = [];
    const validatedProps = { ...props };

    // Apply default values and validate
    for (const propSchema of widget.props) {
      const value = validatedProps[propSchema.name];

      // Check required props
      if (propSchema.required && (value === undefined || value === null)) {
        errors.push(`Missing required prop: ${propSchema.name}`);
        continue;
      }

      // Apply default value if missing
      if (value === undefined && propSchema.default !== undefined) {
        validatedProps[propSchema.name] = propSchema.default;
      }

      // Type validation
      if (value !== undefined && value !== null) {
        const actualType = Array.isArray(value) ? "array" : typeof value;
        const expectedType = propSchema.type;

        if (expectedType === "string" && actualType !== "string") {
          errors.push(
            `Prop ${propSchema.name} should be string, got ${actualType}`
          );
        } else if (expectedType === "number" && actualType !== "number") {
          errors.push(
            `Prop ${propSchema.name} should be number, got ${actualType}`
          );
        } else if (expectedType === "boolean" && actualType !== "boolean") {
          errors.push(
            `Prop ${propSchema.name} should be boolean, got ${actualType}`
          );
        } else if (expectedType === "array" && actualType !== "array") {
          errors.push(
            `Prop ${propSchema.name} should be array, got ${actualType}`
          );
        } else if (
          (expectedType === "url" || expectedType === "image") &&
          actualType !== "string"
        ) {
          errors.push(
            `Prop ${propSchema.name} should be string (${expectedType}), got ${actualType}`
          );
        }
      }
    }

    // Also apply widget's defaultProps if available
    if (widget.defaultProps) {
      for (const [key, defaultValue] of Object.entries(widget.defaultProps)) {
        if (validatedProps[key] === undefined) {
          validatedProps[key] = defaultValue;
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      validatedProps,
    };
  }

  /**
   * Register a custom component tag
   */
  public registerComponent(tagName: string, capitalizedName?: string): void {
    const lowerTag = tagName.toLowerCase();
    this.componentTags.add(lowerTag);

    if (capitalizedName) {
      this.specialCaseNames[lowerTag] = capitalizedName;
    }
  }

  /**
   * Register multiple component tags at once
   */
  public registerComponents(tags: string[] | Record<string, string>): void {
    if (Array.isArray(tags)) {
      tags.forEach((tag) => this.registerComponent(tag));
    } else {
      Object.entries(tags).forEach(([tag, name]) =>
        this.registerComponent(tag, name)
      );
    }
  }

  /**
   * Get all registered component tags
   */
  public getRegisteredComponents(): string[] {
    return Array.from(this.componentTags);
  }

  /**
   * Update widget schemas (useful for dynamic widget registration)
   */
  public updateWidgetSchemas(widgets: WidgetTemplate[]): void {
    this.widgetSchemas.clear();
    widgets.forEach((widget) => {
      this.widgetSchemas.set(widget.type, widget);
    });
  }
}

// Export a singleton instance for convenience (no widgets initially)
export const defaultParser = new MelonyParser();
