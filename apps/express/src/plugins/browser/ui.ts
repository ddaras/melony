import { MelonyPlugin } from "melony";
import { BrowserStatusEvent, BrowserStateUpdateEvent } from "./index.js";
import { ui } from "@melony/ui-kit/server";

export const browserUIPlugin = (): MelonyPlugin<any, any> => (builder) => {
  builder.on("browser:status", async function* (event: BrowserStatusEvent) {
    yield ui.event(
      ui.status(event.data.message, event.data.severity)
    );
  });

  builder.on("browser:state-update", async function* (event: BrowserStateUpdateEvent) {
    const { url, title, screenshot } = event.data;

    const children: any[] = [];

    // only yield ui if screenshot is requested
    if (screenshot) {
      children.push(
        ui.image(`data:image/jpeg;base64,${screenshot}`, "Screenshot", { width: "full" })
      );


      children.push(
        ui.row({ justify: "between", padding: "sm" }, [
          ui.row({ gap: "xs" }, [
            ui.button({
              label: "Open Visible",
              size: "xs",
              variant: "outline",
              onClickAction: { type: "action:browser_show" } as any,
            }),
            ui.button({
              label: "Cleanup",
              size: "xs",
              variant: "outline",
              onClickAction: { type: "action:browser_cleanup" } as any,
            }),
          ])
        ])
      );

      yield ui.event(
        ui.resourceCard(title || "Browser View", url, children)
      );
    }
  });
};
