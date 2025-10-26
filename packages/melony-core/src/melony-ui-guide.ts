/**
 * System prompt for LLMs to use Melony's built-in components
 *
 * This prompt teaches the LLM how to use the built-in composable UI components
 * to create rich, interactive interfaces using HTML-style syntax.
 */
export const MELONY_UI_GUIDE = `# Melony UI Components Guide

This guide teaches you how to use Melony's built-in components to compose UIs in your responses.

## Crucial Syntax Rules

1.  **Use HTML-like tags** like \`<card>\`, \`<text>\`, \`<button>\` etc. All components use HTML-style syntax.
2.  **Card is ALWAYS the root component.** Every UI must start with a \`<card>\` element.
3.  **Use HTML-style syntax for component definitions.** Use proper opening and closing tags.
4.  **Card stacks children vertically.** Use the \`<row>\` component for horizontal layouts inside a \`<card>\`.
5.  **Use actions for interactivity.** Use \`onClickAction\`, \`onChangeAction\`, and \`onSubmitAction\` to make UIs interactive.
6.  **No string chilren are allowed.** All children must be components.

## Action Format

Actions are passed as JSON strings with the following structure:

\`\`\`json
{
  "type": "action-name",
  "payload": { "key": "value" }
}
\`\`\`

- \`type\`: The action identifier (required)
- \`payload\`: Additional data for the action (optional)

Example: \`onClickAction='{"type": "navigate", "payload": {"page": "home"}}'\`

## Syntax and Composition

To render a UI, use HTML-style tags starting with a \`<card>\` element.

### Correct Usage

This is **CORRECT**. It uses HTML-style tags starting with a card to define the component tree.

<card title="Welcome">
  <text value="Hello, World!" />
</card>

**HTML-style Guidelines:**
- Always start with a \`<card>\` element: \`<card>...</card>\`
- Use lowercase tag names: \`<card>\`, \`<text>\`, \`<button>\`, etc.
- Attributes are passed as HTML attributes: \`<button onClickAction="action-name" label="Click Me" />\`
- Nested components are placed between opening and closing tags.
- Self-closing tags are supported: \`<spacer height="20" />\`
- Mixed content is supported: \`<card><text value="Hello" /><button label="Click" /></card>\`

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
| \`onClickAction\` | \`string\` | Action to handle clicks (JSON string with type and payload). |

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
| \`onChangeAction\` | \`string\` | Action to handle changes (JSON string with type and payload). |

#### Textarea
A multi-line text input.

| Prop | Type | Description |
|---|---|---|
| \`placeholder\` | \`string\` | Placeholder text. |
| \`label\` | \`string\` | Label text. |
| \`name\` | \`string\` | Form field name. |
| \`rows\` | \`number\` | Number of visible rows (default: 4). |
| \`onChangeAction\` | \`string\` | Action to handle changes (JSON string with type and payload). |

#### Select
A dropdown selection menu.

| Prop | Type | Description |
|---|---|---|
| \`options\` | \`{label, value}[]\` | **(Required)** Array of options. |
| \`placeholder\` | \`string\` | Placeholder text. |
| \`label\` | \`string\` | Label text. |
| \`name\` | \`string\` | Form field name. |
| \`onChangeAction\` | \`string\` | Action to handle changes (JSON string with type and payload). |

#### Checkbox
A single checkbox.

| Prop | Type | Description |
|---|---|---|
| \`label\` | \`string\` | Label text. |
| \`name\` | \`string\` | Form field name. |
| \`onChangeAction\` | \`string\` | Action to handle changes (JSON string with type and payload). |

#### RadioGroup
A group of radio buttons for single-choice selections.

| Prop | Type | Description |
|---|---|---|
| \`options\` | \`{label, value}[]\` | **(Required)** Array of options. |
| \`name\` | \`string\` | **(Required)** Form field name. |
| \`label\` | \`string\` | Label text. |
| \`orientation\` | \`"horizontal"|"vertical"\` | Layout direction (default: "vertical"). |
| \`onChangeAction\` | \`string\` | Action to handle changes (JSON string with type and payload). |

#### Button
An interactive button.

| Prop | Type | Description |
|---|---|---|
| \`label\` | \`string\` | **(Required)** The button label. |
| \`variant\` | \`"primary"..."danger"\` | Button style. |
| \`size\` | \`"sm"|"md"|"lg"\` | Button size. |
| \`onClickAction\` | \`string\` | Action to handle clicks (JSON string with type and payload). |

#### Form
A container that handles form submissions.

| Prop | Type | Description |
|---|---|---|
| \`onSubmitAction\` | \`string\` | Action called with form data on submission (JSON string with type and payload). |

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
| \`label\` | \`string\` | **(Required)** The badge text. |
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
<card title="System Status">
  <row gap="sm" align="center">
    <text value="Status:" />
    <badge variant="success" label="Active" />
  </row>
</card>

### Action Group
<card title="Confirm Action">
  <row gap="sm" justify="end">
    <button variant="secondary" label="Cancel" onClickAction='{"type": "cancel"}' />
    <button variant="primary" label="Confirm" onClickAction='{"type": "confirm", "payload": {"action": "save"}}' />
  </row>
</card>

### Interactive List
<card title="Team Members" size="full">
  <list>
    <listitem gap="md" align="center" onClickAction='{"type": "viewUser", "payload": {"userId": "123"}}'>
      <icon name="Info" />
      <text value="John Doe" />
    </listitem>
  </list>
</card>

### Complete Feedback Form
<card title="User Feedback" size="lg">
  <form onSubmitAction='{"type": "submitFeedback", "payload": {"source": "web"}}'>
    <select name="category" label="Feedback Category" onChangeAction='{"type": "categoryChanged"}'>
      <option value="bug">Bug Report</option>
      <option value="feature">Feature Request</option>
    </select>
    <textarea name="comments" label="Comments" rows="5" onChangeAction='{"type": "commentChanged"}'></textarea>
    <button variant="primary" fullWidth="true" label="Submit Feedback" />
  </form>
</card>
`;
