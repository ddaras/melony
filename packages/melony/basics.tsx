import React from "react";

import {
  NavigationButton,
  Heading,
  Text,
  PrimaryButton,
  RichText,
  RichTextProps,
  NavigationButtonProps,
  PrimaryButtonProps,
  GhostButtonProps,
  GhostButton,
  IconProps,
  Icon,
} from "@melony/ui";

export const primaryButton = ({
  label,
  onClick,
  className,
}: PrimaryButtonProps) => {
  return (
    <PrimaryButton className={className} onClick={onClick} label={label} />
  );
};

export const ghostButton = (props: GhostButtonProps) => {
  return <GhostButton {...props} />;
};

export function navigationButton({
  label,
  href,
  className,
  variant,
}: NavigationButtonProps) {
  return (
    <NavigationButton
      label={label}
      href={href}
      className={className}
      variant={variant}
    />
  );
}

export function heading({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return <Heading title={title} className={className} />;
}

export function text({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <Text className={className}>{children}</Text>;
}

export function richText(props: RichTextProps) {
  return <RichText {...props} />;
}

export function icon(props: IconProps) {
  return <Icon {...props} />;
}
