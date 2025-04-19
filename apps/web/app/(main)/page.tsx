"use client";

import { vstack } from "melony";
import { postsTable } from "../components/posts-table";
import { welcomeSection } from "../components/welcome-section";
import { activitiesList } from "../components/activities-list";

export default function Page() {
  return vstack()
    .className("w-full h-full space-y-4")
    .children([welcomeSection(), activitiesList(), postsTable()]);
}
