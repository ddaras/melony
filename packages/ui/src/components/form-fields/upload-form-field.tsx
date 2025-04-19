import { UploadFieldConfig } from "@/lib/types/fields";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useFormContext } from "react-hook-form";
import { Input } from "../ui/input";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Loader2, UploadIcon } from "lucide-react";

export function UploadFormField({ field }: { field: UploadFieldConfig }) {
  const { control } = useFormContext();
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // const response: any = await fetch({
      //   ...request,
      //   url: uploadUrl,
      //   // body: file,
      // });

      const response = {
        Key: "test",
      };

      const { Key } = response;

      onChange(`/${Key}`);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: { onChange } }) => (
        <FormItem>
          <FormLabel>{field?.label || field.name}</FormLabel>
          <FormControl>
            <div className="flex gap-4 items-center">
              <Input
                type="file"
                ref={inputRef}
                onChange={(e) => handleFileUpload(e, onChange)}
                disabled={isUploading}
                className="hidden file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />

              <div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    inputRef.current?.click();
                  }}
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UploadIcon className="h-4 w-4" />
                  )}
                  Upload
                </Button>
              </div>
            </div>
          </FormControl>
          {field?.description && (
            <FormDescription>{field?.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
