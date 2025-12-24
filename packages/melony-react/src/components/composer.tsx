import React from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";
import {
  IconArrowUp,
  IconAdjustmentsHorizontal,
  IconChevronDown,
  IconLoader2,
} from "@tabler/icons-react";
import { ComposerOption, ComposerOptionGroup } from "../types";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface ComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (state?: Record<string, any>) => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
  options?: ComposerOptionGroup[];
  autoFocus?: boolean;
  defaultSelectedIds?: string[];
}

export function Composer({
  value,
  onChange,
  onSubmit,
  placeholder = "Type a message...",
  isLoading,
  className,
  options = [],
  autoFocus = false,
  defaultSelectedIds = [],
}: ComposerProps) {
  const [selectedOptions, setSelectedOptions] = React.useState<Set<string>>(
    () => new Set(defaultSelectedIds)
  );

  const toggleOption = (
    id: string,
    groupOptions?: ComposerOption[],
    type: "single" | "multiple" = "multiple"
  ) => {
    const next = new Set(selectedOptions);
    if (type === "single") {
      const isAlreadySelected = next.has(id);
      // Remove all other options from this group
      if (groupOptions) {
        groupOptions.forEach((o) => next.delete(o.id));
      }

      if (!isAlreadySelected) {
        next.add(id);
      }
    } else {
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
    }
    setSelectedOptions(next);
  };

  const handleInternalSubmit = () => {
    const state: Record<string, any> = {};

    // Handle grouped options
    options.forEach((group) => {
      const selectedInGroup = group.options.filter((o) =>
        selectedOptions.has(o.id)
      );

      if (selectedInGroup.length > 0) {
        if (group.type === "single") {
          state[group.id] = selectedInGroup[0].value;
        } else {
          state[group.id] = selectedInGroup.map((o) => ({
            id: o.id,
            value: o.value,
          }));
        }
      }
    });

    onSubmit(state);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleInternalSubmit();
    }
  };

  return (
    <div className={cn("relative flex flex-col w-full", className)}>
      <div className="relative flex flex-col w-full border-input border-[1.5px] rounded-3xl bg-background shadow-sm focus-within:border-ring transition-all p-2">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-[44px] max-h-[200px] border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-2 text-[15px] resize-none"
          autoFocus={autoFocus}
        />
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-1">
            {/* Grouped options dropdowns */}
            {options.map((group) => {
              const selectedInGroup = group.options.filter((o) =>
                selectedOptions.has(o.id)
              );
              const label =
                selectedInGroup.length === 0
                  ? group.label
                  : selectedInGroup.length === 1
                    ? selectedInGroup[0].label
                    : `${group.label} (${selectedInGroup.length})`;

              const isSingle = group.type === "single";

              return (
                <DropdownMenu key={group.id}>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          selectedInGroup.length > 0
                            ? "text-foreground bg-muted/50"
                            : "text-muted-foreground"
                        )}
                      >
                        {label}
                        <IconChevronDown className="h-3 w-3 opacity-50" />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {group.options.map((option) => (
                        <DropdownMenuCheckboxItem
                          key={option.id}
                          checked={selectedOptions.has(option.id)}
                          onCheckedChange={() =>
                            toggleOption(
                              option.id,
                              group.options,
                              isSingle ? "single" : "multiple"
                            )
                          }
                          onSelect={(e) => e.preventDefault()}
                        >
                          {option.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            })}
          </div>
          <Button
            type="submit"
            disabled={(!value.trim() && !isLoading) || isLoading}
            size="icon-lg"
            onClick={handleInternalSubmit}
          >
            {isLoading ? (
              <IconLoader2 className="h-5 w-5 animate-spin" />
            ) : (
              <IconArrowUp className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
