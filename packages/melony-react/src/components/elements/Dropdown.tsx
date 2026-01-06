import * as React from "react";
import { Button } from "@/components/ui/button";
import { IconDotsVertical } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface DropdownProps {
  className?: string;
  trigger?: React.ReactNode;
  triggerClassName?: string;
  items: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  }[];
}

export const Dropdown: React.FC<DropdownProps> = ({
  className,
  trigger,
  triggerClassName,
  items,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={triggerClassName}
        render={(props) => (
          <Button
            variant="ghost"
            size="icon-xs"
            {...props}
            onClick={(e) => {
              e.stopPropagation();
              props.onClick?.(e);
            }}
          >
            {trigger || <IconDotsVertical className="size-3.5" />}
          </Button>
        )}
      />
      <DropdownMenuContent align="start" className={cn("w-32", className)}>
        {items.map((item) => (
          <DropdownMenuItem key={item.label} onClick={item.onClick}>
            {item.icon}
            <span>{item.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
