import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ThreadList } from "./thread-list";
import { IconHistory } from "@tabler/icons-react";

export interface ThreadPopoverProps {}

export const ThreadPopover: React.FC<ThreadPopoverProps> = ({}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
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
