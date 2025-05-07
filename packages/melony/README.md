# Melony

[![npm version](https://img.shields.io/npm/v/melony.svg)](https://www.npmjs.com/package/melony)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

Melony is an experimental UI library, highly inspired by Flutter, that lets you build web apps rapidly without writing JSX or traditional frontend code.

## Motivation

We want to create a React wrapper that uses pure JavaScript functions to build consistent UI without JSX, combining React's power with functional programming simplicity.

## Installation

Melony is based on Shadcn UI. First, install it (see https://ui.shadcn.com/docs/installation).

Install Melony with your preferred package manager:

```bash
pnpm add melony @melony/ui
```

Include the following code snippet in your global CSS file:

```css
@source "../node_modules/@melony/ui/dist/**/*.{js,ts,jsx,tsx,mdx}";
```

That's it!

## Usage

Melony provides a simple, declarative API for building data applications. Instead of writing JSX, you use JavaScript functions to create UI components.

```javascript
import { root, vstack, table, text } from "melony";

// Create a simple app
import { root, vstack, text, table, avatar } from "melony";

export default function App() {
  return root({
    children: [
      vstack({
        className: "gap-4",
        children: [
          text({ content: "Hello, Melony!", level: "h1" }),
          table({
            columns: [
              { header: "Name", accessorKey: "name" },
              { header: "Age", accessorKey: "age" },
              {
                header: "Avatar",
                accessorKey: "avatar",
                cell: ({ row }) =>
                  avatar({
                    src: row.original.avatar,
                  }),
              },
            ],
            data,
          }),
        ],
      }),
    ],
  });
}
```

## API Reference

### Layout Components

- `root(config)`: The root component for your app
- `vstack(config)`: Vertical stack layout
- `hstack(config)`: Horizontal stack layout
- `spacer(config)`: Flexible space between elements

### Basic Components

- `text(config)`: Display text content
- `heading(config)`: Display headings
- `button(config)`: Create buttons
- `tabs(config)`: Create tabbed interface
- `card(config)`: Display card
- `themeToggle(config)`: Display card

### Form Components

- `form(config)`: Form provider
- `formComboboxField(config)`: Create combobox input field
- `formTextField(config)`: Create form text input field
- `formDateField(config)`: Create form date input field
- `formBooleanField(config)`: Create boolean input field
- `formNumberField(config)`: Create boolean input field
- `formSelectField(config)`: Create select field
- `formTextareaField(config)`: Create textarea input field
- `formPasswordField(config)`: Create textarea input field

### Data Components

- `table(config)`: Display tabular data

### Data Fetching Components

- `query(config)`: Fetch and display data
- `mutation(config)`: Execute data mutations

### Presentational Components

- `avatar(config)`: Avatar
- `chip(config)`: Chip, label
- `codeBlock(config)`: Display code snippets
- `image(config)`: Display image

### Overlay Components
- `modal(config)`: Display dialog popup
- `tooltip(config)`: Display tooltip

## Examples

### Creating a Data Table

```javascript
import { table } from "melony";

const data = [
  { id: 1, name: "John", age: 30 },
  { id: 2, name: "Jane", age: 25 },
];

export const UserTable = () => {
  return table({
    columns: [
      { header: "ID", accessorKey: "id" },
      { header: "Name", accessorKey: "name" },
      { header: "Age", accessorKey: "age" },
    ],
    data,
  });
};
```

### Building a Form

```javascript
import { form, button } from "melony";

export const UserForm = () => {
  return form({
    children: [
      formDateField({ name: "date" }),
      formTextField({ name: "title" }),
      button({ label: "Submit" }),
    ],
    onSubmit: async (data) => {
      console.log("Form submitted:", data);
    },
  });
};
```

## License

MIT
