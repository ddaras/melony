import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import * as React from "react";

type Option = {
  value: string;
  label: string;
};

interface VirtualizedCommandProps {
  height: string;
  options: Option[];
  placeholder: string;
  selectedValue: string;
  onSelectOption?: (option: string) => void;
  onSearch: (value: string) => void;
  isLoading?: boolean;
}

const VirtualizedCommand = ({
  height,
  options,
  placeholder,
  selectedValue,
  onSelectOption,
  onSearch,
  isLoading,
}: VirtualizedCommandProps) => {
  const [filteredOptions, setFilteredOptions] =
    React.useState<Option[]>(options);
  const [focusedIndex, setFocusedIndex] = React.useState(0);
  const [isKeyboardNavActive, setIsKeyboardNavActive] = React.useState(false);

  React.useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  const [searchValue, setSearchValue] = React.useState("");
  const debouncedSearchValue = useDebounce(searchValue, 300);
  const prevSearchValueRef = React.useRef(debouncedSearchValue);
  React.useEffect(() => {
    if (debouncedSearchValue !== prevSearchValueRef.current) {
      onSearch(debouncedSearchValue);
      prevSearchValueRef.current = debouncedSearchValue;
    }
  }, [debouncedSearchValue, onSearch]);

  const parentRef = React.useRef(null);

  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  const virtualOptions = virtualizer.getVirtualItems();

  // const scrollToIndex = (index: number) => {
  //   virtualizer.scrollToIndex(index, {
  //     align: "center",
  //   });
  // };

  const handleSearch = (search: string) => {
    setSearchValue(search);
    setIsKeyboardNavActive(false);
    // setFilteredOptions(
    //   options.filter((option) =>
    //     option.value.toLowerCase().includes(search.toLowerCase() ?? [])
    //   )
    // );
  };

  React.useEffect(() => {
    if (selectedValue) {
      const option = filteredOptions.find(
        (option) => option.value === selectedValue
      );
      if (option) {
        const index = filteredOptions.indexOf(option);
        setFocusedIndex(index);
        virtualizer.scrollToIndex(index, {
          align: "center",
        });
      }
    }
  }, [selectedValue, filteredOptions, virtualizer]);

  return (
    <Command shouldFilter={false}>
      <CommandInput onValueChange={handleSearch} placeholder={placeholder} />
      <CommandList
        ref={parentRef}
        style={{
          height: height,
          width: "100%",
          overflow: "auto",
        }}
        onMouseDown={() => setIsKeyboardNavActive(false)}
        onMouseMove={() => setIsKeyboardNavActive(false)}
      >
        <CommandEmpty>
          {isLoading ? "Loading..." : "No item found."}
        </CommandEmpty>
        <CommandGroup>
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {virtualOptions.map((virtualOption) => {
              const option = filteredOptions[virtualOption.index];

              return (
                <CommandItem
                  key={option.value}
                  disabled={isKeyboardNavActive}
                  className={cn(
                    "absolute left-0 top-0 w-full bg-transparent",
                    focusedIndex === virtualOption.index &&
                      "bg-accent text-accent-foreground",
                    isKeyboardNavActive &&
                      focusedIndex !== virtualOption.index &&
                      "aria-selected:bg-transparent aria-selected:text-primary"
                  )}
                  style={{
                    height: `${virtualOption.size}px`,
                    transform: `translateY(${virtualOption.start}px)`,
                  }}
                  value={`${option.value}`}
                  onMouseEnter={() =>
                    !isKeyboardNavActive && setFocusedIndex(virtualOption.index)
                  }
                  onMouseLeave={() =>
                    !isKeyboardNavActive && setFocusedIndex(-1)
                  }
                  onSelect={(value) => {
                    onSelectOption?.(value);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValue ===
                        filteredOptions[virtualOption.index].value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {filteredOptions[virtualOption.index].label}
                </CommandItem>
              );
            })}
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

interface VirtualizedComboboxProps {
  options: Option[];
  value: string;
  searchPlaceholder?: string;
  width?: string;
  height?: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  isLoading?: boolean;
}

export function VirtualizedCombobox({
  options,
  value,
  searchPlaceholder = "Search items...",
  width = "400px",
  height = "400px",
  onChange,
  onSearch,
  isLoading,
}: VirtualizedComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOption = options.find(
    (option) => `${option.value}` === `${value}`
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
          style={{
            width: width,
          }}
        >
          {value ? selectedOption?.label : searchPlaceholder}
          {isLoading ? (
            <Loader2 className="ml-2 h-4 w-4 shrink-0 opacity-50 animate-spin" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" style={{ width: width }}>
        <VirtualizedCommand
          height={height}
          options={options}
          placeholder={searchPlaceholder}
          selectedValue={value}
          onSelectOption={(currentValue) => {
            onChange(currentValue);
            setOpen(false);
          }}
          onSearch={onSearch}
          isLoading={isLoading}
        />
      </PopoverContent>
    </Popover>
  );
}
