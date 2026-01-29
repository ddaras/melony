import * as React from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "../lib/utils";
import type { Event } from "melony";
import { UIContract } from "@melony/ui-kit";
import { useMelony } from "@melony/react";
import { Icon } from "./Icon";

export interface DropdownItem {
  label: string;
  icon?: string;
  onClickAction?: Event;
}


export const Dropdown: React.FC<UIContract["dropdown"] & { children?: React.ReactNode }> = ({ items = [], children }) => {
  const { send } = useMelony();

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
            {children || <Icon name="⋮" size="sm" />}
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
                send(item.onClickAction);
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
