import React from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import {
  IconArrowUp,
  IconAdjustmentsHorizontal,
  IconChevronDown,
  IconLoader2,
  IconPaperclip,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import { ComposerOption, ComposerOptionGroup } from "../types";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
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
  fileAttachments?: {
    enabled?: boolean;
    accept?: string; // e.g., "image/*,.pdf" for file input accept attribute
    maxFiles?: number; // Maximum number of files allowed
    maxFileSize?: number; // Maximum file size in bytes
  };
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
  fileAttachments,
}: ComposerProps) {
  const enabled = fileAttachments?.enabled || false;
  const accept = fileAttachments?.accept;
  const maxFiles = fileAttachments?.maxFiles ?? 10;
  const maxFileSize = fileAttachments?.maxFileSize ?? 10 * 1024 * 1024;
  const [selectedOptions, setSelectedOptions] = React.useState<Set<string>>(
    () => new Set(defaultSelectedIds)
  );
  const [attachedFiles, setAttachedFiles] = React.useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Filter out files that are too large
    const validFiles = files.filter((file) => {
      if (file.size > maxFileSize) {
        // You might want to show a toast/error here
        console.warn(
          `File ${file.name} exceeds maximum size of ${maxFileSize} bytes`
        );
        return false;
      }
      return true;
    });

    // Check if adding these files would exceed maxFiles
    const remainingSlots = maxFiles - attachedFiles.length;
    const filesToAdd = validFiles.slice(0, remainingSlots);

    if (filesToAdd.length < validFiles.length) {
      console.warn(
        `Only ${filesToAdd.length} files can be added (max: ${maxFiles})`
      );
    }

    setAttachedFiles((prev) => [...prev, ...filesToAdd]);

    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleInternalSubmit = async () => {
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

    // Convert files to base64 before including in state
    if (attachedFiles.length > 0) {
      const filePromises = attachedFiles.map((file) => {
        return new Promise<{
          name: string;
          type: string;
          size: number;
          data: string; // base64 string
        }>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const base64 = reader.result as string;
              if (!base64) {
                reject(new Error("FileReader returned empty result"));
                return;
              }

              resolve({
                name: file.name,
                type: file.type,
                size: file.size,
                data: base64,
              });
            } catch (error) {
              reject(error);
            }
          };
          reader.onerror = (error) => {
            reject(new Error(`Failed to read file ${file.name}: ${error}`));
          };
          reader.onabort = () => {
            reject(new Error(`File read aborted for ${file.name}`));
          };
          reader.readAsDataURL(file);
        });
      });

      try {
        const convertedFiles = await Promise.all(filePromises);
        if (convertedFiles.length > 0) {
          state.files = convertedFiles;
        }
      } catch (error) {
        console.error("Failed to convert files to base64:", error);
        // Don't include files if conversion fails
      }
    }

    onSubmit(state);

    // Clear files after submission
    setAttachedFiles([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleInternalSubmit().catch(console.error);
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
            {/* File attachment UI - only show if enabled */}
            {enabled && (
              <>
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={accept}
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isLoading || attachedFiles.length >= maxFiles}
                />

                {/* File attachment button/dropdown */}
                {attachedFiles.length === 0 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="text-muted-foreground"
                    title="Attach file"
                  >
                    <IconPaperclip className="h-4 w-4" />
                  </Button>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground gap-2"
                          title={`${attachedFiles.length} files attached`}
                        >
                          <IconPaperclip className="h-4 w-4" />
                          <Badge className="h-[18px] min-w-[18px] px-1.5 text-[10px]">
                            {attachedFiles.length}
                          </Badge>
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="start" className="w-64">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>
                          Attached Files ({attachedFiles.length}/{maxFiles})
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {attachedFiles.map((file, index) => (
                          <DropdownMenuItem
                            key={index}
                            className="flex items-center justify-between group"
                            onSelect={(e) => e.preventDefault()}
                          >
                            <div className="flex flex-col min-w-0 flex-1">
                              <span
                                className="truncate text-sm"
                                title={file.name}
                              >
                                {file.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {formatFileSize(file.size)}
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveFile(index)}
                            >
                              <IconX className="h-3 w-3" />
                            </Button>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                      {attachedFiles.length < maxFiles && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault();
                              fileInputRef.current?.click();
                            }}
                            className="text-primary focus:text-primary"
                          >
                            <IconPlus className="mr-2 h-4 w-4" />
                            <span>Add more files</span>
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </>
            )}

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
                    : group.label;

              const isSingle = group.type === "single";

              return (
                <DropdownMenu key={group.id}>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "gap-2",
                          selectedInGroup.length > 0
                            ? "text-foreground bg-muted/50"
                            : "text-muted-foreground"
                        )}
                      >
                        {label}
                        {selectedInGroup.length > 1 && (
                          <Badge className="h-[18px] min-w-[18px] px-1.5 text-[10px]">
                            {selectedInGroup.length}
                          </Badge>
                        )}
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
            disabled={
              (!value.trim() && attachedFiles.length === 0 && !isLoading) ||
              isLoading
            }
            size="icon-lg"
            onClick={() => handleInternalSubmit().catch(console.error)}
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
