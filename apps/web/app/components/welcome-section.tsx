import { getCurrentScenarioSession } from "@/lib/actions/scenarios";
import { vstack, heading, text, progress, query, melony, button } from "melony";

export const welcomeSection = () => {
  return query()
    .action(getCurrentScenarioSession)
    .render((query) =>
      vstack()
        .className("space-y-4")
        .children([
          heading().title("Welcome"),
          text().content("This is a welcome section"),
          heading().title(
            `${query.data?.detail?.scenario?.progress_percent || 0}%`
          ),
          progress().value(query.data?.detail?.scenario?.progress_percent || 0),
        ])
    );
};
