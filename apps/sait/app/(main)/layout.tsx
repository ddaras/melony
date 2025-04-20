"use client";

import { sidebarLayout } from "@/components/sidebar-layout";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return sidebarLayout({ children });
}
