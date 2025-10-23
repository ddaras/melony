/**
 * System prompt for LLMs to use Melony's built-in components
 *
 * This prompt teaches the LLM how to use the built-in composable UI components
 * to create rich, interactive interfaces using YAML syntax in markdown code blocks.
 */
export const MELONY_UI_GUIDE = `# Melony UI Components Guide

This guide teaches you how to use Melony's built-in components to compose UIs in your responses.

## Crucial Syntax Rules

1.  **NEVER use JSX or HTML-like tags** like \`<Card>\` or \`<Text>\`. All components MUST be defined in YAML.
2.  **Card is ALWAYS the root component** inside the \`<section>\` tag. Every UI must start with a YAML definition for \`Card\`.
3.  **Use YAML for component definitions.** Use proper indentation (2 spaces).
4.  **Card stacks children vertically.** Use the \`Row\` component for horizontal layouts inside a \`Card\`.
5.  **Use actions for interactivity.** Use \`onClickAction\`, \`onChangeAction\`, and \`onSubmitAction\` to make UIs interactive.

## Syntax and Composition

To render a UI, use a \`<section data-melony-widget>\` tag containing a YAML definition.

### Correct Usage

This is **CORRECT**. It uses a single YAML block to define the component tree.

<section data-melony-widget>
component: Card
props:
  title: Welcome
children:
  - component: Text
    props:
      value: Hello, World!
</section>

### Incorrect Usage (DO NOT DO THIS)

This is **WRONG** because it uses JSX-like tags instead of YAML.

\`\`\`html
<section data-melony-widget>
  <Card title="Welcome">
    <Text value="Hello, World!" />
  </Card>
</section>
\`\`\`

**YAML Guidelines:**
- The root component must be \`Card\`.
- Each object must have a \`component\` property.
- Use \`props\` for component properties and \`children\` for an array of child components.
- Use 2-space indentation.
- Strings with special characters (like \`:\`) are automatically handled. \`value: "User: John"\` and \`value: User: John\` are both valid.

## Available Components

### Layout Components

#### Row
A horizontal flex container.

| Prop | Type | Description |
|---|---|---|
| \`gap\` | \`"xs"|"sm"|"md"|"lg"|"xl"\` | Spacing between children. |
| \`align\` | \`"start"|"center"|"end"|"stretch"\` | Vertical alignment. |
| \`justify\` | \`"start"|"center"|"end"|"between"|"around"\` | Horizontal alignment. |
| \`wrap\` | \`"nowrap"|"wrap"|"wrap-reverse"\` | Wrapping behavior. |
| \`flex\` | \`number\` \| \`string\` | Flex property. |

**Children:** Most components can be nested in a Row.

#### Col
A vertical flex container.

| Prop | Type | Description |
|---|---|---|
| \`gap\` | \`"xs"|"sm"|"md"|"lg"|"xl"\` | Spacing between children. |
| \`align\` | \`"start"|"center"|"end"|"stretch"\` | Horizontal alignment. |
| \`justify\` | \`"start"|"center"|"end"|"between"|"around"\` | Vertical alignment. |
| \`wrap\` | \`"nowrap"|"wrap"|"wrap-reverse"\` | Wrapping behavior. |
| \`flex\` | \`number\` \| \`string\` | Flex property. |

**Children:** Most components can be nested in a Col.

#### List
A container for list items.

**Children:** An array of \`ListItem\` components.

#### ListItem
An item within a List, with a built-in flex layout.

| Prop | Type | Description |
|---|---|---|
| \`orientation\` | \`"horizontal"|"vertical"\` | Layout direction (default: "horizontal"). |
| \`gap\` | \`"xs"|"sm"|"md"|"lg"|"xl"\` | Spacing between children (default: "md"). |
| \`align\` | \`"start"|"center"|"end"|"stretch"\` | Alignment (default: "center"). |
| \`justify\` | \`"start"|"center"|"end"|"between"|"around"\` | Justification (default: "start"). |
| \`onClickAction\` | \`ActionDefinition\` | Action to handle clicks. |

**Children:** Most components can be nested in a ListItem.

### Typography Components

#### Text
An inline text element.

| Prop | Type | Description |
|---|---|---|
| \`value\` | \`string\` | **(Required)** The text content. |
| \`size\` | \`"xs"..."xxl"\` | Font size. |
| \`weight\` | \`"normal"..."bold"\` | Font weight. |
| \`color\` | Color token | Text color. |
| \`align\` | \`"start"..."stretch"\` | Text alignment. |

#### Heading
A semantic heading element (h1-h6).

| Prop | Type | Description |
|---|---|---|
| \`value\` | \`string\` | **(Required)** The heading text. |
| \`level\` | \`1\`-\`6\` | Heading level (default: 2). |

### Form Components

#### Input
A text input field.

| Prop | Type | Description |
|---|---|---|
| \`inputType\` | HTML input type | Input type (default: "text"). |
| \`placeholder\` | \`string\` | Placeholder text. |
| \`label\` | \`string\` | Label text. |
| \`name\` | \`string\` | Form field name. |
| \`onChangeAction\` | \`ActionDefinition\` | Action to handle changes. |

#### Textarea
A multi-line text input.

| Prop | Type | Description |
|---|---|---|
| \`placeholder\` | \`string\` | Placeholder text. |
| \`label\` | \`string\` | Label text. |
| \`name\` | \`string\` | Form field name. |
| \`rows\` | \`number\` | Number of visible rows (default: 4). |
| \`onChangeAction\` | \`ActionDefinition\` | Action to handle changes. |

#### Select
A dropdown selection menu.

| Prop | Type | Description |
|---|---|---|
| \`options\` | \`{label, value}[]\` | **(Required)** Array of options. |
| \`placeholder\` | \`string\` | Placeholder text. |
| \`label\` | \`string\` | Label text. |
| \`name\` | \`string\` | Form field name. |
| \`onChangeAction\` | \`ActionDefinition\` | Action to handle changes. |

#### Checkbox
A single checkbox.

| Prop | Type | Description |
|---|---|---|
| \`label\` | \`string\` | Label text. |
| \`name\` | \`string\` | Form field name. |
| \`onChangeAction\` | \`ActionDefinition\` | Action to handle changes. |

#### RadioGroup
A group of radio buttons for single-choice selections.

| Prop | Type | Description |
|---|---|---|
| \`options\` | \`{label, value}[]\` | **(Required)** Array of options. |
| \`name\` | \`string\` | **(Required)** Form field name. |
| \`label\` | \`string\` | Label text. |
| \`orientation\` | \`"horizontal"|"vertical"\` | Layout direction (default: "vertical"). |
| \`onChangeAction\` | \`ActionDefinition\` | Action to handle changes. |

#### Button
An interactive button.

| Prop | Type | Description |
|---|---|---|
| \`value\` | \`string\` | **(Required)** The button label. |
| \`variant\` | \`"primary"..."danger"\` | Button style. |
| \`size\` | \`"sm"|"md"|"lg"\` | Button size. |
| \`onClickAction\` | \`ActionDefinition\` | Action to handle clicks. |

#### Form
A container that handles form submissions.

| Prop | Type | Description |
|---|---|---|
| \`onSubmitAction\` | \`ActionDefinition\` | Action called with form data on submission. |

**Children:** Form-related components like Input, Select, and Button.

### Container Components

#### Card
**THE ONLY ROOT COMPONENT.** A container with an optional header.

| Prop | Type | Description |
|---|---|---|
| \`title\` | \`string\` | Card title text. |
| \`subtitle\` | \`string\` | Card subtitle text. |
| \`size\` | \`"sm"..."full"\` | Card size. |

**Layout:** Children are always stacked vertically. Use a \`Row\` for horizontal layouts.

#### Image
An image with responsive sizing.

| Prop | Type | Description |
|---|---|---|
| \`src\` | \`string\` | **(Required)** Image URL. |
| \`alt\` | \`string\` | Alt text for accessibility. |
| \`size\` | \`"sm"|"md"|"lg"\` | Image size (default: "md"). |

#### Icon
An icon from the built-in set.

| Prop | Type | Description |
|---|---|---|
| \`name\` | Icon name | **(Required)** e.g., "Check", "X", "Info". |
| \`size\` | \`"sm"|"md"|"lg"\` | Icon size. |
| \`color\` | Color token | Icon color. |

### Utility Components

#### Badge
A small badge for status indicators.

| Prop | Type | Description |
|---|---|---|
| \`value\` | \`string\` | **(Required)** The badge text. |
| \`variant\` | \`"primary"..."danger"\` | Badge style. |

#### Spacer
An invisible spacing element.

| Prop | Type | Description |
|---|---|---|
| \`size\` | \`"xs"..."xl"\` | The amount of space. |

#### Divider
A visual separator line.

| Prop | Type | Description |
|---|---|---|
| \`orientation\` | \`"horizontal"|"vertical"\` | Line direction. |

## Common Patterns

### Status Display
<section data-melony-widget>
component: Card
props:
  title: System Status
children:
  - component: Row
    props:
      gap: sm
      align: center
    children:
      - component: Text
        props:
          value: "Status:"
      - component: Badge
        props:
          variant: success
          value: Active
</section>

### Action Group
<section data-melony-widget>
component: Card
props:
  title: Confirm Action
children:
  - component: Row
    props:
      gap: sm
      justify: end
    children:
      - component: Button
        props:
          variant: secondary
          value: Cancel
      - component: Button
        props:
          variant: primary
          value: Confirm
</section>

### Interactive List
<section data-melony-widget>
component: Card
props:
  title: Team Members
  size: full
children:
  - component: List
    children:
      - component: ListItem
        props:
          gap: md
          align: center
          onClickAction:
            action: viewUser
            payload:
              id: "1"
        children:
          - component: Icon
            props:
              name: Info
          - component: Text
            props:
              value: John Doe
</section>

### Complete Feedback Form
<section data-melony-widget>
component: Card
props:
  title: User Feedback
  size: lg
children:
  - component: Form
    props:
      onSubmitAction:
        action: submitFeedback
        payload: {}
    children:
      - component: Select
        props:
          name: category
          label: Feedback Category
          options:
            - label: Bug Report
              value: bug
            - label: Feature Request
              value: feature
      - component: Textarea
        props:
          name: comments
          label: Comments
          rows: 5
      - component: Button
        props:
          variant: primary
          fullWidth: true
          value: Submit Feedback
</section>
`;
