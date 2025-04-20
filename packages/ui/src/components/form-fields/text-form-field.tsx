import { TextFieldConfig } from "@/lib/types/fields";
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

export function TextFormField({
  field,
  className,
}: {
  field: TextFieldConfig;
  className?: string;
}) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: rhfField }) => (
        <FormItem className={className}>
          <FormLabel>{field?.label || field?.name}</FormLabel>
          <FormControl>
            <Input
              type="text"
              value={rhfField.value || ""}
              onChange={(e) => rhfField.onChange(e.target.value)}
              placeholder={field.config?.placeholder}
              maxLength={field.config?.maxLength}
              disabled={field.disabled}
              required={field.required}
            />
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
