import { Thread } from "../use-melony-store";
import { Text, ListItem } from "../components";
import { useTheme } from "../theme";

export interface ThreadItemProps {
  thread: Thread;
  isActive?: boolean;
}

export function ThreadItem({ thread, isActive = false }: ThreadItemProps) {
  const theme = useTheme();

  return (
    <ListItem
      orientation="horizontal"
      justify="between"
      align="start"
      gap="sm"
      width="100%"
      padding="sm"
      onClickAction={{ type: "switchThread", data: { threadId: thread.id } }}
      style={{
        backgroundColor: isActive ? theme.colors?.muted : "transparent",
      }}
    >
      <Text value={thread.title} />
    </ListItem>
  );
}
