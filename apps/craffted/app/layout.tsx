import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { root } from "melony";
import { redirect } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CRAFFTED",
  description: "Widgets",
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
        className: `h-screen w-full overflow-hidden ${montserrat.variable} ${geistSans.variable} ${geistMono.variable}`,
      })}
    </>
  );
}
