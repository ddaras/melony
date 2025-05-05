import { cn } from "@/lib/utils";

export const Heading = ({
  variant,
  content,
  className,
}: {
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "caption";
  content: string;
  className?: string;
}) => {
  const commonProps = {
    className: cn(`font-bold`, className, {
      "text-3xl": variant === "h1",
      "text-2xl": variant === "h2",
      "text-xl": variant === "h3",
      "text-lg": variant === "h4",
      "text-md": variant === "h5",
      "text-xs": variant === "h6",
      "text-sm": variant === "caption",
    }),
  };

  switch (variant) {
    case "h1":
      return <h1 {...commonProps}>{content}</h1>;
    case "h2":
      return <h2 {...commonProps}>{content}</h2>;
    case "h3":
      return <h3 {...commonProps}>{content}</h3>;
    case "h4":
      return <h4 {...commonProps}>{content}</h4>;
    case "h5":
      return <h5 {...commonProps}>{content}</h5>;
    case "h6":
      return <h6 {...commonProps}>{content}</h6>;
    case "caption":
      return <caption {...commonProps}>{content}</caption>;
    default:
      return <div {...commonProps}>{content}</div>;
  }
};
