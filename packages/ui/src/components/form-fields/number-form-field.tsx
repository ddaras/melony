import { NumberFieldConfig } from "@/lib/types/fields";
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

export function NumberFormField({ field,
  className,
}: {
  field: NumberFieldConfig;
  className?: string;
}) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: rhfField }) => (
        <FormItem className={className}>
          <FormLabel>{field?.label || field.name}</FormLabel>
          <FormControl>
            <Input
              type="number"
              value={rhfField.value || ""}
              onChange={(e) => rhfField.onChange(e.target.valueAsNumber)}
              min={field.config?.min}
              max={field.config?.max}
              step={field.config?.step}
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
