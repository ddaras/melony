"use client";

import { cleanLayout } from "@/app/components/clean-layout";

export default function AuthLayout({
  children,
}: {
  children: React.JSX.Element;
}) {
  return cleanLayout(children);
}
