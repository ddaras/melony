import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useCallback } from "@/hooks/use-callback";
import { CallbackConfig } from "@/lib/types/actions";

export type DropdownProps = {
  triggerLabel: string | React.ReactNode;
  preventDefault?: boolean;
  items: {
    label: string;
    onClick: (config: CallbackConfig) => void;
  }[];
  align?: "start" | "center" | "end";
};

export const Dropdown = ({
  triggerLabel,
  items,
  align = "start",
  preventDefault = false,
}: DropdownProps) => {
  const callback = useCallback();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        onClick={(e) => {
          if (preventDefault) {
            e.preventDefault();
          }
        }}
      >
        <Button variant="ghost">{triggerLabel}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {items.map((item) => (
          <DropdownMenuItem
            key={item.label}
            onClick={(e) => {
              e.preventDefault();
              item.onClick({ ...callback });
            }}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
