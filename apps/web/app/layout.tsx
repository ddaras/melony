import "./globals.css";
import type { Metadata } from "next";
import { root } from "melony";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "MentalConnect",
  description: "MentalConnect",
};

export default function RootLayout({
  children,
}: {
  children: React.JSX.Element;
}) {
  return root()
    .appName("MentalConnect")
    .child(children)
    .shouldRenderHtml(true)
    .navigate(async (path) => {
      "use server";
      redirect(path);
    });
}
