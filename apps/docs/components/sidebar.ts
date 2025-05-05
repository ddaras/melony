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
        content: "Layout",
        variant: "h6",
        className: "p-4 border-b opacity-50",
      }),
      navigationButton({
        label: "vstack",
        className: "justify-start",
        href: "/docs/components/vstack",
        variant: pathname.includes("/docs/components/vstack")
          ? "secondary"
          : "ghost",
      }),
      navigationButton({
        label: "hstack",
        className: "justify-start",
        href: "/docs/components/hstack",
        variant: pathname.includes("/docs/components/hstack")
          ? "secondary"
          : "ghost",
      }),
      navigationButton({
        label: "spacer",
        className: "justify-start",
        href: "/docs/components/spacer",
        variant: pathname.includes("/docs/components/spacer")
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
      navigationButton({
        label: "formBooleanField",
        className: "justify-start",
        href: "/docs/components/form-boolean-field",
        variant: pathname.includes("/docs/components/form-boolean-field")
          ? "secondary"
          : "ghost",
      }),
      navigationButton({
        label: "formNumberField",
        className: "justify-start",
        href: "/docs/components/form-number-field",
        variant: pathname.includes("/docs/components/form-number-field")
          ? "secondary"
          : "ghost",
      }),
      navigationButton({
        label: "formSelectField",
        className: "justify-start",
        href: "/docs/components/form-select-field",
        variant: pathname.includes("/docs/components/form-select-field")
          ? "secondary"
          : "ghost",
      }),
      navigationButton({
        label: "formTextareaField",
        className: "justify-start",
        href: "/docs/components/form-textarea-field",
        variant: pathname.includes("/docs/components/form-textarea-field")
          ? "secondary"
          : "ghost",
      }),
      navigationButton({
        label: "formPasswordField",
        className: "justify-start",
        href: "/docs/components/form-password-field",
        variant: pathname.includes("/docs/components/form-password-field")
          ? "secondary"
          : "ghost",
      }),
      spacer(),
      heading({
        content: "Data",
        variant: "h6",
        className: "p-4 border-b opacity-50",
      }),
      navigationButton({
        label: "table",
        className: "justify-start",
        href: "/docs/components/table",
        variant: pathname.includes("/docs/components/table")
          ? "secondary"
          : "ghost",
      }),
      spacer(),
      heading({
        content: "Presentation",
        variant: "h6",
        className: "p-4 border-b opacity-50",
      }),
      navigationButton({
        label: "avatar",
        className: "justify-start",
        href: "/docs/components/avatar",
        variant: pathname.includes("/docs/components/avatar")
          ? "secondary"
          : "ghost",
      }),
      navigationButton({
        label: "chip",
        className: "justify-start",
        href: "/docs/components/chip",
        variant: pathname.includes("/docs/components/chip")
          ? "secondary"
          : "ghost",
      }),
      navigationButton({
        label: "codeBlock",
        className: "justify-start",
        href: "/docs/components/code-block",
        variant: pathname.includes("/docs/components/code-block")
          ? "secondary"
          : "ghost",
      }),
      navigationButton({
        label: "image",
        className: "justify-start",
        href: "/docs/components/image",
        variant: pathname.includes("/docs/components/image")
          ? "secondary"
          : "ghost",
      }),
      spacer(),
      heading({
        content: "Overlays",
        variant: "h6",
        className: "p-4 border-b opacity-50",
      }),
      navigationButton({
        label: "modalButton",
        className: "justify-start",
        href: "/docs/components/modal-button",
        variant: pathname.includes("/docs/components/modal-button")
          ? "secondary"
          : "ghost",
      }),
      navigationButton({
        label: "tooltip",
        className: "justify-start",
        href: "/docs/components/tooltip",
        variant: pathname.includes("/docs/components/tooltip")
          ? "secondary"
          : "ghost",
      }),
      spacer(),
      heading({
        content: "Feedbacks",
        variant: "h6",
        className: "p-4 border-b opacity-50",
      }),
      navigationButton({
        label: "loader",
        className: "justify-start",
        href: "/docs/components/loader",
        variant: pathname.includes("/docs/components/loader")
          ? "secondary"
          : "ghost",
      }),
      navigationButton({
        label: "progress",
        className: "justify-start",
        href: "/docs/components/progress",
        variant: pathname.includes("/docs/components/progress")
          ? "secondary"
          : "ghost",
      }),
      navigationButton({
        label: "toast",
        className: "justify-start",
        href: "/docs/components/toast",
        variant: pathname.includes("/docs/components/toast")
          ? "secondary"
          : "ghost",
      }),
    ],
  });
};
