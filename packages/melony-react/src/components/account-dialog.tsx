import * as React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { IconBrandGoogle, IconLogout, IconUser } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  variant,
  size,
}) => {
  const { isLoading, isAuthenticated, login, logout } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    login();
  };

  if (isAuthenticated) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={(props) => (
            <Button
              variant={variant}
              size={size}
              {...props}
              className={className}
            >
              <IconUser className="mr-2 size-4" />
              Account
            </Button>
          )}
        />
        <DropdownMenuContent>
          <DropdownMenuItem>
            <IconUser className="mr-2 size-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem onClick={logout}>
            <IconLogout className="mr-2 size-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
