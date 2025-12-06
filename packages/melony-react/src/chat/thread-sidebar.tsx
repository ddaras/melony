import { useTheme } from "../theme";
import { ThreadList } from "./thread-list";
import { Heading } from "../components/Heading";
import { Box, Col } from "../components";

export interface ThreadSidebarProps {
  onThreadSelect?: (threadId: string) => void;
  onNewThread?: () => void;
  width?: number | string;
  className?: string;
  storageKey?: string;
}

export function ThreadSidebar({
  onThreadSelect,
  onNewThread,
  width = 280,
  storageKey,
}: ThreadSidebarProps) {
  const theme = useTheme();

  return (
    <Col width={width} height="100%" overflow="hidden" flex={"unset"}>
      <Box padding="md">
        <Heading value="Threads" level={2} />
      </Box>

      <ThreadList
        onThreadSelect={onThreadSelect}
        onNewThread={onNewThread}
        storageKey={storageKey}
      />
    </Col>
  );
}
