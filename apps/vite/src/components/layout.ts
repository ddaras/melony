import { root } from "melony";

export const mainLayout = ({ children }: { children: React.ReactNode }) => {
  return root({
    children: [children],
  });
};
