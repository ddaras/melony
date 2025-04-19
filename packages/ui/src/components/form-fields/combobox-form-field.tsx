import { ComboboxFieldConfig } from "@/lib/types/fields";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useFormContext } from "react-hook-form";
import { VirtualizedCombobox } from "@/components/ui/virtualized-combobox";

export function ComboboxFormField({
  field,
  onSearch,
  isLoading,
  className,
}: {
  field: ComboboxFieldConfig;
  onSearch?: (value: string) => void;
  isLoading?: boolean;
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
              <VirtualizedCombobox
                options={field.config?.options || []}
                value={rhfField.value}
                onChange={(value) => {
                  rhfField.onChange(value);
                }}
                onSearch={(value) => {
                  if (onSearch) {
                    onSearch(value);
                  }
                }}
                isLoading={isLoading}
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
