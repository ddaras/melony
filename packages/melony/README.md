# Melony

Melony is an experimental UI library that lets you build data apps rapidly without writing JSX or traditional frontend code.

## Motivation

I love React, but I hate JSX. So I decided to build a simple UI library to build data apps faster without writing a single line of "frontend code".

## Installation

```bash
pnpm add melony
```

## Usage

Melony provides a simple, declarative API for building data applications. Instead of writing JSX, you use JavaScript functions to create UI components.

```javascript
import { root, vstack, table, text } from 'melony';

// Create a simple data app
export default function App() {
  return root([
    vstack([
      text('Hello, Melony!', { level: 'h1' }),
      table(data, {
        columns: [
          { header: 'Name', accessorKey: 'name' },
          { header: 'Age', accessorKey: 'age' }
        ]
      })
    ])
  ]);
}
```

## API Reference

### Layout Components

- `root(children, config)`: The root component for your app
- `vstack(children, config)`: Vertical stack layout
- `hstack(children, config)`: Horizontal stack layout
- `tabs(config)`: Create tabbed interface

### Content Components

- `table(data, config)`: Display tabular data
- `text(content, config)`: Display text content
- `heading(content, config)`: Display headings

### Form Components

- `form(children, config)`: Create forms
- `formField(config)`: Create form fields (supports various types)
- `button(config)`: Create buttons

### Data Components

- `query(config)`: Fetch and display data
- `mutation(config)`: Execute data mutations

## Examples

### Creating a Data Table

```javascript
import { table } from 'melony';

const data = [
  { id: 1, name: 'John', age: 30 },
  { id: 2, name: 'Jane', age: 25 }
];

export const UserTable = () => {
  return table(data, {
    columns: [
      { header: 'ID', accessorKey: 'id' },
      { header: 'Name', accessorKey: 'name' },
      { header: 'Age', accessorKey: 'age' }
    ]
  });
};
```

### Building a Form

```javascript
import { form, button } from 'melony';

export const UserForm = () => {
  return form([
    formField({
      name: 'name',
      label: 'Name',
      type: 'text'
    }),
    formField({
      name: 'email',
      label: 'Email',
      type: 'email'
    }),
    button({
      label: 'Submit',
      submit: true
    })
  ], {
    onSubmit: async (data) => {
      console.log('Form submitted:', data);
    }
  });
};
```

## License

MIT
