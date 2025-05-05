import { card, codeBlock, heading, table, tabs, text, vstack } from "melony";

const exmapleCode = `tabs({
  tabs: [
    {
      label: "Tab 1",
      content: "Tab 1 content",
    },
    {
      label: "Tab 2",
      content: "Tab 2 content",
    },
  ],
})`;

export default function Page() {
  return vstack({
    className: "gap-6 container max-w-4xl mx-auto p-8",
    children: [
      heading({ content: "Tabs" }),
      text({
        content: "Tabs is a component that displays a list of tabs.",
      }),
      card({
        className: "flex flex-col gap-8",
        children: [
          tabs({
            tabs: [
              {
                label: "Tab 1",
                content: "Tab 1 content",
              },
              {
                label: "Tab 2",
                content: "Tab 2 content",
              },
            ],
          }),
          codeBlock({
            lang: "ts",
            code: exmapleCode,
          }),
        ],
      }),
      heading({ content: "Config", variant: "h4" }),
      table({
        data: [
          {
            name: "tabs",
            type: "TabConfig[]",
            description: "The tabs to display",
          },
          {
            name: "className",
            type: "string",
            description: "The class name to apply to the tabs",
          },
        ],
        columns: [
          {
            header: "Name",
            accessorKey: "name",
            size: 140,
          },
          {
            header: "Type",
            accessorKey: "type",
            size: 300,
          },
          {
            header: "Description",
            accessorKey: "description",
          },
        ],
      }),
      heading({ content: "TabConfig", variant: "h4" }),
      table({
        columns: [
          {
            header: "Name",
            accessorKey: "name",
            size: 140,
          },
          {
            header: "Type",
            accessorKey: "type",
            size: 300,
          },
          {
            header: "Description",
            accessorKey: "description",
          },
        ],
        data: [
          {
            name: "label",
            type: "string",
            description: "The text to display",
          },
          {
            name: "content",
            type: "React.ReactNode",
            description: "The content to display",
          },
          {
            name: "disabled",
            type: "boolean",
            description: "Whether the tab is disabled",
          },
          {
            name: "description",
            type: "string",
            description: "The description to display",
          },
          {
            name: "footer",
            type: "React.ReactNode",
            description: "The footer to display",
          },
        ],
      }),
    ],
  });
}
