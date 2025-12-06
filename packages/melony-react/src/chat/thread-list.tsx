import { useMelonyThreads } from "../use-melony-threads";
import { ThreadItem } from "./thread-item";
import { Text, List, Button, Col } from "../components";

export interface ThreadListProps {
  onThreadSelect?: (threadId: string) => void;
  onNewThread?: () => void;
  showNewThreadButton?: boolean;
  storageKey?: string;
}

export function ThreadList({
  onThreadSelect,
  onNewThread,
  showNewThreadButton = true,
  storageKey,
}: ThreadListProps) {
  const { threads, activeThreadId, createThread, switchThread, deleteThread } =
    useMelonyThreads({
      storageKey,
      onThreadChange: (threadId) => {
        if (onThreadSelect) {
          onThreadSelect(threadId);
        }
      },
    });

  return (
    <Col gap="md" width="100%" height="100%" overflow="hidden" padding="md">
      {showNewThreadButton && (
        <Button
          onClickAction={{ type: "createThread" }}
          label="New Thread"
          variant="primary"
        />
      )}

      <Col width="100%" height="100%" overflow="auto">
        {threads.length === 0 ? (
          <Text
            value="No threads yet. Create a new thread to get started."
            size="sm"
            color="mutedForeground"
            align="center"
          />
        ) : (
          <List width="100%">
            {threads.map((thread) => (
              <ThreadItem key={thread.id} thread={thread} />
            ))}
          </List>
        )}
      </Col>
    </Col>
  );
}
