import * as React from "react";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { useThreads } from "@/hooks/use-threads";
import { cn } from "@/lib/utils";

export interface CreateThreadButtonProps {
  className?: string;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "destructive"
    | "link";
  size?:
    | "default"
    | "xs"
    | "sm"
    | "lg"
    | "icon"
    | "icon-xs"
    | "icon-sm"
    | "icon-lg";
  children?: React.ReactNode;
  onThreadCreated?: (threadId: string) => void;
}

export const CreateThreadButton: React.FC<CreateThreadButtonProps> = ({
  className,
  variant = "ghost",
  size = "default",
  onThreadCreated,
}) => {
  const { createThread } = useThreads();
  const [isCreating, setIsCreating] = React.useState(false);

  const handleCreateThread = async () => {
    if (isCreating) return; // Prevent multiple simultaneous creations
    try {
      setIsCreating(true);
      const threadId = await createThread();
      if (threadId) {
        onThreadCreated?.(threadId);
      }
    } catch (error) {
      console.error("Failed to create thread:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCreateThread}
      disabled={isCreating}
      className={cn(className)}
    >
      <IconPlus className="size-4" />
      New chat
    </Button>
  );
};
