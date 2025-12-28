import { MelonyClient, type TransportFn } from "melony/client";
import {
  AccountDialog,
  AuthProvider,
  ChatPopup,
  MelonyClientProvider,
  ThreadProvider,
  ChatFull,
  ThreadPopover,
  CreateThreadButton,
} from "@melony/react";
import { ThemeProvider } from "./components/theme-provider";
import { ThemeToggle } from "./components/theme-toggle";
import { createMelonyThreadService } from "./lib/services/thread-service";
import {
  createMelonyAuthService,
  TOKEN_STORAGE_KEY,
} from "./lib/services/auth-service";

const CHAT_API_URL = "https://melony-cloud-api-549776254754.us-central1.run.app/api/chat";

const transport: TransportFn = async (request, signal) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  const response = await fetch(CHAT_API_URL, {
    method: "POST",
    body: JSON.stringify(request),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    signal,
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  if (!response.body) throw new Error("No response body");
  return response.body;
};

const client = new MelonyClient(transport);

const threadService = createMelonyThreadService();
const authService = createMelonyAuthService();

export function App() {
  return (
    <ThemeProvider>
      <MelonyClientProvider client={client} configApi={CHAT_API_URL}>
        <AuthProvider service={authService}>
          <ThreadProvider service={threadService}>
            <ChatApp />
          </ThreadProvider>
        </AuthProvider>
      </MelonyClientProvider>
    </ThemeProvider>
  );
}

export default App;

const ChatApp = () => {
  return (
    <div className="flex flex-col h-screen relative bg-background">
      <main className="flex-1 overflow-hidden">
        <ChatFull
          defaultSelectedIds={["square", "vertical"]}
          headerProps={{
            leftContent: (
              <div className="flex gap-2">
                <ThreadPopover />
                <CreateThreadButton />
              </div>
            ),
            rightContent: (
              <div className="flex gap-2">
                <ThemeToggle />
                <AccountDialog />
              </div>
            ),
          }}
        />
      </main>

      <ChatPopup />
    </div>
  );
};
