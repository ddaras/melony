import { heading, vstack } from "melony";

export default function Home() {
  return vstack({
    children: [
      vstack({
        children: [heading({ content: "Home" })],
      }),
    ],
  });
}
