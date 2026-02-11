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
        ui.box({ padding: "xs", width: "full" }, [
          ui.box({ padding: "xs" }, [
            ui.listItem({
              padding: "sm",
              onClickAction: {
                type: "client:navigate",
                data: { path: "/" }
              },
              background: "transparent",
            },
              [ui.text("OpenBot", { className: "logo" })]
            ),
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
              background: session.id === sessionId ? "muted" : undefined,
            }, [
              ui.icon("MessageCircleIcon", { size: "sm" }),
              ui.text(session.id.slice(0, 10), { size: "sm" })
            ]))
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
                [
                  ui.icon("SettingsIcon", { size: "sm" }), 
                  ui.text("Settings", { size: "sm" })
                ]
              ),
            ]
          ),
        ]),
      ]),
    ]
  );
