"use client";

import { Button as ButtonComponent } from "./ui/button";
import { useMelony } from "./melony-provider";

export type NavigationButtonProps = {
  label: string;
  href: string;
  className?: string;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
};

export function NavigationButton({
  label,
  href,
  className,
  variant,
}: NavigationButtonProps) {
  const { navigate } = useMelony();

  return (
    <ButtonComponent
      onClick={() => navigate(href)}
      className={className}
      variant={variant}
    >
      {label}
    </ButtonComponent>
  );
}
