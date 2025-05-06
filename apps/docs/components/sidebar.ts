"use client";

import { button, heading, spacer } from "melony";
import { vstack } from "melony";
import { usePathname, useRouter } from "next/navigation";

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  return vstack({
    className:
      "w-64 px-4 pb-20 pt-4 fixed top-12 left-0 bottom-0 overflow-y-auto",
    children: [
      button({
        label: "Introduction",
        className: "justify-start",
        onClick: () => {
          router.push("/docs");
        },
        variant: pathname === "/docs" ? "outline" : "ghost",
      }),
      button({
        label: "Installation",
        className: "justify-start",
        onClick: () => {
          router.push("/docs/install");
        },
        variant: pathname.includes("/docs/install") ? "outline" : "ghost",
      }),
      button({
        label: "Core Concepts",
        className: "justify-start",
        onClick: () => {
          router.push("/docs/core-concepts");
        },
        variant: pathname.includes("/docs/core-concepts")
          ? "outline"
          : "ghost",
      }),
      spacer(),
      heading({
        content: "Layout",
        variant: "h6",
        className: "p-4 border-b opacity-50",
      }),
      button({
        label: "vstack",
        className: "justify-start",
        onClick: () => {
          router.push("/docs/components/vstack");
        },
        variant: pathname.includes("/docs/components/vstack")
          ? "outline"
          : "ghost",
      }),
      button({
        label: "hstack",
        className: "justify-start",
        onClick: () => {
          router.push("/docs/components/hstack");
        },
        variant: pathname.includes("/docs/components/hstack")
          ? "outline"
          : "ghost",
      }),
      button({
        label: "spacer",
        className: "justify-start",
        onClick: () => {
          router.push("/docs/components/spacer");
        },
        variant: pathname.includes("/docs/components/spacer")
          ? "outline"
          : "ghost",
      }),
      spacer(),
      heading({
        content: "Basics",
        variant: "h6",
        className: "p-4 border-b opacity-50",
      }),
      button({
        label: "text",
        onClick: () => {
          router.push("/docs/components/text");
        },
        className: "justify-start",
        variant: pathname.includes("/docs/components/text")
          ? "outline"
          : "ghost",
      }),
      button({
        label: "heading",
        onClick: () => {
          router.push("/docs/components/heading");
        },
        className: "justify-start",
        variant: pathname.includes("/docs/components/heading")
          ? "outline"
          : "ghost",
      }),
      button({
        label: "button",
        className: "justify-start",
        onClick: () => {
          router.push("/docs/components/button");
        },
        variant: pathname.includes("/docs/components/button")
          ? "outline"
          : "ghost",
      }),
      button({
        label: "tabs",
        className: "justify-start",
        onClick: () => {
          router.push("/docs/components/tabs");
        },
        variant: pathname.includes("/docs/components/tabs")
          ? "outline"
          : "ghost",
      }),
      button({
        label: "card",
        className: "justify-start",
        onClick: () => {
          router.push("/docs/components/card");
        },
        variant: pathname.includes("/docs/components/card")
          ? "outline"
          : "ghost",
      }),
      button({
        label: "themeToggle",
        className: "justify-start",
        onClick: () => {
          router.push("/docs/components/theme-toggle");
        },
        variant: pathname.includes("/docs/components/theme-toggle")
          ? "outline"
          : "ghost",
      }),
      spacer(),
      heading({
        content: "Inputs",
        variant: "h6",
        className: "p-4 border-b opacity-50",
      }),
      button({
        label: "form",
        className: "justify-start",
        onClick: () => {
          router.push("/docs/components/form");
        },
        variant: pathname === "/docs/components/form" ? "outline" : "ghost",
      }),
      button({
        label: "formTextField",
        className: "justify-start",
        onClick: () => {
          router.push("/docs/components/form-text-field");
        },
        variant: pathname.includes("/docs/components/form-text-field")
          ? "outline"
          : "ghost",
      }),
      button({
        label: "formComboboxField",
        className: "justify-start",
        onClick: () => {
          router.push("/docs/components/form-combobox-field");
        },
        variant: pathname.includes("/docs/components/form-combobox-field")
          ? "outline"
          : "ghost",
      }),
      button({
        label: "formDateField",
        className: "justify-start",
        onClick: () => {
          router.push("/docs/components/form-date-field");
        },
        variant: pathname.includes("/docs/components/form-date-field")
          ? "outline"
          : "ghost",
      }),
      button({
        label: "formBooleanField",
        className: "justify-start",
        onClick: () => {
          router.push("/docs/components/form-boolean-field");
        },
        variant: pathname.includes("/docs/components/form-boolean-field")
          ? "outline"
          : "ghost",
      }),
      button({
        label: "formNumberField",
        className: "justify-start",
        onClick: () => {
          router.push("/docs/components/form-number-field");
        },
        variant: pathname.includes("/docs/components/form-number-field")
          ? "outline"
          : "ghost",
      }),
      button({
        label: "formSelectField",
        className: "justify-start",
        onClick: () => {
          router.push("/docs/components/form-select-field");
        },
        variant: pathname.includes("/docs/components/form-select-field")
          ? "outline"
          : "ghost",
      }),
      button({
        label: "formTextareaField",
        className: "justify-start",
        onClick: () => {
          router.push("/docs/components/form-textarea-field");
        },
        variant: pathname.includes("/docs/components/form-textarea-field")
          ? "outline"
          : "ghost",
      }),
      button({
        label: "formPasswordField",
        className: "justify-start",
        onClick: () => {
          router.push("/docs/components/form-password-field");
        },
        variant: pathname.includes("/docs/components/form-password-field")
          ? "outline"
          : "ghost",
      }),
      spacer(),
      heading({
        content: "Data",
        variant: "h6",
        className: "p-4 border-b opacity-50",
      }),
      button({
        label: "table",
        className: "justify-start",
        onClick: () => {
          router.push("/docs/components/table");
        },
        variant: pathname.includes("/docs/components/table")
          ? "outline"
          : "ghost",
      }),
      spacer(),
      heading({
        content: "Presentation",
        variant: "h6",
        className: "p-4 border-b opacity-50",
      }),
      button({
        label: "avatar",
        className: "justify-start",
        onClick: () => {
          router.push("/docs/components/avatar");
        },
        variant: pathname.includes("/docs/components/avatar")
          ? "outline"
          : "ghost",
      }),
      button({
        label: "chip",
        className: "justify-start",
        onClick: () => {
          router.push("/docs/components/chip");
        },
        variant: pathname.includes("/docs/components/chip")
          ? "outline"
          : "ghost",
      }),
      button({
        label: "codeBlock",
        className: "justify-start",
        onClick: () => {
          router.push("/docs/components/code-block");
        },
        variant: pathname.includes("/docs/components/code-block")
          ? "outline"
          : "ghost",
      }),
      button({
        label: "image",
        className: "justify-start",
        onClick: () => {
          router.push("/docs/components/image");
        },
        variant: pathname.includes("/docs/components/image")
          ? "outline"
          : "ghost",
      }),
      spacer(),
      heading({
        content: "Overlays",
        variant: "h6",
        className: "p-4 border-b opacity-50",
      }),
      button({
        label: "modal",
        className: "justify-start",
        onClick: () => {
          router.push("/docs/components/modal");
        },
        variant: pathname.includes("/docs/components/modal")
          ? "outline"
          : "ghost",
      }),
      button({
        label: "tooltip",
        className: "justify-start",
        onClick: () => {
          router.push("/docs/components/tooltip");
        },
        variant: pathname.includes("/docs/components/tooltip")
          ? "outline"
          : "ghost",
      }),
      spacer(),
      heading({
        content: "Feedbacks",
        variant: "h6",
        className: "p-4 border-b opacity-50",
      }),
      button({
        label: "loader",
        className: "justify-start",
        onClick: () => {
          router.push("/docs/components/loader");
        },
        variant: pathname.includes("/docs/components/loader")
          ? "outline"
          : "ghost",
      }),
      button({
        label: "progress",
        className: "justify-start",
        onClick: () => {
          router.push("/docs/components/progress");
        },
        variant: pathname.includes("/docs/components/progress")
          ? "outline"
          : "ghost",
      }),
      button({
        label: "toast",
        className: "justify-start",
        onClick: () => {
          router.push("/docs/components/toast");
        },
        variant: pathname.includes("/docs/components/toast")
          ? "outline"
          : "ghost",
      }),
    ],
  });
};
