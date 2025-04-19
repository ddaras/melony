import { hstack, renderUI, text, ui, vstack } from "melony";

// export default function MainLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return vstack().children([
//     hstack()
//       .className("items-center border-b px-4 h-12 gap-8")
//       .children([
//         <>SAIT</>,
//         hstack()
//           .className("flex-1 gap-1")
//           .children([<>Home</>, <>Docs</>]),
//       ]),
//     vstack()
//       .className("container max-w-screen-lg mx-auto p-8")
//       .children([children]),
//   ]);
// }

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return vstack([
    hstack(
      [
        text("YourApp", {
          className: "font-bold",
        }),
        hstack([<div>Home</div>, <div>Docs</div>], {
          className: "flex-1 gap-1",
        }),
      ],
      {
        className: "items-center border-b px-4 h-12 gap-8",
      }
    ),
    vstack([children], {
      className: "container max-w-screen-lg mx-auto p-8",
    }),
  ]);
}
