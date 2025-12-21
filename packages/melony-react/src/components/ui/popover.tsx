import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}

const PopoverContext = React.createContext<PopoverContextValue | undefined>(
  undefined
);

function usePopoverContext() {
  const context = React.useContext(PopoverContext);
  if (!context) {
    throw new Error("Popover components must be used within a Popover");
  }
  return context;
}

interface PopoverProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function Popover({
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const triggerRef = React.useRef<HTMLElement>(null);

  const open = controlledOpen ?? internalOpen;
  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [controlledOpen, onOpenChange]
  );

  const value = React.useMemo(
    () => ({
      open,
      setOpen,
      triggerRef,
    }),
    [open, setOpen]
  );

  return (
    <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>
  );
}

interface PopoverTriggerProps extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean;
}

const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ asChild, className, children, ...props }, ref) => {
    const { setOpen, triggerRef } = usePopoverContext();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setOpen(true);
      props.onClick?.(e);
    };

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ref: (node: HTMLElement) => {
          triggerRef.current = node;
          if (typeof (children as any).ref === "function") {
            (children as any).ref(node);
          } else if ((children as any).ref) {
            (children as any).ref.current = node;
          }
        },
        onClick: handleClick,
      } as any);
    }

    return (
      <button
        ref={(node) => {
          triggerRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={className}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

PopoverTrigger.displayName = "PopoverTrigger";

interface PopoverContentProps extends React.ComponentPropsWithoutRef<"div"> {
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  (
    {
      className,
      side = "bottom",
      align = "start",
      sideOffset = 4,
      alignOffset = 0,
      children,
      ...props
    },
    ref
  ) => {
    const { open, setOpen, triggerRef } = usePopoverContext();
    const [position, setPosition] = React.useState({ top: 0, left: 0 });
    const contentRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (!open || !triggerRef.current) return;

      const updatePosition = () => {
        if (!triggerRef.current || !contentRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const contentRect = contentRef.current.getBoundingClientRect();
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;

        let top = 0;
        let left = 0;

        switch (side) {
          case "bottom":
            top = triggerRect.bottom + sideOffset + scrollY;
            break;
          case "top":
            top = triggerRect.top - contentRect.height - sideOffset + scrollY;
            break;
          case "right":
            top = triggerRect.top + scrollY;
            left = triggerRect.right + sideOffset + scrollX;
            break;
          case "left":
            top = triggerRect.top + scrollY;
            left = triggerRect.left - contentRect.width - sideOffset + scrollX;
            break;
        }

        switch (align) {
          case "start":
            if (side === "top" || side === "bottom") {
              left = triggerRect.left + scrollX + alignOffset;
            } else {
              top += alignOffset;
            }
            break;
          case "center":
            if (side === "top" || side === "bottom") {
              left =
                triggerRect.left +
                triggerRect.width / 2 -
                contentRect.width / 2 +
                scrollX +
                alignOffset;
            } else {
              top += triggerRect.height / 2 - contentRect.height / 2 + alignOffset;
            }
            break;
          case "end":
            if (side === "top" || side === "bottom") {
              left =
                triggerRect.left +
                triggerRect.width -
                contentRect.width +
                scrollX +
                alignOffset;
            } else {
              top += triggerRect.height - contentRect.height + alignOffset;
            }
            break;
        }

        setPosition({ top, left });
      };

      // Use requestAnimationFrame to ensure content is rendered
      requestAnimationFrame(() => {
        updatePosition();
      });

      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);

      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, true);
      };
    }, [open, side, align, sideOffset, alignOffset, triggerRef]);

    React.useEffect(() => {
      if (!open) return;

      const handleClickOutside = (event: MouseEvent) => {
        if (
          contentRef.current &&
          !contentRef.current.contains(event.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(event.target as Node)
        ) {
          setOpen(false);
        }
      };

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }, [open, setOpen, triggerRef]);

    if (!open) return null;

    const content = (
      <div
        ref={(node) => {
          contentRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={cn(
          "bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 ring-foreground/5 rounded-2xl shadow-2xl ring-1 z-50 min-w-48 max-h-96 overflow-hidden",
          className
        )}
        style={{
          position: "absolute",
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
        {...props}
      >
        {children}
      </div>
    );

    return createPortal(content, document.body);
  }
);

PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent };

