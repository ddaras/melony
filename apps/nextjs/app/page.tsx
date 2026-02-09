"use client";

import { MelonyRenderer, UINode } from "@melony/ui-kit/client";
import { useMelonyInit, useMelony } from "@melony/react";
import { useEffect } from "react";

export default function Home() {
  const { reset } = useMelony();
  const { data, loading, error } = useMelonyInit("/api/chat", { 
    platform: "web" 
  });

  useEffect(() => {
    if (data?.initialEvents) {
      reset(data.initialEvents);
    }
  }, [data?.initialEvents, reset]);

  const uiTree = data?.data as UINode | null;

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

