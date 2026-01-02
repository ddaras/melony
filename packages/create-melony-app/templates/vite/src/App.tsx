import { MelonyClient } from "melony/client";
import {
  AccountDialog,
  AuthProvider,
  ChatFull,
  MelonyClientProvider,
  ThreadProvider,
} from "@melony/react";
import { ThemeProvider } from "./components/theme-provider";
import { ThemeToggle } from "./components/theme-toggle";
import { STARTER_PROMPTS } from "./lib/starter-prompts";
import { createMelonyThreadService } from "./lib/services/thread-service";
import { createMelonyAuthService } from "./lib/services/auth-service";

const client = new MelonyClient({
  url: "http://localhost:3000/api/chat"
});

const threadService = createMelonyThreadService();
const authService = createMelonyAuthService();

export function App() {
  return (
    <ThemeProvider>
      <MelonyClientProvider client={client}>
        <AuthProvider service={authService}>
          <ThreadProvider service={threadService}>
            <div className="flex flex-col h-screen relative bg-background">
              <main className="flex-1 overflow-hidden">
                <ChatFull
                  starterPrompts={STARTER_PROMPTS}
                  headerProps={{
                    rightContent: (
                      <div className="flex gap-2">
                        <ThemeToggle />
                        <AccountDialog />
                      </div>
                    ),
                  }}
                />
              </main>
            </div>
          </ThreadProvider>
        </AuthProvider>
      </MelonyClientProvider>
    </ThemeProvider>
  );
}

export default App;

