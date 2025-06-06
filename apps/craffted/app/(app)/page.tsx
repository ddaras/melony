import { vstack } from "melony";
import { getProjects } from "@/actions/projects";
import { ProjectItem } from "@/components/projects/project-item";

export default async function Home() {
  const projects = await getProjects();

  return vstack({
    className: "container mx-auto max-w-screen-lg mt-20",
    children: [
      vstack({
        children: projects.map((project) => (
          <ProjectItem key={project.id} project={project} />
        )),
      }),
    ],
  });
}
