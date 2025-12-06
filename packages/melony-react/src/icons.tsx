import React from "react";

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const ChevronDownIcon: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  className,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  className,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const XIcon: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  className,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const InfoIcon: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  className,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

export const AlertCircleIcon: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  className,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// Export all icons
export const ICONS = {
  ChevronDown: ChevronDownIcon,
  Check: CheckIcon,
  X: XIcon,
  Info: InfoIcon,
  AlertCircle: AlertCircleIcon,
};

// Generic Icon component that can render any icon by name
export const Icon: React.FC<
  IconProps & {
    name: keyof typeof ICONS;
  }
> = ({ name, ...props }) => {
  const IconComponent = ICONS[name];
  return <IconComponent {...props} />;
};

