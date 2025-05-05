import type { Metadata } from "next";
import "./globals.css";
import { root } from "melony";
import { redirect } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Melony",
  description: "Flutter inspired React UI library",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {root({
        children: [children],
        shouldRenderHtml: true,
        // className: geistSans.className + " " + geistMono.className,
        navigate: async (path) => {
          "use server";
          redirect(path);
        },
      })}

      <Analytics />
    </>
  );
}
