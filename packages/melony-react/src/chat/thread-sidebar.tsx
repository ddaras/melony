import { useTheme } from "../theme";
import { ThreadList } from "./thread-list";
import { Col } from "../components";
import { Thread } from "../use-melony-store";

export interface ThreadSidebarProps {
  threads: Thread[];
  activeThreadId: string | null;
  width?: number | string;
  className?: string;
}

export function ThreadSidebar({
  threads,
  activeThreadId,
  width = 280,
}: ThreadSidebarProps) {
  const theme = useTheme();

  return (
    <Col
      width={width}
      height="100%"
      overflow="hidden"
      flex={"unset"}
      style={{ backgroundColor: theme.colors?.cardBackground || "#ffffff" }}
    >
      <ThreadList threads={threads} activeThreadId={activeThreadId} />
    </Col>
  );
}
