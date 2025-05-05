import { SelectFieldConfig } from "@/lib/types/fields";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectFormField({ field,
  className,
}: {
  field: SelectFieldConfig;
  className?: string;
}) {
  const { control } = useFormContext();

  const options = field.config?.options || [];

  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: rhfField }) => (
        <FormItem className={className}>
          <FormLabel>{field?.label || field.name}</FormLabel>
          <FormControl>
            <Select
              value={rhfField.value || ""}
              onValueChange={(val) => rhfField.onChange(val)}
              disabled={field.disabled}
              required={field.required}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value.toString()}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
