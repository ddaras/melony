/**
 * Custom Template Engine
 * Replaces mustache with enhanced array support and better performance
 */

export interface TemplateContext {
  [key: string]: any;
}

export interface ArrayItem {
  [key: string]: any;
}

export interface ArrayContext {
  item: any;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  isEven: boolean;
  isOdd: boolean;
  length: number;
}

/**
 * Custom Template Engine with enhanced array support
 */
export class TemplateEngine {
  /**
   * Render a template string with the given context
   */
  public static render(
    template: string,
    context: TemplateContext = {}
  ): string {
    if (!template) return "";

    let result = template;

    // Handle array iterations first ({{#array}}...{{/array}})
    result = this.processArraySections(result, context);

    // Handle conditional sections ({{#condition}}...{{/condition}})
    result = this.processConditionalSections(result, context);

    // Handle negative conditional sections ({{#!condition}}...{{/!condition}})
    result = this.processNegativeConditionalSections(result, context);

    // Handle simple variable substitution ({{variable}})
    result = this.processVariables(result, context);

    return result;
  }

  /**
   * Safely evaluate a JavaScript condition expression
   */
  private static evaluateCondition(expression: string, context: TemplateContext): any {
    try {
      // Handle simple variable lookup first (most common case)
      if (/^\w+$/.test(expression)) {
        return context[expression];
      }

      // For complex expressions, create a safe evaluation environment
      const contextKeys = Object.keys(context);
      const contextValues = Object.values(context);

      // Create a safe function that evaluates the expression
      // eslint-disable-next-line no-new-func
      const evalFunc = new Function(
        ...contextKeys,
        `return (${expression})`
      );

      return evalFunc(...contextValues);
    } catch (error) {
      console.warn(`Failed to evaluate condition expression: ${expression}`, error);
      return false;
    }
  }

  /**
   * Process array sections with enhanced context
   */
  private static processArraySections(
    template: string,
    context: TemplateContext
  ): string {
    // Match {{#arrayName}}...{{/arrayName}} patterns
    const arrayPattern = /\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g;

    return (String(template) || "").replace(
      arrayPattern,
      (match, arrayName, content) => {
        const array = context[arrayName];

        // Only process if it's actually an array, otherwise leave it for conditional processing
        if (!Array.isArray(array)) {
          return match;
        }

        if (array.length === 0) {
          return "";
        }

        return array
          .map((item, index) => {
            const arrayContext: ArrayContext = {
              item,
              index,
              isFirst: index === 0,
              isLast: index === array.length - 1,
              isEven: index % 2 === 0,
              isOdd: index % 2 === 1,
              length: array.length,
            };

            // Create enhanced context for this iteration
            const iterationContext = {
              ...context,
              ...arrayContext,
              // Also make the item available as the array name for convenience
              [arrayName]: item,
            };

            // Process the content with the iteration context
            let processedContent = this.processVariables(
              content,
              iterationContext
            );

            // Process conditional sections within the array iteration
            processedContent = this.processConditionalSections(
              processedContent,
              iterationContext
            );
            processedContent = this.processNegativeConditionalSections(
              processedContent,
              iterationContext
            );

            return processedContent;
          })
          .join("");
      }
    );
  }

