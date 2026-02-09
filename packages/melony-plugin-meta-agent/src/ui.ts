import { MelonyPlugin, Event } from "melony";
import { ui } from "@melony/ui-kit/server";

export interface MetaAgentStatusEvent extends Event {
  type: "meta:status";
  data: { message: string; severity?: "info" | "success" | "error" };
}

export interface MetaAgentSkillLoadedEvent extends Event {
  type: "meta:skill-loaded";
  data: { skillId: string; title: string; instructions: string };
}

export const metaAgentUIPlugin = (): MelonyPlugin<any, any> => (builder) => {
  builder.on("meta:status" as any, async function* (event: MetaAgentStatusEvent) {
    yield ui.event(
      ui.status(event.data.message, event.data.severity)
    );
  });


  builder.on("meta:skill-loaded" as any, async function* (event: MetaAgentSkillLoadedEvent) {
    yield ui.event(
      ui.resourceCard(event.data.title, '', [
        ui.text(event.data.instructions),
      ])
    );
  });
};
