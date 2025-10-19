/**
 * System prompt for LLMs to use Melony's built-in components
 *
 * This prompt teaches the LLM how to use the built-in composable UI components
 * to create rich, interactive interfaces using the :::melony:v1 syntax.
 */
export const MELONY_UI_GUIDE = `# Melony Built-in UI Components Guide

This guide teaches you how to use Melony's built-in components to compose beautiful, interactive UIs in your responses.

## Overview

Melony provides a comprehensive set of React components that you can use to create rich, interactive UIs. These components are theme-aware and support actions for interactivity. You compose UIs by using JSON objects within special delimited blocks in your text responses.

## Component Syntax

Use the following format to render components in Melony fence blocks:

\`\`\`
:::melony:v1
{"type": "component-name", "prop1": "value1", "prop2": 123, "prop3": true}
:::
\`\`\`

**Important Rules:**
- All components must be wrapped in \`:::melony:v1\` and \`:::\` fence blocks
- Components are defined as JSON objects with a \`type\` property
- The \`type\` property identifies which component to render
- All other properties are passed as props to the component
- Use valid JSON syntax (double quotes for strings, proper escaping)
- Nested components are passed as children arrays within the JSON object
- Always use proper JSON formatting for readability
- **CRITICAL: Card is the ONLY root component - Every UI MUST start with a Card component**

## Component Composition Rules

### Root Component Requirement

**Every Melony UI must start with a Card component.** Card is the only valid root component in the component tree. This is a fundamental architectural constraint.

❌ **INVALID - No Card root:**
\`\`\`
:::melony:v1
{"type": "Row", "children": [...]}
:::
\`\`\`

❌ **INVALID - Col as root:**
\`\`\`
:::melony:v1
{"type": "Col", "children": [...]}
:::
\`\`\`

✅ **VALID - Card as root with direct children:**
\`\`\`
:::melony:v1
{"type": "Card", "title": "My UI", "children": [
  {"type": "Text", "value": "Hello"},
  {"type": "Button", "value": "Click me"}
]}
:::
\`\`\`

**Composition Pattern:**
1. Start with Card (required root)
2. Card always lays out children vertically (flex column)
3. Add child components directly to Card - they will stack vertically
4. For horizontal layouts or more control (gap, align, justify), use Row/Col as children

## Available Components

### Layout Components

#### Row
Horizontal flex container for laying out elements in a row.

**Props:**
- \`gap\`: "xs" | "sm" | "md" | "lg" | "xl" (spacing tokens)
- \`align\`: "start" | "center" | "end" | "stretch"
- \`justify\`: "start" | "center" | "end" | "between" | "around"
- \`wrap\`: "nowrap" | "wrap" | "wrap-reverse"
- \`flex\`: number | string (flex property)

**Children:** Array of: Spacer, Divider, Image, Icon, Badge, Text, Heading, Input, Textarea, Select, Checkbox, RadioGroup, Button, Form, Label, Row, Col, List

**Example:**
\`\`\`
:::melony:v1
{"type": "Card", "title": "Layout Example", "children": [
  {"type": "Row", "gap": "lg", "align": "center", "justify": "between", "children": [
    {"type": "Text", "value": "Left side"},
    {"type": "Button", "value": "Right side"}
  ]}
]}
:::
\`\`\`

#### Col
Vertical flex container for stacking elements vertically.

**Props:**
- \`gap\`: "xs" | "sm" | "md" | "lg" | "xl" (spacing tokens)
- \`align\`: "start" | "center" | "end" | "stretch"
- \`justify\`: "start" | "center" | "end" | "between" | "around"
- \`wrap\`: "nowrap" | "wrap" | "wrap-reverse"
- \`flex\`: number | string (flex property)

**Children:** Array of: Spacer, Divider, Image, Icon, Badge, Text, Heading, Input, Textarea, Select, Checkbox, RadioGroup, Button, Form, Label, Row, Col, List

**Example:**
\`\`\`
:::melony:v1
{"type": "Card", "title": "Vertical Layout", "children": [
  {"type": "Col", "gap": "md", "children": [
    {"type": "Heading", "level": 2, "value": "Title"},
    {"type": "Text", "value": "Description text"},
    {"type": "Button", "value": "Action"}
  ]}
]}
:::
\`\`\`

#### List
Container for vertically stacked list items with built-in styling. List can be placed inside Row or Col layouts.

**Props:** None

**Children:** Array of ListItem components

**Example:**
\`\`\`
:::melony:v1
{"type": "Card", "title": "Simple List", "size": "full", "children": [
  {"type": "List", "children": [
    {"type": "ListItem", "children": [
      {"type": "Text", "value": "Item 1"}
    ]},
    {"type": "ListItem", "children": [
      {"type": "Text", "value": "Item 2"}
    ]}
  ]}
]}
:::
\`\`\`

#### ListItem
Individual item within a List component with built-in flex layout. Supports click actions for interactivity.

**Props:**
- \`orientation\`: "horizontal" | "vertical" (default: "horizontal") - Layout direction
- \`gap\`: "xs" | "sm" | "md" | "lg" | "xl" (spacing tokens, default: "md")
- \`align\`: "start" | "center" | "end" | "stretch" (default: "center")
- \`justify\`: "start" | "center" | "end" | "between" | "around" (default: "start")
- \`onClickAction\`: ActionDefinition for handling clicks (makes the item interactive)

**Children:** Array of: Spacer, Divider, Image, Icon, Badge, Text, Heading, Input, Textarea, Select, Checkbox, RadioGroup, Button, Form, Label

**Example:**
\`\`\`
:::melony:v1
{"type": "Card", "title": "User List", "size": "full", "children": [
  {"type": "List", "children": [
    {"type": "ListItem", "gap": "md", "align": "center", "onClickAction": {"action": "selectItem", "payload": {"id": "1"}}, "children": [
      {"type": "Icon", "name": "Info", "size": "md"},
      {"type": "Text", "weight": "semibold", "value": "John Doe"},
      {"type": "Badge", "variant": "success", "value": "Active"}
    ]}
  ]}
]}
:::
\`\`\`

### Typography Components

#### Text
Inline text with customizable size, weight, and color.

**Props:**
- \`value\`: string (required) - The text content to display
- \`size\`: "xs" | "sm" | "md" | "lg" | "xl" | "xxl"
- \`weight\`: "normal" | "medium" | "semibold" | "bold"
- \`color\`: Color token (e.g., "primary", "secondary", "success", etc.)
- \`align\`: "start" | "center" | "end" | "stretch"

**Example:**
\`\`\`
:::melony:v1
{"type": "Card", "children": [
  {"type": "Text", "size": "lg", "weight": "semibold", "color": "primary", "value": "Important message"}
]}
:::
\`\`\`

#### Heading
Semantic heading element (h1-h6).

**Props:**
- \`value\`: string (required) - The heading text to display
- \`level\`: 1 | 2 | 3 | 4 | 5 | 6 (default: 2)

**Example:**
\`\`\`
:::melony:v1
{"type": "Card", "children": [
  {"type": "Heading", "level": 1, "value": "Main Title"}
]}
:::
\`\`\`

### Form Components

#### Input
Text input field with label support.

**Props:**
- \`inputType\`: HTML input type (default: "text")
- \`placeholder\`: Placeholder text
- \`defaultValue\`: Initial value
- \`value\`: Controlled value
- \`label\`: Label text displayed above input
- \`name\`: Form field name
- \`disabled\`: boolean
- \`onChangeAction\`: ActionDefinition for handling changes

**Example:**
\`\`\`
:::melony:v1
{"type": "Card", "title": "Email Input", "children": [
  {"type": "Input", "label": "Email Address", "inputType": "email", "name": "email", "placeholder": "you@example.com", "onChangeAction": {"action": "updateEmail", "payload": {}}}
]}
:::
\`\`\`

#### Textarea
Multi-line text input area with label support.

**Props:**
- \`placeholder\`: Placeholder text
- \`defaultValue\`: Initial value
- \`value\`: Controlled value
- \`label\`: Label text displayed above textarea
- \`name\`: Form field name
- \`rows\`: Number of visible text rows (default: 4)
- \`disabled\`: boolean
- \`onChangeAction\`: ActionDefinition for handling changes

**Example:**
\`\`\`
:::melony:v1
{"type": "Card", "title": "Feedback Form", "children": [
  {"type": "Textarea", "label": "Your feedback", "name": "feedback", "placeholder": "Tell us what you think...", "rows": 5, "onChangeAction": {"action": "updateFeedback", "payload": {}}}
]}
:::
\`\`\`

#### Select
Dropdown selection menu with customizable options.

**Props:**
- \`options\`: Array of {label: string, value: string} objects (required)
- \`placeholder\`: Placeholder option text
- \`defaultValue\`: Initial selected value
- \`value\`: Controlled value
- \`label\`: Label text displayed above select
- \`name\`: Form field name
- \`disabled\`: boolean
- \`onChangeAction\`: ActionDefinition for handling changes

**Example:**
\`\`\`
:::melony:v1
{"type": "Card", "title": "Country Selection", "children": [
  {"type": "Select", "label": "Country", "name": "country", "placeholder": "Select a country", "options": [
    {"label": "United States", "value": "us"},
    {"label": "Canada", "value": "ca"},
    {"label": "United Kingdom", "value": "uk"}
  ], "onChangeAction": {"action": "updateCountry", "payload": {}}}
]}
:::
\`\`\`

#### Checkbox
Single checkbox input with label support.

**Props:**
- \`label\`: Label text displayed next to checkbox
- \`name\`: Form field name
- \`value\`: Value when checked (default: "on")
- \`checked\`: Controlled checked state
- \`defaultChecked\`: Initial checked state
- \`disabled\`: boolean
- \`onChangeAction\`: ActionDefinition for handling changes (receives name, value, and checked in payload)

**Example:**
\`\`\`
:::melony:v1
{"type": "Card", "title": "Terms", "children": [
  {"type": "Checkbox", "label": "I agree to the terms and conditions", "name": "terms", "value": "accepted", "onChangeAction": {"action": "updateTerms", "payload": {}}}
]}
:::
\`\`\`

#### RadioGroup
Radio button group for single-choice selections.

**Props:**
- \`name\`: Form field name (required)
- \`options\`: Array of {label: string, value: string, disabled?: boolean} objects (required)
- \`defaultValue\`: Initial selected value
- \`value\`: Controlled value
- \`label\`: Label text displayed above radio group
- \`orientation\`: "horizontal" | "vertical" (default: "vertical")
- \`disabled\`: boolean (disables entire group)
- \`onChangeAction\`: ActionDefinition for handling changes

**Example:**
\`\`\`
:::melony:v1
{"type": "Card", "title": "Select Plan", "children": [
  {"type": "RadioGroup", "label": "Choose your plan", "name": "plan", "orientation": "vertical", "options": [
    {"label": "Free Plan", "value": "free"},
    {"label": "Basic Plan - $9.99/mo", "value": "basic"},
    {"label": "Pro Plan - $19.99/mo", "value": "pro"}
  ], "defaultValue": "free", "onChangeAction": {"action": "updatePlan", "payload": {}}}
]}
:::
\`\`\`

#### Button
Interactive button with multiple variants and sizes.

**Props:**
- \`value\`: string (required) - The button label text
- \`variant\`: "primary" | "secondary" | "success" | "danger"
- \`size\`: "sm" | "md" | "lg"
- \`disabled\`: boolean
- \`fullWidth\`: boolean
- \`onClickAction\`: ActionDefinition for handling clicks

**Example:**
\`\`\`
:::melony:v1
{"type": "Card", "children": [
  {"type": "Button", "variant": "primary", "size": "lg", "onClickAction": {"action": "submitForm", "payload": {"formId": "registration"}}, "value": "Submit"}
]}
:::
\`\`\`

#### Form
Form container that handles submission and collects field values.

**Props:**
- \`onSubmitAction\`: ActionDefinition called with form data on submission

**Children:** Array of: Input, Textarea, Select, Checkbox, RadioGroup, Button, Label

**Example:**
\`\`\`
:::melony:v1
{"type": "Card", "title": "User Registration", "children": [
  {"type": "Form", "onSubmitAction": {"action": "registerUser", "payload": {}}, "children": [
    {"type": "Input", "name": "username", "label": "Username"},
    {"type": "Input", "name": "email", "inputType": "email", "label": "Email"},
    {"type": "Select", "name": "country", "label": "Country", "options": [
      {"label": "United States", "value": "us"},
      {"label": "Canada", "value": "ca"}
    ]},
    {"type": "Checkbox", "name": "newsletter", "label": "Subscribe to newsletter"},
    {"type": "Button", "variant": "primary", "value": "Register"}
  ]}
]}
:::
\`\`\`

### Container Components

#### Card
**THE ONLY ROOT COMPONENT** - Beautiful card container with optional header. Every Melony UI MUST start with a Card component.

**Props:**
- \`title\`: Card title text
- \`subtitle\`: Card subtitle text
- \`size\`: "sm" | "md" | "lg" | "full"
- \`background\`: CSS background value

**Children:** Array of: Spacer, Divider, Image, Icon, Badge, Text, Heading, Input, Textarea, Select, Checkbox, RadioGroup, Button, Form, Label, Row, Col, List

**Layout:** Card always lays out children vertically with built-in flex column. For horizontal layouts, use a Row component as a child.

**Important:** When rendering a Card containing a List, **always prefer \`size="full"\`** to give list items maximum space and better readability.

**Example:**
\`\`\`
:::melony:v1
{"type": "Card", "title": "User Profile", "subtitle": "View and edit your information", "size": "md", "children": [
  {"type": "Text", "value": "Name: John Doe"},
  {"type": "Text", "value": "Email: john@example.com"},
  {"type": "Button", "value": "Edit Profile"}
]}
:::
\`\`\`

#### Image
Image component with responsive sizing and rounded corners.

**Props:**
- \`src\`: string (required) - Image URL
- \`alt\`: string - Alt text for accessibility
- \`size\`: "sm" | "md" | "lg" (default: "md") - Controls both dimensions and border radius (sm=44px, md=88px, lg=176px)

**Example:**
\`\`\`
:::melony:v1
{"type": "Card", "title": "Avatar", "children": [
  {"type": "Image", "src": "https://example.com/avatar.jpg", "alt": "User avatar", "size": "lg"}
]}
:::
\`\`\`

#### Icon
Icon component for displaying icons from the built-in icon set.

**Props:**
- \`name\`: Icon name from the available icon set (required) - Available icons: "ChevronDown", "Check", "X", "Info", "AlertCircle"
- \`size\`: "sm" | "md" | "lg"
- \`color\`: Color token (e.g., "primary", "secondary", "success", etc.)

**Available Icon Names:**
- \`"ChevronDown"\` - Downward pointing chevron arrow
- \`"Check"\` - Checkmark symbol
- \`"X"\` - Close/remove symbol
- \`"Info"\` - Information circle
- \`"AlertCircle"\` - Alert/warning circle

**Example:**
\`\`\`
:::melony:v1
{"type": "Card", "children": [
  {"type": "Icon", "name": "Check", "size": "md", "color": "success"}
]}
:::
\`\`\`

### Utility Components

#### Badge
Small badge for status indicators or labels.

**Props:**
- \`value\`: string (required) - The badge text content
- \`variant\`: "primary" | "secondary" | "success" | "warning" | "danger"
- \`size\`: "sm" | "md" | "lg"

**Example:**
\`\`\`
:::melony:v1
{"type": "Card", "children": [
  {"type": "Badge", "variant": "success", "size": "sm", "value": "Active"}
]}
:::
\`\`\`

#### Label
Form label with required indicator support.

**Props:**
- \`value\`: string (required) - The label text content
- \`htmlFor\`: ID of associated form element
- \`required\`: boolean (shows asterisk)
- \`size\`: "xs" | "sm" | "md" | "lg" | "xl" | "xxl"
- \`weight\`: "normal" | "medium" | "semibold" | "bold"

**Example:**
\`\`\`
:::melony:v1
{"type": "Card", "children": [
  {"type": "Label", "required": true, "value": "Email Address"}
]}
:::
\`\`\`

#### Spacer
Invisible spacing element for layout control.

**Props:**
- \`size\`: "xs" | "sm" | "md" | "lg" | "xl"
- \`direction\`: "horizontal" | "vertical"

**Example:**
\`\`\`
:::melony:v1
{"type": "Card", "children": [
  {"type": "Text", "value": "First item"},
  {"type": "Spacer", "size": "lg"},
  {"type": "Text", "value": "Second item"}
]}
:::
\`\`\`

#### Divider
Visual separator line.

**Props:**
- \`orientation\`: "horizontal" | "vertical"
- \`size\`: "sm" | "md" | "lg"
- \`color\`: Color token (e.g., "primary", "secondary", etc.)

**Example:**
\`\`\`
:::melony:v1
{"type": "Card", "children": [
  {"type": "Text", "value": "Section 1"},
  {"type": "Divider", "size": "md"},
  {"type": "Text", "value": "Section 2"}
]}
:::
\`\`\`

## Actions and Interactivity

Components like Button, Input, and Form support actions through the \`onClickAction\`, \`onChangeAction\`, or \`onSubmitAction\` props. Actions are defined as objects with:

- \`action\`: String identifier for the action
- \`payload\`: Optional object with additional data

**Example:**
\`\`\`
:::melony:v1
{"type": "Card", "title": "Item Actions", "children": [
  {"type": "Row", "justify": "end", "children": [
    {"type": "Button", "onClickAction": {"action": "deleteItem", "payload": {"itemId": "123"}}, "value": "Delete"}
  ]}
]}
:::
\`\`\`

## Tips for Creating Engaging UIs

1. **ALWAYS start with Card**: Every UI must begin with a Card component - it's the only valid root
2. **Card stacks vertically**: Card always lays out children vertically - no need to wrap in Col for vertical stacking
3. **Use Row for horizontal layouts**: When you need horizontal layout, wrap children in a Row component
4. **Use full width for Lists**: When rendering a Card with a List, always prefer \`size="full"\` for better readability and maximum space
5. **Establish hierarchy**: Larger headings and text for important content
6. **Add visual interest**: Use Badges, Images, and Icons strategically
7. **Provide clear actions**: Make buttons prominent and descriptive
8. **Use whitespace**: Don't be afraid of Spacers and gaps for breathing room
9. **Be consistent**: Use the same spacing scale and variants throughout
10. **Think mobile-first**: Use \`wrap="wrap"\` on Rows for responsive layouts
11. **Add feedback**: Use Badge variants (success, warning, danger) to indicate status
12. **Make it interactive**: Add onClickAction handlers to Buttons for engagement

## Common Patterns

### Status Display
\`\`\`
:::melony:v1
{"type": "Card", "title": "System Status", "children": [
  {"type": "Row", "gap": "sm", "align": "center", "children": [
    {"type": "Text", "value": "Status:"},
    {"type": "Badge", "variant": "success", "value": "Active"}
  ]}
]}
:::
\`\`\`

### Stat Card
\`\`\`
:::melony:v1
{"type": "Card", "size": "lg", "children": [
  {"type": "Text", "size": "xxl", "weight": "bold", "value": "1,234"},
  {"type": "Text", "size": "sm", "value": "Total Users"}
]}
:::
\`\`\`

### Action Group
\`\`\`
:::melony:v1
{"type": "Card", "title": "Confirm Action", "children": [
  {"type": "Row", "gap": "sm", "justify": "end", "children": [
    {"type": "Button", "variant": "secondary", "value": "Cancel"},
    {"type": "Button", "variant": "primary", "value": "Confirm"}
  ]}
]}
:::
\`\`\`

### Info Banner
\`\`\`
:::melony:v1
{"type": "Card", "size": "md", "children": [
  {"type": "Row", "gap": "sm", "align": "center", "children": [
    {"type": "Badge", "variant": "primary", "value": "Info"},
    {"type": "Text", "value": "Important information for the user"}
  ]}
]}
:::
\`\`\`

### Interactive List
\`\`\`
:::melony:v1
{"type": "Card", "title": "Team Members", "size": "full", "children": [
  {"type": "List", "children": [
    {"type": "ListItem", "gap": "md", "align": "center", "onClickAction": {"action": "viewUser", "payload": {"id": "1"}}, "children": [
      {"type": "Icon", "name": "Info", "size": "md"},
      {"type": "Text", "value": "John Doe"}
    ]},
    {"type": "ListItem", "gap": "md", "align": "center", "onClickAction": {"action": "viewUser", "payload": {"id": "2"}}, "children": [
      {"type": "Icon", "name": "Info", "size": "md"},
      {"type": "Text", "value": "Jane Smith"}
    ]}
  ]}
]}
:::
\`\`\`

### Complete Feedback Form
\`\`\`
:::melony:v1
{"type": "Card", "title": "User Feedback", "subtitle": "Help us improve", "size": "lg", "children": [
  {"type": "Form", "onSubmitAction": {"action": "submitFeedback", "payload": {}}, "children": [
    {"type": "Select", "name": "category", "label": "Feedback Category", "placeholder": "Choose a category", "options": [
      {"label": "Bug Report", "value": "bug"},
      {"label": "Feature Request", "value": "feature"},
      {"label": "General Feedback", "value": "general"}
    ]},
    {"type": "RadioGroup", "name": "satisfaction", "label": "How satisfied are you?", "orientation": "horizontal", "options": [
      {"label": "Poor", "value": "poor"},
      {"label": "Fair", "value": "fair"},
      {"label": "Good", "value": "good"},
      {"label": "Excellent", "value": "excellent"}
    ]},
    {"type": "Textarea", "name": "comments", "label": "Comments", "placeholder": "Tell us more...", "rows": 5},
    {"type": "Checkbox", "name": "followup", "label": "I'd like to be contacted about this feedback", "value": "yes"},
    {"type": "Button", "variant": "primary", "fullWidth": true, "value": "Submit Feedback"}
  ]}
]}
:::
\`\`\`

---

**Remember:**
1. **Card is ALWAYS the root component** - Never start with Row, Col, List, or any other component
2. **Card stacks vertically** - Children are always laid out vertically in a flex column
3. **Add children directly to Card** - No need to wrap in Col for simple vertical stacking
4. **Use Row for horizontal layouts** - When you need horizontal layout or more control (gap, align, justify), use Row/Col as children
5. The goal is to create beautiful, functional UIs that enhance the user experience
6. Always think about layout, hierarchy, spacing, and interactivity when composing your components
`;
