import { MelonyClient } from "melony/client";
import {
  AccountDialog,
  AuthProvider,
  ChatPopup,
  MelonyClientProvider,
  ThreadProvider,
  ChatFull,
  CreateThreadButton,
  ThreadList,
  ThemeProvider,
  ThemeToggle,
  SidebarToggle,
  Button,
} from "@melony/react";
import { createMelonyThreadService } from "./lib/services/thread-service";
import {
  createMelonyAuthService,
  TOKEN_STORAGE_KEY,
} from "./lib/services/auth-service";
import { ui } from "melony";

const CHAT_API_URL = "http://localhost:3006/api/agent";

const client = new MelonyClient({
  url: CHAT_API_URL,
  headers: () => ({
    Authorization: `Bearer ${localStorage.getItem(TOKEN_STORAGE_KEY)}`,
  }),
});

const threadService = createMelonyThreadService();
const authService = createMelonyAuthService();

export function App() {
  return (
    <ThemeProvider>
      <MelonyClientProvider client={client}>
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
          welcomeScreenProps={{
            title: "Welcome to Craffted",
            description:
              "The most powerful AI agent framework for building modern applications. Connect your tools, build your brain, and ship faster.",
            imageUrl: "https://img.freepik.com/free-vector/gradient-mosaic-instagram-posts-with-photo_23-2149064043.jpg?semt=ais_hybrid&w=740&q=80",
            imageAlt: "Craffted logo",
          }}
          showWelcomeScreen={true}
          leftSidebar={
            <div className="w-[18rem]">
              <ThreadList />
            </div>
          }
          headerProps={{
            leftContent: (
              <div className="flex gap-1 items-center">
                <Button
                  onClickAction={ui.actions.navigate("/")}
                  variant="ghost"
                  label="Craffted"
                  className="font-bold tracking-wider"
                />
                <SidebarToggle side="left" />
                {/* <CreateThreadButton /> */}
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
