import { MelonyClient } from "melony/client";
import {
  AccountButton,
  AuthProvider,
  PopupChat,
  MelonyProvider,
  ThreadProvider,
  FullChat,
  ThemeProvider,
  ThemeToggle,
  SidebarToggle,
  SidebarProvider,
  Sidebar,
  CreateThreadListItem,
  List,
  ListItem,
  ThreadList,
} from "@melony/react";
import { createMelonyThreadService } from "./lib/services/thread-service";
import {
  createMelonyAuthService,
  TOKEN_STORAGE_KEY,
} from "./lib/services/auth-service";
import { ui } from "melony";
import { IconDeviceHeartMonitor } from "@tabler/icons-react";
import { useAuth } from "@melony/react";
import { brandKitUI } from "./ui/brand-kit-form";

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
    <MelonyProvider client={client}>
      <ThemeProvider>
        <AuthProvider
          service={authService}
          // welcomeScreenProps={{
          //   title: "Welcome to Craffted",
          //   description:
          //     "The most powerful AI agent framework for building modern applications. Connect your tools, build your brain, and ship faster.",
          //   imageUrl:
          //     "https://img.freepik.com/free-vector/gradient-mosaic-instagram-posts-with-photo_23-2149064043.jpg?semt=ais_hybrid&w=740&q=80",
          //   imageAlt: "Craffted logo",
          // }}
        >
          <ThreadProvider service={threadService}>
            <ChatApp />
          </ThreadProvider>
        </AuthProvider>
      </ThemeProvider>
    </MelonyProvider>
  );
}

export default App;

const ChatApp = () => {
  const { user } = useAuth();

  const appUserMetadata =
    user?.apps?.find((app: any) => app.id === "rUtMCDbkn3BVBfYp6BHw")
      ?.metadata || {};

  const brandKit = appUserMetadata?.brandKit || {};

  return (
    <SidebarProvider>
      <div className="flex h-screen relative bg-background overflow-hidden">
        <Sidebar side="left" className="2xl:w-[18rem] w-[16rem]">
          <List className="p-2">
            <ListItem
              onClickAction={ui.actions.navigate("/")}
              className="font-bold tracking-wider text-foreground"
            >
              <IconDeviceHeartMonitor className="size-4" />
              Craffted
            </ListItem>
          </List>

          <List className="p-2">
            <CreateThreadListItem />
            <ListItem
              onClickAction={{
                type: "client:open-dialog",
                data: {
                  title: "Brand Kit",
                  description: "Configure your brand kit here",
                  ui: brandKitUI(brandKit),
                },
              }}
            >
              <IconDeviceHeartMonitor className="size-4" /> Brand Kit
            </ListItem>
          </List>

          <ThreadList className="p-2 flex-1 overflow-y-auto" />
        </Sidebar>
        <FullChat
          className="flex-1 overflow-hidden"
          headerProps={{
            leftContent: (
              <>
                <SidebarToggle side="left" />
              </>
            ),
            rightContent: (
              <div className="flex gap-2">
                <ThemeToggle />
                <AccountButton />
              </div>
            ),
          }}
        />

        <PopupChat />
      </div>
    </SidebarProvider>
  );
};
