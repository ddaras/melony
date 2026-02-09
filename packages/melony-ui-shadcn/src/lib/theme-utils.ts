import { UIColor, UISpacing, UIWidth, UIShadow, UIRadius } from "@melony/ui-kit";

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

export const paddingVerticalMap: Record<UISpacing, string> = {
  none: "py-0",
  xs: "py-1",
  sm: "py-2",
  md: "py-4",
  lg: "py-6",
  xl: "py-8",
  xxl: "py-12",
};

export const paddingHorizontalMap: Record<UISpacing, string> = {
  none: "px-0",
  xs: "px-1",
  sm: "px-2",
  md: "px-4",
  lg: "px-6",
  xl: "px-8",
  xxl: "px-12",
};

export const interactivePaddingMap: Record<UISpacing, string> = {
  none: "p-0",
  xs: "py-1 px-2",
  sm: "py-1.5 px-3",
  md: "py-2 px-4",
  lg: "py-3 px-6",
  xl: "py-4 px-8",
  xxl: "py-6 px-10",
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

export const marginVerticalMap: Record<UISpacing, string> = {
  none: "my-0",
  xs: "my-1",
  sm: "my-2",
  md: "my-4",
  lg: "my-6",
  xl: "my-8",
  xxl: "my-12",
};

export const marginHorizontalMap: Record<UISpacing, string> = {
  none: "mx-0",
  xs: "mx-1",
  sm: "mx-2",
  md: "mx-4",
  lg: "mx-6",
  xl: "mx-8",
  xxl: "mx-12",
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

export const alignMap: Record<string, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

export const justifyMap: Record<string, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
};

export const wrapMap: Record<string, string> = {
  nowrap: "flex-nowrap",
  wrap: "flex-wrap",
  "wrap-reverse": "flex-wrap-reverse",
};

export const textSizeMap: Record<string, string> = {
  none: "text-[0]",
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  xxl: "text-2xl",
};

export const textAlignMap: Record<string, string> = {
  start: "text-left",
  center: "text-center",
  end: "text-right",
  stretch: "text-justify",
};

export const fontWeightMap: Record<string, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

/**
 * Resolves an SDUI color (e.g., "primary/50") to a React style object.
 * This handles opacity using CSS Relative Color Syntax.
 */
export const resolveUIStyle = (
  property: "backgroundColor" | "color" | "borderColor",
  value?: UIColor,
) => {
  if (!value) return {};

  const [colorName, opacityStr] = value.split("/");

  // If it's a standard mapping and no opacity is requested, return nothing
  // and let the Tailwind classes handle it (to preserve text-foreground etc.)
  if (!opacityStr && (colorBgMap[value as UIColor] || colorTextMap[value as UIColor] || colorBorderMap[value as UIColor])) {
    return {};
  }

  const opacity = opacityStr ? parseInt(opacityStr, 10) / 100 : 1;

  // Map camelCase to kebab-case for CSS variables if needed, 
  // but most of our colors are single words.
  const kebabName = colorName.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  
  // Tailwind 4 defines colors as --color-{name}
  // Shadcn often defines them as --{name}
  const variable = `var(--color-${kebabName}, var(--${kebabName}))`;

  if (opacity === 1) {
    return { [property]: variable };
  }

  // Use CSS color-mix as it's very robust and handles the opacity well
  // mixed with transparent. This is a very safe way to handle opacity.
  return {
    [property]: `color-mix(in oklch, ${variable}, transparent ${100 - opacity * 100}%)`,
  };
};
