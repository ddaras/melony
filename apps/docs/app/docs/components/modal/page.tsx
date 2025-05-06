"use client";

import {
  card,
  codeBlock,
  heading,
  hstack,
  table,
  text,
  vstack,
  modal,
} from "melony";

const exampleCode = `modal({
  label: "Open Settings",
  title: "Settings", 
  description: "Configure your application settings",
  content: ({ close }) => (
    <div className="space-y-4">
      <div>
        <label>Theme</label>
        <select>
          <option>Light</option>
          <option>Dark</option>
        </select>
      </div>
      <div>
        <label>Language</label>
        <select>
          <option>English</option>
          <option>Spanish</option>
        </select>
      </div>
      <button onClick={close}>Save Changes</button>
    </div>
  ),
});`;

export default function Page() {
  return vstack({
    className: "gap-6 container max-w-4xl mx-auto p-8",
    children: [
      heading({ content: "Modal Button" }),
      text({
        content:
          "Modal Button is a component that displays a button which opens a modal dialog when clicked.",
      }),
      card({
        className: "flex flex-col gap-8",
        children: [
          hstack({
            children: [
              modal({
                label: "Open Modal",
                title: "Example Modal",
                description: "This is an example modal",
                content: ({ close }) => (
                  <div className="space-y-4">
                    <p>Modal content goes here</p>
                    <button onClick={close}>Close</button>
                  </div>
                ),
              }),
            ],
          }),
          codeBlock({
            lang: "ts",
            code: exampleCode,
          }),
        ],
      }),
      heading({ content: "Config", variant: "h4" }),
      table({
        data: [
          {
            name: "label",
            type: "string",
            description: "The text to display on the button",
          },
          {
            name: "title",
            type: "string",
            description: "The title of the modal dialog",
          },
          {
            name: "description",
            type: "string",
            description: "Optional description text for the modal",
          },
          {
            name: "content",
            type: "({ close: () => void }) => React.ReactNode",
            description:
              "A function that receives a close function and returns the modal content",
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
    ],
  });
}
