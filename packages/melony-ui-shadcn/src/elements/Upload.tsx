import React, { useRef, useState } from "react";
import { UIContract } from "@melony/ui-kit";
import { Button } from "../ui/button";
import { useMelony } from "@melony/react";
import { Icon } from "./Icon";
import { MelonyRenderer } from "@melony/ui-kit";
import { Image } from "./Image";

export const Upload: React.FC<UIContract["upload"]> = ({
  label = "Upload",
  multiple = false,
  accept,
  onUploadAction,
  initialFiles,
  mode = "append",
  disabled,
}) => {
  const { send, events } = useMelony();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const uploadedFilesEvents = events.filter(
    (event) => event.type === "uploaded-files",
  );

  const displayEvents =
    mode === "replace" && uploadedFilesEvents.length > 0
      ? [uploadedFilesEvents[uploadedFilesEvents.length - 1]]
      : uploadedFilesEvents;

  const showInitialFiles =
    mode === "replace" ? displayEvents.length === 0 : true;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setStatus("idle");

    try {
      const filePromises = files.map((file) => {
        return new Promise<{
          name: string;
          type: string;
          size: number;
          data: string;
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
          reader.readAsDataURL(file);
        });
      });

      const convertedFiles = await Promise.all(filePromises);

      if (onUploadAction) {
        if (typeof onUploadAction === "function") {
          await send(onUploadAction({ files: convertedFiles }));
        } else {
          await send({
            ...onUploadAction,
            data: {
              ...onUploadAction.data,
              files: convertedFiles,
            },
          });
        }
      }

      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error("Upload failed:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="relative inline-block">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple={multiple}
        accept={accept}
        className="hidden"
        disabled={isUploading || disabled}
      />

      <div className="flex flex-wrap gap-2 mb-2 items-center">
        {showInitialFiles &&
          initialFiles?.map((file, index) => (
            <Image
              key={index}
              src={file.url}
              alt={file.name}
              width="min"
              radius="md"
            />
          ))}

        {displayEvents.map((event, index) =>
          event.data ? <MelonyRenderer key={index} node={event.data} /> : null,
        )}

        <Button
          type="button"
          disabled={isUploading || disabled}
          onClick={() => fileInputRef.current?.click()}
          variant="default"
        >
          {isUploading ? (
            <Icon name="⏳" size="sm" className="animate-spin mr-2" />
          ) : status === "success" ? (
            <Icon name="✅" size="sm" className="mr-2" />
          ) : status === "error" ? (
            <Icon name="❌" size="sm" className="mr-2" />
          ) : (
            <Icon name="📤" size="sm" className="mr-2" />
          )}
          {status === "success"
            ? "Uploaded"
            : status === "error"
              ? "Failed"
              : label}
        </Button>
      </div>
    </div>
  );
};
