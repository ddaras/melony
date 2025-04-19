import * as LucideIcons from "lucide-react";
import { ComponentProps } from "react";
import { cn } from "../lib/utils";

type LucideIconType = {
  [K in keyof typeof LucideIcons]: (typeof LucideIcons)[K] extends React.ForwardRefExoticComponent<any>
    ? (typeof LucideIcons)[K]
    : never;
};

type IconName = keyof LucideIconType;

export interface IconProps extends Omit<ComponentProps<"svg">, "ref"> {
  name: IconName;
  size?: number;
  className?: string;
}

export const Icon = ({ name, size = 24, className, ...props }: IconProps) => {
  const LucideIcon = LucideIcons[name] as React.ForwardRefExoticComponent<any>;

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in Lucide icons`);
    return <></>;
  }

  return (
    <LucideIcon
      size={size}
      className={cn("inline-block", className)}
      {...props}
    />
  );
};

Icon.displayName = "Icon";
