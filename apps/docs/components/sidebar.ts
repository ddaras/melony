"use client";

import { button, heading, spacer } from "melony";
import { vstack } from "melony";
import { usePathname, useRouter } from "next/navigation";

// Sidebar navigation constants
const SIDEBAR_ITEMS = [
  {
    type: "button",
    label: "Introduction",
    route: "/docs",
    exactMatch: true,
  },
  {
    type: "button",
    label: "Installation",
    route: "/docs/install",
  },
  {
    type: "button",
    label: "Core Concepts",
    route: "/docs/core-concepts",
  },
  {
    type: "spacer",
  },
  {
    type: "heading",
    content: "Layout",
  },
  {
    type: "button",
    label: "vstack",
    route: "/docs/components/vstack",
  },
  {
    type: "button",
    label: "hstack",
    route: "/docs/components/hstack",
  },
  {
    type: "button",
    label: "spacer",
    route: "/docs/components/spacer",
  },
  {
    type: "spacer",
  },
  {
    type: "heading",
    content: "Basics",
  },
  {
    type: "button",
    label: "text",
    route: "/docs/components/text",
  },
  {
    type: "button",
    label: "heading",
    route: "/docs/components/heading",
  },
  {
    type: "button",
    label: "button",
    route: "/docs/components/button",
  },
  {
    type: "button",
    label: "tabs",
    route: "/docs/components/tabs",
  },
  {
    type: "button",
    label: "card",
    route: "/docs/components/card",
  },
  {
    type: "button",
    label: "themeToggle",
    route: "/docs/components/theme-toggle",
  },
  {
    type: "spacer",
  },
  {
    type: "heading",
    content: "Inputs",
  },
  {
    type: "button",
    label: "form",
    route: "/docs/components/form",
    exactMatch: true,
  },
  {
    type: "button",
    label: "formTextField",
    route: "/docs/components/form-text-field",
  },
  {
    type: "button",
    label: "formComboboxField",
    route: "/docs/components/form-combobox-field",
  },
  {
    type: "button",
    label: "formDateField",
    route: "/docs/components/form-date-field",
  },
  {
    type: "button",
    label: "formBooleanField",
    route: "/docs/components/form-boolean-field",
  },
  {
    type: "button",
    label: "formNumberField",
    route: "/docs/components/form-number-field",
  },
  {
    type: "button",
    label: "formSelectField",
    route: "/docs/components/form-select-field",
  },
  {
    type: "button",
    label: "formTextareaField",
    route: "/docs/components/form-textarea-field",
  },
  {
    type: "button",
    label: "formPasswordField",
    route: "/docs/components/form-password-field",
  },
  {
    type: "spacer",
  },
  {
    type: "heading",
    content: "Data",
  },
  {
    type: "button",
    label: "table",
    route: "/docs/components/table",
  },
  {
    type: "spacer",
  },
  {
    type: "heading",
    content: "Presentation",
  },
  {
    type: "button",
    label: "avatar",
    route: "/docs/components/avatar",
  },
  {
    type: "button",
    label: "chip",
    route: "/docs/components/chip",
  },
  {
    type: "button",
    label: "codeBlock",
    route: "/docs/components/code-block",
  },
  {
    type: "button",
    label: "image",
    route: "/docs/components/image",
  },
  {
    type: "spacer",
  },
  {
    type: "heading",
    content: "Overlays",
  },
  {
    type: "button",
    label: "modal",
    route: "/docs/components/modal",
  },
  {
    type: "button",
    label: "tooltip",
    route: "/docs/components/tooltip",
  },
  {
    type: "spacer",
  },
  {
    type: "heading",
    content: "Feedbacks",
  },
  {
    type: "button",
    label: "loader",
    route: "/docs/components/loader",
  },
  {
    type: "button",
    label: "progress",
    route: "/docs/components/progress",
  },
  {
    type: "button",
    label: "toast",
    route: "/docs/components/toast",
  },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const renderSidebarItem = (item: any, index: number) => {
    switch (item.type) {
      case "button":
        const isActive = item.exactMatch
          ? pathname === item.route
          : pathname.includes(item.route);

        return button({
          label: item.label,
          className: "justify-start",
          onClick: () => router.push(item.route),
          variant: isActive ? "outline" : "ghost",
        });

      case "heading":
        return heading({
          content: item.content,
          variant: "h6",
          className: "p-4 border-b opacity-50",
        });

      case "spacer":
        return spacer();

      default:
        return null;
    }
  };

  return vstack({
    className:
      "w-64 px-4 pb-20 pt-4 fixed top-12 left-0 bottom-0 overflow-y-auto",
    children: SIDEBAR_ITEMS.map(renderSidebarItem),
  });
};
