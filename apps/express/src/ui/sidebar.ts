import { ui } from "@melony/ui-kit";
import { navigationUI } from "./navigation.js";

export const sidebarUI = ({ sessions, sessionId }: { sessions: { id: string; mtime: Date }[]; sessionId?: string }) =>
  ui.box(
    {
      width: 280,
      height: "full",
      overflow: "hidden",
      background: "muted/20",
    },
    [
      ui.col({ width: "full", height: "full" }, [
        ui.box({ padding: "xs" }, [
          ui.row({ justify: "between", align: "center", width: "full" }, [
            ui.button({
              label: "OpenBot",
              variant: "ghost",
              size: "sm",
              onClickAction: {
                type: "client:navigate",
                data: { path: "/" },
              },
            }),
          ]),
        ]),
        ui.col({ width: "full", gap: "sm", padding: "sm" }, [
          navigationUI,
        ]),
        ui.col({ width: "full", flex: 1, padding: "sm", overflow: "auto" }, [
          ui.list({
            gap: "none",
            width: "full",
          }, [
            ...sessions.map((session) => ui.listItem({
              padding: "sm",
              onClickAction: {
                type: "client:navigate",
                data: { path: `/?sessionId=${session.id}` },
              },
              background: session.id === sessionId ? "muted" : "transparent",
            }, [ui.text(session.id.slice(0, 10), { size: "sm" })]))
          ]),
        ]),
        ui.spacer({ size: "xs" }),
        ui.box({ padding: "sm", width: "full" }, [
          ui.list(
            {
              gap: "sm",
              width: "full",
            },
            [
              ui.listItem(
                {
                  padding: "sm",
                  onClickAction: {
                    type: "client:navigate",
                    data: { path: "/?tab=settings" },
                  },
                },
                [ui.text("Settings", { size: "sm" })]
              ),
            ]
          ),
        ]),
      ]),
    ]
  );
