import React from "react";
import { Image, Chip as ChipUI, ChipProps } from "@melony/ui";

export const image = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  return <Image src={src} alt={alt} className={className} />;
};

export const chip = ({ label, variant = "default", className }: ChipProps) => {
  return <ChipUI label={label} variant={variant} className={className} />;
};
