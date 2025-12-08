import { Thread } from "../use-melony-store";
import { ThreadItem } from "./thread-item";
import { Text, List, Button, Col } from "../components";

export interface ThreadListProps {
  threads: Thread[];
  activeThreadId: string | null;
}

export function ThreadList({ threads, activeThreadId }: ThreadListProps) {
  return (
    <Col gap="md" width="100%" height="100%" overflow="hidden">
      <Col width="100%" height="100%" overflow="auto" padding="md" gap="lg">
        <Button
          onClickAction={{ type: "createThread" }}
          label="New Thread"
          variant="primary"
        />

        {threads.length === 0 ? (
          <Text
            value="No threads yet. Create a new thread to get started."
            size="sm"
            align="center"
          />
        ) : (
          <List width="100%">
            {threads.map((thread) => (
              <ThreadItem
                key={thread.id}
                thread={thread}
                isActive={activeThreadId === thread.id}
              />
            ))}
          </List>
        )}
      </Col>
    </Col>
  );
}
