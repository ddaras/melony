"use client";

import { MelonyRenderer, UINode } from "@melony/ui-kit/client";
import { useMelonyInit } from "@melony/react";

export default function Home() {
  const { data, loading, error } = useMelonyInit("/api/chat", { 
    platform: "web" 
  });

  const uiTree = data as UINode | null;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !uiTree) {
    return <div>Failed to load UI</div>;
  }

  return (
    <MelonyRenderer node={uiTree} />
  );
}

