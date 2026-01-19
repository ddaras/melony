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
import type { Event, UIContract } from "melony";
import { useMelony } from "@/hooks/use-melony";
import { Icon } from "./Icon";

export interface DropdownItem {
  label: string;
  icon?: string;
  onClickAction?: Event;
}


export const Dropdown: React.FC<UIContract["dropdown"] & { children?: React.ReactNode | React.ReactNode[] }> = ({ items = [], children }) => {
  const { sendEvent } = useMelony();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={(props: any) => (
          <Button
            variant="outline"
            size="icon-sm"
            {...props}
            onClick={(e) => {
              e.stopPropagation();
              props.onClick?.(e);
            }}
          >
            {children || <IconDotsVertical className="size-3.5" />}
          </Button>
        )}
      />
      <DropdownMenuContent align="start" className={cn("w-32")}>
        {items.map((item, i) => (
          <DropdownMenuItem
            key={`${item.label}-${i}`}
            onClick={(e) => {
              e.stopPropagation();
              if (item.onClickAction) {
                sendEvent(item.onClickAction);
              }
            }}
          >
            {item.icon && <Icon name={item.icon} size="sm" />}
            <span className={item.icon ? "ml-2" : ""}>{item.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
