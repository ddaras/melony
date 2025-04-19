import { hstack, text, vstack } from "melony";

export default function Home() {
  return vstack()
    .children([
      hstack().children([text("Melony Docs"), text("Home"), text("Docs")]),
    ])
    .className("border-b px-4 h-12");
}
