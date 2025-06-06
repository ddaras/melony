import { hstack, vstack } from "melony";
import { Header } from "./header";

export const StackedLayout = ({ children }: { children: React.ReactNode }) => {
  return vstack({
    className:
      "h-screen overflow-y-auto w-full " +
      // "bg-[url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=3506&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center bg-no-repeat relative",
      "bg-[url('https://images.unsplash.com/photo-1502252430442-aac78f397426?q=80&w=5184&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center bg-no-repeat relative",
      // "bg-[url('https://images.unsplash.com/photo-1710166755608-58b3d62db3a8?q=80&w=5232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center bg-no-repeat relative",
      // "w-full relative bg-gradient-to-br from-black via-purple-900 to-blue-950",
    children: [
      vstack({
        className: "absolute inset-0",
        children: [],
      }),
      Header(),
      hstack({
        children: [
          vstack({
            children: [children],
            className: `w-full relative`,
          }),
        ],
      }),
    ],
  });
};
