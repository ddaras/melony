import { heading, text, vstack } from "melony";

export default function Page() {
  return vstack({
    children: [
      heading({ content: "Docs" }),
      text({
        content:
          "We are working on it! The documentation is updating periodically.",
      }),
    ],
  });
}
