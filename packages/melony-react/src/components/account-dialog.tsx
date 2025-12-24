import * as React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  IconBrandGoogle,
  IconLogout,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export interface AccountDialogProps {
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const AccountDialog: React.FC<AccountDialogProps> = ({
  className,
  variant = "outline",
  size,
}) => {
  const { isLoading, isAuthenticated, user, login, logout } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [accountInfoOpen, setAccountInfoOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const initials = React.useMemo(() => {
    const name = user?.displayName || user?.name;
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [user?.displayName, user?.name]);

  const handleGoogleSignIn = async () => {
    login();
  };

  if (isAuthenticated) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={(props) => (
              <Button
                variant={variant}
                size="icon"
                {...props}
                className={cn("rounded-full", className)}
              >
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt={user.displayName || user.name}
                    className="size-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-7 items-center justify-center rounded-full bg-muted text-xs font-bold">
                    {initials || <IconUser className="size-4" />}
                  </div>
                )}
              </Button>
            )}
          />
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-2 p-2">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user.displayName || user.name}
                  className="size-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-bold">
                  {initials || <IconUser className="size-4" />}
                </div>
              )}
              <div className="flex flex-col space-y-0.5 overflow-hidden">
                <p className="truncate text-sm font-medium">
                  {user?.displayName || user?.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </div>
            <Separator className="my-1" />
            <DropdownMenuItem onClick={() => setAccountInfoOpen(true)}>
              <IconUser className="mr-2 size-4" />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <IconLogout className="mr-2 size-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={accountInfoOpen} onOpenChange={setAccountInfoOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Account Information</DialogTitle>
              <DialogDescription>
                Your account details and settings.
              </DialogDescription>
            </DialogHeader>
            <DialogClose>
              <IconX className="size-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex items-center gap-4">
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt={user.displayName || user.name}
                    className="size-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-16 items-center justify-center rounded-full bg-muted text-xl font-bold">
                    {initials || (
                      <IconUser className="size-8 text-muted-foreground" />
                    )}
                  </div>
                )}
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold">
                    {user?.displayName || user?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    User ID
                  </p>
                  <p className="font-mono text-xs truncate">
                    {user?.uid || user?.id}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Created At
                  </p>
                  <p className="text-xs">{user?.createdAt || "N/A"}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setOpen(true)}
        className={className}
      >
        <IconBrandGoogle className="mr-2 size-4" />
        Sign in with Google
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Sign in to continue</AlertDialogTitle>
            <AlertDialogDescription>
              Choose your preferred sign-in method to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col gap-3 py-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <IconBrandGoogle className="mr-2 size-5" />
              {isLoading ? "Signing in..." : "Continue with Google"}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
