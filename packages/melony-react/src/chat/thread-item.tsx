import { Thread } from "../use-melony-threads";
import { Text, ListItem } from "../components";

export interface ThreadItemProps {
  thread: Thread;
}

export function ThreadItem({ thread }: ThreadItemProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return "Today";
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <ListItem
      orientation="horizontal"
      justify="between"
      align="start"
      gap="sm"
      width="100%"
      padding="sm"
      onClickAction={{ type: "switchThread", data: { threadId: thread.id } }}
    >
      <Text value={thread.title} />
    </ListItem>
  );
}
