import { MelonyProvider, useMelonyInit } from "@melony/react";
import { MelonyRenderer, MelonyUIProvider, type UINode } from "@melony/ui-kit";
import { shadcnElements, ThemeProvider } from "@melony/ui-shadcn";
import { MelonyClient } from "melony/client";

const BASE_URL = "http://localhost:4001";

const melonyClient = new MelonyClient({
  url: `${BASE_URL}/api/chat`,
})

export function App() {
  return (
    <MelonyProvider client={melonyClient} eventHandlers={{
      "client:navigate": (event) => {
        console.log("Navigating to:", event.data.path);
        // push without reloading the page
        window.history.pushState({}, "", event.data.path);
        return;
      }
    }}>
      <MelonyUIProvider components={{ ...shadcnElements }}>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </MelonyUIProvider>
    </MelonyProvider>
  )
}

export function AppContent() {
  const { data, loading, error } = useMelonyInit(`${BASE_URL}/api/init`, {
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

export default App
