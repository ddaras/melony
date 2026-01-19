import { UIColor, UISpacing, UIWidth, UIShadow, UIRadius } from "melony";

export const spacingMap: Record<UISpacing, string> = {
  none: "0",
  xs: "1",
  sm: "2",
  md: "4",
  lg: "6",
  xl: "8",
  xxl: "12",
};

export const paddingMap: Record<UISpacing, string> = {
  none: "p-0",
  xs: "p-1",
  sm: "p-2",
  md: "p-4",
  lg: "p-6",
  xl: "p-8",
  xxl: "p-12",
};

export const marginMap: Record<UISpacing, string> = {
  none: "m-0",
  xs: "m-1",
  sm: "m-2",
  md: "m-4",
  lg: "m-6",
  xl: "m-8",
  xxl: "m-12",
};

export const gapMap: Record<UISpacing, string> = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
  xxl: "gap-12",
};

export const colorBgMap: Record<UIColor, string> = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  success: "bg-green-500 text-white",
  danger: "bg-destructive text-destructive-foreground",
  warning: "bg-yellow-500 text-white",
  info: "bg-blue-500 text-white",
  background: "bg-background text-foreground",
  foreground: "bg-foreground text-background",
  muted: "bg-muted text-muted-foreground",
  mutedForeground: "bg-muted-foreground text-muted",
  border: "bg-border",
  transparent: "bg-transparent",
};

export const colorTextMap: Record<UIColor, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  success: "text-green-600",
  danger: "text-destructive",
  warning: "text-yellow-600",
  info: "text-blue-600",
  background: "text-background",
  foreground: "text-foreground",
  muted: "text-muted-foreground",
  mutedForeground: "text-muted-foreground",
  border: "text-border",
  transparent: "text-transparent",
};

export const colorBorderMap: Record<UIColor, string> = {
  primary: "border-primary",
  secondary: "border-secondary",
  success: "border-green-500",
  danger: "border-destructive",
  warning: "border-yellow-500",
  info: "border-blue-500",
  background: "border-background",
  foreground: "border-foreground",
  muted: "border-muted",
  mutedForeground: "border-muted-foreground",
  border: "border-border",
  transparent: "border-transparent",
};

export const widthMap: Record<UIWidth, string> = {
  auto: "w-auto",
  full: "w-full",
  min: "w-min",
  max: "w-max",
  "1/2": "w-1/2",
  "1/3": "w-1/3",
  "2/3": "w-2/3",
  "1/4": "w-1/4",
  "3/4": "w-3/4",
};

export const shadowMap: Record<UIShadow, string> = {
  none: "shadow-none",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
};

export const radiusMap: Record<UIRadius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

export const alignMap = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

export const justifyMap = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
};

export const wrapMap = {
  nowrap: "flex-nowrap",
  wrap: "flex-wrap",
  "wrap-reverse": "flex-wrap-reverse",
};

export const textSizeMap = {
  none: "text-[0]",
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  xxl: "text-2xl",
};

export const textAlignMap = {
  start: "text-left",
  center: "text-center",
  end: "text-right",
  stretch: "text-justify",
};

export const fontWeightMap = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};
