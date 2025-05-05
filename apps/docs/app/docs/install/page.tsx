import { codeBlock, heading, text, vstack } from "melony";

export default function Page() {
  return vstack({
    className: "gap-8 container max-w-4xl mx-auto p-8",
    children: [
      heading({ content: "Install" }),
      text({ content: "Melony requires shadcn/ui to be installed in your project first. Make sure you have shadcn/ui set up before proceeding with Melony installation." }),
      text({ content: "Once shadcn/ui is installed, you can install Melony using npm:" }),
      codeBlock({
        code: "npm i melony",
        lang: "bash",
      }),
    ],
  });
}
