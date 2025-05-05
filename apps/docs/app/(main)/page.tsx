import { exampleForm } from "@/components/example-form";
import { card, codeBlock, heading, table, text, vstack } from "melony";
import { avatarCell } from "@/components/avatar-cell";
import { statusCell } from "@/components/status-cell";

const tableCodeExample = `table({
  data: [
    {
      name: "John Doe",
      email: "john@doe.com",
      phone: "1234567890",
      avatar:
        "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_3.png",
      status: "Active",
    },
    {
      name: "Jane Doe",
      email: "jane@doe.com",
      phone: "1234567890",
      avatar:
        "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_1.png",
      status: "Active",
    },
    {
      name: "Jim Doe",
      email: "jim@doe.com",
      phone: "1234567890",
      avatar:
        "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_2.png",
      status: "Active",
    },
  ],
  columns: [
    {
      header: "Avatar",
      accessorKey: "avatar",
      cell: avatarCell,
      size: 80,
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Phone",
      accessorKey: "phone",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: statusCell,
      size: 100,
    },
  ],
})`;

const formCodeExample = `form({
  onSubmit: (data) => console.log(data),
  children: [
    formTextField({
      name: "name",
      label: "Name",
    }),
    formComboboxField({
      name: "country",
      label: "Country",
      options: [
        { label: "United States", value: "US" },
        { label: "Canada", value: "CA" },
        { label: "Australia", value: "AU" },
      ],
    }),
    formDateField({
      name: "birthday",
      label: "Birthday",
    }),
    button({
      label: "Submit",
      submit: true,
    }),
  ],
})`;

export default function Home() {
  return vstack({
    className: "gap-8 container max-w-4xl mx-auto p-8",
    children: [
      heading({
        content: "Flutter inspired React UI library",
      }),
      text({
        content:
          "Melony is an experimental project that lets you build beautiful, consistent interfaces with just JavaScript functions. No fancy syntax, no steep learning curve - just straightforward code that works.",
      }),
      text({
        content:
          "Let's build a table with Melony to demonstrate how easy it is to use.",
      }),
      card({
        className: "flex flex-col gap-8",
        children: [
          table({
            data: [
              {
                name: "John Doe",
                email: "john@doe.com",
                phone: "1234567890",
                avatar:
                  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_3.png",
                status: "Active",
              },
              {
                name: "Jane Doe",
                email: "jane@doe.com",
                phone: "1234567890",
                avatar:
                  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_1.png",
                status: "Active",
              },
              {
                name: "Jim Doe",
                email: "jim@doe.com",
                phone: "1234567890",
                avatar:
                  "https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_2.png",
                status: "Active",
              },
            ],
            columns: [
              {
                header: "Avatar",
                accessorKey: "avatar",
                cell: avatarCell,
                size: 80,
              },
              {
                header: "Name",
                accessorKey: "name",
              },
              {
                header: "Email",
                accessorKey: "email",
              },
              {
                header: "Phone",
                accessorKey: "phone",
              },
              {
                header: "Status",
                accessorKey: "status",
                cell: statusCell,
                size: 100,
              },
            ],
          }),
          codeBlock({
            lang: "ts",
            code: tableCodeExample,
          }),
        ],
      }),
      heading({ content: "Form" }),
      text({
        content: "Now I will show you how to build a simple form using Melony.",
      }),
      card({
        className: "flex flex-col gap-8",
        children: [
          exampleForm,
          codeBlock({
            lang: "ts",
            code: formCodeExample,
          }),
        ],
      }),
    ],
  });
}
