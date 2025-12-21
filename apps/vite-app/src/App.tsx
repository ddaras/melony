import { MelonyClient, createHttpTransport } from "@melony/core/client";
import {
  AccountDialog,
  AuthProvider,
  ChatPopup,
  MelonyClientProvider,
  ThreadProvider,
  ChatFull,
} from "@melony/react";
import { ThemeProvider } from "./components/theme-provider";
import { ThemeToggle } from "./components/theme-toggle";
import { STARTER_PROMPTS } from "./lib/starter-prompts";
import { createMelonyThreadService } from "./lib/services/thread-service";
import { createMelonyAuthService } from "./lib/services/auth-service";

const client = new MelonyClient(
  createHttpTransport("http://localhost:3000/api/v1/chat")
);

const threadService = createMelonyThreadService();
const authService = createMelonyAuthService();

export function App() {
  return (
    <ThemeProvider>
      <MelonyClientProvider client={client}>
        <AuthProvider service={authService}>
          <ThreadProvider service={threadService}>
            <div className="flex flex-col h-screen relative bg-background">
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <ThemeToggle />
                <AccountDialog />
              </div>

              <main className="flex-1 overflow-hidden">
                <ChatFull starterPrompts={STARTER_PROMPTS} />
              </main>

              <ChatPopup starterPrompts={STARTER_PROMPTS} />
            </div>
          </ThreadProvider>
        </AuthProvider>
      </MelonyClientProvider>
    </ThemeProvider>
  );
}

export default App;
