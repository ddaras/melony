import { getPages } from "@/actions/pages";
import { PageItem } from "@/components/pages/page-item";
import { heading, hstack, vstack } from "melony";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  const pages = await getPages(projectId);

  return vstack({
    className: "container mx-auto max-w-screen-lg mt-20 gap-8",
    children: [
      heading({ content: "Pages" }),
      hstack({
        children: pages.map((page) => <PageItem key={page.id} page={page} />),
      }),
    ],
  });
}
