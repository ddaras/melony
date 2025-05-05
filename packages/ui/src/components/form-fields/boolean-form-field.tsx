import { BooleanFieldConfig } from "@/lib/types/fields";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useFormContext } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";

export function BooleanFormField({
  field,
  className,
}: {
  field: BooleanFieldConfig;
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
            <div>
              <Checkbox
                checked={rhfField.value || false}
                onCheckedChange={(value) => rhfField.onChange(value)}
                disabled={field.disabled}
                required={field.required}
              />
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