  /**
   * Process conditional sections
   */
  private static processConditionalSections(
    template: string,
    context: TemplateContext
  ): string {
    // Match {{#condition}}...{{/condition}} patterns (non-array)
    // Updated to support complex expressions like !!description or !!humidity || !!windSpeed
    const conditionalPattern = /\{\{#([^}]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g;

    return template.replace(
      conditionalPattern,
      (match, conditionExpression, content) => {
        // Evaluate the condition expression (e.g., "!!description", "!!humidity || !!windSpeed")
        const conditionResult = this.evaluateCondition(conditionExpression, context);
        
        // Skip if it's an array (already processed)
        if (Array.isArray(conditionResult)) {
          return match;
        }

        // Show content if condition is truthy
        if (conditionResult) {
          // Process nested arrays and conditionals within the conditional content
          let processedContent = this.processArraySections(content, context);
          processedContent = this.processConditionalSections(
            processedContent,
            context
          );
          processedContent = this.processNegativeConditionalSections(
            processedContent,
            context
          );
          processedContent = this.processVariables(processedContent, context);
          return processedContent;
        }

        return "";
      }
    );
  }

  /**
   * Process negative conditional sections ({{#!condition}})
   */
  private static processNegativeConditionalSections(
    template: string,
    context: TemplateContext
  ): string {
    // Match {{#!condition}}...{{/!condition}} patterns
    // Updated to support complex expressions like !showBadge
    const negativeConditionalPattern =
      /\{\{#!([^}]+)\}\}([\s\S]*?)\{\{\/!\1\}\}/g;

    return template.replace(
      negativeConditionalPattern,
      (match, conditionExpression, content) => {
        // Evaluate the condition expression and negate it
        const conditionResult = this.evaluateCondition(conditionExpression, context);

        // Show content if condition is falsy
        if (!conditionResult) {
          // Process nested arrays and conditionals within the conditional content
          let processedContent = this.processArraySections(content, context);
          processedContent = this.processConditionalSections(
            processedContent,
            context
          );
          processedContent = this.processNegativeConditionalSections(
            processedContent,
            context
          );
          processedContent = this.processVariables(processedContent, context);
          return processedContent;
        }

        return "";
      }
    );
  }

  /**
   * Process simple variable substitution
   */
  private static processVariables(
    template: string,
    context: TemplateContext
  ): string {
    // Match {{variable}} patterns
    const variablePattern = /\{\{(\w+(?:\.\w+)*)\}\}/g;

    return template.replace(variablePattern, (match, variablePath) => {
      const value = this.getNestedValue(context, variablePath);

      // If the value is an array or object, convert it to a JSON string for HTML attributes
      // and escape quotes for proper HTML parsing
      if (
        Array.isArray(value) ||
        (typeof value === "object" && value !== null)
      ) {
        const jsonString = JSON.stringify(value);
        // Escape double quotes to prevent breaking HTML attribute parsing
        return jsonString.replace(/"/g, "&quot;");
      }

      return value !== undefined ? String(value) : match;
    });
  }

  /**
   * Get nested value from object using dot notation
   */
  private static getNestedValue(obj: any, path: string): any {
    return path.split(".").reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  /**
   * Check if a template contains array sections
   */
  public static hasArraySections(template: string): boolean {
    return /\{\{#\w+\}\}[\s\S]*?\{\{\/\w+\}\}/.test(template);
  }

  /**
   * Extract array names from template
   */
  public static getArrayNames(template: string): string[] {
    const matches = template.match(/\{\{#(\w+)\}\}/g);
    return matches ? matches.map((match) => match.slice(3, -2)) : [];
  }

  /**
   * Validate template syntax
   */
  public static validateTemplate(template: string): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Check for unmatched opening tags
    const openingTags = template.match(/\{\{#\w+\}\}/g) || [];
    const closingTags = template.match(/\{\{\/\w+\}\}/g) || [];

    if (openingTags.length !== closingTags.length) {
      errors.push("Unmatched array section tags");
    }

    // Check for malformed tags
    const malformedTags = template.match(/\{\{[^#\/\w][^}]*\}\}/g);
    if (malformedTags) {
      errors.push(`Malformed template tags: ${malformedTags.join(", ")}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Utility functions for template processing
 */
export class TemplateUtils {
  /**
   * Create a context object with array iteration helpers
   */
  public static createArrayContext(
    array: any[],
    item: any,
    index: number
  ): ArrayContext {
    return {
      item,
      index,
      isFirst: index === 0,
      isLast: index === array.length - 1,
      isEven: index % 2 === 0,
      isOdd: index % 2 === 1,
      length: array.length,
    };
  }

  /**
   * Merge contexts with array context taking precedence
   */
  public static mergeContexts(
    baseContext: TemplateContext,
    arrayContext: ArrayContext
  ): TemplateContext {
    return {
      ...baseContext,
      ...arrayContext,
    };
  }

  /**
   * Escape HTML characters in template output
   */
  public static escapeHtml(str: string): string {
    const htmlEscapes: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return str.replace(/[&<>"']/g, (match) => htmlEscapes[match]);
  }

  /**
   * Unescape HTML characters
   */
  public static unescapeHtml(str: string): string {
    const htmlUnescapes: Record<string, string> = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'",
    };

    return str.replace(
      /&(amp|lt|gt|quot|#39);/g,
      (match) => htmlUnescapes[match]
    );
  }
}

// Export default instance for convenience
export const templateEngine = TemplateEngine;
export default TemplateEngine;
