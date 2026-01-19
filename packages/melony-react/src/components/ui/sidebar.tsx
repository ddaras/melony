import * as React from "react";
import { cn } from "@/lib/utils";

interface SidebarProps extends React.ComponentProps<"aside"> {
  collapsible?: "icon" | "offcanvas" | false;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SidebarContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  collapsible: "icon" | "offcanvas" | false;
}>({
  open: true,
  setOpen: () => {},
  collapsible: false,
});

function Sidebar({
  className,
  collapsible = false,
  defaultOpen = true,
  open: controlledOpen,
  onOpenChange,
  ...props
}: SidebarProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = controlledOpen ?? internalOpen;
  const setOpen = React.useCallback(
    (value: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(value);
      }
      onOpenChange?.(value);
    },
    [controlledOpen, onOpenChange],
  );

  return (
    <SidebarContext.Provider value={{ open, setOpen, collapsible }}>
      <aside
        data-slot="sidebar"
        data-state={open ? "open" : "closed"}
        className={cn(
          "bg-sidebar text-sidebar-foreground flex h-screen w-64 flex-col border-r border-sidebar-border transition-all duration-200",
          !open && collapsible === "icon" && "w-16",
          !open && collapsible === "offcanvas" && "-translate-x-full",
          className,
        )}
        {...props}
      />
    </SidebarContext.Provider>
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn(
        "flex h-16 items-center border-b border-sidebar-border px-4",
        className,
      )}
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn("flex-1 overflow-y-auto p-4", className)}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("border-t border-sidebar-border p-4", className)}
      {...props}
    />
  );
}

function SidebarTrigger({
  className,
  ...props
}: React.ComponentProps<"button">) {
  const { open, setOpen } = React.useContext(SidebarContext);

  return (
    <button
      data-slot="sidebar-trigger"
      onClick={() => setOpen(!open)}
      className={cn(
        "inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M9 3v18" />
      </svg>
      <span className="sr-only">Toggle sidebar</span>
    </button>
  );
}

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
};
