import React from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";
import {
  IconArrowUp,
  IconAdjustmentsHorizontal,
  IconChevronDown,
  IconLoader2,
  IconPaperclip,
  IconX,
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
  fileAttachments?: {
    enabled?: boolean;
    accept?: string; // e.g., "image/*,.pdf" for file input accept attribute
    maxFiles?: number; // Maximum number of files allowed
    maxFileSize?: number; // Maximum file size in bytes
  };
  // Legacy props for backward compatibility
  accept?: string;
  maxFiles?: number;
  maxFileSize?: number;
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
  // Legacy props for backward compatibility
  accept: legacyAccept,
  maxFiles: legacyMaxFiles,
  maxFileSize: legacyMaxFileSize,
}: ComposerProps) {
  // Use config values if provided, otherwise fall back to legacy props or defaults
  const enabled = fileAttachments?.enabled !== false; // Default to enabled if not specified
  const accept = fileAttachments?.accept ?? legacyAccept;
  const maxFiles = fileAttachments?.maxFiles ?? legacyMaxFiles ?? 10;
  const maxFileSize = fileAttachments?.maxFileSize ?? legacyMaxFileSize ?? 10 * 1024 * 1024; // 10MB default
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
        console.warn(`File ${file.name} exceeds maximum size of ${maxFileSize} bytes`);
        return false;
      }
      return true;
    });

    // Check if adding these files would exceed maxFiles
    const remainingSlots = maxFiles - attachedFiles.length;
    const filesToAdd = validFiles.slice(0, remainingSlots);

    if (filesToAdd.length < validFiles.length) {
      console.warn(`Only ${filesToAdd.length} files can be added (max: ${maxFiles})`);
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
              // Remove data URL prefix (e.g., "data:image/png;base64,")
              const base64Data = base64.includes(",") 
                ? base64.split(",")[1] 
                : base64;
              resolve({
                name: file.name,
                type: file.type,
                size: file.size,
                data: base64Data,
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
      {/* Display attached files above the input - only show if enabled */}
      {enabled && attachedFiles.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg text-sm"
            >
              <span className="truncate max-w-[200px]" title={file.name}>
                {file.name}
              </span>
              <span className="text-muted-foreground text-xs">
                {formatFileSize(file.size)}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="ml-1 hover:bg-muted-foreground/20 rounded p-0.5 transition-colors"
                aria-label="Remove file"
              >
                <IconX className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

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
                
                {/* File attachment button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || attachedFiles.length >= maxFiles}
                  className="text-muted-foreground"
                  title={
                    attachedFiles.length >= maxFiles
                      ? `Maximum ${maxFiles} files allowed`
                      : "Attach file"
                  }
                >
                  <IconPaperclip className="h-4 w-4" />
                </Button>
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
            disabled={(!value.trim() && attachedFiles.length === 0 && !isLoading) || isLoading}
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
