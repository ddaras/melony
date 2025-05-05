import type { Metadata } from "next";
import "./globals.css";
import { root } from "melony";
import { redirect } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: {
    default: "Melony Documentation",
    template: "%s | Melony Docs",
  },
  description:
    "Flutter inspired React UI library - Comprehensive documentation and guides",
  keywords: ["React", "UI Library", "Flutter", "Components", "Documentation"],
  authors: [{ name: "Melony Team" }],
  creator: "Melony Team",
  publisher: "Melony",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://docs.melony.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://docs.melony.dev",
    title: "Melony Documentation",
    description:
      "Flutter inspired React UI library - Comprehensive documentation and guides",
    siteName: "Melony Docs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Melony Documentation",
    description:
      "Flutter inspired React UI library - Comprehensive documentation and guides",
    creator: "@melony",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification",
  },
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
        navigate: async (path) => {
          "use server";
          redirect(path);
        },
      })}
      <Analytics />
    </>
  );
}
