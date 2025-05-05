"use client";

import { stackedLayout } from "@/components/stacked-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return stackedLayout({ children });
}
