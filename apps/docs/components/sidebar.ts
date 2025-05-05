"use client";

import { heading, spacer } from "melony";
import { navigationButton, vstack } from "melony";
import { usePathname } from "next/navigation";

export const Sidebar = () => {
  const pathname = usePathname();

  return vstack({
    className:
      "w-64 px-4 pb-20 pt-4 fixed top-12 left-0 bottom-0 overflow-y-auto",
    children: [
      navigationButton({
        label: "Introduction",
        className: "justify-start",
        href: "/docs",
        variant: pathname === "/docs" ? "secondary" : "ghost",
      }),
      navigationButton({
        label: "Installation",
        className: "justify-start",
        href: "/docs/install",
        variant: pathname.includes("/docs/install") ? "secondary" : "ghost",
      }),
      navigationButton({
        label: "Core Concepts",
        className: "justify-start",
        href: "/docs/core-concepts",
        variant: pathname.includes("/docs/core-concepts")
          ? "secondary"
          : "ghost",
      }),
      spacer(),
      heading({
        content: "Basics",
        variant: "h6",
        className: "p-4 border-b opacity-50",
      }),
      navigationButton({
        label: "text",
        href: "/docs/components/text",
        className: "justify-start",
        variant: pathname.includes("/docs/components/text")
          ? "secondary"
          : "ghost",
      }),
      navigationButton({
        label: "heading",
        href: "/docs/components/heading",
        className: "justify-start",
        variant: pathname.includes("/docs/components/heading")
          ? "secondary"
          : "ghost",
      }),
      navigationButton({
        label: "button",
        className: "justify-start",
        href: "/docs/components/button",
        variant: pathname.includes("/docs/components/button")
          ? "secondary"
          : "ghost",
      }),
      navigationButton({
        label: "tabs",
        className: "justify-start",
        href: "/docs/components/tabs",
        variant: pathname.includes("/docs/components/tabs")
          ? "secondary"
          : "ghost",
      }),
      navigationButton({
        label: "card",
        className: "justify-start",
        href: "/docs/components/card",
        variant: pathname.includes("/docs/components/card")
          ? "secondary"
          : "ghost",
      }),
      navigationButton({
        label: "themeToggle",
        className: "justify-start",
        href: "/docs/components/theme-toggle",
        variant: pathname.includes("/docs/components/theme-toggle")
          ? "secondary"
          : "ghost",
      }),
      spacer(),
      heading({
        content: "Inputs",
        variant: "h6",
        className: "p-4 border-b opacity-50",
      }),
      navigationButton({
        label: "form",
        className: "justify-start",
        href: "/docs/components/form",
        variant: pathname === "/docs/components/form" ? "secondary" : "ghost",
      }),
      navigationButton({
        label: "formTextField",
        className: "justify-start",
        href: "/docs/components/form-text-field",
        variant: pathname.includes("/docs/components/form-text-field")
          ? "secondary"
          : "ghost",
      }),
      navigationButton({
        label: "formComboboxField",
        className: "justify-start",
        href: "/docs/components/form-combobox-field",
        variant: pathname.includes("/docs/components/form-combobox-field")
          ? "secondary"
          : "ghost",
      }),
      navigationButton({
        label: "formDateField",
        className: "justify-start",
        href: "/docs/components/form-date-field",
        variant: pathname.includes("/docs/components/form-date-field")
          ? "secondary"
          : "ghost",
      }),
      spacer(),
      heading({
        content: "Layout",
        variant: "h6",
        className: "p-4 border-b opacity-50",
      }),
      navigationButton({
        label: "vstack",
        variant: "ghost",
        className: "justify-start",
        href: "/docs/components/vstack",
      }),
      navigationButton({
        label: "hstack",
        variant: "ghost",
        className: "justify-start",
        href: "/docs/components/hstack",
      }),
      navigationButton({
        label: "spacer",
        variant: "ghost",
        className: "justify-start",
        href: "/docs/components/spacer",
      }),
      spacer(),
      heading({
        content: "Data",
        variant: "h6",
        className: "p-4 border-b opacity-50",
      }),
      navigationButton({
        label: "table",
        variant: "ghost",
        className: "justify-start",
        href: "/docs/components/table",
      }),
      spacer(),
      heading({
        content: "Presentation",
        variant: "h6",
        className: "p-4 border-b opacity-50",
      }),
      navigationButton({
        label: "avatar",
        variant: "ghost",
        className: "justify-start",
        href: "/docs/components/avatar",
      }),
      navigationButton({
        label: "chip",
        variant: "ghost",
        className: "justify-start",
        href: "/docs/components/chip",
      }),
      navigationButton({
        label: "codeBlock",
        variant: "ghost",
        className: "justify-start",
        href: "/docs/components/code-block",
      }),
      navigationButton({
        label: "image",
        variant: "ghost",
        className: "justify-start",
        href: "/docs/components/image",
      }),
      spacer(),
      heading({
        content: "Overlays",
        variant: "h6",
        className: "p-4 border-b opacity-50",
      }),
      navigationButton({
        label: "modalButton",
        variant: "ghost",
        className: "justify-start",
        href: "/docs/components/modal-button",
      }),
      navigationButton({
        label: "tooltip",
        variant: "ghost",
        className: "justify-start",
        href: "/docs/components/tooltip",
      }),
      spacer(),
      heading({
        content: "Feedbacks",
        variant: "h6",
        className: "p-4 border-b opacity-50",
      }),
      navigationButton({
        label: "loader",
        variant: "ghost",
        className: "justify-start",
        href: "/docs/components/loader",
      }),
      navigationButton({
        label: "progress",
        variant: "ghost",
        className: "justify-start",
        href: "/docs/components/progress",
      }),
      navigationButton({
        label: "toast",
        variant: "ghost",
        className: "justify-start",
        href: "/docs/components/toast",
      }),
    ],
  });
};
