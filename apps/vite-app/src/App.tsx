import { MelonyClient } from "melony/client";
import {
  AccountDialog,
  AuthProvider,
  PopupChat,
  MelonyClientProvider,
  ThreadProvider,
  FullChat,
  CreateThreadButton,
  ThreadList,
  ThemeProvider,
  ThemeToggle,
  SidebarToggle,
  Button,
  SidebarProvider,
  Sidebar,
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
        <AuthProvider
          service={authService}
          welcomeScreenProps={{
            title: "Welcome to Craffted",
            description:
              "The most powerful AI agent framework for building modern applications. Connect your tools, build your brain, and ship faster.",
            imageUrl:
              "https://img.freepik.com/free-vector/gradient-mosaic-instagram-posts-with-photo_23-2149064043.jpg?semt=ais_hybrid&w=740&q=80",
            imageAlt: "Craffted logo",
          }}
        >
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
    <SidebarProvider>
      <div className="flex h-screen relative bg-background overflow-hidden">
        <Sidebar side="left" className="2xl:w-[18rem] w-[16rem]">
          <div className="flex gap-1 items-center justify-between w-full p-2">
            <Button
              onClickAction={ui.actions.navigate("/")}
              variant="ghost"
              size="lg"
              label="Craffted"
              className="font-bold tracking-wider"
            />
            {/* <CreateThreadButton /> */}
          </div>

          <div className="p-2">
            <CreateThreadButton />
          </div>

          <ThreadList />
        </Sidebar>
        <main className="flex-1 overflow-hidden">
          <FullChat
            headerProps={{
              leftContent: (
                <>
                  <SidebarToggle side="left" />
                </>
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

        <PopupChat />
      </div>
    </SidebarProvider>
  );
};
