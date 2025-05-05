import { stackedLayout } from "@/components/stacked-layout";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return stackedLayout({ children });
}
