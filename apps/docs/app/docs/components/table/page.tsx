"use client";

import {
  table,
  card,
  codeBlock,
  heading,
  text,
  vstack,
} from "melony";

const exampleCode = `table({
  data: [
    { name: "John Doe", age: 30, email: "john@example.com" },
    { name: "Jane Smith", age: 25, email: "jane@example.com" },
    { name: "Bob Johnson", age: 35, email: "bob@example.com" },
  ],
  columns: [
    {
      header: "Name",
      accessorKey: "name",
      size: 140,
    },
    {
      header: "Age",
      accessorKey: "age",
      size: 100,
    },
    {
      header: "Email",
      accessorKey: "email",
    },
  ],
});`;

export default function Page() {
  return vstack({
    className: "gap-6 container max-w-4xl mx-auto p-8",
    children: [
      heading({ content: "Table" }),
      text({
        content:
          "Table is a component that displays data in a structured tabular format with configurable columns.",
      }),
      card({
        className: "flex flex-col gap-8",
        children: [
          table({
            data: [
              { name: "John Doe", age: 30, email: "john@example.com" },
              { name: "Jane Smith", age: 25, email: "jane@example.com" },
              { name: "Bob Johnson", age: 35, email: "bob@example.com" },
            ],
            columns: [
              {
                header: "Name",
                accessorKey: "name",
                size: 140,
              },
              {
                header: "Age",
                accessorKey: "age",
                size: 100,
              },
              {
                header: "Email",
                accessorKey: "email",
              },
            ],
          }),
          codeBlock({
            lang: "ts",
            code: exampleCode,
          }),
        ],
      }),
      heading({ content: "Config", variant: "h4" }),
      card({
        className: "flex flex-col gap-4",
        children: [
          text({
            content: "Table accepts the following configuration options:",
          }),
          vstack({
            className: "gap-2",
            children: [
              text({
                content: "• data: any[] - Array of data objects to display in the table",
              }),
              text({
                content: "• columns: ColumnDef[] - Array of column definitions",
              }),
            ],
          }),
        ],
      }),
      heading({ content: "ColumnDef", variant: "h4" }),
      card({
        className: "flex flex-col gap-4",
        children: [
          text({
            content: "Each column definition accepts the following options:",
          }),
          vstack({
            className: "gap-2",
            children: [
              text({
                content: "• header: string - The text to display in the column header",
              }),
              text({
                content: "• accessorKey: string - The key to access the data in each row",
              }),
              text({
                content: "• size: number - The width of the column in pixels (optional)",
              }),
            ],
          }),
        ],
      }),
    ],
  });
} 