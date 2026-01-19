import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ThreadList } from "./thread-list";
import { IconHistory } from "@tabler/icons-react";
import { useHotkeys } from "react-hotkeys-hook";

export interface ThreadPopoverProps {
}

export const ThreadPopover: React.FC<ThreadPopoverProps> = ({
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  // Hotkey to toggle popover: Press 'H' to open/close
  // Scopes ensure it doesn't trigger when typing in inputs/textareas
  useHotkeys(
    "h",
    (e: KeyboardEvent) => {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    },
    {
      enableOnFormTags: false, // Don't trigger when typing in form inputs
      enableOnContentEditable: false, // Don't trigger in contenteditable elements
    }
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
        >
          <IconHistory className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0"
        side="bottom"
        align="start"
        sideOffset={8}
      >
        <div className="flex flex-col h-[400px]">
          <ThreadList />
        </div>
      </PopoverContent>
    </Popover>
  );
};
