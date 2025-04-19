import {
  heading,
  loader,
  query,
  vstack,
  hstack,
  spacer,
  image,
  text,
  primaryButton,
} from "melony";
import { getCurrentScenarioSession } from "@/lib/actions/scenarios";

const openCardModalButton = (activity: any) => {
  return primaryButton()
    .label("Start")
    .onClick(() => {
      const modalContent = vstack()
        .className("py-4 px-8 gap-4")
        .children([
          heading().title(activity?.article?.title || activity?.test?.title),
          image()
            .src(activity?.article?.main_image || activity?.test?.image)
            .alt(activity?.article?.title || activity?.test?.title),
        ]);

      // @ts-ignore - openModal is injected by the framework
      openModal({
        title: activity?.article?.title || activity?.test?.title,
        content: modalContent,
      });
    });
};

const activityCard = (activity: any) => {
  return hstack()
    .className("w-full space-x-4 border rounded-md")
    .children([
      image()
        .src(activity?.article?.main_image || activity?.test?.image)
        .alt(activity?.article?.title || activity?.test?.title)
        .className("w-40 h-40 rounded-md object-cover"),
      vstack()
        .className("py-4 items-start")
        .children([
          heading().title(activity?.article?.title || activity?.test?.title),
          text().content(activity?.article?.read_time),
          spacer().className("mt-auto w-auto"),
          openCardModalButton(activity),
        ]),
    ]);
};

const weekActivityCard = (weekActivity: any) => {
  return vstack()
    .className("w-full space-y-4")
    .children([
      heading().title(`Week ${weekActivity.week}`),
      ...weekActivity.activities.map((activity: any) => {
        return activityCard(activity);
      }),
    ]);
};

export const activitiesList = () => {
  return query()
    .action(getCurrentScenarioSession)
    .render((query) => {
      if (query.isPending) {
        return loader();
      }

      return vstack()
        .className("w-full space-y-8")
        .children(
          query?.data?.detail?.scenario?.activities?.map(
            (weekActivity: any) => {
              return weekActivityCard(weekActivity);
            }
          )
        );
    });
};
