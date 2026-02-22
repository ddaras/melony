import type {
  UIColor,
  UISpacing,
  UIWidth,
  UIShadow,
  UIRadius,
  UISize,
  UIAlign,
  UIJustify,
  UIWrap,
  UIFontWeight,
  UITextAlign,
} from "@melony/ui-kit";

// ─── Spacing Scale ──────────────────────────────────────────────────────────────
// Single spacing scale used to derive all spacing-related class maps.

const SPACING_SCALE: Record<UISpacing, string> = {
  none: "0",
  xs: "1",
  sm: "2",
  md: "4",
  lg: "6",
  xl: "8",
  xxl: "12",
};

function buildSpacingMap(prefix: string): Record<UISpacing, string> {
  const map = {} as Record<UISpacing, string>;
  for (const [token, value] of Object.entries(SPACING_SCALE)) {
    map[token as UISpacing] = `${prefix}-${value}`;
  }
  return map;
}

export const spacingMap = SPACING_SCALE;
export const paddingMap = buildSpacingMap("p");
export const paddingXMap = buildSpacingMap("px");
export const paddingYMap = buildSpacingMap("py");
export const marginMap = buildSpacingMap("m");
export const marginXMap = buildSpacingMap("mx");
export const marginYMap = buildSpacingMap("my");
export const gapMap = buildSpacingMap("gap");

export const interactivePaddingMap: Record<UISpacing, string> = {
  none: "p-0",
  xs: "py-1 px-2",
  sm: "py-1.5 px-3",
  md: "py-2 px-4",
  lg: "py-3 px-6",
  xl: "py-4 px-8",
  xxl: "py-6 px-10",
};

// ─── Color Maps ─────────────────────────────────────────────────────────────────

export const colorBgMap: Record<UIColor, string> = {
  primary: "bg-primary text-(--color-primary-foreground)",
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

// ─── Layout Maps ────────────────────────────────────────────────────────────────

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

export const alignMap: Record<UIAlign, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

export const justifyMap: Record<UIJustify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
};

export const wrapMap: Record<UIWrap, string> = {
  nowrap: "flex-nowrap",
  wrap: "flex-wrap",
  "wrap-reverse": "flex-wrap-reverse",
};

// ─── Typography Maps ────────────────────────────────────────────────────────────

export const textSizeMap: Record<UISize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

export const textAlignMap: Record<UITextAlign, string> = {
  start: "text-left",
  center: "text-center",
  end: "text-right",
};

export const fontWeightMap: Record<UIFontWeight, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

// ─── Dynamic Style Resolver ─────────────────────────────────────────────────────

/**
 * Resolves a UIColor (with optional opacity like "primary/50") to a style object.
 * Uses CSS color-mix for opacity, which works across modern browsers.
 */
export function resolveUIStyle(
  property: "backgroundColor" | "color" | "borderColor",
  value?: UIColor,
): React.CSSProperties {
  if (!value) return {};

  const [colorName, opacityStr] = value.split("/");

  if (
    !opacityStr &&
    (colorBgMap[value as UIColor] ||
      colorTextMap[value as UIColor] ||
      colorBorderMap[value as UIColor])
  ) {
    return {};
  }

  const opacity = opacityStr ? parseInt(opacityStr, 10) / 100 : 1;
  const kebabName = colorName
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();
  const variable = `var(--color-${kebabName}, var(--${kebabName}))`;

  if (opacity === 1) {
    return { [property]: variable };
  }

  return {
    [property]: `color-mix(in oklch, ${variable}, transparent ${100 - opacity * 100}%)`,
  };
}
