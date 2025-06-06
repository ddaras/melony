"use client";

import { useAuthStore } from "@/stores/auth-store";
import { button, avatar, modal, vstack, hstack, text } from "melony";

export function AuthButton() {
  const { user, loading, signInWithGoogle, logout } = useAuthStore();

  if (loading) {
    return button({
      label: "Loading...",
      variant: "outline",
    });
  }

  if (user) {
    return modal({
      label: "Account",
      title: "Account",
      content: ({ close }) =>
        vstack({
          className: "gap-4 p-4",
          children: [
            hstack({
              className: "gap-3",
              children: [
                avatar({
                  src: user.user_metadata?.avatar_url || undefined,
                  name: user.user_metadata?.full_name || user.email || "User",
                  className: "h-12 w-12",
                }),
                vstack({
                  children: [
                    text({
                      className: "font-medium",
                      content: user.user_metadata?.full_name || user.email || "User",
                    }),
                    text({
                      className: "text-sm text-muted-foreground",
                      content: user.email || "No email provided",
                    }),
                  ],
                }),
              ],
            }),
            button({
              label: "Logout",
              onClick: () => {
                logout();
                close();
              },
              variant: "outline",
              className: "w-full justify-start",
            }),
          ],
        }),
    });
  }

  return button({
    label: "Login",
    onClick: signInWithGoogle,
    variant: "outline",
  });
}
