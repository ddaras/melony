"use client";

import { useEffect, useState } from "react";
import { MelonyRenderer, UINode } from "@melony/ui-kit/client";

export default function Home() {
  const [uiTree, setUiTree] = useState<UINode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initApp() {
      try {
        const response = await fetch("/api/chat?platform=web");
        const data = await response.json();
        setUiTree(data);
      } catch (error) {
        console.error("Failed to initialize SDUI:", error);
      } finally {
        setLoading(false);
      }
    }

    initApp();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!uiTree) {
    return <div>Failed to load UI</div>;
  }

  return (
    <MelonyRenderer node={uiTree} />
  );
}

